
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  completedOrders: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  image: string;
}

export interface InventoryItem {
  menuItemId: string;
  quantity: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PREPARING = 'PREPARING',
  DELIVERED = 'DELIVERED'
}

export interface Order {
  id: string;
  userId: string;
  userName: string; // Denormalized for easier display on staff dash
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO String
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

// Voice Intent Types
export enum IntentType {
  ADD_TO_CART = 'ADD_TO_CART',
  NAVIGATE = 'NAVIGATE',
  CHECKout = 'CHECKOUT',
  UNKNOWN = 'UNKNOWN'
}

export interface VoiceIntent {
  type: IntentType;
  target?: string;
  quantity?: number;
}
