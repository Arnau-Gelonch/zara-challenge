import { fetchProductById } from '../product';
import { axiosInstance } from '@/utils/api';
import type { Product } from '@/types';

jest.mock('@/utils/api', () => ({
  axiosInstance: {
    get: jest.fn(),
    defaults: { baseURL: 'http://localhost:3000' },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

const mockAxiosGet = axiosInstance.get as jest.MockedFunction<
  typeof axiosInstance.get
>;

const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15 Pro Max',
  brand: 'Apple',
  model: '15 Pro Max',
  basePrice: 1199,
  imageUrl: 'https://example.com/iphone15pro.jpg',
  description: 'The most advanced iPhone ever',
  storageOptions: [
    { capacity: '128GB', price: 1199 },
    { capacity: '256GB', price: 1299 },
    { capacity: '512GB', price: 1499 },
  ],
  colorOptions: [
    {
      name: 'Natural Titanium',
      hexCode: '#E5E3DF',
      imageUrl: 'https://example.com/natural.jpg',
    },
    {
      name: 'Blue Titanium',
      hexCode: '#2E3842',
      imageUrl: 'https://example.com/blue.jpg',
    },
  ],
  specs: {
    screen: '6.7"',
    resolution: '2796 x 1290',
    processor: 'A17 Pro',
    mainCamera: '48 MP',
    selfieCamera: '12 MP',
    battery: '4422 mAh',
    os: 'iOS 17',
    screenRefreshRate: '120 Hz',
  },
  similarProducts: [
    {
      id: '2',
      brand: 'Apple',
      name: 'iPhone 14 Pro',
      basePrice: 999,
      imageUrl: 'https://example.com/iphone14pro.jpg',
    },
  ],
};

describe('fetchProductById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch product by ID successfully', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    const result = await fetchProductById('1');

    expect(result).toEqual(mockProduct);
    expect(mockAxiosGet).toHaveBeenCalledWith('/products/1');
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
  });

  it('should call API with correct endpoint', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    await fetchProductById('123');

    expect(mockAxiosGet).toHaveBeenCalledWith('/products/123');
  });

  it('should return product data from response', async () => {
    const expectedProduct: Product = {
      id: '5',
      name: 'Galaxy S24',
      brand: 'Samsung',
      model: 'S24',
      basePrice: 899,
      imageUrl: 'https://example.com/galaxys24.jpg',
    };

    mockAxiosGet.mockResolvedValue({ data: expectedProduct });

    const result = await fetchProductById('5');

    expect(result).toEqual(expectedProduct);
    expect(result.id).toBe('5');
    expect(result.name).toBe('Galaxy S24');
    expect(result.brand).toBe('Samsung');
  });

  it('should throw error when API call fails', async () => {
    const errorMessage = 'Network error';
    mockAxiosGet.mockRejectedValue(new Error(errorMessage));

    await expect(fetchProductById('1')).rejects.toThrow(errorMessage);
    expect(mockAxiosGet).toHaveBeenCalledWith('/products/1');
  });

  it('should throw error when product not found (404)', async () => {
    const error = {
      response: {
        status: 404,
        data: { message: 'Product not found' },
      },
    };
    mockAxiosGet.mockRejectedValue(error);

    await expect(fetchProductById('999')).rejects.toEqual(error);
    expect(mockAxiosGet).toHaveBeenCalledWith('/products/999');
  });

  it('should handle product with all optional fields', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    const result = await fetchProductById('1');

    expect(result.storageOptions).toBeDefined();
    expect(result.colorOptions).toBeDefined();
    expect(result.specs).toBeDefined();
    expect(result.similarProducts).toBeDefined();
    expect(result.description).toBeDefined();
  });

  it('should handle product with minimal fields', async () => {
    const minimalProduct: Product = {
      id: '10',
      name: 'Basic Phone',
      brand: 'Generic',
      model: 'Basic',
      basePrice: 199,
      imageUrl: 'https://example.com/basic.jpg',
    };

    mockAxiosGet.mockResolvedValue({ data: minimalProduct });

    const result = await fetchProductById('10');

    expect(result).toEqual(minimalProduct);
    expect(result.storageOptions).toBeUndefined();
    expect(result.colorOptions).toBeUndefined();
    expect(result.specs).toBeUndefined();
  });

  it('should handle different product IDs', async () => {
    const products = [
      { ...mockProduct, id: 'abc-123' },
      { ...mockProduct, id: '999' },
      { ...mockProduct, id: 'product-xyz' },
    ];

    for (const product of products) {
      mockAxiosGet.mockResolvedValue({ data: product });
      const result = await fetchProductById(product.id);
      expect(result.id).toBe(product.id);
      expect(mockAxiosGet).toHaveBeenCalledWith(`/products/${product.id}`);
    }
  });

  it('should handle API timeout error', async () => {
    const timeoutError = new Error('timeout of 5000ms exceeded');
    mockAxiosGet.mockRejectedValue(timeoutError);

    await expect(fetchProductById('1')).rejects.toThrow(
      'timeout of 5000ms exceeded'
    );
  });

  it('should handle server error (500)', async () => {
    const serverError = {
      response: {
        status: 500,
        data: { message: 'Internal server error' },
      },
    };
    mockAxiosGet.mockRejectedValue(serverError);

    await expect(fetchProductById('1')).rejects.toEqual(serverError);
  });

  it('should return product with storage options correctly', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    const result = await fetchProductById('1');

    expect(result.storageOptions).toHaveLength(3);
    expect(result.storageOptions?.[0].capacity).toBe('128GB');
    expect(result.storageOptions?.[0].price).toBe(1199);
    expect(result.storageOptions?.[2].capacity).toBe('512GB');
    expect(result.storageOptions?.[2].price).toBe(1499);
  });

  it('should return product with color options correctly', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    const result = await fetchProductById('1');

    expect(result.colorOptions).toHaveLength(2);
    expect(result.colorOptions?.[0].name).toBe('Natural Titanium');
    expect(result.colorOptions?.[0].hexCode).toBe('#E5E3DF');
    expect(result.colorOptions?.[1].name).toBe('Blue Titanium');
  });

  it('should return product with specifications correctly', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    const result = await fetchProductById('1');

    expect(result.specs?.screen).toBe('6.7"');
    expect(result.specs?.processor).toBe('A17 Pro');
    expect(result.specs?.battery).toBe('4422 mAh');
    expect(result.specs?.os).toBe('iOS 17');
  });

  it('should return product with similar products correctly', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    const result = await fetchProductById('1');

    expect(result.similarProducts).toHaveLength(1);
    expect(result.similarProducts?.[0].id).toBe('2');
    expect(result.similarProducts?.[0].name).toBe('iPhone 14 Pro');
    expect(result.similarProducts?.[0].basePrice).toBe(999);
  });

  it('should handle empty string ID', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    await fetchProductById('');

    expect(mockAxiosGet).toHaveBeenCalledWith('/products/');
  });

  it('should preserve all product data fields', async () => {
    mockAxiosGet.mockResolvedValue({ data: mockProduct });

    const result = await fetchProductById('1');

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('brand');
    expect(result).toHaveProperty('model');
    expect(result).toHaveProperty('basePrice');
    expect(result).toHaveProperty('imageUrl');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('storageOptions');
    expect(result).toHaveProperty('colorOptions');
    expect(result).toHaveProperty('specs');
    expect(result).toHaveProperty('similarProducts');
  });
});
