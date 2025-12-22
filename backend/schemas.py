"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class UserTypeEnum(str, Enum):
    HOSPITAL = "hospital"
    PHARMACY = "pharmacy"
    SUPPLIER = "supplier"
    ADMIN = "admin"

class OrderStatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    user_type: UserTypeEnum = UserTypeEnum.HOSPITAL
    phone: Optional[str] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    user_type: str
    phone: Optional[str]
    location: Optional[str]
    verified: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Settings Schemas
class SettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    order_updates: Optional[bool] = None
    low_stock_alerts: Optional[bool] = None
    price_alerts: Optional[bool] = None
    promotional_emails: Optional[bool] = None
    share_data_with_suppliers: Optional[bool] = None
    show_online_status: Optional[bool] = None
    allow_analytics: Optional[bool] = None
    language: Optional[str] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None
    theme: Optional[str] = None
    sound_enabled: Optional[bool] = None
    auto_reorder: Optional[bool] = None
    default_delivery_address: Optional[str] = None
    require_order_confirmation: Optional[bool] = None
    default_payment_method: Optional[str] = None

class SettingsResponse(BaseModel):
    id: int
    user_id: int
    email_notifications: bool
    push_notifications: bool
    sms_notifications: bool
    order_updates: bool
    low_stock_alerts: bool
    price_alerts: bool
    promotional_emails: bool
    share_data_with_suppliers: bool
    show_online_status: bool
    allow_analytics: bool
    language: str
    currency: str
    timezone: str
    theme: str
    sound_enabled: bool
    auto_reorder: bool
    default_delivery_address: Optional[str]
    require_order_confirmation: bool
    default_payment_method: str

    class Config:
        from_attributes = True

# Product Schemas
class ProductCreate(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: float
    market_price: Optional[float] = None
    stock: int = 0
    min_stock_level: int = 20
    supplier_id: Optional[int] = None
    urgent: bool = False

class ProductResponse(BaseModel):
    id: int
    name: str
    brand: Optional[str]
    category: Optional[str]
    price: float
    market_price: Optional[float]
    stock: int
    urgent: bool
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    payment_method: str
    delivery_address: str

class OrderResponse(BaseModel):
    id: int
    order_number: str
    status: str
    total_amount: float
    total_items: int
    payment_method: str
    payment_status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Payment Method Schemas
class PaymentMethodCreate(BaseModel):
    card_type: str
    last_four: str
    expiry_month: int
    expiry_year: int
    stripe_payment_method_id: Optional[str] = None

class PaymentMethodResponse(BaseModel):
    id: int
    card_type: str
    last_four: str
    expiry_month: int
    expiry_year: int
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Supplier Schemas
class SupplierCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class SupplierResponse(BaseModel):
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    distance: Optional[str]
    rating: float
    total_orders: int
    verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Currency Conversion
class CurrencyConvertRequest(BaseModel):
    amount: float
    from_currency: str = "INR"
    to_currency: str = "USD"

class CurrencyConvertResponse(BaseModel):
    original_amount: float
    converted_amount: float
    from_currency: str
    to_currency: str
    exchange_rate: float

# Analytics
class AnalyticsResponse(BaseModel):
    total_orders: int
    total_revenue: float
    total_savings: float
    active_orders: int
    completed_orders: int
    cancelled_orders: int
    top_products: List[dict]
    revenue_by_month: List[dict]
