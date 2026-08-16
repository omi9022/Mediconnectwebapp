# 🚀 Quick Start - Run Both Servers

## ⚡ FASTEST WAY TO START

### Option 1: Two Terminals

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

### Option 2: One Command (Mac/Linux)

```bash
# Start both servers
./start-servers.sh
```

---

### Option 3: One Command (Windows)

```bash
# Start both servers
start-servers.bat
```

---

## 📋 PRE-FLIGHT CHECKLIST

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Verify Installations
```bash
# Check Python
python --version  # Should be 3.8+

# Check Node
node --version   # Should be 18+

# Check npm
npm --version
```

---

## ✅ AFTER STARTING

### Backend Server:
- URL: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Status: Check for "Application startup complete"

### Frontend Server:
- URL: `http://localhost:5173`
- Should auto-open in browser
- Login page should appear

---

## 🔐 LOGIN CREDENTIALS

### Customer Portal:
```
Username: customer
Password: customer123
```

### Hospital Portal:
```
Username: cityhospital
Password: hospital123
```

### Support Portal:
```
Username: admin
Password: admin123
```

---

## 🎯 QUICK TEST FLOW

1. **Start both servers** ✅
2. **Open** `http://localhost:5173` ✅
3. **Login** as customer ✅
4. **Click** "Stock Search" ✅
5. **Search** for "Paracetamol" ✅
6. **Click** "Add to Cart" ✅
7. **Click** cart icon ✅
8. **Click** "Place Order" ✅
9. **Select** payment method ✅
10. **Confirm** payment ✅
11. **Success!** Order placed ✅

---

## 🔧 COMMON ISSUES

### Port Already in Use:
```bash
# Backend (port 8000)
lsof -i :8000          # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>          # Mac/Linux
taskkill /PID <PID> /F # Windows
```

### Backend Won't Start:
```bash
# Reinstall dependencies
cd backend
pip install -r requirements.txt --force-reinstall
```

### Frontend Won't Start:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors:
```python
# In backend/main.py, update:
allow_origins=["http://localhost:5173"]
```

---

## 📊 VERIFY EVERYTHING WORKS

### Check Backend:
```bash
# Test API endpoint
curl http://localhost:8000/

# Should return:
{
  "message": "MediConnect API Server",
  "version": "1.0.0",
  "status": "running"
}
```

### Check Frontend:
- Open `http://localhost:5173`
- Should see login page
- No console errors
- Can click tabs

### Check API Connection:
- Login as customer
- Should redirect to dashboard
- Products should load
- No API errors in console

---

## 🎉 YOU'RE READY!

Both servers running? ✅
Login page visible? ✅
Can login successfully? ✅
Dashboard loads? ✅
Products load? ✅

**EVERYTHING WORKING! 🚀**

Start testing all features now!
