"""Main FastAPI application."""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from decouple import config
from loguru import logger

import models
import schemas
from database import get_db, init_db, engine
from auth import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from services.notifications import email_service, sms_service, push_service
from services.currency import currency_service
from services.payment import payment_service
from services.geolocation import geolocation_service

# Initialize database
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="MediConnect API",
    description="Healthcare Supply Chain Management Platform API",
    version="1.0.0"
)

# CORS configuration
origins = config('ALLOWED_ORIGINS', default='*').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ['*'] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTHENTICATION ENDPOINTS ---

@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
        user_type=user.user_type,
        phone=user.phone,
        location=user.location
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default settings
    settings = models.UserSettings(user_id=db_user.id)
    db.add(settings)
    db.commit()
    
    # Send welcome email
    await email_service.send_email(
        to_email=user.email,
        subject="Welcome to MediConnect",
        html_content=f"<h2>Welcome {user.full_name}!</h2><p>Your account has been created successfully.</p>"
    )
    
    logger.info(f"New user registered: {user.username}")
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    logger.info(f"User logged in: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
async def get_current_user_info(
    current_user: models.User = Depends(get_current_active_user)
):
    """Get current user information."""
    return current_user

# --- SETTINGS ENDPOINTS ---

@app.get("/api/settings", response_model=schemas.SettingsResponse)
async def get_settings(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user settings."""
    settings = db.query(models.UserSettings).filter(
        models.UserSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        # Create default settings if not exists
        settings = models.UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

@app.put("/api/settings", response_model=schemas.SettingsResponse)
async def update_settings(
    settings_update: schemas.SettingsUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user settings."""
    settings = db.query(models.UserSettings).filter(
        models.UserSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        settings = models.UserSettings(user_id=current_user.id)
        db.add(settings)
    
    # Update only provided fields
    update_data = settings_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    
    logger.info(f"Settings updated for user: {current_user.username}")
    return settings

# --- PRODUCT ENDPOINTS ---

@app.get("/api/products", response_model=List[schemas.ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    urgent: bool = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    """Get all products with optional filters."""
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    if urgent is not None:
        query = query.filter(models.Product.urgent == urgent)
    if search:
        query = query.filter(
            models.Product.name.contains(search) | 
            models.Product.brand.contains(search)
        )
    
    products = query.offset(skip).limit(limit).all()
    return products

@app.get("/api/products/{product_id}", response_model=schemas.ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: schemas.ProductCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new product."""
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    logger.info(f"Product created: {product.name}")
    return db_product

# --- ORDER ENDPOINTS ---

@app.get("/api/orders", response_model=List[schemas.OrderResponse])
async def get_orders(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's orders."""
    orders = db.query(models.Order).filter(
        models.Order.user_id == current_user.id
    ).order_by(models.Order.created_at.desc()).all()
    return orders

@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: schemas.OrderCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new order."""
    # Get user settings to check confirmation requirement
    settings = db.query(models.UserSettings).filter(
        models.UserSettings.user_id == current_user.id
    ).first()
    
    # Calculate total
    total_amount = 0
    total_items = 0
    
    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        total_amount += product.price * item.quantity
        total_items += item.quantity
    
    # Create order
    import random
    order_number = f"ORD-{random.randint(10000, 99999)}"
    
    db_order = models.Order(
        order_number=order_number,
        user_id=current_user.id,
        status=models.OrderStatus.PROCESSING,
        total_amount=total_amount,
        total_items=total_items,
        payment_method=order_data.payment_method,
        delivery_address=order_data.delivery_address
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items and update stock
    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        
        order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price,
            subtotal=product.price * item.quantity
        )
        db.add(order_item)
        
        # Update product stock
        product.stock -= item.quantity
    
    db.commit()
    
    # Send notifications based on settings
    if settings:
        if settings.email_notifications and settings.order_updates:
            await email_service.send_order_confirmation(
                to_email=current_user.email,
                order_number=order_number,
                total_amount=total_amount,
                items_count=total_items
            )
        
        if settings.sms_notifications and settings.order_updates:
            await sms_service.send_order_update(
                to_phone=current_user.phone,
                order_number=order_number,
                status="Processing"
            )
        
        if settings.push_notifications and settings.order_updates:
            await push_service.send_push(
                user_id=current_user.id,
                title="Order Placed",
                body=f"Order {order_number} placed successfully"
            )
    
    # Create notification
    notification = models.Notification(
        user_id=current_user.id,
        title="Order Placed",
        message=f"Order {order_number} placed successfully",
        type="success"
    )
    db.add(notification)
    db.commit()
    
    logger.info(f"Order created: {order_number} for user {current_user.username}")
    return db_order

@app.get("/api/orders/{order_id}", response_model=schemas.OrderResponse)
async def get_order(
    order_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific order."""
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

# Continue in next file...
