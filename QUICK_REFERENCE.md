# ⚡ QUICK REFERENCE CARD

## 🚀 START IN 30 SECONDS

```bash
# 1. Install
cd backend && pip install -r requirements.txt && cd .. && npm install

# 2. Start (choose one)
./start-servers.sh        # Mac/Linux (chmod +x start-servers.sh first)
start-servers.bat         # Windows
python backend/main.py & npm run dev  # Manual

# 3. Open
http://localhost:5173

# 4. Login
customer / customer123
```

---

## 🔑 ALL CREDENTIALS

```
Customer:  customer      / customer123
Hospital:  cityhospital  / hospital123
Support:   admin         / admin123
```

---

## 📊 MAIN FEATURES

| Feature | Status | Location |
|---------|--------|----------|
| Login System | ✅ | All portals |
| Stock Search | ✅ | Customer → Stock Search |
| Shopping Cart | ✅ | Customer → Cart icon |
| Place Order | ✅ | Customer → Cart → Place Order |
| Payment | ✅ | Customer → Payment modal |
| Track Order | ✅ | Customer → Logistics |
| Analytics | ✅ | Customer → Analytics |
| Settings | ✅ | Customer → Settings |
| Download CSV | ✅ | API → /export/* |

---

## 🌐 URLS

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://localhost:5173` | Main application |
| Backend | `http://localhost:8000` | API server |
| API Docs | `http://localhost:8000/docs` | Swagger UI |
| ReDoc | `http://localhost:8000/redoc` | API documentation |

---

## 🔌 KEY API ENDPOINTS

```bash
# Login
POST /api/auth/login
Body: { "username": "customer", "password": "customer123" }

# Get Products
GET /api/products
GET /api/products?category=pharma
GET /api/products?search=paracetamol

# Add Product
POST /api/products/add
Body: { "name": "...", "price": 100, "stock": 50, ... }

# Place Order
POST /api/orders/place
Body: { "userId": 1, "items": [...], "deliveryLocation": "..." }

# Process Payment
POST /api/payment/process
Body: { "orderId": "#ORD-9921", "method": "card", "amount": 4200 }

# Download Products CSV
GET /api/export/products

# Download Orders CSV
GET /api/export/orders

# Download Sales CSV
GET /api/export/sales
```

---

## 📥 DOWNLOAD FUNCTIONS

```javascript
// In your code
import api from '../services/api';

// Download products
await api.downloadProducts();
// Creates: products_YYYYMMDD_HHMMSS.csv

// Download orders
await api.downloadOrders();
// Creates: orders_YYYYMMDD_HHMMSS.csv

// Download sales
await api.downloadSales();
// Creates: sales_YYYYMMDD_HHMMSS.csv
```

---

## 🛒 COMPLETE ORDER FLOW

```
1. Login (customer/customer123)
2. Click "Stock Search"
3. Search product (e.g., "Paracetamol")
4. Click "Add to Cart"
5. Click cart icon (top right)
6. Review items
7. Click "Place Order"
8. Select payment method
9. Enter card details (if card)
10. Click "Confirm Payment"
11. Order placed! Get order ID
12. Track in "Logistics"
```

---

## 🧪 QUICK TESTS

### Test 1: Login (10 sec)
```
1. Open http://localhost:5173
2. Enter: customer / customer123
3. Click Login
4. Should see dashboard ✅
```

### Test 2: Search (20 sec)
```
1. Click "Stock Search"
2. Type "Paracetamol"
3. Should show results ✅
4. Click "Add to Cart"
5. Cart badge updates ✅
```

### Test 3: Order (60 sec)
```
1. Add items to cart
2. Click cart icon
3. Click "Place Order"
4. Select "Cash on Delivery"
5. Click "Confirm Payment"
6. Order placed ✅
```

### Test 4: Download (15 sec)
```
1. Open http://localhost:8000/docs
2. Find GET /export/products
3. Click "Try it out"
4. Click "Execute"
5. See CSV data ✅
```

---

## 🔧 COMMON ISSUES

### Port Busy
```bash
# Kill port 8000
lsof -i :8000    # Find PID
kill -9 <PID>    # Kill it

# Or change port in backend/main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Backend Won't Start
```bash
cd backend
pip install -r requirements.txt --force-reinstall
python main.py
```

### Frontend Won't Start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS Error
```python
# In backend/main.py
allow_origins=["http://localhost:5173"]
```

---

## 📂 FILE LOCATIONS

| File | Purpose |
|------|---------|
| `backend/main.py` | Python API server |
| `src/services/api.ts` | Frontend API layer |
| `src/app/components/CustomerDashboard.tsx` | Customer interface |
| `start-servers.sh` | Mac/Linux startup |
| `start-servers.bat` | Windows startup |

---

## 💡 PRO TIPS

1. **Start Fresh**: Delete `node_modules` and reinstall if issues
2. **Check Logs**: Backend errors show in Terminal 1, Frontend in Terminal 2
3. **API Testing**: Use Swagger UI at `/docs` for testing
4. **Data Reset**: Restart backend to reset data (in-memory)
5. **Multi-Port**: Run multiple instances on different ports

---

## 📊 SAMPLE DATA

### Products: 8 items
```
Remdesivir, Tocilizumab, Enoxaparin, Surgical Gloves,
N95 Masks, Digital Thermometer, Paracetamol, Azithromycin
```

### Categories: 8 types
```
All Stock, Critical, Emergency, Surgical,
Pharma, Diagnostics, Consumables, Equipment
```

### Payment Methods: 5 options
```
Credit/Debit Card, UPI, Net Banking, Wallet, Cash on Delivery
```

---

## ✅ VERIFICATION

After starting, check:
- [ ] Backend running: `curl http://localhost:8000/`
- [ ] Frontend loads: Open `http://localhost:5173`
- [ ] Can login: Use customer/customer123
- [ ] Dashboard displays: See stats cards
- [ ] Products load: Click Stock Search
- [ ] Cart works: Add item
- [ ] Payment works: Place order
- [ ] Download works: Export CSV

---

## 🎯 NEXT ACTIONS

1. ✅ Start servers
2. ✅ Test login
3. ✅ Test product search
4. ✅ Test cart & order
5. ✅ Test payment
6. ✅ Test downloads
7. ✅ Test all features
8. ✅ Read documentation
9. ✅ Customize as needed
10. ✅ Deploy to production

---

## 📚 FULL DOCS

- **README.md** - Project overview
- **COMPLETE_SYSTEM_GUIDE.md** - Complete documentation
- **BACKEND_SETUP_GUIDE.md** - Backend details
- **START_SERVER.md** - Startup guide
- **COMPLETE_CUSTOMER_FEATURES_GUIDE.md** - All features

---

## 🚀 ONE-LINE START

```bash
cd backend && python main.py & cd .. && npm run dev
```

---

**You're ready to go! 🎉**
