# MediConnect Backend API

Complete Python backend for the MediConnect healthcare supply chain platform.

## 🚀 Features

### ✅ Fully Implemented

- **Authentication & Authorization**: JWT-based auth with secure password hashing
- **User Management**: Registration, login, profile management
- **Settings Management**: All user preferences stored and applied
- **Product Management**: CRUD operations for medical supplies
- **Order Management**: Complete order lifecycle with status tracking
- **Payment Processing**: Stripe integration for payments
- **Notifications**: Email (SendGrid), SMS (Twilio), Push notifications
- **Currency Conversion**: Real-time forex rates with fallback
- **Geolocation**: Distance calculations and nearby supplier search
- **Analytics**: Revenue, orders, savings tracking
- **Background Tasks**: Auto-reorder, low stock alerts, order updates
- **Database**: SQLAlchemy ORM with PostgreSQL/SQLite support

## 📋 Requirements

- Python 3.9+
- PostgreSQL (or SQLite for development)
- Redis (optional, for caching)

## 🛠️ Installation

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- Database URL
- Secret key
- SendGrid API key (for emails)
- Twilio credentials (for SMS)
- Stripe keys (for payments)

### 4. Initialize Database

```bash
python -c "from database import init_db; init_db()"
```

### 5. Seed Sample Data (Optional)

```bash
python seed_data.py
```

## 🏃 Running the Server

### Development Mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user info

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Payment
- `GET /api/payment-methods` - List payment methods
- `POST /api/payment-methods` - Add payment method
- `DELETE /api/payment-methods/{id}` - Remove payment method
- `POST /api/payment/create-intent` - Create payment intent

### Currency
- `POST /api/currency/convert` - Convert currency
- `GET /api/currency/rates` - Get exchange rates

### Suppliers
- `GET /api/suppliers` - List suppliers
- `GET /api/suppliers/nearby` - Find nearby suppliers
- `POST /api/suppliers` - Create supplier

### Analytics
- `GET /api/analytics` - Get user analytics

### Utilities
- `POST /api/utils/clear-data` - Clear all user data
- `POST /api/utils/deactivate-account` - Deactivate account
- `GET /health` - Health check

## 🔐 Authentication

All endpoints (except register/login) require authentication.

### Get Token

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=your_username&password=your_password"
```

### Use Token

```bash
curl -X GET "http://localhost:8000/api/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📧 Notification Services

### Email (SendGrid)

```python
await email_service.send_order_confirmation(
    to_email="user@example.com",
    order_number="ORD-12345",
    total_amount=5000,
    items_count=10
)
```

### SMS (Twilio)

```python
await sms_service.send_order_update(
    to_phone="+1234567890",
    order_number="ORD-12345",
    status="Out for Delivery"
)
```

## 💳 Payment Processing

Uses Stripe for payment processing:

```python
# Create payment intent
intent = await payment_service.create_payment_intent(
    amount=5000.00,
    currency="inr",
    metadata={"order_id": "ORD-12345"}
)
```

## 💱 Currency Conversion

Real-time forex rates:

```python
converted_amount = currency_service.convert(
    amount=1000,
    from_currency="INR",
    to_currency="USD"
)
```

## 📍 Geolocation

Find nearby suppliers:

```python
nearby = geolocation_service.find_nearest_suppliers(
    user_location=(23.0225, 72.5714),  # Lat, Long
    supplier_locations=suppliers,
    max_distance=50  # km
)
```

## ⏰ Background Tasks

Auto-running tasks:
- **Low Stock Alerts**: Runs every hour
- **Auto-Reorder Check**: Runs every 2 hours
- **Order Status Updates**: Runs every 15 minutes

## 🗄️ Database Models

### User
- Authentication and profile information
- One-to-one relationship with UserSettings

### UserSettings
- All user preferences and settings
- Notification, privacy, payment preferences

### Product
- Medical supplies/medicines
- Stock levels, pricing, categories

### Order
- Order information and status
- One-to-many relationship with OrderItems

### Notification
- User notifications
- Filtered based on user settings

### PaymentMethod
- Saved payment cards
- Stripe integration

### Supplier
- Supplier information
- Location and ratings

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=. --cov-report=html
```

## 📊 Monitoring

### Logs

Uses Loguru for structured logging:

```python
from loguru import logger

logger.info("Order created successfully")
logger.error("Payment failed")
```

### Health Check

```bash
curl http://localhost:8000/health
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens for authentication
- CORS protection
- SQL injection protection (SQLAlchemy ORM)
- Environment-based configuration
- Secure password requirements

## 🌍 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/mediconnect

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (SendGrid)
SENDGRID_API_KEY=your-key
FROM_EMAIL=noreply@mediconnect.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Redis
REDIS_URL=redis://localhost:6379

# App
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
```

## 🚀 Deployment

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t mediconnect-api .
docker run -p 8000:8000 --env-file .env mediconnect-api
```

### Using Gunicorn

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📞 Support

For issues or questions, contact the development team or check the API documentation at `/docs`.

## 📄 License

Proprietary - MediConnect Healthcare Platform
