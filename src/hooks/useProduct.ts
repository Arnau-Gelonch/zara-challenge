import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services';

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};
