import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services';

interface UseProductsParams {
  search?: string;
}

export const useProducts = ({ search }: UseProductsParams = {}) => {
  return useQuery({
    queryKey: ['products', { search }],
    queryFn: () =>
      fetchProducts({
        search: search || undefined,
      }),
  });
};
