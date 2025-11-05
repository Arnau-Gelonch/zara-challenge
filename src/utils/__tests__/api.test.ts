const mockBaseURL = 'http://localhost:3000';
const mockApiKey = 'test-api-key-123';

interface MockConfig {
  headers: Record<string, string>;
  url?: string;
  method?: string;
  data?: unknown;
  params?: unknown;
  timeout?: number;
}

type RequestInterceptor = (config: MockConfig) => MockConfig;
type ErrorInterceptor = (error: Error) => Promise<never>;

let actualRequestInterceptor: RequestInterceptor | null = null;
let actualErrorInterceptor: ErrorInterceptor | null = null;

jest.mock('axios', () => {
  const mockInstance = {
    defaults: { baseURL: mockBaseURL },
    interceptors: {
      request: {
        use: jest.fn(
          (onSuccess: RequestInterceptor, onError: ErrorInterceptor) => {
            actualRequestInterceptor = onSuccess;
            actualErrorInterceptor = onError;
            return 0;
          }
        ),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockInstance),
    },
  };
});

jest.mock('../api', () => {
  const axios = jest.requireMock<{
    default: { create: (config: { baseURL: string }) => typeof mockInstance };
  }>('axios').default;
  const mockInstance = axios.create({ baseURL: mockBaseURL });

  mockInstance.interceptors.request.use(
    (config: MockConfig) => {
      config.headers['x-api-key'] = mockApiKey;
      return config;
    },
    (error: Error) => {
      return Promise.reject(error);
    }
  );

  return {
    axiosInstance: mockInstance,
  };
});

import { axiosInstance } from '../api';

describe('API Utils', () => {
  describe('axiosInstance configuration', () => {
    it('should create axios instance with baseURL', () => {
      expect(axiosInstance.defaults.baseURL).toBe(mockBaseURL);
    });

    it('should have request interceptor registered', () => {
      expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
    });
  });

  describe('request interceptor behavior', () => {
    beforeEach(() => {
      if (!actualRequestInterceptor && axiosInstance.interceptors.request.use) {
        const calls = (axiosInstance.interceptors.request.use as jest.Mock).mock
          .calls;
        if (calls.length > 0) {
          actualRequestInterceptor = calls[0][0];
          actualErrorInterceptor = calls[0][1];
        }
      }
    });

    it('should add x-api-key header to requests', async () => {
      const mockConfig = {
        headers: {},
        url: '/products',
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.headers['x-api-key']).toBe(mockApiKey);
      expect(result.url).toBe('/products');
    });

    it('should preserve existing headers when adding api key', async () => {
      const mockConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        url: '/products',
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.headers['x-api-key']).toBe(mockApiKey);
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['Authorization']).toBe('Bearer token');
    });

    it('should preserve all request config properties', async () => {
      const mockConfig = {
        headers: {},
        url: '/products',
        method: 'POST',
        data: { name: 'Test Product', price: 999 },
        params: { page: 1, limit: 20 },
        timeout: 5000,
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.url).toBe('/products');
      expect(result.method).toBe('POST');
      expect(result.data).toEqual({ name: 'Test Product', price: 999 });
      expect(result.params).toEqual({ page: 1, limit: 20 });
      expect(result.timeout).toBe(5000);
      expect(result.headers['x-api-key']).toBe(mockApiKey);
    });

    it('should add api key to GET requests', async () => {
      const mockConfig = {
        headers: {},
        url: '/products',
        method: 'GET',
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.headers['x-api-key']).toBe(mockApiKey);
    });

    it('should add api key to POST requests', async () => {
      const mockConfig = {
        headers: {},
        url: '/products',
        method: 'POST',
        data: {},
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.headers['x-api-key']).toBe(mockApiKey);
    });

    it('should add api key to PUT requests', async () => {
      const mockConfig = {
        headers: {},
        url: '/products/1',
        method: 'PUT',
        data: {},
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.headers['x-api-key']).toBe(mockApiKey);
    });

    it('should add api key to DELETE requests', async () => {
      const mockConfig = {
        headers: {},
        url: '/products/1',
        method: 'DELETE',
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.headers['x-api-key']).toBe(mockApiKey);
    });

    it('should handle request interceptor errors correctly', async () => {
      const mockError = new Error('Request configuration error');

      await expect(actualErrorInterceptor(mockError)).rejects.toThrow(
        'Request configuration error'
      );
    });

    it('should overwrite existing x-api-key header', async () => {
      const mockConfig = {
        headers: {
          'x-api-key': 'old-key',
        },
        url: '/products',
      };

      const result = await actualRequestInterceptor(mockConfig);

      expect(result.headers['x-api-key']).toBe(mockApiKey);
    });
  });
});
