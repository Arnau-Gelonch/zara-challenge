import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('should show loader while fetching products', async () => {
    mockFetchProducts.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to keep loading state
        })
    );

    const { container } = render(<ProductList />);

    const loader = container.querySelector('.loader');
    expect(loader).toBeInTheDocument();
  });

  it('should display products after successful fetch', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });

    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('2 RESULTS')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Network error'));

    render(<ProductList />);

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

    render(<ProductList />);

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

    render(<ProductList />);

    const searchInput = screen.getByPlaceholderText(
      'Search for a smartphone...'
    );
    expect(searchInput).toBeInTheDocument();
  });

  it('should fetch products with search term', async () => {
    const user = userEvent.setup();
    mockFetchProducts.mockResolvedValue({
      data: [mockProducts[0]],
      total: 1,
    });

    render(<ProductList />);

    const searchInput = screen.getByPlaceholderText(
      'Search for a smartphone...'
    );

    await act(async () => {
      await user.type(searchInput, 'iPhone');
    });

    await waitFor(
      () => {
        expect(mockFetchProducts).toHaveBeenCalledWith({
          limit: 20,
          search: 'iPhone',
        });
      },
      { timeout: 500 }
    );
  });

  it('should debounce search input', async () => {
    const user = userEvent.setup();
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    render(<ProductList />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalled();
    });

    const initialCallCount = mockFetchProducts.mock.calls.length;

    const searchInput = screen.getByPlaceholderText(
      'Search for a smartphone...'
    );

    // Type quickly without waiting
    await user.type(searchInput, 'abc');

    // Wait for debounce (300ms)
    await waitFor(
      () => {
        expect(mockFetchProducts).toHaveBeenCalledWith({
          limit: 20,
          search: 'abc',
        });
      },
      { timeout: 500 }
    );

    // Should have been called once initially and once after debounce
    expect(mockFetchProducts.mock.calls.length).toBeGreaterThan(
      initialCallCount
    );
  });

  it('should display correct number of results', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('2 RESULTS')).toBeInTheDocument();
    });
  });

  it('should render all products in grid', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });

    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Samsung')).toBeInTheDocument();
  });

  it('should fetch products with limit of 20', async () => {
    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalledWith({
        limit: 20,
        search: undefined,
      });
    });
  });

  it('should clear search and fetch all products', async () => {
    const user = userEvent.setup();
    mockFetchProducts.mockResolvedValue({
      data: [mockProducts[0]],
      total: 1,
    });

    render(<ProductList />);

    const searchInput = screen.getByPlaceholderText(
      'Search for a smartphone...'
    );

    // Type search term
    await act(async () => {
      await user.type(searchInput, 'iPhone');
    });

    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalledWith({
        limit: 20,
        search: 'iPhone',
      });
    });

    mockFetchProducts.mockResolvedValue({
      data: mockProducts,
      total: 2,
    });

    // Clear search
    const clearButton = await screen.findByLabelText('Clear search');
    await act(async () => {
      await user.click(clearButton);
    });

    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalledWith({
        limit: 20,
        search: undefined,
      });
    });
  });
});
