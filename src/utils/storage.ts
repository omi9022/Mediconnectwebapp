// Shared localStorage utility functions

/**
 * Get custom users from localStorage
 */
export const getCustomUsers = () => {
  try {
    const data = localStorage.getItem('customUsers');
    return data ? JSON.parse(data) : { hospital: [], customer: [], distributor: [] };
  } catch (error) {
    console.error('Error reading custom users:', error);
    return { hospital: [], customer: [], distributor: [] };
  }
};

/**
 * Save custom users to localStorage
 */
export const saveCustomUsers = (users: any) => {
  try {
    localStorage.setItem('customUsers', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving custom users:', error);
  }
};

/**
 * Get user session from localStorage
 */
export const getUserSession = () => {
  try {
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    return user && userType ? { user: JSON.parse(user), userType } : null;
  } catch (error) {
    console.error('Error reading user session:', error);
    return null;
  }
};

/**
 * Save user session to localStorage
 */
export const saveUserSession = (user: any, userType: string) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);
  } catch (error) {
    console.error('Error saving user session:', error);
  }
};

/**
 * Clear user session from localStorage
 */
export const clearUserSession = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

/**
 * Get customer orders from localStorage
 */
export const getCustomerOrders = () => {
  try {
    const orders = localStorage.getItem('customerOrders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error reading customer orders:', error);
    return [];
  }
};

/**
 * Save customer orders to localStorage
 */
export const saveCustomerOrders = (orders: any[]) => {
  try {
    localStorage.setItem('customerOrders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving customer orders:', error);
  }
};

/**
 * Get distributor products from localStorage
 */
export const getDistributorProducts = () => {
  try {
    const products = localStorage.getItem('distributorProducts');
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error reading distributor products:', error);
    return [];
  }
};

/**
 * Save distributor products to localStorage
 */
export const saveDistributorProducts = (products: any[]) => {
  try {
    localStorage.setItem('distributorProducts', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving distributor products:', error);
  }
};
