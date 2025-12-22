"""Database models for MediConnect."""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserType(str, enum.Enum):
    HOSPITAL = "hospital"
    PHARMACY = "pharmacy"
    SUPPLIER = "supplier"
    ADMIN = "admin"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentMethod(str, enum.Enum):
    CARD = "card"
    UPI = "upi"
    NET_BANKING = "netbanking"
    WALLET = "wallet"
    COD = "cod"

class User(Base):
    """User model for authentication."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    user_type = Column(Enum(UserType), default=UserType.HOSPITAL)
    phone = Column(String)
    location = Column(String)
    verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    settings = relationship("UserSettings", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    payment_methods = relationship("PaymentMethod", back_populates="user")

class UserSettings(Base):
    """User settings and preferences."""
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Notification Settings
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    order_updates = Column(Boolean, default=True)
    low_stock_alerts = Column(Boolean, default=True)
    price_alerts = Column(Boolean, default=True)
    promotional_emails = Column(Boolean, default=True)
    
    # Privacy Settings
    share_data_with_suppliers = Column(Boolean, default=True)
    show_online_status = Column(Boolean, default=True)
    allow_analytics = Column(Boolean, default=True)
    
    # General Settings
    language = Column(String, default="English")
    currency = Column(String, default="INR")
    timezone = Column(String, default="Asia/Kolkata")
    theme = Column(String, default="light")
    sound_enabled = Column(Boolean, default=True)
    
    # Order Settings
    auto_reorder = Column(Boolean, default=False)
    default_delivery_address = Column(Text)
    require_order_confirmation = Column(Boolean, default=True)
    
    # Payment Settings
    default_payment_method = Column(String, default="card")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="settings")

class Product(Base):
    """Product/Medicine model."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    brand = Column(String)
    category = Column(String)
    description = Column(Text)
    price = Column(Float, nullable=False)
    market_price = Column(Float)
    stock = Column(Integer, default=0)
    min_stock_level = Column(Integer, default=20)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    urgent = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    supplier = relationship("Supplier", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class Supplier(Base):
    """Supplier model."""
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    phone = Column(String)
    location = Column(String)
    distance = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    rating = Column(Float, default=0.0)
    total_orders = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    products = relationship("Product", back_populates="supplier")

class Order(Base):
    """Order model."""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = Column(Float, nullable=False)
    total_items = Column(Integer, default=0)
    payment_method = Column(String)
    payment_status = Column(String, default="pending")
    delivery_address = Column(Text)
    delivery_date = Column(DateTime(timezone=True))
    driver_name = Column(String)
    driver_phone = Column(String)
    vehicle_number = Column(String)
    tracking_info = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    """Order item model."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

class Notification(Base):
    """Notification model."""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String)  # success, error, warning, info
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")

class PaymentMethod(Base):
    """Saved payment methods."""
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    card_type = Column(String)  # Visa, Mastercard, etc.
    last_four = Column(String(4))
    expiry_month = Column(Integer)
    expiry_year = Column(Integer)
    is_default = Column(Boolean, default=False)
    stripe_payment_method_id = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="payment_methods")

class Analytics(Base):
    """Analytics data."""
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String)
    event_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
