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
  rating?: number;
  specs?: ProductSpecs;
  colorOptions?: ColorOption[];
  storageOptions?: StorageOption[];
  similarProducts?: SimilarProduct[];
}

export interface ProductSpecs {
  screen?: string;
  resolution?: string;
  processor?: string;
  mainCamera?: string;
  selfieCamera?: string;
  battery?: string;
  os?: string;
  screenRefreshRate?: string;
}

export interface ColorOption {
  name: string;
  hexCode: string;
  imageUrl: string;
}

export interface StorageOption {
  capacity: string;
  price: number;
}

export interface SimilarProduct {
  id: string;
  brand: string;
  name: string;
  basePrice: number;
  imageUrl: string;
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
