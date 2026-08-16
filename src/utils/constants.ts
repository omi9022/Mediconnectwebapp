// Shared constants and configuration

/**
 * Fallback user credentials when backend is not available
 */
export const FALLBACK_USERS: Record<string, any> = {
  customer: {
    id: 1,
    username: 'customer',
    password: 'customer123',
    name: 'Rajesh Kumar',
    email: 'rajesh@customer.com',
    phone: '+91 98765 43210',
    location: 'City Hospital, Vadodara',
    role: 'customer'
  },
  cityhospital: {
    id: 2,
    username: 'cityhospital',
    password: 'hospital123',
    name: 'City Hospital',
    email: 'admin@cityhospital.com',
    phone: '+91 99887 76655',
    location: 'Vadodara, Gujarat',
    role: 'hospital'
  },
  admin: {
    id: 3,
    username: 'admin',
    password: 'admin123',
    name: 'Admin Support',
    email: 'admin@mediconnect.com',
    phone: '+91 88776 65544',
    location: 'MediConnect HQ',
    role: 'support'
  },
  distributor: {
    id: 4,
    username: 'distributor',
    password: 'distributor123',
    name: 'MedPlus Distributors',
    email: 'sales@medplus.com',
    phone: '+91 98765 22222',
    location: 'Vadodara, Gujarat',
    role: 'distributor'
  }
};

/**
 * Theme colors for different portal types
 */
export const THEME_COLORS = {
  hospital: {
    primary: '#2A5C82',
    hover: '#234a68',
    light: '#e8f0f5',
    name: 'Medical Blue'
  },
  support: {
    primary: '#008080',
    hover: '#006666',
    light: '#e6f5f5',
    name: 'Teal Green'
  },
  customer: {
    primary: '#2563eb',
    hover: '#1d4ed8',
    light: '#eff6ff',
    name: 'Blue'
  },
  distributor: {
    primary: '#7c3aed',
    hover: '#6d28d9',
    light: '#f5f3ff',
    name: 'Purple'
  }
};

/**
 * Status badge color mappings
 */
export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  urgent: 'bg-red-100 text-red-700',
  critical: 'bg-red-100 text-red-700',
  stable: 'bg-green-100 text-green-700',
  recovering: 'bg-blue-100 text-blue-700',
  'post-op': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  'in-stock': 'bg-green-100 text-green-700',
  'low-stock': 'bg-yellow-100 text-yellow-700',
  'out-of-stock': 'bg-red-100 text-red-700'
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  return STATUS_COLORS[normalizedStatus] || 'bg-gray-100 text-gray-700';
};
