"""
MediConnect Backend - FastAPI Python Server
Complete backend with all working endpoints
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import json
import os
from enum import Enum

app = FastAPI(title="MediConnect API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== DATA MODELS ====================

class UserRole(str, Enum):
    CUSTOMER = "customer"
    HOSPITAL = "hospital"
    SUPPORT = "support"

class OrderStatus(str, Enum):
    PENDING = "Pending"
    PROCESSING = "Processing"
    OUT_FOR_DELIVERY = "Out for Delivery"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"

class PaymentMethod(str, Enum):
    CARD = "card"
    UPI = "upi"
    NETBANKING = "netbanking"
    WALLET = "wallet"
    COD = "cod"

class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    name: str
    email: str
    phone: str
    location: str
    role: UserRole

class Product(BaseModel):
    id: int
    name: str
    brand: str
    category: str
    stock: int
    critical: bool
    rating: float
    marketPrice: float
    price: float
    savings: float
    supplier: str
    location: str
    description: Optional[str] = ""

class CartItem(BaseModel):
    productId: int
    quantity: int

class Order(BaseModel):
    id: str
    userId: int
    items: List[CartItem]
    status: OrderStatus
    amount: float
    date: str
    driver: Optional[str] = "Pending"
    vehicle: Optional[str] = "-"
    eta: Optional[str] = "Processing"
    deliveryLocation: str

class PaymentRequest(BaseModel):
    orderId: str
    method: PaymentMethod
    amount: float
    cardNumber: Optional[str] = None
    cardExpiry: Optional[str] = None
    cardCVV: Optional[str] = None
    cardName: Optional[str] = None

class ProductEntry(BaseModel):
    name: str
    brand: str
    category: str
    stock: int
    marketPrice: float
    price: float
    supplier: str
    location: str
    description: Optional[str] = ""

class SalesEntry(BaseModel):
    productId: int
    quantity: int
    customerId: int
    salePrice: float
    date: str

# ==================== IN-MEMORY DATABASE ====================

# Users Database
USERS_DB = {
    "customer": {
        "id": 1,
        "username": "customer",
        "password": "customer123",
        "name": "Rajesh Kumar",
        "email": "rajesh@customer.com",
        "phone": "+91 98765 43210",
        "location": "City Hospital, Vadodara",
        "role": "customer"
    },
    "cityhospital": {
        "id": 2,
        "username": "cityhospital",
        "password": "hospital123",
        "name": "City Hospital",
        "email": "admin@cityhospital.com",
        "phone": "+91 99887 76655",
        "location": "Vadodara, Gujarat",
        "role": "hospital"
    },
    "admin": {
        "id": 3,
        "username": "admin",
        "password": "admin123",
        "name": "Admin Support",
        "email": "admin@mediconnect.com",
        "phone": "+91 88776 65544",
        "location": "MediConnect HQ",
        "role": "support"
    }
}

# Products Database
PRODUCTS_DB = [
    {
        "id": 1,
        "name": "Remdesivir Inj. 100mg",
        "brand": "Cipla • Kandivali Distributors",
        "category": "emergency",
        "stock": 3,
        "critical": True,
        "rating": 4.8,
        "marketPrice": 32000,
        "price": 28800,
        "savings": 10,
        "supplier": "Kandivali Distributors",
        "location": "2.5 km",
        "description": "Emergency COVID-19 treatment injection"
    },
    {
        "id": 2,
        "name": "Tocilizumab 400mg",
        "brand": "Roche • Healthcare Solutions",
        "category": "emergency",
        "stock": 8,
        "critical": True,
        "rating": 4.7,
        "marketPrice": 40000,
        "price": 35200,
        "savings": 12,
        "supplier": "Healthcare Solutions",
        "location": "3.1 km",
        "description": "Immunosuppressive drug for severe cases"
    },
    {
        "id": 3,
        "name": "Enoxaparin Sodium",
        "brand": "Sanofi • Apollo Pharmacy Hub",
        "category": "pharma",
        "stock": 12,
        "critical": False,
        "rating": 4.5,
        "marketPrice": 620,
        "price": 450,
        "savings": 27,
        "supplier": "Apollo Pharmacy Hub",
        "location": "1.8 km",
        "description": "Blood thinner medication"
    },
    {
        "id": 4,
        "name": "Surgical Gloves (Box)",
        "brand": "Ansell • MedPlus Distributors",
        "category": "surgical",
        "stock": 234,
        "critical": False,
        "rating": 4.9,
        "marketPrice": 250,
        "price": 180,
        "savings": 28,
        "supplier": "MedPlus Distributors",
        "location": "0.9 km",
        "description": "Premium quality surgical gloves"
    },
    {
        "id": 5,
        "name": "N95 Masks (Pack of 10)",
        "brand": "3M • Wellness Pharma",
        "category": "consumables",
        "stock": 567,
        "critical": False,
        "rating": 4.7,
        "marketPrice": 180,
        "price": 120,
        "savings": 33,
        "supplier": "Wellness Pharma",
        "location": "1.2 km",
        "description": "High filtration respiratory protection"
    },
    {
        "id": 6,
        "name": "Digital Thermometer",
        "brand": "Omron • Healthcare Solutions",
        "category": "equipment",
        "stock": 78,
        "critical": False,
        "rating": 4.6,
        "marketPrice": 650,
        "price": 450,
        "savings": 31,
        "supplier": "Healthcare Solutions",
        "location": "2.3 km",
        "description": "Digital temperature measurement device"
    },
    {
        "id": 7,
        "name": "Paracetamol 650mg",
        "brand": "Crocin • Apollo Pharmacy Hub",
        "category": "pharma",
        "stock": 12,
        "critical": False,
        "rating": 4.5,
        "marketPrice": 60,
        "price": 45,
        "savings": 25,
        "supplier": "Apollo Pharmacy Hub",
        "location": "1.8 km",
        "description": "Pain relief and fever reducer"
    },
    {
        "id": 8,
        "name": "Azithromycin 500mg",
        "brand": "Azithral • MedPlus Distributors",
        "category": "pharma",
        "stock": 45,
        "critical": False,
        "rating": 4.7,
        "marketPrice": 180,
        "price": 145,
        "savings": 19,
        "supplier": "MedPlus Distributors",
        "location": "0.9 km",
        "description": "Antibiotic for bacterial infections"
    }
]

# Orders Database
ORDERS_DB = []
ORDER_COUNTER = 9922

# Sales Database
SALES_DB = []

# Analytics Data
ANALYTICS_DB = {
    "monthly_savings": [
        {"month": "Jan", "amount": 6800},
        {"month": "Feb", "amount": 8200},
        {"month": "Mar", "amount": 7500},
        {"month": "Apr", "amount": 9100},
        {"month": "May", "amount": 8800},
        {"month": "Jun", "amount": 9500},
        {"month": "Jul", "amount": 8900},
        {"month": "Aug", "amount": 9800},
        {"month": "Sep", "amount": 8600},
        {"month": "Oct", "amount": 9200},
        {"month": "Nov", "amount": 8400},
        {"month": "Dec", "amount": 7800}
    ]
}

# ==================== API ENDPOINTS ====================

@app.get("/")
def read_root():
    return {
        "message": "MediConnect API Server",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/api/auth/login",
            "/api/products",
            "/api/products/{id}",
            "/api/products/add",
            "/api/orders",
            "/api/orders/{id}",
            "/api/orders/place",
            "/api/payment/process",
            "/api/analytics",
            "/api/sales",
            "/api/export/products",
            "/api/export/orders",
            "/api/export/sales"
        ]
    }

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/login")
def login(request: LoginRequest):
    """Login endpoint"""
    user_data = USERS_DB.get(request.username)
    
    if not user_data or user_data["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Remove password from response
    response_data = {k: v for k, v in user_data.items() if k != "password"}
    
    return {
        "success": True,
        "user": response_data,
        "token": f"token_{user_data['id']}_{datetime.now().timestamp()}"
    }

# ==================== PRODUCTS ENDPOINTS ====================

@app.get("/api/products")
def get_products(category: Optional[str] = None, search: Optional[str] = None):
    """Get all products with optional filtering"""
    products = PRODUCTS_DB.copy()
    
    if category and category != "all":
        if category == "critical":
            products = [p for p in products if p["critical"]]
        else:
            products = [p for p in products if p["category"] == category]
    
    if search:
        search_lower = search.lower()
        products = [p for p in products if 
                   search_lower in p["name"].lower() or 
                   search_lower in p["brand"].lower()]
    
    return {
        "success": True,
        "products": products,
        "count": len(products)
    }

@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    """Get single product by ID"""
    product = next((p for p in PRODUCTS_DB if p["id"] == product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {
        "success": True,
        "product": product
    }

@app.post("/api/products/add")
def add_product(product: ProductEntry):
    """Add new product to inventory"""
    new_id = max([p["id"] for p in PRODUCTS_DB]) + 1 if PRODUCTS_DB else 1
    
    new_product = {
        "id": new_id,
        "name": product.name,
        "brand": product.brand,
        "category": product.category,
        "stock": product.stock,
        "critical": product.stock < 10,
        "rating": 4.5,
        "marketPrice": product.marketPrice,
        "price": product.price,
        "savings": round(((product.marketPrice - product.price) / product.marketPrice) * 100, 2),
        "supplier": product.supplier,
        "location": product.location,
        "description": product.description
    }
    
    PRODUCTS_DB.append(new_product)
    
    return {
        "success": True,
        "message": "Product added successfully",
        "product": new_product
    }

@app.put("/api/products/{product_id}")
def update_product(product_id: int, product: ProductEntry):
    """Update existing product"""
    product_index = next((i for i, p in enumerate(PRODUCTS_DB) if p["id"] == product_id), None)
    
    if product_index is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    PRODUCTS_DB[product_index].update({
        "name": product.name,
        "brand": product.brand,
        "category": product.category,
        "stock": product.stock,
        "critical": product.stock < 10,
        "marketPrice": product.marketPrice,
        "price": product.price,
        "savings": round(((product.marketPrice - product.price) / product.marketPrice) * 100, 2),
        "supplier": product.supplier,
        "location": product.location,
        "description": product.description
    })
    
    return {
        "success": True,
        "message": "Product updated successfully",
        "product": PRODUCTS_DB[product_index]
    }

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    """Delete product from inventory"""
    global PRODUCTS_DB
    
    product = next((p for p in PRODUCTS_DB if p["id"] == product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    PRODUCTS_DB = [p for p in PRODUCTS_DB if p["id"] != product_id]
    
    return {
        "success": True,
        "message": "Product deleted successfully"
    }

# ==================== ORDERS ENDPOINTS ====================

@app.get("/api/orders")
def get_orders(user_id: Optional[int] = None, status: Optional[str] = None):
    """Get all orders with optional filtering"""
    orders = ORDERS_DB.copy()
    
    if user_id:
        orders = [o for o in orders if o["userId"] == user_id]
    
    if status:
        orders = [o for o in orders if o["status"] == status]
    
    return {
        "success": True,
        "orders": orders,
        "count": len(orders)
    }

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    """Get single order by ID"""
    order = next((o for o in ORDERS_DB if o["id"] == order_id), None)
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "success": True,
        "order": order
    }

@app.post("/api/orders/place")
def place_order(order: Order):
    """Place a new order"""
    global ORDER_COUNTER
    
    # Generate order ID
    order_id = f"#ORD-{ORDER_COUNTER}"
    ORDER_COUNTER += 1
    
    # Calculate total amount
    total_amount = 0
    for item in order.items:
        product = next((p for p in PRODUCTS_DB if p["id"] == item.productId), None)
        if product:
            total_amount += product["price"] * item.quantity
            # Update stock
            product["stock"] -= item.quantity
    
    # Add tax
    tax = total_amount * 0.18
    total_amount += tax
    
    new_order = {
        "id": order_id,
        "userId": order.userId,
        "items": [{"productId": item.productId, "quantity": item.quantity} for item in order.items],
        "status": "Processing",
        "amount": round(total_amount, 2),
        "date": datetime.now().strftime("%a, %B %d, %I:%M %p"),
        "driver": "Pending",
        "vehicle": "-",
        "eta": "2 hours",
        "deliveryLocation": order.deliveryLocation
    }
    
    ORDERS_DB.insert(0, new_order)
    
    return {
        "success": True,
        "message": "Order placed successfully",
        "order": new_order
    }

@app.put("/api/orders/{order_id}/status")
def update_order_status(order_id: str, status: OrderStatus):
    """Update order status"""
    order = next((o for o in ORDERS_DB if o["id"] == order_id), None)
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order["status"] = status.value
    
    # Update driver and ETA based on status
    if status == OrderStatus.OUT_FOR_DELIVERY:
        drivers = ["Rahul Sharma", "Priya Mehta", "Amit Kumar", "Sneha Patel"]
        vehicles = ["GJ-06-XY-1234", "GJ-06-AB-5678", "GJ-06-CD-9012", "GJ-06-EF-3456"]
        import random
        order["driver"] = random.choice(drivers)
        order["vehicle"] = random.choice(vehicles)
        order["eta"] = "15 mins"
    elif status == OrderStatus.DELIVERED:
        order["eta"] = "Completed"
    
    return {
        "success": True,
        "message": "Order status updated",
        "order": order
    }

# ==================== PAYMENT ENDPOINTS ====================

@app.post("/api/payment/process")
def process_payment(payment: PaymentRequest):
    """Process payment for an order"""
    order = next((o for o in ORDERS_DB if o["id"] == payment.orderId), None)
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Simulate payment processing
    payment_status = "success"
    
    # Update order status
    order["status"] = "Processing"
    order["paymentMethod"] = payment.method.value
    order["paymentStatus"] = payment_status
    
    return {
        "success": True,
        "message": "Payment processed successfully",
        "transactionId": f"TXN{datetime.now().timestamp()}",
        "order": order
    }

# ==================== ANALYTICS ENDPOINTS ====================

@app.get("/api/analytics")
def get_analytics(user_id: Optional[int] = None):
    """Get analytics data"""
    user_orders = [o for o in ORDERS_DB if o["userId"] == user_id] if user_id else ORDERS_DB
    
    total_orders = len(user_orders)
    total_spent = sum(o["amount"] for o in user_orders)
    delivered_orders = len([o for o in user_orders if o["status"] == "Delivered"])
    
    # Calculate savings
    total_savings = 0
    for order in user_orders:
        for item in order["items"]:
            product = next((p for p in PRODUCTS_DB if p["id"] == item["productId"]), None)
            if product:
                savings_per_item = (product["marketPrice"] - product["price"]) * item["quantity"]
                total_savings += savings_per_item
    
    return {
        "success": True,
        "analytics": {
            "totalOrders": total_orders,
            "totalSpent": round(total_spent, 2),
            "totalSavings": round(total_savings, 2),
            "deliveredOrders": delivered_orders,
            "activeOrders": total_orders - delivered_orders,
            "monthlySavings": ANALYTICS_DB["monthly_savings"]
        }
    }

# ==================== SALES ENDPOINTS ====================

@app.get("/api/sales")
def get_sales():
    """Get all sales records"""
    return {
        "success": True,
        "sales": SALES_DB,
        "count": len(SALES_DB)
    }

@app.post("/api/sales/add")
def add_sale(sale: SalesEntry):
    """Add new sales entry"""
    new_sale = {
        "id": len(SALES_DB) + 1,
        "productId": sale.productId,
        "quantity": sale.quantity,
        "customerId": sale.customerId,
        "salePrice": sale.salePrice,
        "date": sale.date,
        "totalAmount": sale.quantity * sale.salePrice
    }
    
    SALES_DB.append(new_sale)
    
    # Update product stock
    product = next((p for p in PRODUCTS_DB if p["id"] == sale.productId), None)
    if product:
        product["stock"] -= sale.quantity
    
    return {
        "success": True,
        "message": "Sale recorded successfully",
        "sale": new_sale
    }

# ==================== EXPORT ENDPOINTS ====================

@app.get("/api/export/products")
def export_products():
    """Export products as CSV data"""
    csv_data = "ID,Name,Brand,Category,Stock,Market Price,Sale Price,Savings %,Supplier,Location\n"
    
    for product in PRODUCTS_DB:
        csv_data += f"{product['id']},{product['name']},{product['brand']},{product['category']},"
        csv_data += f"{product['stock']},{product['marketPrice']},{product['price']},{product['savings']},"
        csv_data += f"{product['supplier']},{product['location']}\n"
    
    return {
        "success": True,
        "filename": f"products_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        "data": csv_data,
        "count": len(PRODUCTS_DB)
    }

@app.get("/api/export/orders")
def export_orders():
    """Export orders as CSV data"""
    csv_data = "Order ID,User ID,Status,Amount,Date,Items Count,Driver,Vehicle,ETA,Location\n"
    
    for order in ORDERS_DB:
        csv_data += f"{order['id']},{order['userId']},{order['status']},{order['amount']},"
        csv_data += f"{order['date']},{len(order['items'])},{order['driver']},{order['vehicle']},"
        csv_data += f"{order['eta']},{order['deliveryLocation']}\n"
    
    return {
        "success": True,
        "filename": f"orders_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        "data": csv_data,
        "count": len(ORDERS_DB)
    }

@app.get("/api/export/sales")
def export_sales():
    """Export sales as CSV data"""
    csv_data = "Sale ID,Product ID,Customer ID,Quantity,Sale Price,Total Amount,Date\n"
    
    for sale in SALES_DB:
        csv_data += f"{sale['id']},{sale['productId']},{sale['customerId']},{sale['quantity']},"
        csv_data += f"{sale['salePrice']},{sale['totalAmount']},{sale['date']}\n"
    
    return {
        "success": True,
        "filename": f"sales_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        "data": csv_data,
        "count": len(SALES_DB)
    }

# ==================== STATS ENDPOINTS ====================

@app.get("/api/stats")
def get_stats(user_id: Optional[int] = None):
    """Get dashboard statistics"""
    user_orders = [o for o in ORDERS_DB if o["userId"] == user_id] if user_id else ORDERS_DB
    
    total_savings = 0
    for order in user_orders:
        for item in order["items"]:
            product = next((p for p in PRODUCTS_DB if p["id"] == item["productId"]), None)
            if product:
                savings = (product["marketPrice"] - product["price"]) * item["quantity"]
                total_savings += savings
    
    active_orders = len([o for o in user_orders if o["status"] in ["Processing", "Out for Delivery"]])
    suppliers_count = len(set(p["supplier"] for p in PRODUCTS_DB))
    low_stock_count = len([p for p in PRODUCTS_DB if p["stock"] < 15])
    
    return {
        "success": True,
        "stats": {
            "totalSavings": round(total_savings, 2),
            "activeOrders": active_orders,
            "suppliers": suppliers_count,
            "lowStockAlerts": low_stock_count
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
