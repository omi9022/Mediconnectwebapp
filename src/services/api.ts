/**
 * API Service - Frontend to Backend Communication
 * Complete integration with Python FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000/api';

// Fallback mode when backend is not available
let USE_FALLBACK = false;

// ==================== TYPES ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  stock: number;
  critical: boolean;
  rating: number;
  marketPrice: number;
  price: number;
  savings: number;
  supplier: string;
  location: string;
  description?: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  status: string;
  amount: number;
  date: string;
  driver?: string;
  vehicle?: string;
  eta?: string;
  deliveryLocation: string;
}

export interface PaymentRequest {
  orderId: string;
  method: string;
  amount: number;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cardName?: string;
}

export interface ProductEntry {
  name: string;
  brand: string;
  category: string;
  stock: number;
  marketPrice: number;
  price: number;
  supplier: string;
  location: string;
  description?: string;
}

export interface SalesEntry {
  productId: number;
  quantity: number;
  customerId: number;
  salePrice: number;
  date: string;
}

// ==================== API FUNCTIONS ====================

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ==================== AUTH ====================

  async login(username: string, password: string): Promise<{ success: boolean; user: User; token: string }> {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ==================== PRODUCTS ====================

  async getProducts(category?: string, search?: string): Promise<{ success: boolean; products: Product[]; count: number }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const queryString = params.toString();
    return this.request<any>(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: number): Promise<{ success: boolean; product: Product }> {
    return this.request<any>(`/products/${id}`);
  }

  async addProduct(product: ProductEntry): Promise<{ success: boolean; message: string; product: Product }> {
    return this.request<any>('/products/add', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, product: ProductEntry): Promise<{ success: boolean; message: string; product: Product }> {
    return this.request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<any>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ORDERS ====================

  async getOrders(userId?: number, status?: string): Promise<{ success: boolean; orders: Order[]; count: number }> {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId.toString());
    if (status) params.append('status', status);

    const queryString = params.toString();
    return this.request<any>(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(id: string): Promise<{ success: boolean; order: Order }> {
    return this.request<any>(`/orders/${id}`);
  }

  async placeOrder(order: {
    userId: number;
    items: CartItem[];
    deliveryLocation: string;
  }): Promise<{ success: boolean; message: string; order: Order }> {
    return this.request<any>('/orders/place', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; message: string; order: Order }> {
    return this.request<any>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== PAYMENT ====================

  async processPayment(payment: PaymentRequest): Promise<{ success: boolean; message: string; transactionId: string; order: Order }> {
    return this.request<any>('/payment/process', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  // ==================== ANALYTICS ====================

  async getAnalytics(userId?: number): Promise<{ success: boolean; analytics: any }> {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId.toString());

    const queryString = params.toString();
    return this.request<any>(`/analytics${queryString ? `?${queryString}` : ''}`);
  }

  // ==================== SALES ====================

  async getSales(): Promise<{ success: boolean; sales: any[]; count: number }> {
    return this.request<any>('/sales');
  }

  async addSale(sale: SalesEntry): Promise<{ success: boolean; message: string; sale: any }> {
    return this.request<any>('/sales/add', {
      method: 'POST',
      body: JSON.stringify(sale),
    });
  }

  // ==================== EXPORT ====================

  async exportProducts(): Promise<{ success: boolean; filename: string; data: string; count: number }> {
    return this.request<any>('/export/products');
  }

  async exportOrders(): Promise<{ success: boolean; filename: string; data: string; count: number }> {
    return this.request<any>('/export/orders');
  }

  async exportSales(): Promise<{ success: boolean; filename: string; data: string; count: number }> {
    return this.request<any>('/export/sales');
  }

  // ==================== STATS ====================

  async getStats(userId?: number): Promise<{ success: boolean; stats: any }> {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId.toString());

    const queryString = params.toString();
    return this.request<any>(`/stats${queryString ? `?${queryString}` : ''}`);
  }

  // ==================== DOWNLOAD HELPERS ====================

  downloadCSV(filename: string, data: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async downloadProducts() {
    const response = await this.exportProducts();
    if (response.success) {
      this.downloadCSV(response.filename, response.data);
    }
  }

  async downloadOrders() {
    const response = await this.exportOrders();
    if (response.success) {
      this.downloadCSV(response.filename, response.data);
    }
  }

  async downloadSales() {
    const response = await this.exportSales();
    if (response.success) {
      this.downloadCSV(response.filename, response.data);
    }
  }
}

// Export singleton instance
export const api = new ApiService(API_BASE_URL);
export default api;