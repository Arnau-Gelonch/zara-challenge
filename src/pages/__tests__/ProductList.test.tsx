import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductList } from '../ProductList';
import { fetchProducts } from '@/services';
import type { Product } from '@/types';

jest.mock('@/services');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
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

const mockFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>;

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15',
    brand: 'Apple',
    model: '15',
    basePrice: 999,
    imageUrl: 'https://example.com/iphone15.jpg',
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

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display products after successful fetch', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    renderWithQueryClient(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });

    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('2 RESULTS')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Network error'));

    renderWithQueryClient(<ProductList />);

    await waitFor(() => {
      expect(
        screen.getByText('Error loading products. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('should display empty state when no products found', async () => {
    mockFetchProducts.mockResolvedValue({
      data: [],
      total: 0,
    });

    renderWithQueryClient(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument();
    });

    expect(screen.getByText('0 RESULTS')).toBeInTheDocument();
  });

  it('should render search input', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    renderWithQueryClient(<ProductList />);

    const searchInput = screen.getByPlaceholderText(
      'Search for a smartphone...'
    );
    expect(searchInput).toBeInTheDocument();
  });

  it('should display correct number of results', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    renderWithQueryClient(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('2 RESULTS')).toBeInTheDocument();
    });
  });

  it('should render all products in grid', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    renderWithQueryClient(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });

    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Samsung')).toBeInTheDocument();
  });
});
