export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockCount: number;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  stockCount?: number;
}

export interface PlaceOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}
