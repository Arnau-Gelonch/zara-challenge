import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../ProductCard';
import type { Product } from '@/types';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15',
  brand: 'Apple',
  model: '15',
  basePrice: 999,
  imageUrl: 'https://example.com/iphone15.jpg',
};

describe('ProductCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render product information correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
    expect(screen.getByAltText('iPhone 15')).toBeInTheDocument();
  });

  it('should render product image with correct src', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    const image = screen.getByAltText('iPhone 15') as HTMLImageElement;
    expect(image.src).toBe('https://example.com/iphone15.jpg');
  });

  it('should navigate to product detail on click', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    const card = screen.getByText('iPhone 15').closest('div');
    card?.click();

    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <BrowserRouter>
        <ProductCard product={mockProduct} style={customStyle} />
      </BrowserRouter>
    );

    const card = container.querySelector('.productCard');
    expect(card).toHaveAttribute(
      'style',
      expect.stringContaining('background-color')
    );
  });
});
