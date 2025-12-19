import React, { useState, useEffect } from 'react';
import { 
  Home, Search, ShoppingCart, User, 
  MapPin, Bell, Truck, Package, 
  AlertCircle, ChevronRight, TrendingDown,
  Clock, ShieldCheck, Filter, Star,
  Menu, Settings, LogOut, Users,
  Activity, DollarSign, TrendingUp,
  CheckCircle, XCircle, Phone,
  MessageSquare, Calendar, BarChart3,
  Edit, Trash2, Plus, X, Eye,
  Download, Upload, RefreshCw, FileText,
  CreditCard, Wallet, Mail, Building,
  Globe, Moon, Sun, Volume2, VolumeX,
  Lock, Key, HelpCircle, Info
} from 'lucide-react';

// --- MOCK DATA ---
const initialCategories = [
  { id: 1, name: 'Emergency', icon: '🚨', color: 'bg-red-100', textColor: 'text-red-700', count: 45 },
  { id: 2, name: 'Surgical', icon: '✂️', color: 'bg-blue-100', textColor: 'text-blue-700', count: 128 },
  { id: 3, name: 'Pharma', icon: '💊', color: 'bg-green-100', textColor: 'text-green-700', count: 234 },
  { id: 4, name: 'Equipment', icon: '🩺', color: 'bg-purple-100', textColor: 'text-purple-700', count: 89 },
  { id: 5, name: 'Diagnostics', icon: '🔬', color: 'bg-orange-100', textColor: 'text-orange-700', count: 56 },
  { id: 6, name: 'Consumables', icon: '🧪', color: 'bg-pink-100', textColor: 'text-pink-700', count: 312 },
];

const initialStock = [
  { id: 1, name: 'Remdesivir Inj. 100mg', brand: 'Cipla', stock: 45, dist: '2.5km', price: 1200, marketPrice: 1800, urgent: true, supplier: 'MedPlus Distributors', category: 'Emergency', rating: 4.5 },
  { id: 2, name: 'Enoxaparin Sodium', brand: 'Sanofi', stock: 12, dist: '4.1km', price: 450, marketPrice: 620, urgent: true, supplier: 'Apollo Pharmacy Hub', category: 'Emergency', rating: 4.7 },
  { id: 3, name: 'Tocilizumab 400mg', brand: 'Roche', stock: 3, dist: '8.0km', price: 32000, marketPrice: 40000, urgent: true, supplier: 'Healthcare Solutions', category: 'Emergency', rating: 4.8 },
  { id: 4, name: 'Dexamethasone 8mg', brand: 'Pfizer', stock: 89, dist: '1.2km', price: 85, marketPrice: 120, urgent: false, supplier: 'MedPlus Distributors', category: 'Pharma', rating: 4.6 },
  { id: 5, name: 'Azithromycin 500mg', brand: 'Sun Pharma', stock: 156, dist: '3.5km', price: 45, marketPrice: 75, urgent: false, supplier: 'Wellness Pharma', category: 'Pharma', rating: 4.4 },
  { id: 6, name: 'Surgical Gloves (Box)', brand: 'Ansell', stock: 234, dist: '2.8km', price: 180, marketPrice: 250, urgent: false, supplier: 'MedPlus Distributors', category: 'Surgical', rating: 4.9 },
  { id: 7, name: 'N95 Masks (Pack of 10)', brand: '3M', stock: 567, dist: '1.5km', price: 120, marketPrice: 180, urgent: false, supplier: 'Apollo Pharmacy Hub', category: 'Consumables', rating: 4.7 },
  { id: 8, name: 'Digital Thermometer', brand: 'Omron', stock: 78, dist: '3.2km', price: 450, marketPrice: 650, urgent: false, supplier: 'Healthcare Solutions', category: 'Equipment', rating: 4.5 },
];

const initialOrders = [
  { id: '#ORD-9921', status: 'Out for Delivery', items: 120, time: '15 mins away', total: 4200, date: 'Today, 10:45 AM', driver: 'Rahul S.', phone: '+91 98765 43210', vehicle: 'GJ-06-XY-1234' },
  { id: '#ORD-9920', status: 'Processing', items: 85, time: '2 hours', total: 2850, date: 'Today, 09:30 AM', driver: 'Pending', phone: '', vehicle: '' },
  { id: '#ORD-9919', status: 'Delivered', items: 200, time: 'Completed', total: 8500, date: 'Yesterday, 04:20 PM', driver: 'Priya M.', phone: '+91 98765 43211', vehicle: 'GJ-06-AB-5678' },
  { id: '#ORD-9918', status: 'Delivered', items: 150, time: 'Completed', total: 5200, date: 'Yesterday, 02:15 PM', driver: 'Amit K.', phone: '+91 98765 43212', vehicle: 'GJ-06-CD-9012' },
  { id: '#ORD-9917', status: 'Cancelled', items: 45, time: 'Cancelled', total: 1200, date: '2 days ago', driver: 'N/A', phone: '', vehicle: '' },
];

const notifications = [
  { id: 1, title: 'Low Stock Alert', message: 'Remdesivir stock below 50 units', time: '5 mins ago', read: false, type: 'warning' },
  { id: 2, title: 'Order Delivered', message: 'Order #ORD-9919 delivered successfully', time: '3 hours ago', read: false, type: 'success' },
  { id: 3, title: 'New Supplier Added', message: 'Healthcare Solutions verified', time: '5 hours ago', read: true, type: 'info' },
  { id: 4, title: 'Payment Received', message: 'Payment of $8,500 received', time: '1 day ago', read: true, type: 'success' },
  { id: 5, title: 'Delivery Delayed', message: 'Order #ORD-9920 delayed by 30 mins', time: '2 days ago', read: true, type: 'error' },
];

const suppliers = [
  { id: 1, name: 'MedPlus Distributors', rating: 4.8, orders: 234, location: 'Vadodara', distance: '2.5km', verified: true, contact: '+91 98765 00001' },
  { id: 2, name: 'Apollo Pharmacy Hub', rating: 4.7, orders: 189, location: 'Vadodara', distance: '4.1km', verified: true, contact: '+91 98765 00002' },
  { id: 3, name: 'Healthcare Solutions', rating: 4.9, orders: 156, location: 'Vadodara', distance: '8.0km', verified: true, contact: '+91 98765 00003' },
  { id: 4, name: 'Wellness Pharma', rating: 4.6, orders: 198, location: 'Vadodara', distance: '3.5km', verified: true, contact: '+91 98765 00004' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [notificationPanel, setNotificationPanel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [emergencyStock, setEmergencyStock] = useState(initialStock);
  const [filteredStock, setFilteredStock] = useState(initialStock);
  const [sortBy, setSortBy] = useState('distance');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [orders, setOrders] = useState(initialOrders);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'City Hospital',
    type: 'Hospital',
    location: 'Vadodara, Gujarat',
    email: 'admin@cityhospital.com',
    phone: '+91 98765 54321',
    verified: true
  });

  // Settings state
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    lowStockAlerts: true,
    priceAlerts: false,
    promotionalEmails: true,
    
    // Privacy Settings
    shareDataWithSuppliers: true,
    showOnlineStatus: true,
    allowAnalytics: true,
    
    // General Settings
    language: 'English',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    theme: 'light',
    soundEnabled: true,
    
    // Order Settings
    autoReorder: false,
    defaultDeliveryAddress: 'City Hospital, Vadodara',
    requireOrderConfirmation: true,
    
    // Payment Settings
    savedCards: [
      { id: 1, last4: '4242', type: 'Visa', expiry: '12/25', default: true },
      { id: 2, last4: '8888', type: 'Mastercard', expiry: '06/26', default: false }
    ],
    defaultPaymentMethod: 'card'
  });

  // Calculate totals
  const totalSavings = emergencyStock.reduce((acc, item) => acc + (item.marketPrice - item.price) * 10, 0);
  const activeOrdersCount = orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Processing').length;
  const unreadNotifications = notificationsList.filter(n => !n.read).length;

  // Filter and sort stock
  useEffect(() => {
    let filtered = emergencyStock;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Urgent filter
    if (filterUrgent) {
      filtered = filtered.filter(item => item.urgent);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return parseFloat(a.dist) - parseFloat(b.dist);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredStock(filtered);
  }, [searchQuery, sortBy, filterCategory, filterUrgent, emergencyStock]);

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update cart quantity
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartMarketTotal = cart.reduce((acc, item) => acc + (item.marketPrice * item.quantity), 0);
  const cartSavings = cartMarketTotal - cartTotal;

  // Mark notification as read
  const markAsRead = (id) => {
    setNotificationsList(notificationsList.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, read: true })));
  };

  // Place order
  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `#ORD-${10000 - orders.length}`,
      status: 'Processing',
      items: cart.reduce((acc, item) => acc + item.quantity, 0),
      time: 'Processing',
      total: cartTotal,
      date: `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      driver: 'Pending',
      phone: '',
      vehicle: ''
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCartModal(false);

    // Add notification
    const newNotification = {
      id: notificationsList.length + 1,
      title: 'Order Placed',
      message: `Order ${newOrder.id} placed successfully`,
      time: 'Just now',
      read: false,
      type: 'success'
    };
    setNotificationsList([newNotification, ...notificationsList]);
  };

  // --- COMPONENT: SIDEBAR ---
  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col z-50`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        {sidebarOpen ? (
          <>
            <div>
              <h1 className="font-bold text-slate-800">MediConnect</h1>
              <p className="text-slate-500">Healthcare Platform</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
              <Menu size={20} />
            </button>
          </>
        ) : (
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-slate-600 mx-auto">
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Home size={20} />
          {sidebarOpen && <span className="font-medium">Dashboard</span>}
        </button>

        <button 
          onClick={() => setActiveTab('search')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'search' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Search size={20} />
          {sidebarOpen && <span className="font-medium">Stock Search</span>}
        </button>

        <button 
          onClick={() => setActiveTab('orders')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'orders' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Truck size={20} />
          {sidebarOpen && <span className="font-medium">Logistics</span>}
          {sidebarOpen && activeOrdersCount > 0 && (
            <span className="ml-auto bg-blue-500 text-white px-2 py-0.5 rounded-full">{activeOrdersCount}</span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('suppliers')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'suppliers' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users size={20} />
          {sidebarOpen && <span className="font-medium">Suppliers</span>}
        </button>

        <button 
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'analytics' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BarChart3 size={20} />
          {sidebarOpen && <span className="font-medium">Analytics</span>}
        </button>

        <div className="pt-4 mt-4 border-t border-slate-200">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="font-medium">Settings</span>}
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User size={20} />
            {sidebarOpen && <span className="font-medium">Profile</span>}
          </button>
        </div>
      </nav>

      {/* User Info */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Building className="text-teal-700" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{userProfile.name}</p>
              <p className="text-slate-500">{userProfile.type}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  // --- COMPONENT: TOP BAR ---
  const TopBar = () => (
    <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800">
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'search' && 'Real-Time Stock Search'}
            {activeTab === 'orders' && 'Logistics & Tracking'}
            {activeTab === 'suppliers' && 'Supplier Management'}
            {activeTab === 'analytics' && 'Analytics & Reports'}
            {activeTab === 'settings' && 'Settings & Preferences'}
            {activeTab === 'profile' && 'Profile Settings'}
          </h2>
          <p className="text-slate-500">{userProfile.location} • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button 
            onClick={() => setShowCartModal(true)}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ShoppingCart size={20} className="text-slate-600" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center">{cart.length}</span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationPanel(!notificationPanel)}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-slate-600" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Panel */}
            {notificationPanel && (
              <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificationsList.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${!notif.read ? 'bg-teal-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notif.type === 'warning' ? 'bg-yellow-100' :
                          notif.type === 'success' ? 'bg-green-100' :
                          notif.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {notif.type === 'warning' && <AlertCircle className="text-yellow-600" size={16} />}
                          {notif.type === 'success' && <CheckCircle className="text-green-600" size={16} />}
                          {notif.type === 'error' && <XCircle className="text-red-600" size={16} />}
                          {notif.type === 'info' && <Bell className="text-blue-600" size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{notif.title}</p>
                          <p className="text-slate-600">{notif.message}</p>
                          <p className="text-slate-400 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              setActiveTab('search');
              setFilterUrgent(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
          >
            <AlertCircle size={18} />
            <span className="font-medium">Emergency Order</span>
          </button>
        </div>
      </div>
    </div>
  );

  // --- COMPONENT: CART MODAL ---
  const CartModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Shopping Cart ({cart.length} items)</h2>
          <button onClick={() => setShowCartModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-slate-300 mb-4" size={64} />
              <p className="text-slate-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800">{item.name}</h3>
                    <p className="text-slate-500">{item.brand} • {item.supplier}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-slate-400 line-through">₹{item.marketPrice}</span>
                      <span className="font-bold text-slate-800">₹{item.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">₹{item.price * item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Market Price:</span>
                <span>₹{cartMarketTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>You Pay:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-green-600">
                <span>You Save:</span>
                <span>₹{cartSavings.toFixed(2)} ({((cartSavings/cartMarketTotal)*100).toFixed(0)}%)</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-slate-800">
                <span>Total:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={placeOrder}
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // --- COMPONENT: PRODUCT MODAL ---
  const ProductModal = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
            <h2 className="font-bold text-slate-800">Product Details</h2>
            <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="bg-slate-100 rounded-xl p-12 mb-4 flex items-center justify-center">
                  <Package size={80} className="text-slate-400" />
                </div>
                {selectedProduct.urgent && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-700 font-medium">Critical Stock Item</span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="font-bold text-slate-800 mb-2">{selectedProduct.name}</h1>
                <p className="text-slate-600 mb-4">{selectedProduct.brand}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500 fill-yellow-500" size={18} />
                    <span className="font-medium">{selectedProduct.rating}</span>
                    <span className="text-slate-500">(234 reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={18} className="text-teal-600" />
                    <span>{selectedProduct.dist} away from your location</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Building size={18} className="text-slate-400" />
                    <span>{selectedProduct.supplier}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package size={18} className={selectedProduct.stock < 10 ? 'text-red-600' : 'text-green-600'} />
                    <span className={`font-medium ${selectedProduct.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedProduct.stock} units available
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500">Market Price</span>
                    <span className="text-slate-400 line-through">₹{selectedProduct.marketPrice}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500">Direct Price</span>
                    <span className="font-bold text-slate-800">₹{selectedProduct.price}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="font-medium text-green-600">Your Savings</span>
                    <span className="font-bold text-green-600">
                      ₹{selectedProduct.marketPrice - selectedProduct.price} 
                      ({Math.round(((selectedProduct.marketPrice - selectedProduct.price) / selectedProduct.marketPrice) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setShowProductModal(false);
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setShowProductModal(false);
                      setShowCartModal(true);
                    }}
                    className="flex-1 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Quick Order
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Product Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 mb-1">Category</p>
                  <p className="font-medium text-slate-800">{selectedProduct.category}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 mb-1">Brand</p>
                  <p className="font-medium text-slate-800">{selectedProduct.brand}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 mb-1">Supplier</p>
                  <p className="font-medium text-slate-800">{selectedProduct.supplier}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 mb-1">Delivery Time</p>
                  <p className="font-medium text-slate-800">2-4 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENT: ORDER MODAL ---
  const OrderModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
            <h2 className="font-bold text-slate-800">Order Details</h2>
            <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">{selectedOrder.id}</h3>
                <span className={`px-3 py-1 rounded-full font-medium ${
                  selectedOrder.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                  selectedOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                  selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 mb-1">Total Items</p>
                  <p className="font-medium text-slate-800">{selectedOrder.items} units</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Total Amount</p>
                  <p className="font-medium text-slate-800">₹{selectedOrder.total}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Order Date</p>
                  <p className="font-medium text-slate-800">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Expected Time</p>
                  <p className="font-medium text-slate-800">{selectedOrder.time}</p>
                </div>
              </div>
            </div>

            {selectedOrder.driver !== 'Pending' && selectedOrder.driver !== 'N/A' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-slate-800 mb-4">Driver Information</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="text-teal-700" size={32} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{selectedOrder.driver}</p>
                    <p className="text-slate-500">{selectedOrder.vehicle}</p>
                    <p className="text-slate-500">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Phone size={18} />
                    Call Driver
                  </button>
                  <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Message
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-800 mb-4">Order Timeline</h3>
              <div className="relative space-y-4">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                
                {selectedOrder.status === 'Delivered' && (
                  <>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-green-600 border-2 border-white"></div>
                      <div>
                        <h4 className="font-medium text-slate-800">Delivered</h4>
                        <p className="text-slate-500">Order completed successfully</p>
                      </div>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                      <div>
                        <h4 className="font-medium text-slate-800">Out for Delivery</h4>
                        <p className="text-slate-500">In transit</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedOrder.status === 'Out for Delivery' && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white ring-2 ring-teal-100"></div>
                    <div>
                      <h4 className="font-medium text-slate-800">Out for Delivery</h4>
                      <p className="text-slate-500">Currently in transit</p>
                    </div>
                  </div>
                )}

                {(selectedOrder.status === 'Out for Delivery' || selectedOrder.status === 'Delivered') && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                    <div>
                      <h4 className="font-medium text-slate-800">Dispatched</h4>
                      <p className="text-slate-500">From warehouse</p>
                    </div>
                  </div>
                )}

                {selectedOrder.status === 'Processing' && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-yellow-600 border-2 border-white ring-2 ring-yellow-100"></div>
                    <div>
                      <h4 className="font-medium text-slate-800">Processing</h4>
                      <p className="text-slate-500">Preparing order</p>
                    </div>
                  </div>
                )}

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                  <div>
                    <h4 className="font-medium text-slate-800">Order Confirmed</h4>
                    <p className="text-slate-500">Payment verified</p>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                  <div>
                    <h4 className="font-medium text-slate-800">Order Placed</h4>
                    <p className="text-slate-500">{selectedOrder.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SCREEN: DASHBOARD ---
  const DashboardScreen = () => {
    const recentActivity = [
      { id: 1, action: 'Order Placed', description: 'Emergency medicines ordered', time: '5 mins ago', icon: ShoppingCart, color: 'text-green-600' },
      { id: 2, action: 'Low Stock Alert', description: 'Remdesivir below threshold', time: '1 hour ago', icon: AlertCircle, color: 'text-red-600' },
      { id: 3, action: 'Delivery Complete', description: `Order ${orders[0]?.id} delivered successfully`, time: '3 hours ago', icon: CheckCircle, color: 'text-blue-600' },
      { id: 4, action: 'New Supplier', description: 'Healthcare Solutions verified', time: '5 hours ago', icon: Users, color: 'text-purple-600' },
    ];

    const lowStockItems = emergencyStock.filter(item => item.stock < 20);

    return (
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-green-600 font-medium flex items-center gap-1">
                <TrendingUp size={16} /> 18%
              </span>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Total Savings</h3>
            <p className="font-bold text-slate-800">₹{totalSavings.toLocaleString()}</p>
            <p className="text-slate-400 mt-1">vs Market Price</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
              <span className="text-blue-600 font-medium flex items-center gap-1">
                <Activity size={16} /> Active
              </span>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Active Orders</h3>
            <p className="font-bold text-slate-800">{activeOrdersCount}</p>
            <p className="text-slate-400 mt-1">In transit & processing</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-purple-600 font-medium flex items-center gap-1">
                <CheckCircle size={16} /> Verified
              </span>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Suppliers</h3>
            <p className="font-bold text-slate-800">{suppliers.length}</p>
            <p className="text-slate-400 mt-1">Connected partners</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <span className="text-red-600 font-medium flex items-center gap-1">
                <Clock size={16} /> Urgent
              </span>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Low Stock Alerts</h3>
            <p className="font-bold text-slate-800">{lowStockItems.length}</p>
            <p className="text-slate-400 mt-1">Require attention</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Browse Categories</h3>
                <button 
                  onClick={() => setActiveTab('search')}
                  className="text-teal-600 font-medium hover:text-teal-700"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {initialCategories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => {
                      setActiveTab('search');
                      setFilterCategory(cat.name);
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all group"
                  >
                    <div className={`${cat.color} w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">{cat.icon}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-800">{cat.name}</p>
                      <p className={`${cat.textColor} font-medium`}>{cat.count} items</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Recent Orders</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-teal-600 font-medium hover:text-teal-700"
                >
                  View All Orders
                </button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        order.status === 'Out for Delivery' ? 'bg-blue-50' :
                        order.status === 'Processing' ? 'bg-yellow-50' :
                        order.status === 'Delivered' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {order.status === 'Out for Delivery' && <Truck className="text-blue-600" size={24} />}
                        {order.status === 'Processing' && <Clock className="text-yellow-600" size={24} />}
                        {order.status === 'Delivered' && <CheckCircle className="text-green-600" size={24} />}
                        {order.status === 'Cancelled' && <XCircle className="text-red-600" size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-slate-800">{order.id}</h4>
                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                            order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-slate-500">{order.items} items • {order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">₹{order.total}</p>
                      <p className="text-slate-500">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Location Card */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Current Location</h3>
                <MapPin size={20} />
              </div>
              <p className="font-medium mb-1">{userProfile.name}</p>
              <p className="text-teal-100 mb-4">{userProfile.location}</p>
              <button className="w-full bg-white text-teal-700 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors">
                Change Location
              </button>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Low Stock Alerts</h3>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">{lowStockItems.length}</span>
              </div>
              <div className="space-y-3">
                {lowStockItems.slice(0, 4).map(item => (
                  <div key={item.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <span className="text-red-600 font-bold">{item.stock}</span>
                    </div>
                    <p className="text-slate-500">{item.supplier}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <activity.icon className={activity.color} size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{activity.action}</p>
                      <p className="text-slate-500">{activity.description}</p>
                      <p className="text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SCREEN: STOCK SEARCH ---
  const SearchScreen = () => (
    <div className="p-8">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for medicines, equipment, or supplies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 py-3 pl-12 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setSearchQuery('')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              filterCategory === 'all' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Stock
          </button>
          <button 
            onClick={() => setFilterUrgent(!filterUrgent)}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              filterUrgent ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Critical Only
          </button>
          {initialCategories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFilterCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
                filterCategory === cat.name ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">Available Stock - {filteredStock.length} Results</h3>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="distance">Distance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Stock Availability</option>
          </select>
        </div>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStock.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            {item.urgent && (
              <div className="bg-red-500 text-white px-4 py-1.5 font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>CRITICAL STOCK</span>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">{item.name}</h3>
                  <p className="text-slate-500 mb-2">{item.brand}</p>
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-teal-600" />
                      <span>{item.dist} away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mt-1">{item.supplier}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-lg ${
                    item.stock < 10 ? 'bg-red-100 text-red-700' :
                    item.stock < 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    <span className="font-bold">{item.stock}</span>
                    <span className="ml-1">units</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-400 line-through">₹{item.marketPrice}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                        Save {Math.round(((item.marketPrice - item.price) / item.marketPrice) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">₹{item.price}</span>
                      <span className="text-green-600">Direct Price</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedProduct(item);
                        setShowProductModal(true);
                      }}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => addToCart(item)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <ShoppingCart size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        addToCart(item);
                        setShowCartModal(true);
                      }}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      Quick Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStock.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-slate-500">No products found matching your criteria</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setFilterUrgent(false);
            }}
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );

  // --- SCREEN: LOGISTICS ---
  const LogisticsScreen = () => {
    const activeOrder = orders.find(o => o.status === 'Out for Delivery') || orders[0];

    return (
      <div className="p-8">
        {/* Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">All Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                  className="p-4 rounded-lg border-2 border-slate-200 hover:border-teal-300 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{order.id}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      order.status === 'Out for Delivery' ? 'bg-blue-500' :
                      order.status === 'Processing' ? 'bg-yellow-500' :
                      order.status === 'Delivered' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                  </div>
                  <p className="text-slate-500 mb-1">{order.status}</p>
                  <p className="font-bold text-slate-800">₹{order.total}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[600px] relative">
              {/* Fake Map */}
              <div className="absolute inset-0 bg-slate-200">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 border-4 border-white rounded-full opacity-20"></div>
                <div className="absolute top-1/2 right-10 w-2 h-2 bg-slate-400 rounded-full"></div>
                <div className="absolute top-1/3 left-20 w-2 h-2 bg-slate-400 rounded-full"></div>
                
                {/* Route Line */}
                <svg className="absolute inset-0 w-full h-full">
                  <path d="M 100 100 Q 300 200 400 500" stroke="#0d9488" strokeWidth="4" fill="none" strokeDasharray="8 4" />
                </svg>

                {/* Driver Marker */}
                <div className="absolute top-1/3 left-1/3 bg-white p-2 rounded-full shadow-xl animate-bounce">
                  <div className="bg-teal-600 p-3 rounded-full text-white">
                    <Truck size={24} />
                  </div>
                </div>

                {/* Destination Marker */}
                <div className="absolute bottom-24 right-32 bg-white p-2 rounded-full shadow-xl">
                  <div className="bg-red-600 p-3 rounded-full text-white">
                    <MapPin size={24} />
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="bg-white p-3 rounded-lg shadow-md hover:bg-slate-50">
                  <Plus size={20} className="text-slate-700" />
                </button>
                <button className="bg-white p-3 rounded-lg shadow-md hover:bg-slate-50">
                  <RefreshCw size={20} className="text-slate-700" />
                </button>
              </div>

              {/* Live Status Card */}
              {activeOrder && (
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800">Arriving in 15 minutes</h3>
                      <p className="text-slate-500">{activeOrder.id} • 5.2 km away</p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      On Track
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-slate-500 mb-1">Driver</p>
                      <p className="font-medium text-slate-800">{activeOrder.driver}</p>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <p className="text-slate-500 mb-1">Vehicle</p>
                      <p className="font-medium text-slate-800">{activeOrder.vehicle || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 mb-1">ETA</p>
                      <p className="font-medium text-slate-800">11:00 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      <Phone size={18} />
                      <span className="font-medium">Call Driver</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      <MessageSquare size={18} />
                      <span className="font-medium">Message</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-6">
            {/* Order Details */}
            {activeOrder && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Order ID</span>
                    <span className="font-medium text-slate-800">{activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Items</span>
                    <span className="font-medium text-slate-800">{activeOrder.items} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Amount</span>
                    <span className="font-medium text-slate-800">₹{activeOrder.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Order Time</span>
                    <span className="font-medium text-slate-800">{activeOrder.date}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-6">Tracking Timeline</h3>
              <div className="relative space-y-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white ring-2 ring-teal-100"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">Out for Delivery</h4>
                      <p className="text-slate-500">Currently in transit</p>
                      <p className="text-slate-400 mt-1">10:45 AM</p>
                    </div>
                    <CheckCircle className="text-teal-600" size={20} />
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                  <div>
                    <h4 className="font-medium text-slate-800">Dispatched</h4>
                    <p className="text-slate-500">From MediConnect Hub</p>
                    <p className="text-slate-400 mt-1">09:30 AM</p>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                  <div>
                    <h4 className="font-medium text-slate-800">Order Confirmed</h4>
                    <p className="text-slate-500">Payment verified</p>
                    <p className="text-slate-400 mt-1">09:15 AM</p>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                  <div>
                    <h4 className="font-medium text-slate-800">Order Placed</h4>
                    <p className="text-slate-500">Emergency order created</p>
                    <p className="text-slate-400 mt-1">09:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-200">
              Report Issue with Delivery
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- SCREEN: SUPPLIERS ---
  const SuppliersScreen = () => (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <Building className="text-teal-700" size={32} />
              </div>
              {supplier.verified && (
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={14} />
                  <span className="font-medium">Verified</span>
                </div>
              )}
            </div>

            <h3 className="font-bold text-slate-800 mb-2">{supplier.name}</h3>
            <p className="text-slate-500 mb-4">{supplier.location} • {supplier.distance} away</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  <span className="font-medium text-slate-800">{supplier.rating}</span>
                </div>
                <span className="text-slate-500">{supplier.orders} orders</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={16} />
                <span>{supplier.contact}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                View Products
              </button>
              <button className="flex-1 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- SCREEN: ANALYTICS ---
  const AnalyticsScreen = () => (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Monthly Savings Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 80, 72, 88, 95, 78, 92, 85, 94, 88, 90, 76].map((height, idx) => (
              <div 
                key={idx} 
                className="flex-1 bg-teal-200 rounded-t hover:bg-teal-400 transition-colors cursor-pointer relative group" 
                style={{ height: `${height}%` }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {height}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-slate-500">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Category Distribution</h3>
          <div className="space-y-4">
            {initialCategories.slice(0, 4).map((cat) => (
              <div key={cat.id}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-slate-700">{cat.name}</span>
                  </div>
                  <span className="font-medium text-slate-800">{cat.count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(cat.count / 312) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Top Performing Suppliers</h3>
          <div className="space-y-3">
            {suppliers.map((supplier, idx) => (
              <div key={supplier.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-teal-700">{idx + 1}</span>
                  </div>
                  <span className="font-medium text-slate-800">{supplier.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <span className="font-medium text-slate-700">{supplier.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Delivery Performance</h3>
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-green-600 mb-2">Average Delivery Time</p>
              <p className="font-bold text-slate-800">2.4 hours</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-600 mb-1">On-Time</p>
                <p className="font-bold text-slate-800">88%</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-purple-600 mb-1">Same Day</p>
                <p className="font-bold text-slate-800">76%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <FileText className="text-blue-600" size={32} />
          </div>
          <p className="text-slate-500 mb-1">Total Orders</p>
          <p className="font-bold text-slate-800">{orders.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <DollarSign className="text-green-600" size={32} />
          </div>
          <p className="text-slate-500 mb-1">Revenue</p>
          <p className="font-bold text-slate-800">₹{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <Package className="text-purple-600" size={32} />
          </div>
          <p className="text-slate-500 mb-1">Products</p>
          <p className="font-bold text-slate-800">{emergencyStock.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <Users className="text-orange-600" size={32} />
          </div>
          <p className="text-slate-500 mb-1">Suppliers</p>
          <p className="font-bold text-slate-800">{suppliers.length}</p>
        </div>
      </div>
    </div>
  );

  // --- COMPONENT: TOGGLE SWITCH ---
  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-slate-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-teal-600' : 'bg-slate-300'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'transform translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );

  // --- SCREEN: SETTINGS ---
  const SettingsScreen = () => {
    const updateSetting = (key, value) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    };

    const addPaymentCard = () => {
      const newCard = {
        id: settings.savedCards.length + 1,
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        type: 'Visa',
        expiry: '12/27',
        default: false
      };
      updateSetting('savedCards', [...settings.savedCards, newCard]);
    };

    const removePaymentCard = (id) => {
      updateSetting('savedCards', settings.savedCards.filter(card => card.id !== id));
    };

    const setDefaultCard = (id) => {
      updateSetting('savedCards', settings.savedCards.map(card => ({
        ...card,
        default: card.id === id
      })));
    };

    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="font-bold text-slate-800 mb-2">Settings</h2>
            <p className="text-slate-600">Manage your account preferences and settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
                <nav className="space-y-2">
                  <a href="#notifications" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-slate-600" />
                      <span className="font-medium text-slate-700">Notifications</span>
                    </div>
                  </a>
                  <a href="#privacy" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-slate-600" />
                      <span className="font-medium text-slate-700">Privacy & Security</span>
                    </div>
                  </a>
                  <a href="#general" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Settings size={20} className="text-slate-600" />
                      <span className="font-medium text-slate-700">General</span>
                    </div>
                  </a>
                  <a href="#orders" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Package size={20} className="text-slate-600" />
                      <span className="font-medium text-slate-700">Order Preferences</span>
                    </div>
                  </a>
                  <a href="#payment" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-slate-600" />
                      <span className="font-medium text-slate-700">Payment Methods</span>
                    </div>
                  </a>
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notification Settings */}
              <div id="notifications" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Bell className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Notification Settings</h3>
                    <p className="text-slate-500">Manage how you receive notifications</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ToggleSwitch
                    checked={settings.emailNotifications}
                    onChange={(val) => updateSetting('emailNotifications', val)}
                    label="Email Notifications"
                  />
                  <ToggleSwitch
                    checked={settings.pushNotifications}
                    onChange={(val) => updateSetting('pushNotifications', val)}
                    label="Push Notifications"
                  />
                  <ToggleSwitch
                    checked={settings.smsNotifications}
                    onChange={(val) => updateSetting('smsNotifications', val)}
                    label="SMS Notifications"
                  />
                  
                  <div className="pt-4 border-t border-slate-200">
                    <p className="font-medium text-slate-700 mb-3">Notification Types</p>
                    <div className="space-y-3">
                      <ToggleSwitch
                        checked={settings.orderUpdates}
                        onChange={(val) => updateSetting('orderUpdates', val)}
                        label="Order Updates"
                      />
                      <ToggleSwitch
                        checked={settings.lowStockAlerts}
                        onChange={(val) => updateSetting('lowStockAlerts', val)}
                        label="Low Stock Alerts"
                      />
                      <ToggleSwitch
                        checked={settings.priceAlerts}
                        onChange={(val) => updateSetting('priceAlerts', val)}
                        label="Price Drop Alerts"
                      />
                      <ToggleSwitch
                        checked={settings.promotionalEmails}
                        onChange={(val) => updateSetting('promotionalEmails', val)}
                        label="Promotional Emails"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div id="privacy" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ShieldCheck className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Privacy & Security</h3>
                    <p className="text-slate-500">Control your privacy and security settings</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ToggleSwitch
                    checked={settings.shareDataWithSuppliers}
                    onChange={(val) => updateSetting('shareDataWithSuppliers', val)}
                    label="Share data with suppliers"
                  />
                  <ToggleSwitch
                    checked={settings.showOnlineStatus}
                    onChange={(val) => updateSetting('showOnlineStatus', val)}
                    label="Show online status"
                  />
                  <ToggleSwitch
                    checked={settings.allowAnalytics}
                    onChange={(val) => updateSetting('allowAnalytics', val)}
                    label="Allow analytics tracking"
                  />

                  <div className="pt-4 border-t border-slate-200">
                    <p className="font-medium text-slate-700 mb-3">Security Options</p>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Key size={20} className="text-slate-600" />
                          <span className="text-slate-700">Change Password</span>
                        </div>
                        <ChevronRight size={20} className="text-slate-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Lock size={20} className="text-slate-600" />
                          <span className="text-slate-700">Two-Factor Authentication</span>
                        </div>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">Not Enabled</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* General Settings */}
              <div id="general" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Settings className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">General Settings</h3>
                    <p className="text-slate-500">Customize your experience</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-slate-700 mb-2 block">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 mb-2 block">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 mb-2 block">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => updateSetting('timezone', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 mb-2 block">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => updateSetting('theme', 'light')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === 'light'
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Sun className={settings.theme === 'light' ? 'text-teal-600' : 'text-slate-600'} size={24} />
                        <p className="mt-2 font-medium text-slate-700">Light</p>
                      </button>
                      <button
                        onClick={() => updateSetting('theme', 'dark')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === 'dark'
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Moon className={settings.theme === 'dark' ? 'text-teal-600' : 'text-slate-600'} size={24} />
                        <p className="mt-2 font-medium text-slate-700">Dark</p>
                      </button>
                      <button
                        onClick={() => updateSetting('theme', 'auto')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === 'auto'
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Settings className={settings.theme === 'auto' ? 'text-teal-600' : 'text-slate-600'} size={24} />
                        <p className="mt-2 font-medium text-slate-700">Auto</p>
                      </button>
                    </div>
                  </div>

                  <ToggleSwitch
                    checked={settings.soundEnabled}
                    onChange={(val) => updateSetting('soundEnabled', val)}
                    label="Sound Effects"
                  />
                </div>
              </div>

              {/* Order Preferences */}
              <div id="orders" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Package className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Order Preferences</h3>
                    <p className="text-slate-500">Manage your ordering preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ToggleSwitch
                    checked={settings.autoReorder}
                    onChange={(val) => updateSetting('autoReorder', val)}
                    label="Enable Auto-Reorder for low stock items"
                  />
                  <ToggleSwitch
                    checked={settings.requireOrderConfirmation}
                    onChange={(val) => updateSetting('requireOrderConfirmation', val)}
                    label="Require confirmation before placing orders"
                  />

                  <div className="pt-4 border-t border-slate-200">
                    <label className="text-slate-700 mb-2 block">Default Delivery Address</label>
                    <input
                      type="text"
                      value={settings.defaultDeliveryAddress}
                      onChange={(e) => updateSetting('defaultDeliveryAddress', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter delivery address"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div id="payment" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <CreditCard className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Payment Methods</h3>
                      <p className="text-slate-500">Manage your saved payment methods</p>
                    </div>
                  </div>
                  <button
                    onClick={addPaymentCard}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {settings.savedCards.map((card) => (
                    <div
                      key={card.id}
                      className={`p-4 rounded-lg border-2 ${
                        card.default ? 'border-teal-600 bg-teal-50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-100 p-3 rounded-lg">
                            <CreditCard className="text-slate-600" size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-800">{card.type} •••• {card.last4}</p>
                              {card.default && (
                                <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-medium">Default</span>
                              )}
                            </div>
                            <p className="text-slate-500">Expires {card.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!card.default && (
                            <button
                              onClick={() => setDefaultCard(card.id)}
                              className="px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => removePaymentCard(card.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <label className="text-slate-700 mb-2 block">Default Payment Method</label>
                  <select
                    value={settings.defaultPaymentMethod}
                    onChange={(e) => updateSetting('defaultPaymentMethod', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="wallet">Wallet</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-red-600" size={24} />
                  <h3 className="font-bold text-slate-800">Danger Zone</h3>
                </div>
                <p className="text-slate-600 mb-4">These actions are irreversible. Please be careful.</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200">
                    Clear All Data
                  </button>
                  <button className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200">
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SCREEN: PROFILE ---
  const ProfileScreen = () => (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              <Building className="text-teal-700" size={48} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-bold text-slate-800">{userProfile.name}</h2>
                {userProfile.verified && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={14} />
                    <span className="font-medium">Verified</span>
                  </span>
                )}
              </div>
              <p className="text-slate-600 mb-1">{userProfile.type}</p>
              <p className="text-slate-500">{userProfile.location}</p>
            </div>
            <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-slate-500 mb-1 block">Email Address</label>
                <div className="flex items-center gap-2 text-slate-800">
                  <Mail size={18} />
                  <span>{userProfile.email}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-500 mb-1 block">Phone Number</label>
                <div className="flex items-center gap-2 text-slate-800">
                  <Phone size={18} />
                  <span>{userProfile.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-500 mb-1 block">Location</label>
                <div className="flex items-center gap-2 text-slate-800">
                  <MapPin size={18} />
                  <span>{userProfile.location}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-500 mb-1 block">Account Type</label>
                <div className="flex items-center gap-2 text-slate-800">
                  <Building size={18} />
                  <span>{userProfile.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
            <p className="text-slate-500 mb-2">Total Orders</p>
            <p className="font-bold text-slate-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
            <p className="text-slate-500 mb-2">Total Savings</p>
            <p className="font-bold text-slate-800">₹{totalSavings.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
            <p className="text-slate-500 mb-2">Active Since</p>
            <p className="font-bold text-slate-800">Jan 2024</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <button 
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-slate-600" />
                <span className="font-medium text-slate-700">General Settings</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-slate-600" />
                <span className="font-medium text-slate-700">Notifications</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-slate-600" />
                <span className="font-medium text-slate-700">Privacy & Security</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-slate-600" />
                <span className="font-medium text-slate-700">Payment Methods</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <TopBar />
        
        <main>
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'search' && <SearchScreen />}
          {activeTab === 'orders' && <LogisticsScreen />}
          {activeTab === 'suppliers' && <SuppliersScreen />}
          {activeTab === 'analytics' && <AnalyticsScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </main>
      </div>

      {/* Modals */}
      {showCartModal && <CartModal />}
      {showProductModal && <ProductModal />}
      {showOrderModal && <OrderModal />}
    </div>
  );
}
