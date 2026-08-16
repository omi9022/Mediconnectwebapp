# 🔑 LOGIN CREDENTIALS - All Portals

## 🎯 QUICK ACCESS

### **Customer Portal** 🛒
```
Username: customer
Password: customer123
```
**Features:**
- Stock Search & Shopping Cart
- Order Placement & Tracking
- Payment Processing (5 methods)
- Analytics & Reports
- Product Download (CSV)
- Settings & Profile

---

### **Hospital Portal** 🏥
```
Username: cityhospital
Password: hospital123
```
**Features:**
- Patient Management
- Appointment Scheduling
- Staff Directory
- Bed Occupancy Tracking
- Revenue Analytics
- Medical Records

---

### **Support Portal** 🎯
```
Username: admin
Password: admin123
```
**Features:**
- System Administration
- Support Ticket Management
- Hospital Monitoring
- User Management
- System Analytics
- Reports & Export

---

## 🚀 HOW TO ACCESS

### Step 1: Start Servers
```bash
# Mac/Linux
./start-servers.sh

# Windows
start-servers.bat

# Or manually:
# Terminal 1: cd backend && python main.py
# Terminal 2: npm run dev
```

### Step 2: Open Browser
```
http://localhost:5173
```

### Step 3: Select Portal
You'll see **3 tabs** at the top:
- **Hospital** (Blue)
- **Support** (Teal)
- **Customer** (Green)

### Step 4: Enter Credentials
Click the tab for your portal, then enter:
- Username
- Password

### Step 5: Click Login
You're in! 🎉

---

## 📱 PORTAL FEATURES

### **Customer Portal Features:**
| Feature | Description |
|---------|-------------|
| Dashboard | Overview with stats, recent orders |
| Stock Search | Search medicines, add to cart |
| Shopping Cart | Manage items, quantities, checkout |
| Payment | 5 payment methods (Card, UPI, Net Banking, Wallet, COD) |
| Logistics | Track deliveries, driver info, ETA |
| Analytics | Charts, trends, savings report |
| Settings | Notifications, privacy, preferences |
| Profile | Personal info, statistics |

### **Hospital Portal Features:**
| Feature | Description |
|---------|-------------|
| Dashboard | Patient stats, appointments, alerts |
| Patients | Patient records, admissions, history |
| Appointments | Schedule, manage, track appointments |
| Staff | Doctor & nurse directory, availability |
| Analytics | Revenue, occupancy, trends |
| Inventory | Medicine & equipment tracking |
| Reports | Generate & download reports |

### **Support Portal Features:**
| Feature | Description |
|---------|-------------|
| Dashboard | System overview, tickets, hospitals |
| Tickets | Support request management |
| Hospitals | Monitor all hospitals |
| Users | User management, roles |
| Analytics | System-wide analytics |
| Settings | Platform configuration |
| Logs | Activity logs, audit trail |

---

## 🧪 QUICK TEST

### Test Customer Portal:
```
1. Login: customer / customer123
2. Click "Stock Search"
3. Search "Paracetamol"
4. Click "Add to Cart"
5. View cart (icon top-right)
6. Click "Place Order"
7. Select payment method
8. Confirm payment
✅ Order placed!
```

### Test Hospital Portal:
```
1. Login: cityhospital / hospital123
2. View dashboard stats
3. Check patient list
4. View appointments
5. Check staff directory
✅ All data visible!
```

### Test Support Portal:
```
1. Login: admin / admin123
2. View system overview
3. Check support tickets
4. Monitor hospitals
5. View analytics
✅ Admin access working!
```

---

## 🔐 PASSWORD SECURITY

**Current passwords are for DEMO/TESTING only:**
- ⚠️ These are simple passwords for testing
- ⚠️ Change passwords for production
- ⚠️ Use strong passwords (12+ characters)
- ⚠️ Enable 2FA for production

**Production Password Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not dictionary words
- Unique per user
- Rotated regularly

---

## 🆘 TROUBLESHOOTING

### Can't Login?
1. **Check spelling** - Passwords are case-sensitive
2. **Check tab** - Make sure you're on the right portal tab
3. **Check servers** - Both backend & frontend must be running
4. **Check console** - Look for errors in browser console (F12)
5. **Clear cache** - Try Ctrl+Shift+R to hard refresh

### Wrong Portal?
- Look at the **color of the sidebar**:
  - Blue = Hospital
  - Teal = Support  
  - Teal/Green = Customer

### Forgot which credentials?
- Check this file!
- Or try the "Auto-fill credentials" button on login page

---

## 📊 USER ROLES

### **Customer Role:**
- Can buy products
- Can track orders
- Can view analytics
- Cannot manage other users
- Cannot access admin features

### **Hospital Role:**
- Can manage patients
- Can schedule appointments
- Can view hospital stats
- Cannot access other hospitals
- Cannot access admin features

### **Support Role (Admin):**
- Can manage all hospitals
- Can view all data
- Can manage users
- Can configure system
- Full admin access

---

## 🎯 DEMO DATA

Each portal comes with **sample data** pre-loaded:

**Customer Portal:**
- 8 products
- 4 sample orders
- 12 months analytics
- 4 suppliers

**Hospital Portal:**
- 4 patients
- 5 appointments
- 4 staff members
- 3 alerts

**Support Portal:**
- 8 support tickets
- 4 hospitals
- System metrics
- Activity logs

---

## 📝 NOTES

1. **Passwords shown in login form** - For demo convenience
2. **Auto-fill button available** - Click to fill credentials automatically
3. **Data persists during session** - Resets when backend restarts
4. **Multiple logins** - Can open multiple tabs with different users
5. **No email confirmation** - Direct login for testing

---

## 🚀 QUICK REFERENCE

| Portal | Username | Password | Color |
|--------|----------|----------|-------|
| Customer | `customer` | `customer123` | Teal/Green |
| Hospital | `cityhospital` | `hospital123` | Blue |
| Support | `admin` | `admin123` | Teal |

**URLs:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## ✅ CHECKLIST

Before logging in, make sure:
- [ ] Backend server is running (port 8000)
- [ ] Frontend server is running (port 5173)
- [ ] Browser is on `http://localhost:5173`
- [ ] Correct tab is selected (Hospital/Support/Customer)
- [ ] Credentials are entered correctly
- [ ] No console errors (press F12)

---

## 🎉 YOU'RE ALL SET!

**All 3 portals are working and accessible!**

Choose your portal, enter credentials, and start exploring! 🚀

---

**Need help?** Check the documentation:
- `README.md` - Project overview
- `COMPLETE_SYSTEM_GUIDE.md` - Full system documentation
- `QUICK_REFERENCE.md` - Quick reference card
