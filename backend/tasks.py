"""Background tasks for auto-reorder, stock monitoring, etc."""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from datetime import datetime
from loguru import logger

import models
from database import SessionLocal
from services.notifications import email_service, sms_service

scheduler = AsyncIOScheduler()

async def check_low_stock():
    """Check for low stock items and send alerts."""
    db = SessionLocal()
    try:
        # Get products with low stock
        low_stock_products = db.query(models.Product).filter(
            models.Product.stock < models.Product.min_stock_level
        ).all()
        
        if low_stock_products:
            logger.info(f"Found {len(low_stock_products)} low stock items")
            
            # Get all users with low stock alerts enabled
            users = db.query(models.User).join(models.UserSettings).filter(
                models.UserSettings.low_stock_alerts == True
            ).all()
            
            for user in users:
                settings = user.settings
                
                for product in low_stock_products:
                    # Create notification
                    notification = models.Notification(
                        user_id=user.id,
                        title="Low Stock Alert",
                        message=f"{product.name} stock is low ({product.stock} units remaining)",
                        type="warning"
                    )
                    db.add(notification)
                    
                    # Send email if enabled
                    if settings.email_notifications:
                        await email_service.send_low_stock_alert(
                            to_email=user.email,
                            product_name=product.name,
                            current_stock=product.stock,
                            min_stock=product.min_stock_level
                        )
            
            db.commit()
    finally:
        db.close()

async def auto_reorder_check():
    """Check for auto-reorder enabled users and create orders for low stock."""
    db = SessionLocal()
    try:
        # Get users with auto-reorder enabled
        users = db.query(models.User).join(models.UserSettings).filter(
            models.UserSettings.auto_reorder == True
        ).all()
        
        for user in users:
            # Get low stock products
            low_stock_products = db.query(models.Product).filter(
                models.Product.stock < models.Product.min_stock_level
            ).limit(5).all()
            
            if low_stock_products:
                # Create auto-reorder notification
                notification = models.Notification(
                    user_id=user.id,
                    title="Auto-Reorder Triggered",
                    message=f"Automatic reorder initiated for {len(low_stock_products)} products",
                    type="info"
                )
                db.add(notification)
                
                logger.info(f"Auto-reorder triggered for user {user.username}")
        
        db.commit()
    finally:
        db.close()

async def update_order_status():
    """Simulate order status updates."""
    db = SessionLocal()
    try:
        # Get processing orders
        processing_orders = db.query(models.Order).filter(
            models.Order.status == models.OrderStatus.PROCESSING
        ).all()
        
        for order in processing_orders:
            # Simulate progression (in real app, this would be based on actual logistics)
            order_age = (datetime.now() - order.created_at).total_seconds() / 60  # minutes
            
            if order_age > 30:  # After 30 minutes, mark as out for delivery
                order.status = models.OrderStatus.OUT_FOR_DELIVERY
                order.driver_name = "Driver Assigned"
                
                # Send notification to user
                user = order.user
                settings = user.settings
                
                if settings and settings.sms_notifications:
                    await sms_service.send_delivery_notification(
                        to_phone=user.phone,
                        order_number=order.order_number,
                        driver_name=order.driver_name,
                        eta_minutes=45
                    )
                
                notification = models.Notification(
                    user_id=user.id,
                    title="Order Out for Delivery",
                    message=f"Order {order.order_number} is out for delivery",
                    type="success"
                )
                db.add(notification)
        
        db.commit()
    finally:
        db.close()

def start_background_tasks():
    """Start all background tasks."""
    # Check low stock every hour
    scheduler.add_job(check_low_stock, 'interval', hours=1)
    
    # Auto-reorder check every 2 hours
    scheduler.add_job(auto_reorder_check, 'interval', hours=2)
    
    # Update order status every 15 minutes
    scheduler.add_job(update_order_status, 'interval', minutes=15)
    
    scheduler.start()
    logger.info("Background tasks started")

def stop_background_tasks():
    """Stop all background tasks."""
    scheduler.shutdown()
    logger.info("Background tasks stopped")
