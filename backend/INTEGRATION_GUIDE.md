# 🔗 Frontend-Backend Integration Guide

## 📡 Connecting React Frontend to Python Backend

### Step 1: Install Axios in Frontend

```bash
cd /src
npm install axios
```

### Step 2: Create API Configuration

Create `/src/api/config.js`:

```javascript
import axios from 'axios';

// Backend URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 3: Create API Service Functions

Create `/src/api/services.js`:

```javascript
import apiClient from './config';

// ==================== AUTH ====================

export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    // Save token
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

// ==================== SETTINGS ====================

export const settingsAPI = {
  get: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  update: async (settings) => {
    const response = await apiClient.put('/settings', settings);
    return response.data;
  }
};

// ==================== PRODUCTS ====================

export const productsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/products?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  }
};

// ==================== ORDERS ====================

export const ordersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  }
};

// ==================== NOTIFICATIONS ====================

export const notificationsAPI = {
  getAll: async (unreadOnly = false) => {
    const params = unreadOnly ? '?unread_only=true' : '';
    const response = await apiClient.get(`/notifications${params}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/mark-all-read');
    return response.data;
  }
};

// ==================== PAYMENT ====================

export const paymentAPI = {
  getMethods: async () => {
    const response = await apiClient.get('/payment-methods');
    return response.data;
  },

  addMethod: async (methodData) => {
    const response = await apiClient.post('/payment-methods', methodData);
    return response.data;
  },

  removeMethod: async (id) => {
    const response = await apiClient.delete(`/payment-methods/${id}`);
    return response.data;
  },

  setDefault: async (id) => {
    const response = await apiClient.put(`/payment-methods/${id}/set-default`);
    return response.data;
  },

  createPaymentIntent: async (amount, currency = 'inr') => {
    const response = await apiClient.post('/payment/create-intent', { amount, currency });
    return response.data;
  }
};

// ==================== CURRENCY ====================

export const currencyAPI = {
  convert: async (amount, fromCurrency, toCurrency) => {
    const response = await apiClient.post('/currency/convert', {
      amount,
      from_currency: fromCurrency,
      to_currency: toCurrency
    });
    return response.data;
  },

  getRates: async (baseCurrency = 'INR') => {
    const response = await apiClient.get(`/currency/rates?base_currency=${baseCurrency}`);
    return response.data;
  }
};

// ==================== SUPPLIERS ====================

export const suppliersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/suppliers');
    return response.data;
  },

  getNearby: async (latitude, longitude, maxDistance = 50) => {
    const response = await apiClient.get(
      `/suppliers/nearby?latitude=${latitude}&longitude=${longitude}&max_distance=${maxDistance}`
    );
    return response.data;
  }
};

// ==================== ANALYTICS ====================

export const analyticsAPI = {
  get: async () => {
    const response = await apiClient.get('/analytics');
    return response.data;
  }
};

// ==================== UTILITIES ====================

export const utilsAPI = {
  clearData: async () => {
    const response = await apiClient.post('/utils/clear-data');
    return response.data;
  },

  deactivateAccount: async () => {
    const response = await apiClient.post('/utils/deactivate-account');
    return response.data;
  }
};
```

### Step 4: Update React App to Use Backend

Modify `/src/app/App.tsx` to integrate with backend:

```typescript
import { useEffect } from 'react';
import { 
  settingsAPI, 
  productsAPI, 
  ordersAPI, 
  notificationsAPI 
} from './api/services';

export default function App() {
  // ... existing state ...

  // Load data from backend on mount
  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    try {
      // Load settings
      const backendSettings = await settingsAPI.get();
      setSettings(backendSettings);

      // Load products
      const backendProducts = await productsAPI.getAll();
      setEmergencyStock(backendProducts);

      // Load orders
      const backendOrders = await ordersAPI.getAll();
      setOrders(backendOrders);

      // Load notifications
      const backendNotifications = await notificationsAPI.getAll();
      setNotificationsList(backendNotifications);

    } catch (error) {
      console.error('Failed to load data from backend:', error);
      // Fallback to mock data if backend is unavailable
    }
  };

  // Update settings in backend
  const updateSettingsInBackend = async (newSettings) => {
    try {
      const updated = await settingsAPI.update(newSettings);
      setSettings(updated);
      playSound('success');
    } catch (error) {
      console.error('Failed to update settings:', error);
      playSound('error');
    }
  };

  // Place order via backend
  const placeOrderViaBackend = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        payment_method: settings.defaultPaymentMethod,
        delivery_address: settings.defaultDeliveryAddress || userProfile.location
      };

      const newOrder = await ordersAPI.create(orderData);
      
      setOrders([newOrder, ...orders]);
      setCart([]);
      setShowCartModal(false);
      playSound('success');

      // Refresh notifications
      const updatedNotifications = await notificationsAPI.getAll();
      setNotificationsList(updatedNotifications);

    } catch (error) {
      console.error('Failed to place order:', error);
      playSound('error');
      alert('Failed to place order. Please try again.');
    }
  };

  // ... rest of component ...
}
```

### Step 5: Environment Variables

Create `/src/.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

Create `/src/.env.production`:

```env
REACT_APP_API_URL=https://api.mediconnect.com/api
```

### Step 6: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🔄 Data Flow

```
┌─────────────┐           ┌─────────────┐           ┌──────────────┐
│   React     │  HTTP     │  FastAPI    │  SQL      │  PostgreSQL  │
│  Frontend   │ ◄──────► │  Backend    │ ◄──────► │  Database    │
└─────────────┘           └─────────────┘           └──────────────┘
      │                         │
      │                         ├──────► SendGrid (Email)
      │                         ├──────► Twilio (SMS)
      │                         ├──────► Stripe (Payment)
      │                         └──────► Forex API (Currency)
      │
      └─────────► localStorage (Token)
```

## 🎯 Example: Complete Settings Update Flow

1. **User clicks toggle in Settings screen**
2. **React component calls API:**
   ```javascript
   await settingsAPI.update({ soundEnabled: false });
   ```
3. **Backend receives request at `/api/settings`**
4. **Backend validates JWT token**
5. **Backend updates database:**
   ```python
   settings.sound_enabled = False
   db.commit()
   ```
6. **Backend returns updated settings**
7. **React updates state and UI**

## 🧪 Testing Integration

### Test 1: Login Flow

```javascript
import { authAPI } from './api/services';

const testLogin = async () => {
  try {
    const result = await authAPI.login('cityhospital', 'hospital123');
    console.log('Login successful:', result);
    
    const user = await authAPI.getCurrentUser();
    console.log('Current user:', user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Test 2: Settings Update

```javascript
import { settingsAPI } from './api/services';

const testSettings = async () => {
  // Get current settings
  const settings = await settingsAPI.get();
  console.log('Current settings:', settings);
  
  // Update settings
  const updated = await settingsAPI.update({
    language: 'Hindi',
    currency: 'USD',
    theme: 'dark'
  });
  console.log('Updated settings:', updated);
};
```

### Test 3: Place Order

```javascript
import { ordersAPI } from './api/services';

const testOrder = async () => {
  const order = await ordersAPI.create({
    items: [
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 1 }
    ],
    payment_method: 'card',
    delivery_address: '123 Main St, Mumbai'
  });
  console.log('Order created:', order);
};
```

## 🔧 Troubleshooting

### CORS Errors

If you see CORS errors, ensure backend `.env` has:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 401 Unauthorized

Check if token is being sent:

```javascript
const token = localStorage.getItem('access_token');
console.log('Token:', token);
```

### Network Errors

Verify backend is running:

```bash
curl http://localhost:8000/health
```

## 🚀 Deployment

### Deploy Backend (Example: Railway)

1. Push code to GitHub
2. Connect Railway to repository
3. Add environment variables
4. Deploy!

### Deploy Frontend (Example: Vercel)

1. Update `.env.production` with backend URL
2. Push to GitHub
3. Connect Vercel to repository
4. Deploy!

---

**✅ Your frontend and backend are now fully integrated!**
