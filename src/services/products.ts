import { axiosInstance } from '@/utils/api';
import type { Product } from '@/types';

interface Params {
  limit?: number;
  offset?: number;
  search?: string;
}

interface Response {
  data: Product[];
  total: number;
}

export const fetchProducts = async (params?: Params): Promise<Response> => {
  const queryParams = new URLSearchParams();

  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  if (params?.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }

  if (params?.search) {
    queryParams.append('search', params.search);
  }

  const query = queryParams.toString();
  const response = await axiosInstance.get<Product[]>(
    `/products${query ? `?${query}` : ''}`
  );

  return {
    data: response.data,
    total: response.data.length,
  };
};
