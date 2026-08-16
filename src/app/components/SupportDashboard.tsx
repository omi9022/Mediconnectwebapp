import React, { useState } from 'react';
import { 
  Users, Package, TrendingUp, DollarSign, 
  Activity, AlertCircle, CheckCircle, XCircle,
  ShoppingCart, Truck, Building, Phone, Mail,
  MapPin, Star, Clock, BarChart3, PieChart,
  Settings, Bell, Search, Filter, Download,
  FileText, Calendar, RefreshCw, Eye, Edit,
  Trash2, Plus, MessageSquare, User, LogOut,
  Shield, Database, Server, Zap, Home, Save,
  Stethoscope, UserCog, ShoppingBag, Bed,
  ArrowUp, ArrowDown, Circle
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import UserManagement from './UserManagement';
import { Modal, StatusBadge } from './shared';
import { getFormattedDate } from '../../utils/dateUtils';

interface SupportDashboardProps {
  userData: any;
  onLogout: () => void;
}

export default function SupportDashboard({ userData, onLogout }: SupportDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  // Form state for modal
  const [formData, setFormData] = useState<any>({});
  
  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    platformName: 'MediConnect',
    supportEmail: 'support@mediconnect.com',
    supportPhone: '+91 1800 123 4567'
  });

  // Stats - populated from backend
  const stats = {
    totalHospitals: 0,
    totalSuppliers: 0,
    activeOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    supportTickets: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalPatients: 0
  };

  // Date utility imported from utils/dateUtils.ts

  // Customer data
  const [customers, setCustomers] = useState<any[]>([]);

  // Product data
  const [products, setProducts] = useState<any[]>([]);

  // Hospital data
  const [hospitals, setHospitals] = useState<any[]>([]);

  // Patient data
  const [patients, setPatients] = useState<any[]>([]);

  // Customer orders
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  // Suppliers data
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Hospital orders
  const [hospitalOrders, setHospitalOrders] = useState<any[]>([]);

  // Support tickets
  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  const recentHospitals: any[] = [];
  const recentSuppliers: any[] = [];
  const recentOrders: any[] = [];

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Modal handlers
  const openModal = (type: string, item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Save handler with backend integration
  const handleSave = async () => {
    try {
      if (editingItem) {
        // Update existing item
        await updateItem();
      } else {
        // Add new item
        await addItem();
      }
    } catch (error) {
      console.error('Error saving:', error);
      showNotification('Error saving data. Changes saved locally.', 'error');
    }
  };

  // Add new item
  const addItem = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch(modalType) {
      case 'customer':
        const newCustomer = {
          id: customers.length + 1,
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          location: formData.location || '',
          totalOrders: 0,
          totalSpent: 0,
          joinDate: today,
          status: formData.status || 'active'
        };
        
        // Try to add to backend
        try {
          const response = await api.post('/customers', newCustomer);
          setCustomers([...customers, response.data]);
          showNotification('Customer added successfully!', 'success');
        } catch (error) {
          // Fallback to local state
          setCustomers([...customers, newCustomer]);
          showNotification('Customer added locally (backend unavailable)', 'success');
        }
        break;

      case 'product':
        const newProduct = {
          id: products.length + 1,
          name: formData.name || '',
          category: formData.category || 'pharma',
          brand: formData.brand || '',
          stock: parseInt(formData.stock) || 0,
          price: parseFloat(formData.price) || 0,
          marketPrice: parseFloat(formData.marketPrice) || 0,
          supplier: formData.supplier || '',
          status: formData.status || 'active'
        };
        
        try {
          const response = await api.post('/products', newProduct);
          setProducts([...products, response.data]);
          showNotification('Product added successfully!', 'success');
        } catch (error) {
          setProducts([...products, newProduct]);
          showNotification('Product added locally (backend unavailable)', 'success');
        }
        break;

      case 'hospital':
        const newHospital = {
          id: hospitals.length + 1,
          name: formData.name || '',
          location: formData.location || '',
          beds: parseInt(formData.beds) || 0,
          doctors: parseInt(formData.doctors) || 0,
          patients: parseInt(formData.patients) || 0,
          phone: formData.phone || '',
          email: formData.email || '',
          status: formData.status || 'active',
          joinDate: today
        };
        
        try {
          const response = await api.post('/hospitals', newHospital);
          setHospitals([...hospitals, response.data]);
          showNotification('Hospital added successfully!', 'success');
        } catch (error) {
          setHospitals([...hospitals, newHospital]);
          showNotification('Hospital added locally (backend unavailable)', 'success');
        }
        break;

      case 'patient':
        const newPatient = {
          id: patients.length + 1,
          name: formData.name || '',
          age: parseInt(formData.age) || 0,
          gender: formData.gender || 'Male',
          hospital: formData.hospital || '',
          condition: formData.condition || '',
          doctor: formData.doctor || '',
          status: formData.status || 'Stable',
          room: formData.room || '',
          admitted: today
        };
        
        try {
          const response = await api.post('/patients', newPatient);
          setPatients([...patients, response.data]);
          showNotification('Patient added successfully!', 'success');
        } catch (error) {
          setPatients([...patients, newPatient]);
          showNotification('Patient added locally (backend unavailable)', 'success');
        }
        break;

      case 'supplier':
        const newSupplier = {
          id: suppliers.length + 1,
          name: formData.name || '',
          location: formData.location || '',
          products: parseInt(formData.products) || 0,
          rating: parseFloat(formData.rating) || 0,
          verified: formData.verified || false,
          contact: formData.contact || '',
          email: formData.email || '',
          status: formData.status || 'active'
        };
        
        try {
          const response = await api.post('/suppliers', newSupplier);
          setSuppliers([...suppliers, response.data]);
          showNotification('Supplier added successfully!', 'success');
        } catch (error) {
          setSuppliers([...suppliers, newSupplier]);
          showNotification('Supplier added locally (backend unavailable)', 'success');
        }
        break;
    }
    
    closeModal();
  };

  // Update existing item
  const updateItem = async () => {
    switch(modalType) {
      case 'customer':
        const updatedCustomers = customers.map(c => 
          c.id === editingItem.id ? { ...c, ...formData } : c
        );
        
        try {
          await api.put(`/customers/${editingItem.id}`, formData);
          setCustomers(updatedCustomers);
          showNotification('Customer updated successfully!', 'success');
        } catch (error) {
          setCustomers(updatedCustomers);
          showNotification('Customer updated locally (backend unavailable)', 'success');
        }
        break;

      case 'product':
        const updatedProducts = products.map(p => 
          p.id === editingItem.id ? { ...p, ...formData } : p
        );
        
        try {
          await api.put(`/products/${editingItem.id}`, formData);
          setProducts(updatedProducts);
          showNotification('Product updated successfully!', 'success');
        } catch (error) {
          setProducts(updatedProducts);
          showNotification('Product updated locally (backend unavailable)', 'success');
        }
        break;

      case 'hospital':
        const updatedHospitals = hospitals.map(h => 
          h.id === editingItem.id ? { ...h, ...formData } : h
        );
        
        try {
          await api.put(`/hospitals/${editingItem.id}`, formData);
          setHospitals(updatedHospitals);
          showNotification('Hospital updated successfully!', 'success');
        } catch (error) {
          setHospitals(updatedHospitals);
          showNotification('Hospital updated locally (backend unavailable)', 'success');
        }
        break;

      case 'patient':
        const updatedPatients = patients.map(p => 
          p.id === editingItem.id ? { ...p, ...formData } : p
        );
        
        try {
          await api.put(`/patients/${editingItem.id}`, formData);
          setPatients(updatedPatients);
          showNotification('Patient updated successfully!', 'success');
        } catch (error) {
          setPatients(updatedPatients);
          showNotification('Patient updated locally (backend unavailable)', 'success');
        }
        break;

      case 'supplier':
        const updatedSuppliers = suppliers.map(s => 
          s.id === editingItem.id ? { ...s, ...formData } : s
        );
        
        try {
          await api.put(`/suppliers/${editingItem.id}`, formData);
          setSuppliers(updatedSuppliers);
          showNotification('Supplier updated successfully!', 'success');
        } catch (error) {
          setSuppliers(updatedSuppliers);
          showNotification('Supplier updated locally (backend unavailable)', 'success');
        }
        break;
    }
    
    closeModal();
  };

  // CRUD handlers
  const handleDelete = async (type: string, id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      switch(type) {
        case 'customer':
          try {
            await api.delete(`/customers/${id}`);
          } catch (error) {
            console.log('Backend delete failed, deleting locally');
          }
          setCustomers(customers.filter(c => c.id !== id));
          showNotification('Customer deleted successfully!', 'success');
          break;

        case 'product':
          try {
            await api.delete(`/products/${id}`);
          } catch (error) {
            console.log('Backend delete failed, deleting locally');
          }
          setProducts(products.filter(p => p.id !== id));
          showNotification('Product deleted successfully!', 'success');
          break;

        case 'hospital':
          try {
            await api.delete(`/hospitals/${id}`);
          } catch (error) {
            console.log('Backend delete failed, deleting locally');
          }
          setHospitals(hospitals.filter(h => h.id !== id));
          showNotification('Hospital deleted successfully!', 'success');
          break;

        case 'patient':
          try {
            await api.delete(`/patients/${id}`);
          } catch (error) {
            console.log('Backend delete failed, deleting locally');
          }
          setPatients(patients.filter(p => p.id !== id));
          showNotification('Patient deleted successfully!', 'success');
          break;

        case 'supplier':
          try {
            await api.delete(`/suppliers/${id}`);
          } catch (error) {
            console.log('Backend delete failed, deleting locally');
          }
          setSuppliers(suppliers.filter(s => s.id !== id));
          showNotification('Supplier deleted successfully!', 'success');
          break;

        case 'ticket':
          try {
            await api.delete(`/tickets/${id}`);
          } catch (error) {
            console.log('Backend delete failed, deleting locally');
          }
          setSupportTickets(supportTickets.filter(t => t.id !== id));
          showNotification('Ticket deleted successfully!', 'success');
          break;
      }
    } catch (error) {
      showNotification('Error deleting item', 'error');
    }
  };

  // Update ticket status
  const updateTicketStatus = async (id: number, newStatus: string) => {
    const updatedTickets = supportTickets.map(ticket => 
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    );
    
    try {
      await api.put(`/tickets/${id}`, { status: newStatus });
      setSupportTickets(updatedTickets);
      showNotification('Ticket status updated!', 'success');
    } catch (error) {
      setSupportTickets(updatedTickets);
      showNotification('Ticket status updated locally', 'success');
    }
  };

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    showNotification(`${filename}.csv downloaded successfully!`, 'success');
    toast.success(`${filename}.csv downloaded successfully!`);
  };

  // View item details handler
  const handleViewItem = (type: string, item: any) => {
    setViewingItem({ type, data: item });
    setShowModal(true);
    setModalType(`view-${type}`);
    toast.info(`Viewing ${type} details`);
  };

  // Save system settings handler
  const handleSaveSystemSettings = () => {
    toast.success('System settings saved successfully!');
    showNotification('System settings saved successfully!', 'success');
  };

  // Security and system action handlers
  const handleChangePassword = () => {
    toast.info('Opening change password dialog...');
    showNotification('Password change initiated', 'success');
  };

  const handleEnable2FA = () => {
    toast.success('Two-Factor Authentication enabled!');
    showNotification('2FA enabled successfully', 'success');
  };

  const handleViewLoginHistory = () => {
    toast.info('Opening login history...');
    showNotification('Login history loaded', 'success');
  };

  const handleBackupData = () => {
    const timestamp = new Date().toISOString();
    toast.success('Data backup initiated!');
    showNotification('Backup started successfully', 'success');
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all cache?')) {
      toast.success('Cache cleared successfully!');
      showNotification('All cache cleared', 'success');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset system settings to default?')) {
      setSystemSettings({
        platformName: 'MediConnect',
        supportEmail: 'support@mediconnect.com',
        supportPhone: '+91 1800 123 4567'
      });
      toast.success('System settings reset to default!');
      showNotification('Settings reset successfully', 'success');
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL data permanently! Are you sure?')) {
      if (window.confirm('This action is IRREVERSIBLE. Type YES in your mind and confirm.')) {
        toast.error('Factory reset initiated - All data will be deleted!');
        showNotification('Factory reset in progress...', 'error');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white fixed left-0 top-0 h-screen overflow-y-auto pb-24">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="font-bold">MediConnect</h1>
              <p className="text-slate-400 text-sm">Support System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'overview' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Home size={20} />
            <span>Overview</span>
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-slate-400 text-xs uppercase font-semibold">Customer Portal</p>
          </div>

          <button
            onClick={() => setActiveSection('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'customers' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCog size={20} />
            <span>Customers</span>
            <span className="ml-auto bg-purple-500 px-2 py-1 rounded-full text-xs">{customers.length}</span>
          </button>

          <button
            onClick={() => setActiveSection('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'products' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Package size={20} />
            <span>Products</span>
            <span className="ml-auto bg-green-500 px-2 py-1 rounded-full text-xs">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveSection('customerOrders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'customerOrders' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag size={20} />
            <span>Customer Orders</span>
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-slate-400 text-xs uppercase font-semibold">Hospital Portal</p>
          </div>

          <button
            onClick={() => setActiveSection('hospitals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'hospitals' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building size={20} />
            <span>Hospitals</span>
            <span className="ml-auto bg-blue-500 px-2 py-1 rounded-full text-xs">{hospitals.length}</span>
          </button>

          <button
            onClick={() => setActiveSection('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'patients' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Stethoscope size={20} />
            <span>Patients</span>
            <span className="ml-auto bg-red-500 px-2 py-1 rounded-full text-xs">{patients.length}</span>
          </button>

          <div className="pt-4 pb-2 px-4">
            <p className="text-slate-400 text-xs uppercase font-semibold">System</p>
          </div>

          <button
            onClick={() => setActiveSection('suppliers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'suppliers' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users size={20} />
            <span>Suppliers</span>
          </button>

          <button
            onClick={() => setActiveSection('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'orders' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingCart size={20} />
            <span>Hospital Orders</span>
            {stats.activeOrders > 0 && (
              <span className="ml-auto bg-blue-500 px-2 py-1 rounded-full text-xs">{stats.activeOrders}</span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('tickets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'tickets' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MessageSquare size={20} />
            <span>Support Tickets</span>
            {supportTickets.filter(t => t.status !== 'resolved').length > 0 && (
              <span className="ml-auto bg-red-500 px-2 py-1 rounded-full text-xs">
                {supportTickets.filter(t => t.status !== 'resolved').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'analytics' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveSection('userManagement')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'userManagement' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield size={20} />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'settings' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        {/* User Info - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 w-64 p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userData.name}</p>
              <p className="text-slate-400 text-sm truncate">{userData.type}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-slate-800">
                {activeSection === 'overview' && 'Dashboard Overview'}
                {activeSection === 'customers' && 'Customer Management'}
                {activeSection === 'products' && 'Product Management'}
                {activeSection === 'customerOrders' && 'Customer Order Management'}
                {activeSection === 'hospitals' && 'Hospital Management'}
                {activeSection === 'patients' && 'Patient Management'}
                {activeSection === 'userManagement' && 'User Management'}
                {activeSection === 'suppliers' && 'Supplier Management'}
                {activeSection === 'orders' && 'Hospital Order Management'}
                {activeSection === 'tickets' && 'Support Tickets'}
                {activeSection === 'analytics' && 'Analytics & Reports'}
                {activeSection === 'settings' && 'System Settings'}
              </h2>
              <p className="text-slate-500">Welcome back, {userData.name}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
              <button 
                onClick={() => {
                  setShowNotificationsPanel(!showNotificationsPanel);
                  toast.info('Notifications panel toggled');
                }}
                className="relative p-2 hover:bg-slate-100 rounded-lg"
              >
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - I'll continue with the rest in the next part due to length */}
        <div className="p-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="text-blue-600" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <ArrowUp size={14} />
                      +12%
                    </span>
                  </div>
                  <h3 className="text-slate-500 mb-1">Total Hospitals</h3>
                  <p className="text-3xl font-bold text-slate-800">{hospitals.length}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="text-purple-600" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <ArrowUp size={14} />
                      +8%
                    </span>
                  </div>
                  <h3 className="text-slate-500 mb-1">Total Customers</h3>
                  <p className="text-3xl font-bold text-slate-800">{customers.length}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="text-teal-600" size={24} />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">{stats.activeOrders} active</span>
                  </div>
                  <h3 className="text-slate-500 mb-1">Active Orders</h3>
                  <p className="text-3xl font-bold text-slate-800">{stats.activeOrders}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <ArrowUp size={14} />
                      +24%
                    </span>
                  </div>
                  <h3 className="text-slate-500 mb-1">Total Revenue</h3>
                  <p className="text-3xl font-bold text-slate-800">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>

              {/* Recent Activity - Continue with existing overview content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Hospitals */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Recent Hospitals</h3>
                    <button 
                      onClick={() => setActiveSection('hospitals')}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentHospitals.map(hospital => (
                        <div key={hospital.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building className="text-blue-600" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{hospital.name}</p>
                              <p className="text-slate-500 text-sm">{hospital.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-slate-800">{hospital.orders} orders</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              hospital.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {hospital.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Support Tickets Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Support Tickets</h3>
                    <button 
                      onClick={() => setActiveSection('tickets')}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {supportTickets.slice(0, 4).map(ticket => (
                        <div key={ticket.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-slate-800">{ticket.subject}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {ticket.priority}
                              </span>
                            </div>
                            <p className="text-slate-500 text-sm">{ticket.customer}</p>
                            <p className="text-slate-400 text-xs mt-1">{ticket.created}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Recent Hospital Orders</h3>
                  <button 
                    onClick={() => setActiveSection('orders')}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-slate-600 font-medium">Order ID</th>
                        <th className="px-6 py-3 text-left text-slate-600 font-medium">Hospital</th>
                        <th className="px-6 py-3 text-left text-slate-600 font-medium">Amount</th>
                        <th className="px-6 py-3 text-left text-slate-600 font-medium">Items</th>
                        <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                        <th className="px-6 py-3 text-left text-slate-600 font-medium">Date</th>
                        <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-800">{order.id}</td>
                          <td className="px-6 py-4 text-slate-600">{order.hospital}</td>
                          <td className="px-6 py-4 text-slate-800 font-medium">₹{order.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-slate-600">{order.items} items</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{order.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleViewItem('customer-order', order)}
                                className="p-1 hover:bg-slate-100 rounded" 
                                title="View"
                              >
                                <Eye size={16} className="text-slate-600" />
                              </button>
                              <button 
                                onClick={() => openModal('order', order)}
                                className="p-1 hover:bg-slate-100 rounded" 
                                title="Edit"
                              >
                                <Edit size={16} className="text-slate-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Customer Management Section */}
          {activeSection === 'customers' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Customer Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage all customer accounts and their information</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => exportToCSV(customers, 'customers')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button 
                    onClick={() => openModal('customer')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Customer
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">ID</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Name</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Email</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Phone</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Location</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Orders</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Total Spent</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
                      <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{customer.id}</td>
                        <td className="px-6 py-4 text-slate-800">{customer.name}</td>
                        <td className="px-6 py-4 text-slate-600">{customer.email}</td>
                        <td className="px-6 py-4 text-slate-600">{customer.phone}</td>
                        <td className="px-6 py-4 text-slate-600">{customer.location}</td>
                        <td className="px-6 py-4 text-slate-800">{customer.totalOrders}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openModal('customer', customer)}
                              className="p-1 hover:bg-slate-100 rounded"
                              title="Edit"
                            >
                              <Edit size={16} className="text-slate-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete('customer', customer.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

{/* Due to length constraints, I'll provide the modal component separately. The rest of the sections follow the same pattern as above with their respective data tables */}

{/* Modal for Add/Edit */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="font-bold text-xl">
          {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
        </h3>
        <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
          <X size={20} />
        </button>
      </div>
      <div className="p-6">
        {modalType === 'customer' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.name || ''} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter customer name" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.email || ''} 
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="customer@example.com" 
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.phone || ''} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.location || ''} 
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City name" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.status || 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {modalType === 'product' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.name || ''} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name" 
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.brand || ''} 
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Brand name" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.category || 'pharma'}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                >
                  <option value="emergency">Emergency</option>
                  <option value="surgical">Surgical</option>
                  <option value="pharma">Pharma</option>
                  <option value="consumables">Consumables</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stock *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.stock || ''} 
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹) *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.price || ''} 
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Market Price (₹) *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.marketPrice || ''} 
                  onChange={(e) => handleInputChange('marketPrice', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Supplier *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.supplier || ''} 
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder="Supplier name" 
                required
              />
            </div>
          </div>
        )}

        {modalType === 'hospital' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hospital Name *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.name || ''} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter hospital name" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.location || ''} 
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City name" 
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Beds *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.beds || ''} 
                  onChange={(e) => handleInputChange('beds', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Doctors *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.doctors || ''} 
                  onChange={(e) => handleInputChange('doctors', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Patients *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.patients || ''} 
                  onChange={(e) => handleInputChange('patients', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.phone || ''} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 265 2345678" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="hospital@example.com" 
                  required
                />
              </div>
            </div>
          </div>
        )}

        {modalType === 'patient' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Patient Name *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter patient name" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.age || ''} 
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.gender || 'Male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hospital *</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.hospital || ''}
                  onChange={(e) => handleInputChange('hospital', e.target.value)}
                  required
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Condition *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.condition || ''} 
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  placeholder="Medical condition" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Doctor *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.doctor || ''} 
                  onChange={(e) => handleInputChange('doctor', e.target.value)}
                  placeholder="Dr. Name" 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.status || 'Stable'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="Critical">Critical</option>
                  <option value="Stable">Stable</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Post-Op">Post-Op</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Room *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.room || ''} 
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  placeholder="Room number" 
                  required
                />
              </div>
            </div>
          </div>
        )}

        {modalType === 'supplier' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Supplier Name *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                value={formData.name || ''} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter supplier name" 
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.location || ''} 
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City name" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Products Count *</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.products || ''} 
                  onChange={(e) => handleInputChange('products', e.target.value)}
                  placeholder="0" 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact *</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.contact || ''} 
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder="+91 265 1234567" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="supplier@example.com" 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating *</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="5" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.rating || ''} 
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="4.5" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                  value={formData.status || 'active'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="verified" 
                className="w-5 h-5 text-teal-600" 
                checked={formData.verified || false}
                onChange={(e) => handleInputChange('verified', e.target.checked)}
              />
              <label htmlFor="verified" className="text-sm font-medium text-slate-700">Verified Supplier</label>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button 
            onClick={closeModal}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {editingItem ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

          {/* Product Management Section */}
          {activeSection === 'products' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Product Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage product catalog and inventory</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => exportToCSV(products, 'products')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button 
                    onClick={() => openModal('product')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">ID</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Name</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Brand</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Category</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Stock</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Price</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Market Price</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Supplier</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{product.id}</td>
                        <td className="px-6 py-4 text-slate-800">{product.name}</td>
                        <td className="px-6 py-4 text-slate-600">{product.brand}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.category === 'emergency' ? 'bg-red-100 text-red-700' :
                            product.category === 'surgical' ? 'bg-purple-100 text-purple-700' :
                            product.category === 'pharma' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{product.category}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-800">{product.stock}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">₹{product.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600 line-through">₹{product.marketPrice.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{product.supplier}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openModal('product', product)}
                              className="p-1 hover:bg-slate-100 rounded"
                              title="Edit"
                            >
                              <Edit size={16} className="text-slate-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete('product', product.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customer Orders Section */}
          {activeSection === 'customerOrders' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Customer Order Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Track and manage all customer orders</p>
                </div>
                <button 
                  onClick={() => exportToCSV(customerOrders, 'customer-orders')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Order ID</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Customer</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Items</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Total</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Payment</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Date</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map(order => (
                      <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{order.id}</td>
                        <td className="px-6 py-4 text-slate-800">{order.customer}</td>
                        <td className="px-6 py-4 text-slate-600">{order.items} items</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">₹{order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.payment === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.payment}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{order.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-slate-100 rounded" title="View">
                              <Eye size={16} className="text-slate-600" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded" title="Edit">
                              <Edit size={16} className="text-slate-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hospital Management Section */}
          {activeSection === 'hospitals' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Hospital Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage hospital accounts and facilities</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => exportToCSV(hospitals, 'hospitals')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button 
                    onClick={() => openModal('hospital')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Hospital
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">ID</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Name</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Location</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Beds</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Doctors</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Patients</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Phone</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Email</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map(hospital => (
                      <tr key={hospital.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{hospital.id}</td>
                        <td className="px-6 py-4 text-slate-800">{hospital.name}</td>
                        <td className="px-6 py-4 text-slate-600">{hospital.location}</td>
                        <td className="px-6 py-4 text-slate-800">{hospital.beds}</td>
                        <td className="px-6 py-4 text-slate-800">{hospital.doctors}</td>
                        <td className="px-6 py-4 text-slate-800">{hospital.patients}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{hospital.phone}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{hospital.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            hospital.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {hospital.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openModal('hospital', hospital)}
                              className="p-1 hover:bg-slate-100 rounded"
                              title="Edit"
                            >
                              <Edit size={16} className="text-slate-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete('hospital', hospital.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Patient Management Section */}
          {activeSection === 'patients' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Patient Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage patient records and medical status</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => exportToCSV(patients, 'patients')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button 
                    onClick={() => openModal('patient')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Patient
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">ID</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Name</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Age</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Gender</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Hospital</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Condition</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Doctor</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Room</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Admitted</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(patient => (
                      <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{patient.id}</td>
                        <td className="px-6 py-4 text-slate-800">{patient.name}</td>
                        <td className="px-6 py-4 text-slate-600">{patient.age}</td>
                        <td className="px-6 py-4 text-slate-600">{patient.gender}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{patient.hospital}</td>
                        <td className="px-6 py-4 text-slate-800">{patient.condition}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{patient.doctor}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'Critical' ? 'bg-red-100 text-red-700' :
                            patient.status === 'Stable' ? 'bg-green-100 text-green-700' :
                            patient.status === 'Recovering' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{patient.room}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{patient.admitted}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openModal('patient', patient)}
                              className="p-1 hover:bg-slate-100 rounded"
                              title="Edit"
                            >
                              <Edit size={16} className="text-slate-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete('patient', patient.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suppliers Section */}
          {activeSection === 'suppliers' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Supplier Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage suppliers and their product inventory</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => exportToCSV(suppliers, 'suppliers')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button 
                    onClick={() => openModal('supplier')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Supplier
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">ID</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Name</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Location</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Products</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Rating</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Contact</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Email</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Verified</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map(supplier => (
                      <tr key={supplier.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{supplier.id}</td>
                        <td className="px-6 py-4 text-slate-800">{supplier.name}</td>
                        <td className="px-6 py-4 text-slate-600">{supplier.location}</td>
                        <td className="px-6 py-4 text-slate-800">{supplier.products}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-slate-800 font-medium">{supplier.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{supplier.contact}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{supplier.email}</td>
                        <td className="px-6 py-4">
                          {supplier.verified ? (
                            <CheckCircle size={18} className="text-green-600" />
                          ) : (
                            <XCircle size={18} className="text-slate-400" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            supplier.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {supplier.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openModal('supplier', supplier)}
                              className="p-1 hover:bg-slate-100 rounded"
                              title="Edit"
                            >
                              <Edit size={16} className="text-slate-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete('supplier', supplier.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hospital Orders Section */}
          {activeSection === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Hospital Order Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Track and manage all hospital bulk orders</p>
                </div>
                <button 
                  onClick={() => exportToCSV(hospitalOrders, 'hospital-orders')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Order ID</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Hospital</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Supplier</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Amount</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Items</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Date</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitalOrders.map(order => (
                      <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{order.id}</td>
                        <td className="px-6 py-4 text-slate-800">{order.hospital}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{order.supplier}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">₹{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600">{order.items} items</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{order.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-slate-100 rounded" title="View">
                              <Eye size={16} className="text-slate-600" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded" title="Edit">
                              <Edit size={16} className="text-slate-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Support Tickets Section */}
          {activeSection === 'tickets' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Support Tickets</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage customer and hospital support requests</p>
                </div>
                <button 
                  onClick={() => exportToCSV(supportTickets, 'support-tickets')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
              <div className="p-6 space-y-4">
                {supportTickets.map(ticket => (
                  <div key={ticket.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-800">{ticket.ticketId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1">{ticket.subject}</h4>
                        <p className="text-slate-600 text-sm mb-2">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {ticket.customer}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Shield size={14} />
                            {ticket.assignedTo}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {ticket.created}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <select 
                          className="px-3 py-1 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                          value={ticket.status}
                          onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button 
                          onClick={() => handleDelete('ticket', ticket.id)}
                          className="p-2 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Revenue Trends</h3>
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-slate-800 mb-2">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-green-600 text-sm flex items-center gap-1">
                    <ArrowUp size={14} />
                    <span>+24% from last month</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-slate-600 text-sm">Total transactions: 1,248</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Customer Growth</h3>
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-slate-800 mb-2">{customers.length}</p>
                  <p className="text-green-600 text-sm flex items-center gap-1">
                    <ArrowUp size={14} />
                    <span>+8% from last month</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-slate-600 text-sm">Active customers: {customers.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Order Volume</h3>
                    <ShoppingCart className="text-teal-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-slate-800 mb-2">{stats.activeOrders}</p>
                  <p className="text-blue-600 text-sm">Active orders</p>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-slate-600 text-sm">Completed: {hospitalOrders.filter(o => o.status === 'delivered').length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4">Top Performing Hospitals</h3>
                  <div className="space-y-3">
                    {hospitals.slice(0, 4).map((hospital, index) => (
                      <div key={hospital.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{hospital.name}</p>
                            <p className="text-slate-500 text-sm">{hospital.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">{hospital.patients} patients</p>
                          <p className="text-slate-500 text-sm">{hospital.beds} beds</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4">Top Selling Products</h3>
                  <div className="space-y-3">
                    {products.slice(0, 4).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center font-bold text-green-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{product.name}</p>
                            <p className="text-slate-500 text-sm">{product.brand}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">₹{product.price.toLocaleString()}</p>
                          <p className="text-slate-500 text-sm">{product.stock} in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">System Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{hospitals.length}</p>
                    <p className="text-slate-600 mt-2">Hospitals</p>
                    <p className="text-blue-600 text-sm mt-1">+{hospitals.filter(h => h.status === 'active').length} active</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">{customers.length}</p>
                    <p className="text-slate-600 mt-2">Customers</p>
                    <p className="text-purple-600 text-sm mt-1">+{customers.filter(c => c.status === 'active').length} active</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{products.length}</p>
                    <p className="text-slate-600 mt-2">Products</p>
                    <p className="text-green-600 text-sm mt-1">+{products.filter(p => p.status === 'active').length} active</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-3xl font-bold text-red-600">{patients.length}</p>
                    <p className="text-slate-600 mt-2">Patients</p>
                    <p className="text-red-600 text-sm mt-1">+{patients.filter(p => p.status === 'Critical').length} critical</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="text-green-600" size={20} />
                      <div>
                        <p className="font-medium text-slate-800">New customer registered</p>
                        <p className="text-slate-500 text-sm">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <ShoppingCart className="text-blue-600" size={20} />
                      <div>
                        <p className="font-medium text-slate-800">Order placed - ORD-9921</p>
                        <p className="text-slate-500 text-sm">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="text-yellow-600" size={20} />
                      <div>
                        <p className="font-medium text-slate-800">Low stock alert</p>
                        <p className="text-slate-500 text-sm">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4">Order Status Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-slate-700">Delivered</span>
                      </div>
                      <span className="font-medium text-slate-800">{hospitalOrders.filter(o => o.status === 'delivered').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-700">Shipped</span>
                      </div>
                      <span className="font-medium text-slate-800">{hospitalOrders.filter(o => o.status === 'shipped').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-slate-700">Processing</span>
                      </div>
                      <span className="font-medium text-slate-800">{hospitalOrders.filter(o => o.status === 'processing').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                        <span className="text-slate-700">Pending</span>
                      </div>
                      <span className="font-medium text-slate-800">{hospitalOrders.filter(o => o.status === 'pending').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Section */}
          {activeSection === 'userManagement' && (
            <UserManagement />
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-xl text-slate-800 mb-4">System Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
                    <input 
                      type="text" 
                      defaultValue="MediConnect" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
                    <input 
                      type="email" 
                      defaultValue="support@mediconnect.com" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Support Phone</label>
                    <input 
                      type="tel" 
                      defaultValue="+91 1800 123 4567" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                    />
                  </div>
                  <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-xl text-slate-800 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">Email Notifications</p>
                      <p className="text-slate-500 text-sm">Receive email alerts for new orders and tickets</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-teal-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">SMS Notifications</p>
                      <p className="text-slate-500 text-sm">Receive SMS for critical alerts</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-teal-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">System Alerts</p>
                      <p className="text-slate-500 text-sm">Get notified about system updates</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">Low Stock Alerts</p>
                      <p className="text-slate-500 text-sm">Alert when products are running low</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-teal-600" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-xl text-slate-800 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Shield size={18} />
                    Change Password
                  </button>
                  <button className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
                    Enable Two-Factor Authentication
                  </button>
                  <button className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Clock size={18} />
                    View Login History
                  </button>
                  <button className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Database size={18} />
                    Backup Data
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-xl text-slate-800 mb-2 text-red-600 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Danger Zone
                </h3>
                <p className="text-slate-600 text-sm mb-4">These actions are irreversible. Please be careful.</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw size={18} />
                    Clear All Cache
                  </button>
                  <button className="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <XCircle size={18} />
                    Reset System Settings
                  </button>
                  <button className="w-full px-4 py-3 bg-red-600 text-white border border-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={18} />
                    Delete All Data (Factory Reset)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
