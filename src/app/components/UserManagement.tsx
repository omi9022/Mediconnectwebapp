import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Eye, EyeOff, Copy, Check, Edit,
  Trash2, Shield, Key, Mail, Phone, MapPin, Building,
  ShoppingBag, Search, Filter, Download, RefreshCw, Save,
  AlertCircle, CheckCircle, Calendar, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal, StatusBadge } from './shared';
import { getFormattedDate } from '../../utils/dateUtils';
import { getCustomUsers, saveCustomUsers } from '../../utils/storage';

interface UserManagementProps {
  onClose?: () => void;
}

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: 'hospital' | 'customer' | 'distributor';
  status: 'active' | 'inactive';
  createdDate: string;
  lastLogin?: string;
  // Hospital specific
  beds?: number;
  doctors?: number;
  // Customer specific
  address?: string;
  // Distributor specific
  companyName?: string;
  gstNumber?: string;
  products?: number;
}

export default function UserManagement({ onClose }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState<'hospital' | 'customer' | 'distributor'>('hospital');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    type: 'hospital',
    status: 'active',
  });

  const [users, setUsers] = useState<{ hospital: User[]; customer: User[]; distributor: User[] }>({
    hospital: [],
    customer: [],
    distributor: [],
  });

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('customUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customUsers', JSON.stringify(users));
  }, [users]);

  const generateUsername = (name: string, type: string) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    return `${cleanName}${randomNum}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Check if username already exists
    const existingUser = users[activeTab].find(u => u.username === formData.username);
    if (existingUser && (!selectedUser || selectedUser.id !== existingUser.id)) {
      toast.error('Username already exists. Please choose a different one.');
      return false;
    }

    return true;
  };

  const handleSaveUser = () => {
    if (!validateForm()) return;

    const today = new Date().toISOString().split('T')[0];

    if (modalType === 'edit' && selectedUser) {
      // Update existing user
      const updatedUsers = { ...users };
      const userIndex = updatedUsers[activeTab].findIndex(u => u.id === selectedUser.id);
      updatedUsers[activeTab][userIndex] = {
        ...updatedUsers[activeTab][userIndex],
        ...formData,
      } as User;
      setUsers(updatedUsers);
      toast.success('User updated successfully!');
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now(),
        username: formData.username!,
        password: formData.password!,
        name: formData.name!,
        email: formData.email!,
        phone: formData.phone || '',
        location: formData.location || '',
        type: activeTab,
        status: 'active',
        createdDate: today,
        ...(activeTab === 'hospital' && {
          beds: formData.beds || 0,
          doctors: formData.doctors || 0,
        }),
        ...(activeTab === 'customer' && {
          address: formData.address || '',
        }),
        ...(activeTab === 'distributor' && {
          companyName: formData.companyName || '',
          gstNumber: formData.gstNumber || '',
          products: formData.products || 0,
        }),
      };

      setUsers(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newUser],
      }));
      
      toast.success(`${activeTab === 'hospital' ? 'Hospital' : activeTab === 'customer' ? 'Customer' : 'Distributor'} user created successfully!`);
    }

    closeModal();
  };

  const handleDeleteUser = (user: User) => {
    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) return;

    setUsers(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(u => u.id !== user.id),
    }));

    toast.success('User deleted successfully');
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      ),
    }));

    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedUser(null);
    setFormData({
      type: activeTab,
      status: 'active',
    });
    setShowModal(true);
  };

  const openViewModal = (user: User) => {
    setModalType('view');
    setSelectedUser(user);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setModalType('edit');
    setSelectedUser(user);
    setFormData(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('create');
    setSelectedUser(null);
    setFormData({
      type: activeTab,
      status: 'active',
    });
    setShowPassword(false);
  };

  const exportUsers = () => {
    const data = users[activeTab];
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(user => Object.values(user).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('User data exported successfully!');
  };

  const filteredUsers = users[activeTab].filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500">Create and manage login credentials for Hospital and Customer portals</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Hospital Users</p>
              <p className="text-2xl font-bold text-slate-800">{users.hospital.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Customer Users</p>
              <p className="text-2xl font-bold text-slate-800">{users.customer.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Distributor Users</p>
              <p className="text-2xl font-bold text-slate-800">{users.distributor.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Active</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.hospital.filter(u => u.status === 'active').length + 
                 users.customer.filter(u => u.status === 'active').length +
                 users.distributor.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('hospital')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'hospital'
              ? 'border-teal-600 text-teal-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building size={18} />
            <span>Hospital Users ({users.hospital.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'customer'
              ? 'border-teal-600 text-teal-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <span>Customer Users ({users.customer.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('distributor')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'distributor'
              ? 'border-teal-600 text-teal-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <span>Distributor Users ({users.distributor.length})</span>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, username, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium mb-2">No {activeTab} users found</p>
            <p className="text-sm mb-4">Create your first {activeTab} user to get started</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <UserPlus size={18} />
              <span>Create {activeTab} User</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-700 font-semibold text-sm">
                            {user.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.createdDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-teal-600"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600"
                          title="Delete"
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal && (modalType === 'create' || modalType === 'edit')}
        onClose={closeModal}
        title={modalType === 'create' ? `Create ${activeTab === 'hospital' ? 'Hospital' : activeTab === 'customer' ? 'Customer' : 'Distributor'} User` : 'Edit User'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              <Users size={18} />
              Basic Information
            </h4>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="username"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('username', generateUsername(formData.name || 'user', activeTab))}
                    className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Generate username"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('password', generatePassword())}
                    className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Generate password"
                  >
                    <Key size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="+91 ..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="City, State"
              />
            </div>
          </div>

          {/* Hospital Specific Fields */}
          {activeTab === 'hospital' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                <Building size={18} />
                Hospital Details
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Beds</label>
                  <input
                    type="number"
                    value={formData.beds || ''}
                    onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Doctors</label>
                  <input
                    type="number"
                    value={formData.doctors || ''}
                    onChange={(e) => handleInputChange('doctors', parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Customer Specific Fields */}
          {activeTab === 'customer' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                <ShoppingBag size={18} />
                Customer Details
              </h4>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={3}
                  placeholder="Full address"
                />
              </div>
            </div>
          )}

          {/* Distributor Specific Fields */}
          {activeTab === 'distributor' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                <ShoppingBag size={18} />
                Distributor Details
              </h4>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber || ''}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="GST Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Number of Products</label>
                <input
                  type="number"
                  value={formData.products || ''}
                  onChange={(e) => handleInputChange('products', parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              <span>{modalType === 'create' ? 'Create User' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={showModal && modalType === 'view' && selectedUser !== null}
        onClose={closeModal}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-teal-700 font-bold text-3xl">
                {selectedUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedUser.name}</h3>
                <p className="text-slate-500 capitalize">{selectedUser.type} User</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            {/* Credentials Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Shield size={18} />
                Login Credentials
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500">Username</p>
                    <p className="font-mono font-semibold text-slate-800">{selectedUser.username}</p>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(selectedUser.username, 'Username')}
                    className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-500 hover:text-teal-600"
                  >
                    {copiedField === 'Username' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500">Password</p>
                    <p className="font-mono font-semibold text-slate-800">{selectedUser.password}</p>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(selectedUser.password, 'Password')}
                    className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-500 hover:text-teal-600"
                  >
                    {copiedField === 'Password' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700">Contact Information</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-slate-800 font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone size={20} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-slate-800 font-medium">{selectedUser.phone}</p>
                    </div>
                  </div>
                )}
                {selectedUser.location && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin size={20} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-slate-800 font-medium">{selectedUser.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            {selectedUser.type === 'hospital' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700">Hospital Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Beds</p>
                    <p className="text-xl font-bold text-slate-800">{selectedUser.beds || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Doctors</p>
                    <p className="text-xl font-bold text-slate-800">{selectedUser.doctors || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedUser.type === 'customer' && selectedUser.address && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700">Customer Details</h4>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Address</p>
                  <p className="text-slate-800">{selectedUser.address}</p>
                </div>
              </div>
            )}

            {selectedUser.type === 'distributor' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700">Distributor Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Company Name</p>
                    <p className="text-slate-800 font-medium">{selectedUser.companyName || '-'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">GST Number</p>
                    <p className="text-slate-800 font-medium">{selectedUser.gstNumber || '-'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Number of Products</p>
                    <p className="text-xl font-bold text-slate-800">{selectedUser.products || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700">Account Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Created Date</p>
                  <p className="text-slate-800 font-medium">{selectedUser.createdDate}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Last Login</p>
                  <p className="text-slate-800 font-medium">{selectedUser.lastLogin || 'Never'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  openEditModal(selectedUser);
                }}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                <span>Edit User</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}