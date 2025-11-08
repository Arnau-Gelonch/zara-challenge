import { axiosInstance } from '@/utils/api';
import type { Product } from '@/types';

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`/products/${id}`);
  return response.data;
};
