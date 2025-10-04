// Automation type definitions

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  shippingAddress: Address;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  supplierOrderId?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  supplierId?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Cart {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  lastUpdated: Date;
  recoveryEmailSent: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  supplierPrice?: number;
  supplierId?: string;
  stock: number;
  sku?: string;
}

export interface AutomationEvent {
  type: 'order_created' | 'order_shipped' | 'inventory_low' | 'price_changed' | 'cart_abandoned';
  data: any;
  timestamp: Date;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}
