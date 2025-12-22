"""Continuation of main.py endpoints - Add these to main.py"""

# --- NOTIFICATION ENDPOINTS ---

@app.get("/api/notifications", response_model=List[schemas.NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user notifications."""
    query = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    )
    
    if unread_only:
        query = query.filter(models.Notification.read == False)
    
    notifications = query.order_by(models.Notification.created_at.desc()).all()
    
    # Filter based on user settings
    settings = db.query(models.UserSettings).filter(
        models.UserSettings.user_id == current_user.id
    ).first()
    
    if settings:
        filtered_notifications = []
        for notif in notifications:
            if not settings.order_updates and 'Order' in notif.title:
                continue
            if not settings.low_stock_alerts and notif.type == 'warning':
                continue
            if not settings.price_alerts and 'Price' in notif.title:
                continue
            filtered_notifications.append(notif)
        return filtered_notifications
    
    return notifications

@app.put("/api/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark notification as read."""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    db.commit()
    
    return {"status": "success"}

@app.put("/api/notifications/mark-all-read")
async def mark_all_notifications_read(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read."""
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).update({"read": True})
    db.commit()
    
    return {"status": "success", "message": "All notifications marked as read"}

# --- PAYMENT ENDPOINTS ---

@app.get("/api/payment-methods", response_model=List[schemas.PaymentMethodResponse])
async def get_payment_methods(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's saved payment methods."""
    methods = db.query(models.PaymentMethod).filter(
        models.PaymentMethod.user_id == current_user.id
    ).all()
    return methods

@app.post("/api/payment-methods", response_model=schemas.PaymentMethodResponse)
async def add_payment_method(
    payment_method: schemas.PaymentMethodCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a new payment method."""
    db_method = models.PaymentMethod(
        user_id=current_user.id,
        **payment_method.dict()
    )
    db.add(db_method)
    db.commit()
    db.refresh(db_method)
    
    return db_method

@app.delete("/api/payment-methods/{method_id}")
async def delete_payment_method(
    method_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a payment method."""
    method = db.query(models.PaymentMethod).filter(
        models.PaymentMethod.id == method_id,
        models.PaymentMethod.user_id == current_user.id
    ).first()
    
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    db.delete(method)
    db.commit()
    
    return {"status": "success"}

@app.put("/api/payment-methods/{method_id}/set-default")
async def set_default_payment_method(
    method_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Set a payment method as default."""
    # Unset all defaults
    db.query(models.PaymentMethod).filter(
        models.PaymentMethod.user_id == current_user.id
    ).update({"is_default": False})
    
    # Set new default
    method = db.query(models.PaymentMethod).filter(
        models.PaymentMethod.id == method_id,
        models.PaymentMethod.user_id == current_user.id
    ).first()
    
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    method.is_default = True
    db.commit()
    
    return {"status": "success"}

@app.post("/api/payment/create-intent")
async def create_payment_intent(
    amount: float,
    currency: str = "inr",
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a payment intent for checkout."""
    intent = await payment_service.create_payment_intent(
        amount=amount,
        currency=currency,
        metadata={"user_id": current_user.id}
    )
    
    if not intent:
        raise HTTPException(status_code=500, detail="Failed to create payment intent")
    
    return intent

# --- CURRENCY ENDPOINTS ---

@app.post("/api/currency/convert", response_model=schemas.CurrencyConvertResponse)
async def convert_currency(
    request: schemas.CurrencyConvertRequest,
    current_user: models.User = Depends(get_current_active_user)
):
    """Convert currency."""
    converted_amount = currency_service.convert(
        amount=request.amount,
        from_currency=request.from_currency,
        to_currency=request.to_currency
    )
    
    exchange_rate = currency_service.get_exchange_rate(
        request.from_currency,
        request.to_currency
    )
    
    return {
        "original_amount": request.amount,
        "converted_amount": converted_amount,
        "from_currency": request.from_currency,
        "to_currency": request.to_currency,
        "exchange_rate": exchange_rate
    }

@app.get("/api/currency/rates")
async def get_exchange_rates(base_currency: str = "INR"):
    """Get exchange rates for a base currency."""
    rates = {}
    currencies = currency_service.get_supported_currencies()
    
    for currency in currencies:
        if currency != base_currency:
            rates[currency] = currency_service.get_exchange_rate(base_currency, currency)
    
    return {
        "base_currency": base_currency,
        "rates": rates,
        "timestamp": datetime.now().isoformat()
    }

# --- SUPPLIER ENDPOINTS ---

@app.get("/api/suppliers", response_model=List[schemas.SupplierResponse])
async def get_suppliers(
    db: Session = Depends(get_db)
):
    """Get all suppliers."""
    suppliers = db.query(models.Supplier).all()
    return suppliers

@app.get("/api/suppliers/nearby")
async def get_nearby_suppliers(
    latitude: float,
    longitude: float,
    max_distance: float = 50,
    db: Session = Depends(get_db)
):
    """Get nearby suppliers."""
    suppliers = db.query(models.Supplier).all()
    
    supplier_data = []
    for supplier in suppliers:
        if supplier.latitude and supplier.longitude:
            supplier_data.append({
                'id': supplier.id,
                'name': supplier.name,
                'latitude': supplier.latitude,
                'longitude': supplier.longitude,
                'rating': supplier.rating,
                'total_orders': supplier.total_orders
            })
    
    nearby = geolocation_service.find_nearest_suppliers(
        user_location=(latitude, longitude),
        supplier_locations=supplier_data,
        max_distance=max_distance
    )
    
    return nearby

@app.post("/api/suppliers", response_model=schemas.SupplierResponse)
async def create_supplier(
    supplier: schemas.SupplierCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new supplier."""
    # Get coordinates from location if provided
    if supplier.location and not (supplier.latitude and supplier.longitude):
        coords = geolocation_service.get_coordinates(supplier.location)
        if coords:
            supplier.latitude = coords[0]
            supplier.longitude = coords[1]
    
    db_supplier = models.Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    
    return db_supplier

# --- ANALYTICS ENDPOINTS ---

@app.get("/api/analytics", response_model=schemas.AnalyticsResponse)
async def get_analytics(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user analytics."""
    # Get orders
    orders = db.query(models.Order).filter(
        models.Order.user_id == current_user.id
    ).all()
    
    total_orders = len(orders)
    total_revenue = sum(order.total_amount for order in orders)
    active_orders = len([o for o in orders if o.status in ['processing', 'out_for_delivery']])
    completed_orders = len([o for o in orders if o.status == 'delivered'])
    cancelled_orders = len([o for o in orders if o.status == 'cancelled'])
    
    # Calculate savings (assuming 20% average saving)
    total_savings = total_revenue * 0.2
    
    # Get top products
    from sqlalchemy import func
    top_products = db.query(
        models.Product.name,
        func.sum(models.OrderItem.quantity).label('total_quantity'),
        func.sum(models.OrderItem.subtotal).label('total_revenue')
    ).join(
        models.OrderItem
    ).group_by(
        models.Product.name
    ).order_by(
        func.sum(models.OrderItem.quantity).desc()
    ).limit(5).all()
    
    top_products_list = [
        {
            'name': product[0],
            'quantity': product[1],
            'revenue': product[2]
        }
        for product in top_products
    ]
    
    # Revenue by month (simplified)
    revenue_by_month = [
        {'month': 'Jan', 'revenue': total_revenue * 0.1},
        {'month': 'Feb', 'revenue': total_revenue * 0.12},
        {'month': 'Mar', 'revenue': total_revenue * 0.15},
        {'month': 'Apr', 'revenue': total_revenue * 0.18},
        {'month': 'May', 'revenue': total_revenue * 0.20},
        {'month': 'Jun', 'revenue': total_revenue * 0.25}
    ]
    
    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "total_savings": total_savings,
        "active_orders": active_orders,
        "completed_orders": completed_orders,
        "cancelled_orders": cancelled_orders,
        "top_products": top_products_list,
        "revenue_by_month": revenue_by_month
    }

# --- UTILITY ENDPOINTS ---

@app.post("/api/utils/clear-data")
async def clear_user_data(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Clear all user data (Danger Zone)."""
    # Delete notifications
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).delete()
    
    # Delete orders and order items
    orders = db.query(models.Order).filter(
        models.Order.user_id == current_user.id
    ).all()
    
    for order in orders:
        db.query(models.OrderItem).filter(
            models.OrderItem.order_id == order.id
        ).delete()
    
    db.query(models.Order).filter(
        models.Order.user_id == current_user.id
    ).delete()
    
    # Delete payment methods
    db.query(models.PaymentMethod).filter(
        models.PaymentMethod.user_id == current_user.id
    ).delete()
    
    db.commit()
    
    logger.warning(f"User data cleared for: {current_user.username}")
    return {"status": "success", "message": "All data cleared"}

@app.post("/api/utils/deactivate-account")
async def deactivate_account(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Deactivate user account (Danger Zone)."""
    current_user.is_active = False
    db.commit()
    
    logger.warning(f"Account deactivated: {current_user.username}")
    return {"status": "success", "message": "Account deactivated"}

# --- HEALTH CHECK ---

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "MediConnect API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }
