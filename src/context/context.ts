import { createContext } from 'react';
import type { Product, CartItem } from '@/types';

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string, index?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
