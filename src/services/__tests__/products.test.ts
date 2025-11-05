// Mock the api module before importing to avoid import.meta issues
jest.mock('@/utils/api', () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    defaults: { baseURL: 'http://localhost:3000' },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

import { fetchProducts } from '../products';
import { axiosInstance } from '@/utils/api';
import type { Product } from '@/types';

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('Products Service', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15',
      brand: 'Apple',
      model: '15',
      basePrice: 999,
      imageUrl: 'https://example.com/iphone15.jpg',
      description: 'Latest iPhone',
      ram: '8GB',
      processor: 'A17',
      screen: '6.1"',
    },
    {
      id: '2',
      name: 'Galaxy S24',
      brand: 'Samsung',
      model: 'S24',
      basePrice: 899,
      imageUrl: 'https://example.com/galaxys24.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch products without parameters', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await fetchProducts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(2);
    });

    it('should fetch products with limit parameter', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await fetchProducts({ limit: 20 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products?limit=20');
      expect(result.data).toEqual(mockProducts);
    });

    it('should fetch products with search parameter', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [mockProducts[0]] });

      const result = await fetchProducts({ search: 'iPhone' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/products?search=iPhone'
      );
      expect(result.data).toEqual([mockProducts[0]]);
      expect(result.total).toBe(1);
    });

    it('should fetch products with both limit and search parameters', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await fetchProducts({ limit: 10, search: 'phone' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/products?limit=10&search=phone'
      );
      expect(result.data).toEqual(mockProducts);
    });

    it('should handle empty results', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      const result = await fetchProducts();

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(fetchProducts()).rejects.toThrow(errorMessage);
    });
  });
});
