# 🏥 MediConnect Python Backend - Complete Setup Guide

## 📋 Overview

This is a **production-ready Python backend** for MediConnect with all working functionalities using industry-standard libraries.

## ✨ Features Implemented

### 🔐 Authentication & Security
- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ OAuth2 password flow
- ✅ Role-based access control

### 📧 Notification Services
- ✅ **Email**: SendGrid integration for transactional emails
- ✅ **SMS**: Twilio integration for text messages
- ✅ **Push**: Framework ready for Firebase Cloud Messaging

### 💳 Payment Processing
- ✅ **Stripe**: Full payment gateway integration
- ✅ Saved payment methods
- ✅ Refunds and payment intents

### 💱 Currency Conversion
- ✅ Real-time forex rates using `forex-python`
- ✅ Fallback rates when API unavailable
- ✅ Multi-currency support (INR, USD, EUR, GBP, etc.)

### 📍 Geolocation
- ✅ Address to coordinates conversion
- ✅ Distance calculations using `geopy`
- ✅ Nearby supplier search

### 🗄️ Database
- ✅ SQLAlchemy ORM
- ✅ PostgreSQL/SQLite support
- ✅ Automatic migrations
- ✅ Relationship management

### ⚡ Real-Time Features
- ✅ Background task scheduler
- ✅ Auto-reorder system
- ✅ Low stock alerts
- ✅ Order status updates

### 📊 Analytics
- ✅ Revenue tracking
- ✅ Order analytics
- ✅ Savings calculations
- ✅ Top products reporting

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- FastAPI backend on port 8000

API will be available at: http://localhost:8000

### Option 2: Manual Setup

#### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=sqlite:///./mediconnect.db  # For development

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (Optional - will use console logging if not set)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@mediconnect.com

# SMS (Optional - will use console logging if not set)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Payment (Optional - will use test mode if not set)
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_PUBLIC_KEY=pk_test_your-public-key

# App
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 4. Initialize Database

```bash
python seed_data.py
```

This creates:
- Database tables
- Sample users (admin, cityhospital)
- Products and suppliers
- Sample notifications

#### 5. Start Server

```bash
# Development mode (auto-reload)
python run.py

# OR using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Once running, visit:

- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🧪 Testing the Backend

### 1. Register a User

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "full_name": "Test User",
    "phone": "+1234567890",
    "location": "Mumbai, India"
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Use Token

```bash
TOKEN="your-access-token-here"

# Get products
curl -X GET "http://localhost:8000/api/products" \
  -H "Authorization: Bearer $TOKEN"

# Get settings
curl -X GET "http://localhost:8000/api/settings" \
  -H "Authorization: Bearer $TOKEN"

# Update settings
curl -X PUT "http://localhost:8000/api/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "Hindi",
    "currency": "USD",
    "sound_enabled": false
  }'
```

### 4. Place Order

```bash
curl -X POST "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 2, "quantity": 1}
    ],
    "payment_method": "card",
    "delivery_address": "123 Main St, Mumbai"
  }'
```

## 🔧 Configuration

### Email Configuration (SendGrid)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env`:

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

### SMS Configuration (Twilio)

1. Sign up at https://twilio.com
2. Get Account SID and Auth Token
3. Get a phone number
4. Add to `.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Payment Configuration (Stripe)

1. Sign up at https://stripe.com
2. Get API keys from Dashboard
3. Add to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

## 🗄️ Database Management

### Using SQLite (Development)

```env
DATABASE_URL=sqlite:///./mediconnect.db
```

### Using PostgreSQL (Production)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mediconnect
```

### Migrations

The app uses SQLAlchemy and creates tables automatically on startup.

To reset database:

```bash
rm mediconnect.db  # If using SQLite
python seed_data.py
```

## 📊 Background Tasks

The backend runs scheduled tasks:

- **Low Stock Alerts**: Every 1 hour
- **Auto-Reorder Check**: Every 2 hours
- **Order Status Updates**: Every 15 minutes

These tasks run automatically when the server starts.

## 🐳 Docker Deployment

### Build and Run

```bash
docker-compose up --build
```

### Stop

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f backend
```

### Reset Everything

```bash
docker-compose down -v  # Removes volumes
docker-compose up --build
```

## 🔍 Logging

Logs are stored in `backend/logs/` directory:

- Console output with color coding
- File rotation (500 MB per file)
- 10 days retention
- Separate logs for different log levels

View logs:

```bash
tail -f logs/mediconnect_*.log
```

## 🌐 CORS Configuration

Update allowed origins in `.env`:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com
```

## 🔒 Security Best Practices

### Production Checklist

- [ ] Change `SECRET_KEY` to strong random string
- [ ] Set `DEBUG=False`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Use environment-specific API keys
- [ ] Regular backups
- [ ] Monitor logs

### Generate Secret Key

```python
import secrets
print(secrets.token_urlsafe(32))
```

## 📦 Project Structure

```
backend/
├── main.py                    # Main FastAPI application
├── main_continued.py          # Additional endpoints
├── database.py                # Database configuration
├── models.py                  # SQLAlchemy models
├── schemas.py                 # Pydantic schemas
├── auth.py                    # Authentication utilities
├── tasks.py                   # Background tasks
├── seed_data.py              # Database seeding
├── run.py                    # Startup script
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
├── README.md               # Documentation
└── services/
    ├── notifications.py    # Email, SMS, Push services
    ├── currency.py        # Currency conversion
    ├── payment.py         # Payment processing
    └── geolocation.py     # Location services
```

## 🎯 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get access token
- `GET /api/auth/me` - Current user info

### Settings
- `GET /api/settings` - Get preferences
- `PUT /api/settings` - Update preferences

### Products
- `GET /api/products` - List products
- `GET /api/products/{id}` - Product details
- `POST /api/products` - Create product

### Orders
- `GET /api/orders` - User orders
- `POST /api/orders` - Place order
- `GET /api/orders/{id}` - Order details

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark read
- `PUT /api/notifications/mark-all-read` - Mark all

### Payment
- `GET /api/payment-methods` - Saved cards
- `POST /api/payment-methods` - Add card
- `DELETE /api/payment-methods/{id}` - Remove card
- `POST /api/payment/create-intent` - Payment intent

### Currency
- `POST /api/currency/convert` - Convert amount
- `GET /api/currency/rates` - Exchange rates

### Analytics
- `GET /api/analytics` - User analytics

### Utilities
- `POST /api/utils/clear-data` - Clear all data
- `POST /api/utils/deactivate-account` - Deactivate
- `GET /health` - Health check

## 🤝 Integration with Frontend

### Update Frontend API Base URL

In your React app, create an API client:

```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Example Usage

```javascript
import apiClient from './api/client';

// Login
const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  localStorage.setItem('access_token', response.data.access_token);
};

// Get products
const getProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};

// Update settings
const updateSettings = async (settings) => {
  const response = await apiClient.put('/settings', settings);
  return response.data;
};
```

## 📞 Support & Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 8000
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database connection error:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs db
```

**Module not found:**
```bash
# Ensure virtual environment is activated
pip install -r requirements.txt
```

## 🎉 Success!

Your backend is now running with:
- ✅ Full authentication system
- ✅ Real email and SMS notifications
- ✅ Payment processing
- ✅ Currency conversion
- ✅ Geolocation services
- ✅ Background task scheduler
- ✅ Complete API documentation

Visit http://localhost:8000/docs to explore all endpoints!

## 📝 Default Credentials

After running `seed_data.py`:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Hospital Account:**
- Username: `cityhospital`
- Password: `hospital123`

---

**🚀 Your MediConnect backend is production-ready!**
