import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SimilarItems } from '../SimilarItems';
import type { SimilarProduct } from '@/types';

const mockProducts: SimilarProduct[] = [
  {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 14',
    basePrice: 899,
    imageUrl: 'https://example.com/iphone14.jpg',
  },
  {
    id: '2',
    brand: 'Apple',
    name: 'iPhone 13',
    basePrice: 799,
    imageUrl: 'https://example.com/iphone13.jpg',
  },
  {
    id: '3',
    brand: 'Samsung',
    name: 'Galaxy S23',
    basePrice: 849,
    imageUrl: 'https://example.com/galaxys23.jpg',
  },
];

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
  mockAddEventListener.mockClear();
  mockRemoveEventListener.mockClear();

  HTMLElement.prototype.addEventListener = mockAddEventListener;
  HTMLElement.prototype.removeEventListener = mockRemoveEventListener;
});

describe('SimilarItems', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render similar items title', () => {
    renderWithRouter(<SimilarItems products={mockProducts} />);

    expect(screen.getByText('SIMILAR ITEMS')).toBeInTheDocument();
  });

  it('should render all product cards', () => {
    renderWithRouter(<SimilarItems products={mockProducts} />);

    expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    expect(screen.getByText('iPhone 13')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S23')).toBeInTheDocument();
  });

  it('should render product brands', () => {
    renderWithRouter(<SimilarItems products={mockProducts} />);

    const appleElements = screen.getAllByText('Apple');
    expect(appleElements).toHaveLength(2);
    expect(screen.getByText('Samsung')).toBeInTheDocument();
  });

  it('should render product prices', () => {
    renderWithRouter(<SimilarItems products={mockProducts} />);

    expect(screen.getByText('899 EUR')).toBeInTheDocument();
    expect(screen.getByText('799 EUR')).toBeInTheDocument();
    expect(screen.getByText('849 EUR')).toBeInTheDocument();
  });

  it('should render product images', () => {
    renderWithRouter(<SimilarItems products={mockProducts} />);

    const image1 = screen.getByAltText('iPhone 14') as HTMLImageElement;
    expect(image1.src).toBe('https://example.com/iphone14.jpg');

    const image2 = screen.getByAltText('iPhone 13') as HTMLImageElement;
    expect(image2.src).toBe('https://example.com/iphone13.jpg');

    const image3 = screen.getByAltText('Galaxy S23') as HTMLImageElement;
    expect(image3.src).toBe('https://example.com/galaxys23.jpg');
  });

  it('should not render when products array is empty', () => {
    const { container } = renderWithRouter(<SimilarItems products={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('should not render when products is undefined', () => {
    const { container } = renderWithRouter(
      <SimilarItems products={undefined} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render scroll container with correct structure', () => {
    const { container } = renderWithRouter(
      <SimilarItems products={mockProducts} />
    );

    const scrollContainer = container.querySelector('.scrollContainer');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('should render card wrappers for each product', () => {
    const { container } = renderWithRouter(
      <SimilarItems products={mockProducts} />
    );

    const cardWrappers = container.querySelectorAll('.cardWrapper');
    expect(cardWrappers).toHaveLength(3);
  });

  it('should attach wheel event listener on mount', () => {
    renderWithRouter(<SimilarItems products={mockProducts} />);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'wheel',
      expect.any(Function),
      { passive: false }
    );
  });

  it('should handle single product', () => {
    const singleProduct = [mockProducts[0]];
    renderWithRouter(<SimilarItems products={singleProduct} />);

    expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 13')).not.toBeInTheDocument();
  });

  it('should render with many products', () => {
    const manyProducts: SimilarProduct[] = Array.from(
      { length: 10 },
      (_, i) => ({
        id: `${i + 1}`,
        brand: 'Brand',
        name: `Product ${i + 1}`,
        basePrice: 100 + i * 100,
        imageUrl: `https://example.com/product${i + 1}.jpg`,
      })
    );

    renderWithRouter(<SimilarItems products={manyProducts} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 10')).toBeInTheDocument();
  });

  it('should convert SimilarProduct to Product format correctly', () => {
    renderWithRouter(<SimilarItems products={mockProducts} />);

    expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    expect(screen.getByText('iPhone 13')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S23')).toBeInTheDocument();

    const appleElements = screen.getAllByText('Apple');
    expect(appleElements).toHaveLength(2);
    expect(screen.getByText('Samsung')).toBeInTheDocument();

    expect(screen.getByText('899 EUR')).toBeInTheDocument();
    expect(screen.getByText('799 EUR')).toBeInTheDocument();
    expect(screen.getByText('849 EUR')).toBeInTheDocument();
  });

  it('should have horizontal scroll container', () => {
    const { container } = renderWithRouter(
      <SimilarItems products={mockProducts} />
    );

    const scrollContainer = container.querySelector('.scrollContainer');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('scrollContainer');
  });
});
