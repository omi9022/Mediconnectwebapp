import React, { useState, useEffect } from 'react';
import {
  Package, TrendingUp, DollarSign, ShoppingCart, Truck,
  Building, Users, Bell, Settings, LogOut, Home, Plus,
  Eye, Edit, Trash2, Search, Filter, Download, RefreshCw,
  Save, Check, AlertCircle, CheckCircle, Calendar,
  BarChart3, FileText, MapPin, Phone, Mail, Star,
  Activity, Circle, ArrowUp, ArrowDown, Clock, Box,
  Boxes, PackageCheck, PackageX, ShoppingBag, Database
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal, StatusBadge } from './shared';
import { getFormattedDate } from '../../utils/dateUtils';
import { getCustomerOrders, getDistributorProducts, saveDistributorProducts } from '../../utils/storage';

interface DistributorDashboardProps {
  userData: any;
  onLogout: () => void;
}

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  stock: number;
  price: number;
  marketPrice: number;
  description: string;
  manufacturer: string;
  expiryDate: string;
  batchNumber: string;
  status: 'available' | 'low-stock' | 'out-of-stock';
  distributorId: number;
  distributorName: string;
  createdDate: string;
}

interface Order {
  id: string;
  customerName: string;
  customerType: 'hospital' | 'customer';
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  paymentStatus: 'pending' | 'paid';
  shippingAddress: string;
}

export default function DistributorDashboard({ userData, onLogout }: DistributorDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({});

  // Stock Management state
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'set' | 'add' | 'remove'>('set');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('restock');
  const [adjustNote, setAdjustNote] = useState('');
  const [stockHistory, setStockHistory] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('stockHistory') || '[]'); } catch { return []; }
  });
  const [stockViewTab, setStockViewTab] = useState<'inventory' | 'history' | 'alerts'>('inventory');

  // Load products from shared localStorage
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load products and orders from shared storage on mount
  useEffect(() => {
    loadProducts();
    loadOrders();
    
    // Refresh orders every 3 seconds to get new customer orders
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = () => {
    const sharedProducts = JSON.parse(localStorage.getItem('sharedProducts') || '[]');
    // Filter products for this distributor
    if (userData && (userData.id || userData.name)) {
      const myProducts = sharedProducts.filter((p: Product) => p.distributorId === userData.id || p.distributorName === userData.name);
      setProducts(myProducts);
    } else {
      setProducts([]);
    }
  };

  const loadOrders = () => {
    // Load customer orders from shared storage
    const customerOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    
    // Merge with customer orders from shared storage
    setOrders([...customerOrders]);
  };

  const saveProductsToShared = (updatedProducts: Product[]) => {
    // Get all products from shared storage
    const allProducts = JSON.parse(localStorage.getItem('sharedProducts') || '[]');
    // Remove this distributor's products
    if (userData && (userData.id || userData.name)) {
      const otherProducts = allProducts.filter((p: Product) => p.distributorId !== userData.id && p.distributorName !== userData.name);
      // Add updated products
      const newAllProducts = [...otherProducts, ...updatedProducts];
      // Save to shared storage
      localStorage.setItem('sharedProducts', JSON.stringify(newAllProducts));
    }
    setProducts(updatedProducts);
  };

  const stats = {
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    lowStock: products.filter(p => p.stock < 50).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
  };

  const openAddProductModal = () => {
    setModalType('addProduct');
    setSelectedItem(null);
    setFormData({
      name: '',
      category: 'pharma',
      brand: '',
      stock: 0,
      price: 0,
      marketPrice: 0,
      description: '',
      manufacturer: '',
      expiryDate: '',
      batchNumber: ''
    });
    setShowModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setModalType('editProduct');
    setSelectedItem(product);
    setFormData(product);
    setShowModal(true);
  };

  const openViewProductModal = (product: Product) => {
    setModalType('viewProduct');
    setSelectedItem(product);
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.brand || formData.stock < 0 || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (modalType === 'editProduct' && selectedItem) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.id === selectedItem.id ? { ...p, ...formData } : p
      );
      saveProductsToShared(updatedProducts);
      toast.success('Product updated successfully!');
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now(),
        ...formData,
        distributorId: userData?.id || 0,
        distributorName: userData?.name || 'Unknown',
        status: formData.stock > 50 ? 'available' : formData.stock > 0 ? 'low-stock' : 'out-of-stock',
        createdDate: today
      };
      const updatedProducts = [...products, newProduct];
      saveProductsToShared(updatedProducts);
      toast.success('Product added successfully! Now visible to customers.');
    }

    closeModal();
  };

  const handleDeleteProduct = (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    const updatedProducts = products.filter(p => p.id !== product.id);
    saveProductsToShared(updatedProducts);
    toast.success('Product deleted successfully');
  };

  const handleUpdateStock = (productId: number, newStock: number) => {
    const updatedProducts = products.map(p =>
      p.id === productId
        ? {
            ...p,
            stock: newStock,
            status: newStock > 50 ? 'available' : newStock > 0 ? 'low-stock' : 'out-of-stock'
          }
        : p
    );
    saveProductsToShared(updatedProducts);
    toast.success('Stock updated successfully!');
  };

  const openAdjustModal = (product: Product) => {
    setAdjustProduct(product);
    setAdjustType('set');
    setAdjustQty('');
    setAdjustReason('restock');
    setAdjustNote('');
    setShowAdjustModal(true);
  };

  const handleStockAdjustment = () => {
    if (!adjustProduct || adjustQty === '') return;
    const qty = parseInt(adjustQty);
    if (isNaN(qty) || qty < 0) { toast.error('Enter a valid quantity'); return; }

    let newStock = adjustProduct.stock;
    if (adjustType === 'set') newStock = qty;
    else if (adjustType === 'add') newStock = adjustProduct.stock + qty;
    else if (adjustType === 'remove') newStock = Math.max(0, adjustProduct.stock - qty);

    handleUpdateStock(adjustProduct.id, newStock);

    const entry = {
      id: Date.now(),
      productId: adjustProduct.id,
      productName: adjustProduct.name,
      type: adjustType,
      qty,
      prevStock: adjustProduct.stock,
      newStock,
      reason: adjustReason,
      note: adjustNote,
      date: new Date().toISOString(),
      user: userData?.name || 'Distributor'
    };
    const updated = [entry, ...stockHistory].slice(0, 100);
    setStockHistory(updated);
    localStorage.setItem('stockHistory', JSON.stringify(updated));

    setShowAdjustModal(false);
    toast.success(`Stock updated: ${adjustProduct.name} → ${newStock} units`);
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    
    // Update in localStorage if it's a customer order
    const customerOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const updatedCustomerOrders = customerOrders.map((o: Order) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem('customerOrders', JSON.stringify(updatedCustomerOrders));
    
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
  };

  const exportProducts = () => {
    const headers = Object.keys(products[0] || {}).join(',');
    const rows = products.map(p => Object.values(p).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Products exported successfully!');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="font-bold">MediConnect</h1>
              <p className="text-purple-200 text-sm">Distributor</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'overview' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            <Home size={20} />
            <span>Overview</span>
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-purple-300 text-xs uppercase font-semibold">Inventory</p>
          </div>

          <button
            onClick={() => setActiveSection('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'products' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            <Package size={20} />
            <span>Products</span>
            <span className="ml-auto bg-green-500 px-2 py-1 rounded-full text-xs">{stats.totalProducts}</span>
          </button>

          <button
            onClick={() => setActiveSection('stock')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'stock' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            <Boxes size={20} />
            <span>Stock Management</span>
            {stats.lowStock > 0 && (
              <span className="ml-auto bg-red-500 px-2 py-1 rounded-full text-xs">{stats.lowStock}</span>
            )}
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-purple-300 text-xs uppercase font-semibold">Orders</p>
          </div>

          <button
            onClick={() => setActiveSection('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'orders' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
            {stats.pendingOrders > 0 && (
              <span className="ml-auto bg-orange-500 px-2 py-1 rounded-full text-xs">{stats.pendingOrders}</span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'analytics' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-purple-300 text-xs uppercase font-semibold">Settings</p>
          </div>

          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'profile' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            <Settings size={20} />
            <span>Profile</span>
          </button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="font-bold">{userData.name?.substring(0, 2).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{userData.name}</p>
              <p className="text-purple-300 text-xs">{userData.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-slate-800">
                {activeSection === 'overview' && 'Dashboard Overview'}
                {activeSection === 'products' && 'Product Management'}
                {activeSection === 'stock' && 'Stock Management'}
                {activeSection === 'orders' && 'Order Management'}
                {activeSection === 'analytics' && 'Analytics & Reports'}
                {activeSection === 'profile' && 'Distributor Profile'}
              </h2>
              <p className="text-slate-500">Welcome back, {userData?.name || 'User'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-purple-600" />
                    </div>
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                  <p className="text-slate-500 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalProducts}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Boxes size={24} className="text-green-600" />
                    </div>
                    <Activity className="text-blue-500" size={20} />
                  </div>
                  <p className="text-slate-500 mb-1">Total Stock</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalStock.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={24} className="text-orange-600" />
                    </div>
                    <AlertCircle className="text-orange-500" size={20} />
                  </div>
                  <p className="text-slate-500 mb-1">Pending Orders</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.pendingOrders}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <DollarSign size={24} className="text-teal-600" />
                    </div>
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                  <p className="text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">₹{stats.revenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={openAddProductModal}
                    className="flex items-center gap-3 p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Plus size={20} className="text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Add New Product</p>
                      <p className="text-sm text-slate-500">Add to inventory</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection('stock')}
                    className="flex items-center gap-3 p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <RefreshCw size={20} className="text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Update Stock</p>
                      <p className="text-sm text-slate-500">Manage inventory</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection('orders')}
                    className="flex items-center gap-3 p-4 border-2 border-dashed border-teal-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Truck size={20} className="text-teal-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Process Orders</p>
                      <p className="text-sm text-slate-500">{stats.pendingOrders} pending</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">Recent Orders</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-slate-800">{order.id}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">{order.customerName}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">{order.items} items</span>
                          <span className="font-semibold text-slate-800">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">Low Stock Alert</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {products.filter(p => p.stock < 50).slice(0, 5).map(product => (
                      <div key={product.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-slate-800">{product.name}</p>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Low Stock
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">{product.brand}</span>
                          <span className="font-semibold text-red-600">Stock: {product.stock}</span>
                        </div>
                      </div>
                    ))}
                    {products.filter(p => p.stock < 50).length === 0 && (
                      <div className="p-8 text-center text-slate-500">
                        <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                        <p>All products have sufficient stock!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products Section */}
          {activeSection === 'products' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={exportProducts}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50"
                  >
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={openAddProductModal}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus size={18} />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Package size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium mb-2">No products found</p>
                    <p className="text-sm mb-4">Add your first product to get started</p>
                    <button
                      onClick={openAddProductModal}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Plus size={18} />
                      <span>Add Product</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Product</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Category</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Stock</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(product => (
                          <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-slate-800">{product.name}</p>
                                <p className="text-sm text-slate-500">{product.brand}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 capitalize">{product.category}</td>
                            <td className="px-6 py-4">
                              <span className={`font-semibold ${
                                product.stock > 50 ? 'text-green-600' :
                                product.stock > 0 ? 'text-orange-600' :
                                'text-red-600'
                              }`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-slate-800">₹{product.price.toLocaleString()}</p>
                                {product.marketPrice > product.price && (
                                  <p className="text-sm text-slate-400 line-through">₹{product.marketPrice.toLocaleString()}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                product.status === 'available' ? 'bg-green-100 text-green-700' :
                                product.status === 'low-stock' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openViewProductModal(product)}
                                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-purple-600"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => openEditProductModal(product)}
                                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product)}
                                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Stock Management Section */}
          {activeSection === 'stock' && (() => {
            const totalUnits = products.reduce((s, p) => s + p.stock, 0);
            const inventoryValue = products.reduce((s, p) => s + p.stock * p.price, 0);
            const lowStockItems = products.filter(p => p.status === 'low-stock');
            const outOfStock = products.filter(p => p.status === 'out-of-stock');
            const today = new Date();
            const expiryAlerts = products.filter(p => {
              if (!p.expiryDate) return false;
              const exp = new Date(p.expiryDate);
              const days = Math.ceil((exp.getTime() - today.getTime()) / 86400000);
              return days <= 90 && days > 0;
            });

            const filteredStock = products.filter(p => {
              const matchSearch = p.name.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(stockSearchQuery.toLowerCase());
              const matchCat = stockCategoryFilter === 'all' || p.category === stockCategoryFilter;
              const matchStatus = stockStatusFilter === 'all' || p.status === stockStatusFilter;
              return matchSearch && matchCat && matchStatus;
            });

            return (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  {[
                    { label: 'Total SKUs', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Total Units', value: totalUnits.toLocaleString(), icon: Boxes, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Inventory Value', value: `₹${(inventoryValue/1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Low Stock', value: lowStockItems.length, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Out of Stock', value: outOfStock.length, icon: PackageX, color: 'text-red-600', bg: 'bg-red-50' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                      <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                        <s.icon size={18} className={s.color} />
                      </div>
                      <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Sub-tabs */}
                <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
                  {(['inventory', 'history', 'alerts'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setStockViewTab(tab)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        stockViewTab === tab ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab}
                      {tab === 'alerts' && (lowStockItems.length + outOfStock.length + expiryAlerts.length) > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {lowStockItems.length + outOfStock.length + expiryAlerts.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* INVENTORY TAB */}
                {stockViewTab === 'inventory' && (
                  <>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={stockSearchQuery}
                          onChange={e => setStockSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <select
                        value={stockCategoryFilter}
                        onChange={e => setStockCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                      >
                        <option value="all">All Categories</option>
                        <option value="pharma">Pharma</option>
                        <option value="surgical">Surgical</option>
                        <option value="emergency">Emergency</option>
                        <option value="consumables">Consumables</option>
                        <option value="equipment">Equipment</option>
                      </select>
                      <select
                        value={stockStatusFilter}
                        onChange={e => setStockStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                      >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                      </select>
                      <button
                        onClick={exportProducts}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-sm"
                      >
                        <Download size={16} />
                        Export
                      </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      {filteredStock.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                          <Boxes size={48} className="mx-auto mb-4 text-slate-300" />
                          <p className="font-medium">No products found</p>
                          <p className="text-sm mt-1">Try adjusting your filters or add products first</p>
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                              <th className="px-5 py-3 text-left font-semibold">Product</th>
                              <th className="px-5 py-3 text-left font-semibold">Category</th>
                              <th className="px-5 py-3 text-left font-semibold">Stock Level</th>
                              <th className="px-5 py-3 text-left font-semibold">Units</th>
                              <th className="px-5 py-3 text-left font-semibold">Value</th>
                              <th className="px-5 py-3 text-left font-semibold">Expiry</th>
                              <th className="px-5 py-3 text-left font-semibold">Status</th>
                              <th className="px-5 py-3 text-right font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredStock.map(product => {
                              const expDays = product.expiryDate
                                ? Math.ceil((new Date(product.expiryDate).getTime() - today.getTime()) / 86400000)
                                : null;
                              const barPct = Math.min(100, Math.round((product.stock / 200) * 100));
                              return (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-5 py-4">
                                    <p className="font-semibold text-slate-800">{product.name}</p>
                                    <p className="text-xs text-slate-400">{product.brand}</p>
                                  </td>
                                  <td className="px-5 py-4">
                                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded capitalize">{product.category}</span>
                                  </td>
                                  <td className="px-5 py-4 min-w-32">
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${
                                          product.status === 'available' ? 'bg-green-500' :
                                          product.status === 'low-stock' ? 'bg-orange-400' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${barPct}%` }}
                                      />
                                    </div>
                                  </td>
                                  <td className="px-5 py-4">
                                    <span className={`text-lg font-bold ${
                                      product.status === 'available' ? 'text-slate-800' :
                                      product.status === 'low-stock' ? 'text-orange-600' : 'text-red-600'
                                    }`}>{product.stock}</span>
                                  </td>
                                  <td className="px-5 py-4 text-slate-700 font-medium">
                                    ₹{(product.stock * product.price).toLocaleString()}
                                  </td>
                                  <td className="px-5 py-4 text-sm">
                                    {product.expiryDate ? (
                                      <span className={expDays !== null && expDays <= 30 ? 'text-red-600 font-semibold' : expDays !== null && expDays <= 90 ? 'text-orange-500' : 'text-slate-500'}>
                                        {product.expiryDate}
                                        {expDays !== null && expDays <= 90 && (
                                          <span className="block text-xs">{expDays}d left</span>
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-slate-300">—</span>
                                    )}
                                  </td>
                                  <td className="px-5 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                      product.status === 'available' ? 'bg-green-100 text-green-700' :
                                      product.status === 'low-stock' ? 'bg-orange-100 text-orange-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {product.status}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 text-right">
                                    <button
                                      onClick={() => openAdjustModal(product)}
                                      className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                      Adjust
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}

                {/* HISTORY TAB */}
                {stockViewTab === 'history' && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {stockHistory.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        <Clock size={40} className="mx-auto mb-3" />
                        <p className="font-medium">No adjustments yet</p>
                        <p className="text-sm mt-1">Stock changes will appear here</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                            <th className="px-5 py-3 text-left font-semibold">Date & Time</th>
                            <th className="px-5 py-3 text-left font-semibold">Product</th>
                            <th className="px-5 py-3 text-left font-semibold">Type</th>
                            <th className="px-5 py-3 text-left font-semibold">Change</th>
                            <th className="px-5 py-3 text-left font-semibold">Reason</th>
                            <th className="px-5 py-3 text-left font-semibold">Note</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {stockHistory.map((h: any) => (
                            <tr key={h.id} className="hover:bg-slate-50">
                              <td className="px-5 py-3 text-sm text-slate-500">
                                {new Date(h.date).toLocaleString()}
                              </td>
                              <td className="px-5 py-3 font-medium text-slate-800">{h.productName}</td>
                              <td className="px-5 py-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  h.type === 'add' ? 'bg-green-100 text-green-700' :
                                  h.type === 'remove' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {h.type}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <span className="text-slate-400">{h.prevStock}</span>
                                <span className="mx-2 text-slate-300">→</span>
                                <span className="font-bold text-slate-800">{h.newStock}</span>
                                <span className={`ml-2 text-xs font-medium ${h.newStock >= h.prevStock ? 'text-green-600' : 'text-red-600'}`}>
                                  {h.newStock >= h.prevStock ? '+' : ''}{h.newStock - h.prevStock}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-sm text-slate-600 capitalize">{h.reason}</td>
                              <td className="px-5 py-3 text-sm text-slate-500">{h.note || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* ALERTS TAB */}
                {stockViewTab === 'alerts' && (
                  <div className="space-y-4">
                    {lowStockItems.length > 0 && (
                      <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 bg-orange-50 border-b border-orange-200 flex items-center gap-2">
                          <AlertCircle size={18} className="text-orange-600" />
                          <span className="font-semibold text-orange-800">Low Stock ({lowStockItems.length})</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {lowStockItems.map(p => (
                            <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-slate-800">{p.name}</p>
                                <p className="text-xs text-slate-400">{p.brand} · {p.category}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-orange-600 font-bold">{p.stock} units</span>
                                <button onClick={() => openAdjustModal(p)} className="px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700">Restock</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {outOfStock.length > 0 && (
                      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 bg-red-50 border-b border-red-200 flex items-center gap-2">
                          <PackageX size={18} className="text-red-600" />
                          <span className="font-semibold text-red-800">Out of Stock ({outOfStock.length})</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {outOfStock.map(p => (
                            <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-slate-800">{p.name}</p>
                                <p className="text-xs text-slate-400">{p.brand} · {p.category}</p>
                              </div>
                              <button onClick={() => openAdjustModal(p)} className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Restock Now</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {expiryAlerts.length > 0 && (
                      <div className="bg-white rounded-xl border border-yellow-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 bg-yellow-50 border-b border-yellow-200 flex items-center gap-2">
                          <Calendar size={18} className="text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Expiring Soon ({expiryAlerts.length})</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {expiryAlerts.map(p => {
                            const days = Math.ceil((new Date(p.expiryDate).getTime() - today.getTime()) / 86400000);
                            return (
                              <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-slate-800">{p.name}</p>
                                  <p className="text-xs text-slate-400">{p.brand} · Batch: {p.batchNumber || '—'}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`font-semibold ${days <= 30 ? 'text-red-600' : 'text-orange-500'}`}>{days}d left</p>
                                  <p className="text-xs text-slate-400">{p.expiryDate}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {lowStockItems.length === 0 && outOfStock.length === 0 && expiryAlerts.length === 0 && (
                      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                        <p className="font-semibold text-slate-700">All clear!</p>
                        <p className="text-sm text-slate-400 mt-1">No stock alerts at this time</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })()}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <>
              <div className="mb-6">
                <h3 className="font-bold text-lg text-slate-800 mb-2">Order Management</h3>
                <p className="text-slate-500">Process and track customer orders</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Order ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Items</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Payment</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 font-semibold text-slate-800">{order.id}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-slate-800">{order.customerName}</p>
                              <p className="text-sm text-slate-500 capitalize">{order.customerType}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{order.items}</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">₹{order.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value as Order['status'])}
                              className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-purple-600">
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <p className="text-purple-600 font-medium mb-2">Total Sales</p>
                    <p className="text-3xl font-bold text-purple-900">₹{stats.revenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <p className="text-green-600 font-medium mb-2">Products Sold</p>
                    <p className="text-3xl font-bold text-green-900">{orders.reduce((sum, o) => sum + o.items, 0)}</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <p className="text-orange-600 font-medium mb-2">Success Rate</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 mb-6">Distributor Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Company Name</p>
                    <p className="font-semibold text-slate-800">{userData?.name || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-800">{userData?.email || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-800">{userData?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Location</p>
                    <p className="font-semibold text-slate-800">{userData?.location || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showModal && (modalType === 'addProduct' || modalType === 'editProduct')}
        onClose={closeModal}
        title={modalType === 'addProduct' ? 'Add New Product' : 'Edit Product'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g., Paracetamol 500mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                required
                value={formData.category || 'pharma'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="pharma">Pharmaceuticals</option>
                <option value="surgical">Surgical</option>
                <option value="emergency">Emergency</option>
                <option value="consumables">Consumables</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g., GSK"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock || 0}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Market Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.marketPrice || 0}
                onChange={(e) => setFormData({ ...formData, marketPrice: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer || ''}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
              <input
                type="text"
                value={formData.batchNumber || ''}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                rows={3}
                placeholder="Product description..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              <span>{modalType === 'addProduct' ? 'Add Product' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title={`Adjust Stock — ${adjustProduct?.name || ''}`}
      >
        {adjustProduct && (
          <div className="space-y-4">
            {/* Current stock */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">Current Stock</span>
              <span className="text-2xl font-bold text-slate-800">{adjustProduct.stock} units</span>
            </div>

            {/* Adjustment type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Adjustment Type</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: 'set', label: 'Set to', color: 'border-blue-500 bg-blue-50 text-blue-700' },
                  { v: 'add', label: 'Add', color: 'border-green-500 bg-green-50 text-green-700' },
                  { v: 'remove', label: 'Remove', color: 'border-red-500 bg-red-50 text-red-700' },
                ] as const).map(({ v, label, color }) => (
                  <button
                    key={v}
                    onClick={() => setAdjustType(v)}
                    className={`py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                      adjustType === v ? color : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                value={adjustQty}
                onChange={e => setAdjustQty(e.target.value)}
                placeholder="Enter quantity"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {adjustQty !== '' && (
                <p className="text-sm text-slate-500 mt-1">
                  New stock will be:{' '}
                  <span className="font-bold text-purple-700">
                    {adjustType === 'set' ? parseInt(adjustQty) || 0
                     : adjustType === 'add' ? adjustProduct.stock + (parseInt(adjustQty) || 0)
                     : Math.max(0, adjustProduct.stock - (parseInt(adjustQty) || 0))} units
                  </span>
                </p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
              <select
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
              >
                <option value="restock">Restock / New Delivery</option>
                <option value="sale">Sale / Dispatch</option>
                <option value="damage">Damaged / Expired</option>
                <option value="return">Customer Return</option>
                <option value="correction">Stock Correction</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Note (optional)</label>
              <input
                type="text"
                value={adjustNote}
                onChange={e => setAdjustNote(e.target.value)}
                placeholder="e.g., Batch BN-2024-08 received"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStockAdjustment}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Confirm Adjustment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Product Modal */}
      <Modal
        isOpen={showModal && modalType === 'viewProduct'}
        onClose={closeModal}
        title="Product Details"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Product Name</p>
                <p className="font-semibold text-slate-800">{selectedItem.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Brand</p>
                <p className="font-semibold text-slate-800">{selectedItem.brand}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Category</p>
                <p className="font-semibold text-slate-800 capitalize">{selectedItem.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Stock</p>
                <p className="font-semibold text-slate-800">{selectedItem.stock}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Price</p>
                <p className="font-semibold text-slate-800">₹{selectedItem.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedItem.status === 'available' ? 'bg-green-100 text-green-700' :
                  selectedItem.status === 'low-stock' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
            {selectedItem.description && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Description</p>
                <p className="text-slate-700">{selectedItem.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}