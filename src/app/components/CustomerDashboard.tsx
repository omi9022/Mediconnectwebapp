import React, { useState, useEffect } from 'react';
import {
  Home, Search, Truck, User, TrendingUp, Settings, LogOut,
  ShoppingCart, Package, Users, AlertCircle, MapPin, Clock,
  ChevronRight, DollarSign, Activity, CheckCircle, XCircle,
  RefreshCw, Bell, Calendar, FileText, Plus, Menu, X, Minus,
  Star, Filter, CreditCard, Shield, Globe, Lock, Phone, Mail,
  Building, Edit, Download, Upload, Info, ChevronDown, BarChart3,
  TrendingDown, Eye, EyeOff, Pill, Syringe, Award, Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from './shared';
import { getDistributorProducts, getCustomerOrders, saveCustomerOrders } from '../../utils/storage';

interface CustomerDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function CustomerDashboard({ user, onLogout }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order Dispatched', message: 'Your order is out for delivery.', time: 'Just now', read: false },
    { id: 2, title: 'Low Stock Alert', message: 'Remdesivir 100mg is running low.', time: '1h ago', read: false },
    { id: 3, title: 'Payment Confirmed', message: 'Payment for last order received.', time: '3h ago', read: true },
  ]);

  // Load stock items on mount and when switching tabs
  useEffect(() => {
    loadStockItems();
    
    // Refresh products every 2 seconds to keep in sync with distributor changes
    const interval = setInterval(loadStockItems, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadStockItems = () => {
    const baseItems: any[] = [];

    // Load products from distributors
    const sharedProducts = JSON.parse(localStorage.getItem('sharedProducts') || '[]');
    
    // Convert distributor products to customer format
    const distributorItems = sharedProducts
      .filter((p: any) => p.status !== 'out-of-stock')
      .map((p: any) => ({
        id: `dist-${p.id}`,
        name: p.name,
        brand: `${p.brand} • ${p.distributorName}`,
        category: p.category,
        stock: p.stock,
        critical: p.stock < 10,
        rating: 4.5 + Math.random() * 0.5,
        marketPrice: p.marketPrice,
        price: p.price,
        savings: Math.round(((p.marketPrice - p.price) / p.marketPrice) * 100),
        supplier: p.distributorName,
        location: '1.5 km',
        manufacturer: p.manufacturer,
        expiryDate: p.expiryDate,
        batchNumber: p.batchNumber
      }));

    // Merge base items with distributor items
    const allItems = [...baseItems, ...distributorItems];
    setStockItems(allItems);
  };

  // Stats data
  const stats = [
    { id: 1, label: 'Total Savings', value: '₹0', subtext: 'vs Market Price', icon: DollarSign, color: 'bg-blue-50', iconColor: 'text-[#1a2f5c]', trend: '0%', active: false },
    { id: 2, label: 'Active Orders', value: '0', subtext: 'Pending & processing', icon: ShoppingCart, color: 'bg-blue-50', iconColor: 'text-blue-600', trend: '0 Active', active: true },
    { id: 3, label: 'Suppliers', value: '0', subtext: 'Verified partners', icon: Users, color: 'bg-purple-50', iconColor: 'text-purple-600', trend: 'Verified', active: false },
    { id: 4, label: 'Low Stock Alerts', value: '0', subtext: 'Needs attention', icon: AlertCircle, color: 'bg-red-50', iconColor: 'text-red-600', trend: '0 Alerts', active: false }
  ];

  // Categories data
  const categories = [
    { id: 'all', name: 'All Stock', items: 0, icon: '📦', color: 'bg-slate-50', borderColor: 'border-slate-200', textColor: 'text-slate-700' },
    { id: 'critical', name: 'Critical Only', items: 0, icon: '⚠️', color: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' },
    { id: 'emergency', name: 'Emergency', items: 0, icon: '🚨', color: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' },
    { id: 'surgical', name: 'Surgical', items: 0, icon: '✂️', color: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
    { id: 'pharma', name: 'Pharma', items: 0, icon: '💊', color: 'bg-[#eef1f8]', borderColor: 'border-[#c5d0e8]', textColor: 'text-[#243f7a]' },
    { id: 'diagnostics', name: 'Diagnostics', items: 0, icon: '🔬', color: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' },
    { id: 'consumables', name: 'Consumables', items: 0, icon: '🧪', color: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-700' },
    { id: 'equipment', name: 'Equipment', items: 0, icon: '🩺', color: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' }
  ];

  // Stock items are now loaded dynamically via loadStockItems()

  // Orders data
  const orders: any[] = [];

  // Low stock alerts
  const lowStockAlerts: any[] = [];

  // Recent activity
  const recentActivity: any[] = [];

  // Analytics data
  const monthlySavings = [
    { month: 'Jan', amount: 0 }, { month: 'Feb', amount: 0 }, { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 }, { month: 'May', amount: 0 }, { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 0 }, { month: 'Aug', amount: 0 }, { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 }, { month: 'Nov', amount: 0 }, { month: 'Dec', amount: 0 }
  ];

  const topSuppliers: any[] = [];

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'stock', label: 'Stock Search', icon: Search },
    { id: 'logistics', label: 'Logistics', icon: Truck, badge: 2 },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Settings options
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    orderUpdates: true,
    lowStockAlerts: true,
    newOffers: true,
    promotionalEmails: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    showStatus: true,
    analytics: true
  });

  // Add to cart function
  const addToCart = (item: any) => {
    const existingItem = cartItems.find(ci => ci.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(ci => 
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      ));
      toast.success(`Updated ${item.name} quantity in cart`);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      toast.success(`${item.name} added to cart`);
    }
    setShowCart(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const marketTotal = cartItems.reduce((sum, item) => sum + (item.marketPrice * item.quantity), 0);
  const tax = cartSubtotal * 0.18;
  const youSave = marketTotal - cartSubtotal;
  const cartTotal = cartSubtotal + tax;

  const filteredStock = stockItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
                          (selectedCategory === 'critical' && item.critical) || 
                          item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const maxSavings = Math.max(...monthlySavings.map(m => m.amount));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1a2f5c] to-[#243f7a] rounded-xl flex items-center justify-center">
              <Package className="text-white" size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-slate-800">MediConnect</h1>
                <p className="text-xs text-slate-500">Healthcare Platform</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-[#eef1f8] text-[#243f7a]' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-[#1a2f5c] text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#1a2f5c] to-[#243f7a] rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
                <button onClick={onLogout} className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl text-slate-800">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'stock' && 'Real-Time Stock Search'}
                {activeTab === 'logistics' && 'Logistics & Delivery'}
                {activeTab === 'suppliers' && 'Suppliers'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'settings' && 'Settings & Preferences'}
                {activeTab === 'profile' && 'My Profile'}
              </h1>
              <p className="text-slate-500">MediConnect Supply • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifPanel(p => !p);
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg relative"
                >
                  <Bell size={20} className="text-slate-600" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotifPanel && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
                    <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <span className="font-semibold text-slate-800">Notifications</span>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-xs text-[#1a2f5c] hover:underline font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No notifications</p>
                      ) : notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-[#eef1f8]' : ''}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  </>
                )}
              </div>
              <button onClick={() => setShowCart(true)} className="p-2 hover:bg-slate-100 rounded-lg relative">
                <ShoppingCart size={20} className="text-slate-600" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1a2f5c] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
                Emergency Order
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="flex gap-6 p-8">
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.id} className={`${stat.color} border ${stat.active ? 'border-blue-400' : 'border-transparent'} rounded-xl p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center ${stat.iconColor}`}>
                          <stat.icon size={24} />
                        </div>
                        {stat.active && <span className="text-xs text-blue-600 font-medium">{stat.trend}</span>}
                      </div>
                      <h3 className="font-bold text-2xl text-slate-800 mb-1">{stat.value}</h3>
                      <p className="text-slate-600 text-sm font-medium mb-1">{stat.label}</p>
                      <p className="text-slate-500 text-xs">{stat.subtext}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl text-slate-800">Browse Categories</h2>
                    <button className="text-[#1a2f5c] font-medium hover:text-[#243f7a]">View All</button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {categories.slice(2).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => { setSelectedCategory(category.id); setActiveTab('stock'); }}
                        className={`${category.color} border ${category.borderColor} rounded-xl p-4 text-left hover:shadow-md transition-shadow overflow-hidden`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl flex-shrink-0">{category.icon}</div>
                          <div className="min-w-0 flex-1">
                            <h3 className={`font-bold ${category.textColor} mb-1 truncate`}>{category.name}</h3>
                            <p className="text-slate-600 text-sm">{category.items} Items</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl text-slate-800">Recent Orders</h2>
                    <button onClick={() => setActiveTab('logistics')} className="text-[#1a2f5c] font-medium hover:text-[#243f7a]">View All Orders</button>
                  </div>
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className={`w-12 h-12 ${order.bgColor} rounded-lg flex items-center justify-center ${order.statusColor}`}>
                          <order.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-800">{order.id}</h3>
                            <span className={`px-3 py-1 ${order.bgColor} ${order.statusColor} rounded-full text-xs font-medium`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800 mb-1">₹{order.amount}</p>
                          <p className="text-slate-500 text-xs">{order.items} Items</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-80 space-y-6">
                <div className="bg-gradient-to-br from-[#1a2f5c] to-[#243f7a] rounded-xl p-6 text-white">
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Settings size={16} />
                  </button>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1">Current Location</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} />
                      <span className="text-sm opacity-90">City Hospital</span>
                    </div>
                    <p className="text-sm opacity-90 mb-1">246 Manek Chowk, Vadodara</p>
                    <input 
                      type="text" 
                      placeholder="Enter location"
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 text-sm mt-2"
                    />
                  </div>
                  <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                    Change Location
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Low Stock Alerts</h3>
                    <button className="w-6 h-6 bg-red-50 rounded flex items-center justify-center text-red-600">
                      <AlertCircle size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {lowStockAlerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${
                        alert.urgency === 'critical' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-800 text-sm">{alert.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            alert.urgency === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {alert.stock}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs">{alert.supplier}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                          <activity.icon size={14} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm">{activity.title}</h4>
                          <p className="text-slate-600 text-xs">{activity.description}</p>
                          <p className="text-slate-400 text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STOCK SEARCH TAB */}
          {activeTab === 'stock' && (
            <div className="p-8">
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search for medicines, equipment or supplies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5c] focus:border-[#1a2f5c] outline-none"
                    />
                  </div>
                  <button className="px-6 py-3 bg-[#1a2f5c] text-white rounded-lg font-medium hover:bg-[#243f7a] transition-colors">
                    Search
                  </button>
                  <button 
                    onClick={() => {
                      loadStockItems();
                      toast.success('Product list refreshed!');
                    }}
                    className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                    title="Refresh products from distributors"
                  >
                    <RefreshCw size={18} />
                    Refresh
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-[#1a2f5c] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-xl text-slate-800">
                    Available Stock - {filteredStock.length} Results
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Sort by:</span>
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option>Distance</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredStock.map((item) => (
                    <div key={item.id} className={`p-4 border rounded-lg ${item.critical ? 'bg-red-50 border-red-200' : 'border-slate-200'}`}>
                      {item.critical && (
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">
                            CRITICAL STOCK
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 mb-1">{item.name}</h3>
                          <p className="text-slate-600 text-sm mb-2">{item.brand}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-500 fill-yellow-500" size={14} />
                              <span className="font-medium">{item.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package size={14} />
                              <span>{item.stock} in stock</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{item.location}</span>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold text-[#1a2f5c]">₹{item.price}</span>
                            <span className="text-slate-400 line-through">₹{item.marketPrice}</span>
                            <span className="px-2 py-1 bg-[#dde4f0] text-[#243f7a] text-sm font-medium rounded">
                              Save {item.savings}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => addToCart(item)}
                            className="px-6 py-2 border-2 border-[#1a2f5c] text-[#1a2f5c] rounded-lg font-medium hover:bg-[#eef1f8] transition-colors"
                          >
                            Add to Cart
                          </button>
                          <button className="px-6 py-2 bg-[#1a2f5c] text-white rounded-lg font-medium hover:bg-[#243f7a] transition-colors">
                            Place Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LOGISTICS TAB */}
          {activeTab === 'logistics' && (
            <div className="p-8">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">In Transit</p>
                      <p className="font-bold text-2xl text-slate-800">2</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
                      <RefreshCw size={24} />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Processing</p>
                      <p className="font-bold text-2xl text-slate-800">1</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#eef1f8] rounded-lg flex items-center justify-center text-[#1a2f5c]">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Delivered</p>
                      <p className="font-bold text-2xl text-slate-800">48</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-bold text-xl text-slate-800 mb-6">Active Deliveries</h2>
                <div className="space-y-4">
                  {orders.filter(o => o.status !== 'Delivered').map((order) => (
                    <div key={order.id} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">{order.id}</h3>
                          <p className="text-slate-600">{order.date}</p>
                        </div>
                        <span className={`px-4 py-2 ${order.bgColor} ${order.statusColor} rounded-full font-medium`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mb-4 py-4 border-y border-slate-200">
                        <div>
                          <p className="text-slate-600 text-sm">Driver</p>
                          <p className="font-semibold text-slate-800">{order.driver}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 text-sm">Vehicle</p>
                          <p className="font-semibold text-slate-800">{order.vehicle}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 text-sm">ETA</p>
                          <p className="font-semibold text-slate-800">{order.eta}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 text-sm">Amount</p>
                          <p className="font-semibold text-slate-800">₹{order.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={16} />
                        <span className="text-sm">{order.location}</span>
                      </div>
                      {order.status === 'Out for Delivery' && (
                        <div className="mt-4">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-[#1a2f5c] h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <p className="text-xs text-slate-600 mt-2">75% Complete - Arriving in {order.eta}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">Monthly Savings Trend</h3>
                  <div className="flex items-end justify-between h-64 gap-2">
                    {monthlySavings.map((item) => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[#c5d0e8] rounded-t-lg relative" style={{ height: `${(item.amount / maxSavings) * 100}%` }}>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-600 whitespace-nowrap">
                            ₹{(item.amount / 1000).toFixed(1)}k
                          </div>
                        </div>
                        <span className="text-xs text-slate-600">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">Category Distribution</h3>
                  <div className="space-y-3">
                    {categories.slice(2).map((cat) => (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-700">{cat.icon} {cat.name}</span>
                          <span className="font-semibold text-slate-800">{cat.items}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`${cat.color} h-2 rounded-full`}
                            style={{ width: `${(cat.items / 864) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">Top Performing Suppliers</h3>
                  <div className="space-y-4">
                    {topSuppliers.map((supplier, idx) => (
                      <div key={supplier.id} className="flex items-center gap-4">
                        <span className="text-lg font-bold text-slate-400">{idx + 1}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{supplier.name}</h4>
                          <p className="text-sm text-slate-600">{supplier.orders} orders</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500 fill-yellow-500" size={16} />
                          <span className="font-semibold text-slate-800">{supplier.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">Delivery Performance</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-700">On-Time Delivery</span>
                        <span className="font-semibold text-[#1a2f5c]">98%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-[#eef1f8]0 h-3 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-700">Same Day</span>
                        <span className="font-semibold text-blue-600">75%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
                    <FileText size={24} />
                  </div>
                  <p className="text-slate-600 text-sm mb-1">Total Orders</p>
                  <p className="font-bold text-2xl text-slate-800">156</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="w-12 h-12 bg-[#eef1f8] rounded-lg flex items-center justify-center mx-auto mb-3 text-[#1a2f5c]">
                    <DollarSign size={24} />
                  </div>
                  <p className="text-slate-600 text-sm mb-1">Total Spent</p>
                  <p className="font-bold text-2xl text-slate-800">₹2.4L</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3 text-purple-600">
                    <Award size={24} />
                  </div>
                  <p className="text-slate-600 text-sm mb-1">Avg Rating</p>
                  <p className="font-bold text-2xl text-slate-800">4.7</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3 text-orange-600">
                    <Package size={24} />
                  </div>
                  <p className="text-slate-600 text-sm mb-1">Categories</p>
                  <p className="font-bold text-2xl text-slate-800">6</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="p-8">
              <div className="flex gap-6">
                <div className="w-80 bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Settings</h3>
                  <p className="text-sm text-slate-600 mb-6">Manage your account preferences and settings</p>
                  <div className="space-y-2">
                    {[
                      { id: 'notifications', label: 'Notifications', icon: Bell },
                      { id: 'privacy', label: 'Privacy & Security', icon: Shield },
                      { id: 'general', label: 'General', icon: Settings },
                      { id: 'orders', label: 'Order Preferences', icon: Package },
                      { id: 'payment', label: 'Payment Methods', icon: CreditCard }
                    ].map((item) => (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-slate-50 transition-colors"
                      >
                        <item.icon size={18} className="text-slate-600" />
                        <span className="text-slate-700">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Bell size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">Notification Settings</h3>
                        <p className="text-sm text-slate-600">Manage how you receive notifications</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Email Notifications' },
                        { key: 'push', label: 'Push Notifications' },
                        { key: 'sms', label: 'SMS Notifications' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100">
                          <span className="text-slate-700">{item.label}</span>
                          <button
                            onClick={() => setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                            })}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-[#1a2f5c]' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                      <h4 className="font-semibold text-slate-800 mt-6 mb-3">Notification Types</h4>
                      {[
                        { key: 'orderUpdates', label: 'Order Updates' },
                        { key: 'lowStockAlerts', label: 'Low Stock Alerts' },
                        { key: 'newOffers', label: 'New Offers' },
                        { key: 'promotionalEmails', label: 'Promotional Emails' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100">
                          <span className="text-slate-700">{item.label}</span>
                          <button
                            onClick={() => setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                            })}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-[#1a2f5c]' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-[#eef1f8] rounded-lg flex items-center justify-center text-[#1a2f5c]">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">Privacy & Security</h3>
                        <p className="text-sm text-slate-600">Control your privacy and security settings</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { key: 'shareData', label: 'Share data with suppliers' },
                        { key: 'showStatus', label: 'Show online status' },
                        { key: 'analytics', label: 'Allow analytics tracking' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100">
                          <span className="text-slate-700">{item.label}</span>
                          <button
                            onClick={() => setPrivacySettings({
                              ...privacySettings,
                              [item.key]: !privacySettings[item.key as keyof typeof privacySettings]
                            })}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              privacySettings[item.key as keyof typeof privacySettings] ? 'bg-[#1a2f5c]' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              privacySettings[item.key as keyof typeof privacySettings] ? 'translate-x-6' : 'translate-x-0.5'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                      <div className="mt-6 space-y-3">
                        <button className="w-full py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <Lock size={18} />
                          <span>Change Password</span>
                        </button>
                        <button className="w-full py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2">
                          <Shield size={18} />
                          <span>Two-Factor Authentication</span>
                          <span className="ml-auto px-2 py-1 bg-yellow-600 text-white text-xs rounded">Not Enabled</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                        <Globe size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">General Settings</h3>
                        <p className="text-sm text-slate-600">Customize your experience</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                          <option>English</option>
                          <option>Hindi</option>
                          <option>Gujarati</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                          <option>INR (₹)</option>
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                          <option>Asia/Kolkata (IST)</option>
                          <option>America/New_York (EST)</option>
                          <option>Europe/London (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#1a2f5c] to-[#243f7a] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-2xl text-slate-800 mb-2">{user.name}</h2>
                      <p className="text-slate-600 mb-4">{user.email}</p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[#1a2f5c] text-white rounded-lg hover:bg-[#243f7a] transition-colors">
                          Edit Profile
                        </button>
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                          Change Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input type="text" defaultValue={user.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input type="tel" defaultValue={user.phone} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                      <input type="text" defaultValue={user.location} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <textarea rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="Enter your full address"></textarea>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Account Statistics</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">156</p>
                        <p className="text-sm text-slate-600">Total Orders</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">₹2.4L</p>
                        <p className="text-sm text-slate-600">Total Spent</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">₹91K</p>
                        <p className="text-sm text-slate-600">Total Saved</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">4.7</p>
                        <p className="text-sm text-slate-600">Avg Rating</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button className="px-6 py-2 bg-[#1a2f5c] text-white rounded-lg hover:bg-[#243f7a] transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUPPLIERS TAB */}
          {activeTab === 'suppliers' && (
            <div className="p-8">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-bold text-xl text-slate-800 mb-6">Verified Suppliers</h2>
                <div className="grid grid-cols-2 gap-6">
                  {topSuppliers.map((supplier) => (
                    <div key={supplier.id} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-800 mb-1">{supplier.name}</h3>
                          <p className="text-slate-600 text-sm">{supplier.orders} orders completed</p>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                          <Star className="text-yellow-500 fill-yellow-500" size={16} />
                          <span className="font-semibold text-slate-800">{supplier.rating}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 border border-[#1a2f5c] text-[#1a2f5c] rounded-lg hover:bg-[#eef1f8] transition-colors">
                          View Products
                        </button>
                        <button className="flex-1 py-2 bg-[#1a2f5c] text-white rounded-lg hover:bg-[#243f7a] transition-colors">
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-2xl text-slate-800">Shopping Cart ({cartItems.length} Items)</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{item.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.brand}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-[#1a2f5c]">₹{item.price}</span>
                          <span className="text-sm text-slate-400 line-through">₹{item.marketPrice}</span>
                        </div>
                        <p className="text-xs text-[#1a2f5c] mt-1">Savings: ₹{(item.marketPrice - item.price) * item.quantity}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                          <X size={18} />
                        </button>
                        <div className="flex items-center gap-2 border border-slate-300 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-slate-100">
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-slate-100">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Market Total:</span>
                    <span>₹{marketTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#1a2f5c] font-semibold">
                    <span>You Save:</span>
                    <span>₹{youSave.toFixed(2)} ({((youSave/marketTotal)*100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t-2 border-slate-300">
                    <span>Total:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowCart(false); setShowPaymentModal(true); }}
                  className="w-full py-3 bg-[#1a2f5c] text-white rounded-lg hover:bg-[#243f7a] transition-colors font-medium"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-2xl text-slate-800">Payment Options</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4 mb-6">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Pay securely with your card' },
                  { id: 'upi', label: 'UPI', icon: Phone, desc: 'Pay via UPI apps like GPay, PhonePe' },
                  { id: 'netbanking', label: 'Net Banking', icon: Building, desc: 'Pay directly from your bank account' },
                  { id: 'wallet', label: 'Wallet', icon: DollarSign, desc: 'Paytm, Amazon Pay, PhonePe Wallet' },
                  { id: 'cod', label: 'Cash on Delivery', icon: Package, desc: 'Pay when you receive your order' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-colors ${
                      selectedPayment === method.id ? 'border-[#1a2f5c] bg-[#eef1f8]' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedPayment === method.id ? 'bg-[#1a2f5c] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <method.icon size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-slate-800">{method.label}</h3>
                      <p className="text-sm text-slate-600">{method.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.id ? 'border-[#1a2f5c]' : 'border-slate-300'
                    }`}>
                      {selectedPayment === method.id && <div className="w-3 h-3 bg-[#1a2f5c] rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>

              {selectedPayment === 'card' && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                      <input type="text" placeholder="123" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                    <input type="text" placeholder="Name on card" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-between text-xl font-bold text-slate-800 mb-4">
                <span>Amount to Pay:</span>
                <span className="text-[#1a2f5c]">₹{cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => {
                  const orderId = 'ORD-C-' + Math.floor(Math.random() * 10000);
                  const newOrder = {
                    id: orderId,
                    customerName: user.name,
                    customerType: 'customer' as const,
                    customerEmail: user.email,
                    customerPhone: user.phone,
                    items: cartItems.length,
                    itemDetails: cartItems.map((item: any) => ({
                      name: item.name,
                      quantity: item.quantity,
                      price: item.price
                    })),
                    total: cartSubtotal + tax,
                    status: 'pending' as const,
                    date: new Date().toISOString().split('T')[0],
                    paymentStatus: 'paid' as const,
                    paymentMethod: selectedPayment,
                    shippingAddress: user.location || 'Vadodara, Gujarat'
                  };
                  
                  // Save order to shared localStorage for distributors to see
                  const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
                  localStorage.setItem('customerOrders', JSON.stringify([...existingOrders, newOrder]));
                  
                  toast.success(`Order placed successfully! Order ID: ${orderId}`);
                  setShowPaymentModal(false);
                  setCartItems([]);
                }}
                className="w-full py-3 bg-[#1a2f5c] text-white rounded-lg hover:bg-[#243f7a] transition-colors font-medium"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
