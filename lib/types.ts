export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  features?: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  shippingAddress: Address;
}
