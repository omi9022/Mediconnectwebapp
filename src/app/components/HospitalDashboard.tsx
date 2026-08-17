import React, { useState } from 'react';
import { Chrome as Home, Users, Calendar, DollarSign, UserPlus, FileText, Bell, Settings, LogOut, Search, ListFilter as Filter, Download, Activity, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock, TrendingUp, Phone, Mail, MapPin, ChevronRight, Plus, CreditCard as Edit, Trash2, Stethoscope, Bed, Pill, Syringe, Building, MoveVertical as MoreVertical, Printer, CreditCard, Square as XSquare, SquareCheck as CheckSquare, Calendar as CalendarIcon, Check, Eye, FileDown, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { Modal, StatusBadge } from './shared';
import { getRelativeDate, getFormattedDate } from '../../utils/dateUtils';

interface HospitalDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function HospitalDashboard({ user, onLogout }: HospitalDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [billingFilter, setBillingFilter] = useState('all');
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // --- Mock Data States ---

  const [stats, setStats] = useState<any[]>([
    { id: 1, title: 'Total Patients', value: '0', change: '0%', trend: 'up', icon: Users, color: 'blue' },
    { id: 2, title: 'Appointments Today', value: '0', change: '0%', trend: 'up', icon: Calendar, color: 'green' },
    { id: 3, title: 'Revenue This Month', value: '₹0', change: '0%', trend: 'up', icon: DollarSign, color: 'purple' },
    { id: 4, title: 'Bed Occupancy', value: '0%', change: '0%', trend: 'up', icon: Bed, color: 'orange' },
  ]);

  const [recentPatients, setRecentPatients] = useState<any[]>([]);

  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  const [alerts, setAlerts] = useState<any[]>([]);

  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  const [invoices, setInvoices] = useState<any[]>([]);

  // --- Actions ---

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark unread alerts as read
      setTimeout(() => {
        setUnreadCount(0);
        setAlerts(alerts.map(a => ({ ...a, read: true })));
      }, 500);
    }
  };

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const handleClearNotification = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Notification cleared');
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setUpcomingAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  const handleDeleteStaff = (id: number) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaffMembers(prev => prev.filter(s => s.id !== id));
      toast.success("Staff member removed successfully");
    }
  };

  const handleDeletePatient = (id: number) => {
    if (confirm('Are you sure you want to remove this patient record?')) {
      setRecentPatients(prev => prev.filter(p => p.id !== id));
      toast.success("Patient record removed successfully");
    }
  };

  const handleDeleteAppointment = (id: number) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setUpcomingAppointments(prev => prev.filter(a => a.id !== id));
      toast.success("Appointment deleted successfully");
    }
  };

  const handleViewPatient = (patient: any) => {
    setSelectedItem(patient);
    setActiveModal('viewPatient');
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedItem(appointment);
    setActiveModal('viewAppointment');
  };

  const handleViewStaff = (staff: any) => {
    setSelectedItem(staff);
    setActiveModal('viewStaff');
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedItem(invoice);
    setActiveModal('viewInvoice');
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newPatient = {
      id: recentPatients.length + 1,
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      condition: formData.get('condition') as string,
      doctor: formData.get('doctor') as string,
      status: 'Stable',
      room: formData.get('room') as string,
      admitted: 'Just now'
    };
    setRecentPatients([newPatient, ...recentPatients]);
    setActiveModal(null);
    toast.success("Patient registered successfully");
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newAppointment = {
      id: upcomingAppointments.length + 1,
      patient: formData.get('patient') as string,
      time: formData.get('time') as string,
      doctor: formData.get('doctor') as string,
      type: formData.get('type') as string,
      department: 'General',
      status: 'pending',
      date: 'Today'
    };
    setUpcomingAppointments([newAppointment, ...upcomingAppointments]);
    setActiveModal(null);
    toast.success("Appointment scheduled successfully");
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newStaff = {
      id: staffMembers.length + 1,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      department: formData.get('department') as string,
      status: 'Off Duty',
      availability: 'Available',
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      patients: 0
    };
    setStaffMembers([...staffMembers, newStaff]);
    setActiveModal(null);
    toast.success("Staff member added successfully");
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newInvoice = {
      id: `INV-2024-${(invoices.length + 1).toString().padStart(3, '0')}`,
      patient: formData.get('patient') as string,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(formData.get('amount') as string),
      status: 'Pending',
      type: formData.get('type') as string
    };
    setInvoices([newInvoice, ...invoices]);
    setActiveModal(null);
    toast.success("Invoice generated successfully");
  };

  const handlePrint = () => {
    toast.success("Sending to printer...");
    setTimeout(() => toast.info("Document printed successfully"), 1000);
  };

  const handleDownload = (fileName?: string) => {
    const name = fileName || 'document.pdf';
    toast.success(`Downloading ${name}...`);
    setTimeout(() => toast.info(`${name} downloaded successfully`), 1000);
  };

  const handleExportData = (type: string) => {
    toast.success(`Exporting ${type} data to Excel...`);
    setTimeout(() => {
      toast.info(`${type} data exported successfully!`);
    }, 1500);
  };

  const handlePayInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: 'Paid' } : inv
    ));
    toast.success(`Invoice ${id} marked as paid`);
  };

  // --- Helpers ---

  const statColorMap: Record<string, { bg: string; text: string }> = {
    blue:   { bg: 'bg-blue-100',   text: 'text-blue-600' },
    green:  { bg: 'bg-green-100',  text: 'text-green-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    red:    { bg: 'bg-red-100',    text: 'text-red-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Critical': 'bg-red-100 text-red-700',
      'Stable': 'bg-green-100 text-green-700',
      'Recovering': 'bg-blue-100 text-blue-700',
      'Post-Op': 'bg-yellow-100 text-yellow-700',
      'confirmed': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'urgent': 'bg-red-100 text-red-700',
      'completed': 'bg-blue-100 text-blue-700',
      'cancelled': 'bg-gray-100 text-gray-700',
      'Paid': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Overdue': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filterData = (data: any[], keys: string[]) => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(item => 
      keys.some(key => String(item[key]).toLowerCase().includes(query))
    );
  };

  const filteredAppointments = appointmentFilter === 'all' 
    ? filterData(upcomingAppointments, ['patient', 'doctor']) 
    : filterData(upcomingAppointments.filter(apt => apt.status === appointmentFilter), ['patient', 'doctor']);

  const filteredInvoices = billingFilter === 'all'
    ? filterData(invoices, ['patient', 'id'])
    : filterData(invoices.filter(inv => inv.status === billingFilter), ['patient', 'id']);

  const filteredStaff = filterData(staffMembers, ['name', 'role', 'department']);
  const filteredPatients = filterData(recentPatients, ['name', 'doctor', 'condition']);

  // --- Render Functions ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${statColorMap[stat.color]?.bg || 'bg-slate-100'} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`${statColorMap[stat.color]?.text || 'text-slate-600'}`} size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-600 text-sm mb-1">{stat.title}</h3>
            <p className="font-bold text-2xl text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts Banner */}
      {alerts.some(a => !a.read) && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-red-800 mb-2">Active Alerts</h3>
              <div className="space-y-2">
                {alerts.filter(a => !a.read).slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.type === 'critical' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-slate-700">{alert.message}</span>
                    </div>
                    <span className="text-slate-500 text-sm">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Patient Admissions */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-800">Recent Patient Admissions</h2>
              <p className="text-slate-500 text-sm">Currently admitted patients</p>
            </div>
            <button 
              onClick={() => setActiveModal('patient')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>New Patient</span>
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredPatients.slice(0, 4).map((patient) => (
                <div key={patient.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="text-blue-700" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                        <p className="text-slate-500 text-sm">{patient.age} years • {patient.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                      <button 
                        onClick={() => handleViewPatient(patient)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-blue-600 transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Stethoscope size={16} />
                      <span>{patient.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Bed size={16} />
                      <span>Room {patient.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Activity size={16} />
                      <span>{patient.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={16} />
                      <span>{patient.admitted}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments Calendar */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-800">Today's Appointments</h2>
              <p className="text-slate-500 text-sm">Scheduled consultations & surgeries</p>
            </div>
            <button 
              onClick={() => setActiveTab('appointments')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {upcomingAppointments.filter(apt => apt.date === 'Today').slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleViewAppointment(apt)}>
                  <div className="text-center min-w-[80px]">
                    <div className="font-bold text-lg text-blue-600">{apt.time}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{apt.patient}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span>{apt.doctor}</span>
                      <span>•</span>
                      <span>{apt.type}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointment Management</h2>
          <p className="text-slate-500">Schedule and manage patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            {['all', 'confirmed', 'pending', 'cancelled'].map(filter => (
              <button
                key={filter}
                onClick={() => setAppointmentFilter(filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                  appointmentFilter === filter
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button 
            onClick={() => handleExportData('Appointments')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileDown size={18} />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setActiveModal('appointment')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Time & Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Patient</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Doctor & Dept</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-800">{apt.time}</span>
                    </div>
                    <div className="text-xs text-slate-500 pl-6">{apt.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{apt.patient}</div>
                    <div className="text-sm text-slate-500">ID: #{1000 + apt.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-slate-400" />
                      <span className="text-slate-700">{apt.doctor}</span>
                    </div>
                    <div className="text-xs text-slate-500 pl-6">{apt.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {apt.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewAppointment(apt)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setActiveModal('appointment')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleStatusChange(apt.id, 'completed')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-green-600" title="Complete">
                        <CheckSquare size={16} />
                      </button>
                      <button onClick={() => handleStatusChange(apt.id, 'cancelled')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600" title="Cancel">
                        <XSquare size={16} />
                      </button>
                      <button onClick={() => handleDeleteAppointment(apt.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAppointments.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <CalendarIcon size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium">No appointments found</p>
            <p className="text-sm">Try adjusting your filters or schedule a new one.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Staff Directory</h2>
          <p className="text-slate-500">Manage doctors, nurses, and administrative staff</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => handleExportData('Staff')} className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <FileDown size={18} />
            <span>Export</span>
          </button>
          <button onClick={() => setActiveModal('staff')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={18} />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow relative group">
            <div className="p-6">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDeleteStaff(staff.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl border-4 border-white shadow-sm">
                  {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  staff.status === 'On Duty' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {staff.status}
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-800 mb-1">{staff.name}</h3>
              <p className="text-blue-600 font-medium text-sm mb-4">{staff.role} • {staff.department}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span>{staff.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span>{staff.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Users size={16} className="text-slate-400" />
                  <span>{staff.patients} Active Patients</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button onClick={() => handleViewStaff(staff)} className="flex-1 py-2 px-3 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                  View Profile
                </button>
                <button onClick={() => toast.success(`Email sent to ${staff.email}`)} className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                  <Mail size={18} />
                </button>
                <button onClick={() => toast.success(`Calling ${staff.phone}...`)} className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Card Placeholder */}
        <button 
          onClick={() => setActiveModal('staff')}
          className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all group min-h-[300px]"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <span className="font-medium">Add New Staff Member</span>
        </button>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800">₹45.2L</h3>
              <p className="text-green-600 text-xs font-medium flex items-center gap-1">
                <TrendingUp size={12} /> +12% from last month
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Pending Payments</p>
              <h3 className="text-2xl font-bold text-slate-800">₹1.8L</h3>
              <p className="text-slate-400 text-xs">From 15 invoices</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Invoices Generated</p>
              <h3 className="text-2xl font-bold text-slate-800">1,240</h3>
              <p className="text-blue-600 text-xs font-medium">+58 this week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Invoices & Billing</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            {['all', 'Paid', 'Pending', 'Overdue'].map(filter => (
              <button
                key={filter}
                onClick={() => setBillingFilter(filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                  billingFilter === filter
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button 
            onClick={() => handleExportData('Billing')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileDown size={18} />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setActiveModal('invoice')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Invoice ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Patient</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700 font-mono text-sm">{inv.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{inv.patient}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{inv.type}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewInvoice(inv)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDownload(`${inv.id}.pdf`)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600" title="Download">
                        <Download size={16} />
                      </button>
                      <button onClick={handlePrint} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-green-600" title="Print">
                        <Printer size={16} />
                      </button>
                      {inv.status === 'Pending' && (
                        <button onClick={() => handlePayInvoice(inv.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-green-600" title="Mark as Paid">
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Patient Records</h2>
           <p className="text-slate-500">View and manage patient history and details</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleExportData('Patients')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileDown size={18} />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setActiveModal('patient')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
              <Plus size={18} />
              <span>Register Patient</span>
            </button>
        </div>
      </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Patient Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Age/Gender</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Condition</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Assigned Doctor</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Room</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Admission Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{patient.name}</td>
                  <td className="px-6 py-4 text-slate-600">{patient.age} / {patient.gender}</td>
                  <td className="px-6 py-4 text-slate-600">{patient.condition}</td>
                  <td className="px-6 py-4 text-slate-600">{patient.doctor}</td>
                  <td className="px-6 py-4 text-slate-600">{patient.room}</td>
                  <td className="px-6 py-4 text-slate-600">{patient.admitted}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewPatient(patient)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => toast.info('Edit feature coming soon')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeletePatient(patient.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" onClick={() => showNotifications && setShowNotifications(false)}>
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                  <Building className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-slate-800">{user.name}</h1>
                  <p className="text-slate-500 text-sm">Hospital Management System</p>
                </div>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search patients, doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNotificationClick(); }}
                  className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell size={20} className="text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-bold">{unreadCount}</span>
                  )}
                </button>
                
                {showNotifications && (
                   <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 animate-in slide-in-from-top-2 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length > 0 ? alerts.map((alert) => (
                        <div key={alert.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                           <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                              alert.type === 'critical' ? 'bg-red-500' :
                              alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-800 font-medium">{alert.message}</p>
                              <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                            </div>
                            <button 
                              onClick={() => handleClearNotification(alert.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-all"
                            >
                              <X size={14} />
                            </button>
                           </div>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-slate-400">
                          <Bell size={48} className="mx-auto mb-2 opacity-20" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                      <button onClick={() => setShowNotifications(false)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Close</button>
                    </div>
                   </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="font-medium text-slate-800">{user.name}</p>
                  <p className="text-slate-500 text-sm capitalize">{user.role}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="text-blue-700" size={20} />
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex gap-1 border-t border-slate-200">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'staff', label: 'Staff', icon: UserPlus },
            { id: 'billing', label: 'Billing', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto pb-24">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'staff' && renderStaff()}
        {activeTab === 'billing' && renderBilling()}
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === 'patient'} onClose={() => setActiveModal(null)} title="Register New Patient">
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input required name="name" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter patient name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input required name="age" type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Age" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select name="gender" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
            <input required name="condition" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Medical condition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Doctor</label>
            <select name="doctor" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Dr. Rajesh Shah</option>
              <option>Dr. Priya Desai</option>
              <option>Dr. Amit Mehta</option>
              <option>Dr. Vikram Malhotra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
            <input required name="room" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 304-B" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register Patient</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'appointment'} onClose={() => setActiveModal(null)} title="Schedule Appointment">
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
            <input required name="patient" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter patient name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input required type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input required name="time" type="time" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
            <select name="doctor" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Dr. Rajesh Shah (Cardiology)</option>
              <option>Dr. Priya Desai (Pediatrics)</option>
              <option>Dr. Amit Mehta (Orthopedics)</option>
              <option>Dr. Vikram Malhotra (Neurology)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select name="type" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Surgery</option>
              <option>Check-up</option>
              <option>Emergency</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Schedule</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'staff'} onClose={() => setActiveModal(null)} title="Add Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input required name="name" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Dr. Name or Staff Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select name="role" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Admin</option>
                <option>Technician</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input required name="department" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Cardiology" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input required name="email" type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@hospital.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input required name="phone" type="tel" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 ..." />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Staff</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'invoice'} onClose={() => setActiveModal(null)} title="Create New Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
            <input required name="patient" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter patient name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
            <input required name="type" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Surgery, Consultation" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
            <input required name="amount" type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Generate Invoice</button>
          </div>
        </form>
      </Modal>

      {/* View Patient Modal */}
      <Modal isOpen={activeModal === 'viewPatient'} onClose={() => { setActiveModal(null); setSelectedItem(null); }} title="Patient Details">
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-3xl">
                {selectedItem.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedItem.name}</h3>
                <p className="text-slate-500">{selectedItem.age} years • {selectedItem.gender}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Patient ID</label>
                <p className="text-slate-800 font-medium">#{1000 + selectedItem.id}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Room Number</label>
                <p className="text-slate-800 font-medium">{selectedItem.room}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Condition</label>
                <p className="text-slate-800 font-medium">{selectedItem.condition}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Assigned Doctor</label>
                <p className="text-slate-800 font-medium">{selectedItem.doctor}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Admission Date</label>
                <p className="text-slate-800 font-medium">{selectedItem.admitted}</p>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Close</button>
              <button onClick={() => toast.info('Generating medical report...')} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Download Report</button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Appointment Modal */}
      <Modal isOpen={activeModal === 'viewAppointment'} onClose={() => { setActiveModal(null); setSelectedItem(null); }} title="Appointment Details">
        {selectedItem && (
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedItem.patient}</h3>
                  <p className="text-slate-500">Appointment ID: #{selectedItem.id}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-medium capitalize ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Date</label>
                <p className="text-slate-800 font-medium">{selectedItem.date}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Time</label>
                <p className="text-slate-800 font-medium">{selectedItem.time}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Doctor</label>
                <p className="text-slate-800 font-medium">{selectedItem.doctor}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Department</label>
                <p className="text-slate-800 font-medium">{selectedItem.department}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500">Type</label>
                <p className="text-slate-800 font-medium">{selectedItem.type}</p>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Close</button>
              <button onClick={() => { toast.success('Appointment confirmed'); setActiveModal(null); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirm</button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Staff Modal */}
      <Modal isOpen={activeModal === 'viewStaff'} onClose={() => { setActiveModal(null); setSelectedItem(null); }} title="Staff Profile">
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-4xl border-4 border-white shadow-lg">
                {selectedItem.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedItem.name}</h3>
                <p className="text-blue-600 font-medium text-lg">{selectedItem.role}</p>
                <p className="text-slate-500">{selectedItem.department}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  selectedItem.status === 'On Duty' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail size={20} className="text-slate-400" />
                <div>
                  <label className="text-xs font-medium text-slate-500 block">Email</label>
                  <p className="text-slate-800 font-medium">{selectedItem.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone size={20} className="text-slate-400" />
                <div>
                  <label className="text-xs font-medium text-slate-500 block">Phone</label>
                  <p className="text-slate-800 font-medium">{selectedItem.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Users size={20} className="text-slate-400" />
                <div>
                  <label className="text-xs font-medium text-slate-500 block">Active Patients</label>
                  <p className="text-slate-800 font-medium">{selectedItem.patients} patients</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Activity size={20} className="text-slate-400" />
                <div>
                  <label className="text-xs font-medium text-slate-500 block">Availability</label>
                  <p className="text-slate-800 font-medium">{selectedItem.availability}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Close</button>
              <button onClick={() => toast.success(`Sending email to ${selectedItem.email}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Mail size={18} />
                Send Email
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Invoice Modal */}
      <Modal isOpen={activeModal === 'viewInvoice'} onClose={() => { setActiveModal(null); setSelectedItem(null); }} title="Invoice Details">
        {selectedItem && (
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 font-mono">{selectedItem.id}</h3>
                  <p className="text-slate-500">Invoice for {selectedItem.patient}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Service Type</span>
                <span className="font-medium text-slate-800">{selectedItem.type}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Date</span>
                <span className="font-medium text-slate-800">{selectedItem.date}</span>
              </div>
              <div className="flex justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <span className="text-lg font-medium text-slate-700">Total Amount</span>
                <span className="text-2xl font-bold text-slate-800">₹{selectedItem.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Close</button>
              <button onClick={() => handleDownload(`${selectedItem.id}.pdf`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download size={18} />
                Download PDF
              </button>
              <button onClick={handlePrint} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
