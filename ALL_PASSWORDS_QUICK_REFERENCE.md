# 🔑 ALL PASSWORDS - QUICK REFERENCE

## 📱 WEBSITE
```
http://localhost:5173
```

---

## 🎯 OPTION 1: CUSTOMER PORTAL

### Login:
```
Username: customer
Password: customer123
```

### You Get:
- ✅ Shop for medicines
- ✅ Shopping cart & checkout
- ✅ 5 payment methods (Card, UPI, Net Banking, Wallet, COD)
- ✅ Order tracking with real-time status
- ✅ Analytics with charts & graphs
- ✅ Download orders as CSV
- ✅ Settings & preferences
- ✅ Profile management

### Dashboard Preview:
```
┌────────────────────────────────────────┐
│ Total Savings: ₹91,200 | Orders: 3    │
│                                         │
│ 🔍 Stock Search                        │
│ • Remdesivir - ₹28,800                 │
│ • Paracetamol - ₹45                    │
│ • [Add to Cart]                        │
│                                         │
│ 📦 Recent Orders                       │
│ • #ORD-9921 - Out for Delivery         │
│ • #ORD-9920 - Processing               │
└────────────────────────────────────────┘
```

---

## 🏥 OPTION 2: HOSPITAL PORTAL

### Login:
```
Username: cityhospital
Password: hospital123
```

### You Get:
- ✅ Patient management system
- ✅ Appointment scheduling
- ✅ Staff directory & availability
- ✅ Bed occupancy tracking
- ✅ Revenue & financial analytics
- ✅ Medical inventory
- ✅ Reports & alerts
- ✅ Department management

### Dashboard Preview:
```
┌────────────────────────────────────────┐
│ Patients: 1,247 | Appointments: 48    │
│ Revenue: ₹8.5L  | Occupancy: 86%     │
│                                         │
│ 👥 Recent Patients                     │
│ • Rajesh Kumar - Room 301-A (Critical) │
│ • Priya Patel - Room 205-B (Stable)    │
│                                         │
│ 📅 Today's Appointments                │
│ • 10:00 AM - Vijay Reddy (Dr. Shah)   │
│ • 10:30 AM - Anjali Mehta (Dr. Desai) │
└────────────────────────────────────────┘
```

---

## 🎯 OPTION 3: SUPPORT PORTAL (ADMIN)

### Login:
```
Username: admin
Password: admin123
```

### You Get:
- ✅ Full system administration
- ✅ Support ticket management
- ✅ Hospital monitoring (all hospitals)
- ✅ User management & roles
- ✅ System-wide analytics
- ✅ Platform configuration
- ✅ Activity logs & audit trail
- ✅ Generate reports

### Dashboard Preview:
```
┌────────────────────────────────────────┐
│ Tickets: 24 | Hospitals: 8 | Users: 45│
│                                         │
│ 🎫 Active Tickets                      │
│ • #TKT-001 - Payment Gateway Issue     │
│ • #TKT-002 - Delivery Delay            │
│                                         │
│ 🏥 Hospital Status                     │
│ • City Hospital - ✅ Active            │
│ • Apollo Clinic - ✅ Active            │
│ • MediCare Center - ⚠️ Issues         │
└────────────────────────────────────────┘
```

---

## 🚀 HOW TO START

### Windows:
```bash
start-servers.bat
```

### Mac/Linux:
```bash
chmod +x start-servers.sh
./start-servers.sh
```

### Manual:
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
npm run dev
```

---

## 📊 COMPARISON TABLE

| Feature | Customer | Hospital | Support |
|---------|----------|----------|---------|
| **Username** | `customer` | `cityhospital` | `admin` |
| **Password** | `customer123` | `hospital123` | `admin123` |
| **Color Theme** | 🟢 Teal/Green | 🔵 Blue | 🔷 Teal |
| **Shopping** | ✅ Yes | ❌ No | ❌ No |
| **Patient Mgmt** | ❌ No | ✅ Yes | ✅ View Only |
| **Admin Access** | ❌ No | ❌ No | ✅ Full |
| **Orders** | ✅ My Orders | ❌ No | ✅ All Orders |
| **Analytics** | ✅ Personal | ✅ Hospital | ✅ System-wide |
| **Tickets** | ✅ Create | ❌ No | ✅ Manage All |

---

## 🎯 RECOMMENDED TESTING ORDER

### First Time Users:
```
1. Start with CUSTOMER portal
   - Username: customer
   - Password: customer123
   - Explore shopping features

2. Then try HOSPITAL portal
   - Username: cityhospital
   - Password: hospital123
   - See patient management

3. Finally check SUPPORT portal
   - Username: admin
   - Password: admin123
   - View system admin features
```

---

## 💡 PRO TIPS

### Tip 1: Auto-Fill
Look for the blue box on login page that says:
```
Demo Credentials:
Username: customer
Password: customer123
[Auto-fill credentials] ← Click this!
```

### Tip 2: Switch Portals
- Click **Logout** button (top-right)
- Click different **tab** (Hospital/Support/Customer)
- Enter **new credentials**
- Login again

### Tip 3: Multiple Tabs
Open **3 browser tabs**:
- Tab 1: Customer portal
- Tab 2: Hospital portal
- Tab 3: Support portal

View all portals at once!

### Tip 4: Remember by Color
- **Customer** = Green/Teal sidebar
- **Hospital** = Blue sidebar
- **Support** = Teal sidebar

---

## ⚠️ IMPORTANT NOTES

### Security:
- ⚠️ These are **DEMO passwords** for testing
- ⚠️ **DO NOT** use in production
- ⚠️ Change passwords before deploying
- ⚠️ Enable 2FA for production use

### Data:
- Data stored **in-memory** (resets on restart)
- Sample data **pre-loaded** for testing
- Real database recommended for production

### Passwords:
- Current passwords are **intentionally simple**
- Shown on login page for **demo convenience**
- Change in `backend/main.py` for production

---

## 🔒 TO CHANGE PASSWORDS (Production)

### Edit Backend Database:
```python
# In backend/main.py, find USERS_DB:

USERS_DB = {
    "customer": {
        "username": "customer",
        "password": "YOUR_STRONG_PASSWORD_HERE",  # ← Change this
        ...
    },
    "cityhospital": {
        "username": "cityhospital", 
        "password": "YOUR_STRONG_PASSWORD_HERE",  # ← Change this
        ...
    },
    "admin": {
        "username": "admin",
        "password": "YOUR_STRONG_PASSWORD_HERE",  # ← Change this
        ...
    }
}
```

Then restart backend server.

---

## ✅ VERIFICATION CHECKLIST

Before trying to login:
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Browser on `http://localhost:5173`
- [ ] Login page visible
- [ ] Three tabs showing (Hospital, Support, Customer)
- [ ] No console errors (press F12)

---

## 🎉 READY TO GO!

**You now have all the passwords and access to all 3 portals!**

### Summary:
1. **Customer**: `customer` / `customer123` - Shop & track orders
2. **Hospital**: `cityhospital` / `hospital123` - Manage patients
3. **Support**: `admin` / `admin123` - System administration

**Start the servers and explore!** 🚀

```bash
./start-servers.sh  # Mac/Linux
# OR
start-servers.bat   # Windows
```

**Then open:** `http://localhost:5173`

**Happy exploring!** 🎊
