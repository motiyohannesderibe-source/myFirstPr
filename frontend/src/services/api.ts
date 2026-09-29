import axios from 'axios';
import type {
  Product,
  Order,
  LoginRequest,
  LoginResponse,
  CreateProductRequest,
  UpdateProductRequest,
  PlaceOrderRequest,
  User
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 3000
});

export const resolveImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${window.location.protocol}//${window.location.hostname}:5000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.info('[StoreTrae] Login request succeeded:', { username: credentials.username, status: response.status });
      return response.data;
    } catch (error) {
      console.error('[StoreTrae] Login request failed:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (message) throw new Error(message);
      }
      throw new Error('Unable to sign in. Check that the API is running and try again.');
    }
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  },

  setAuthData: (token: string, user: User): void => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  }
};

export const productService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/products/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return resolveImageUrl(response.data.imageUrl);
  },
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products');
      console.info('[StoreTrae] GET /products:', { status: response.status, count: response.data?.length ?? 0 });
      return response.data;
    } catch (error) {
      console.error('[StoreTrae] GET /products failed:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (message) throw new Error(message);
      }
      throw new Error('Unable to load products.');
    }
  },

  getById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch {
      throw new Error('Unable to load product.');
    }
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch {
      throw new Error('Unable to create product.');
    }
  },

  update: async (id: number, data: UpdateProductRequest): Promise<Product> => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    } catch {
      throw new Error('Unable to update product.');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch {
      throw new Error('Unable to delete product.');
    }
  }
};

export const orderService = {
  placeOrder: async (data: PlaceOrderRequest): Promise<Order> => {
    try {
      const response = await api.post('/orders', data);
      return response.data;
    } catch {
      throw new Error('Unable to place order.');
    }
  },

  getAll: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch {
      throw new Error('Unable to load orders.');
    }
  },

  getById: async (id: number): Promise<Order> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch {
      throw new Error('Unable to load order.');
    }
  },

  getSalesReport: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    itemsSold: number;
    recentOrders: Order[];
  }> => {
    try {
      const response = await api.get('/orders/report/sales');
      return response.data;
    } catch {
      throw new Error('Unable to load sales report.');
    }
  }
};
