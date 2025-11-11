import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from '../ProductCard';
import type { Product } from '@/types';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15',
  brand: 'Apple',
  model: '15',
  basePrice: 999,
  imageUrl: 'https://example.com/iphone15.jpg',
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ProductCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
    expect(screen.getByAltText('iPhone 15')).toBeInTheDocument();
  });

  it('should render product image with correct src', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('iPhone 15') as HTMLImageElement;
    expect(image.src).toBe('https://example.com/iphone15.jpg');
  });

  it('should navigate to product detail on click', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const card = screen.getByText('iPhone 15').closest('div');
    card?.click();

    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = renderWithProviders(
      <ProductCard product={mockProduct} style={customStyle} />
    );

    const card = container.querySelector('.productCard');
    expect(card).toHaveAttribute(
      'style',
      expect.stringContaining('background-color')
    );
  });
});
