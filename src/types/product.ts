export interface Product {
  id: string;
  name: string;
  brand: string;
  model?: string;
  basePrice: number;
  imageUrl: string;
  description?: string;
  ram?: string;
  processor?: string;
  screen?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
