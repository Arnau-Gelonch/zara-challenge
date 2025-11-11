import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductDetail } from '../ProductDetail';
import { fetchProductById } from '@/services';
import { CartProvider } from '@/context';
import type { Product } from '@/types';

jest.mock('@/services');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
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

const mockFetchProductById = fetchProductById as jest.MockedFunction<
  typeof fetchProductById
>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const mockNavigate = jest.fn();

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

const renderWithRouter = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>{component}</CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  it('should show loader while fetching product', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockImplementation(() => new Promise(() => {}));

    const { container } = renderWithRouter(<ProductDetail />);

    const loader = container.querySelector('.loader');
    expect(loader).toBeInTheDocument();
  });

  it('should display product after successful fetch', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    const appleElements = screen.getAllByText('Apple');
    expect(appleElements.length).toBeGreaterThan(0);
    expect(
      screen.getByText('The most advanced iPhone ever')
    ).toBeInTheDocument();
  });

  it('should display error when fetch fails', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByText('Error loading product details. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('should display error when product ID is not found', async () => {
    mockUseParams.mockReturnValue({ id: '' });
    mockFetchProductById.mockRejectedValue(new Error('Not found'));

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByText('Error loading product details. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('should render back button', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('BACK')).toBeInTheDocument();
    });

    const backButton = screen.getByText('BACK').closest('button');
    expect(backButton).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('BACK')).toBeInTheDocument();
    });

    const backButton = screen.getByText('BACK').closest('button');
    fireEvent.click(backButton!);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should render ProductInfo component with product data', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    // Check storage options
    expect(screen.getByText('128GB')).toBeInTheDocument();
    expect(screen.getByText('256GB')).toBeInTheDocument();
    expect(screen.getByText('512GB')).toBeInTheDocument();

    // Check color options (colors are identified by aria-label)
    expect(screen.getByLabelText('Natural Titanium')).toBeInTheDocument();
    expect(screen.getByLabelText('Blue Titanium')).toBeInTheDocument();
  });

  it('should render ProductSpecifications when specs exist', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('Specifications')).toBeInTheDocument();
    });

    expect(screen.getByText('6.7"')).toBeInTheDocument();
    expect(screen.getByText('A17 Pro')).toBeInTheDocument();
  });

  it('should not render ProductSpecifications when specs do not exist', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    const productWithoutSpecs = { ...mockProduct, specs: undefined };
    mockFetchProductById.mockResolvedValue(productWithoutSpecs);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    expect(screen.queryByText('Specifications')).not.toBeInTheDocument();
  });

  it('should render SimilarItems when similar products exist', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('SIMILAR ITEMS')).toBeInTheDocument();
    });

    expect(screen.getByText('iPhone 14 Pro')).toBeInTheDocument();
  });

  it('should not render SimilarItems when no similar products', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    const productWithoutSimilar = { ...mockProduct, similarProducts: [] };
    mockFetchProductById.mockResolvedValue(productWithoutSimilar);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    expect(screen.queryByText('SIMILAR ITEMS')).not.toBeInTheDocument();
  });

  it('should set initial image from first color option', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    const image = (await screen.findByAltText(
      'iPhone 15 Pro Max'
    )) as HTMLImageElement;
    expect(image.src).toBe('https://example.com/natural.jpg');
  });

  it('should set initial image to baseImage when no color options', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    const productWithoutColors = { ...mockProduct, colorOptions: undefined };
    mockFetchProductById.mockResolvedValue(productWithoutColors);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    const image = (await screen.findByAltText(
      'iPhone 15 Pro Max'
    )) as HTMLImageElement;
    expect(image.src).toBe('https://example.com/iphone15pro.jpg');
  });

  it('should change image when selecting different color', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    // Wait for the initial image to render
    await screen.findByAltText('iPhone 15 Pro Max');

    const blueColor = screen.getByLabelText('Blue Titanium');
    fireEvent.click(blueColor!);

    await waitFor(
      async () => {
        const image = (await screen.findByAltText(
          'iPhone 15 Pro Max'
        )) as HTMLImageElement;
        expect(image.src).toBe('https://example.com/blue.jpg');
      },
      { timeout: 1000 }
    );
  });

  it('should update price when selecting different storage', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('1199', { exact: false })).toBeInTheDocument();

    const storage512 = screen.getByText('512GB').closest('button');
    fireEvent.click(storage512!);

    await waitFor(() => {
      expect(screen.getByText('1499', { exact: false })).toBeInTheDocument();
    });
  });

  it('should start with no storage or color selected', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    const { container } = renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    const addButton = container.querySelector('button[class*="addButton"]');
    expect(addButton).not.toHaveClass('addButtonActive');
  });

  it('should enable add button when storage and color are selected', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    const { container } = renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'iPhone 15 Pro Max' })
      ).toBeInTheDocument();
    });

    const storage256 = screen.getByText('256GB').closest('button');
    fireEvent.click(storage256!);

    const naturalColor = screen.getByLabelText('Natural Titanium');
    fireEvent.click(naturalColor!);

    await waitFor(() => {
      const addButton = container.querySelector(
        'button[class*="addButtonActive"]'
      );
      expect(addButton).toBeInTheDocument();
    });
  });

  it('should fetch product data with correct ID', async () => {
    mockUseParams.mockReturnValue({ id: '123' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(mockFetchProductById).toHaveBeenCalledWith('123');
    });
  });

  it('should refetch product when ID changes', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CartProvider>
            <ProductDetail />
          </CartProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockFetchProductById).toHaveBeenCalledWith('1');
    });

    mockUseParams.mockReturnValue({ id: '2' });
    mockFetchProductById.mockResolvedValue({
      ...mockProduct,
      id: '2',
      name: 'Different Product',
    });

    rerender(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CartProvider>
            <ProductDetail />
          </CartProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockFetchProductById).toHaveBeenCalledWith('2');
    });
  });

  it('should display brand, name, and description in specifications', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetchProductById.mockResolvedValue(mockProduct);

    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('Specifications')).toBeInTheDocument();
    });

    const brandLabel = screen.getByText('Brand');
    expect(brandLabel).toBeInTheDocument();
    expect(brandLabel.nextElementSibling).toHaveTextContent('Apple');

    const nameLabel = screen.getByText('Name');
    expect(nameLabel).toBeInTheDocument();
    expect(nameLabel.nextElementSibling).toHaveTextContent('iPhone 15 Pro Max');

    const descLabel = screen.getByText('Description');
    expect(descLabel).toBeInTheDocument();
    expect(descLabel.nextElementSibling).toHaveTextContent(
      'The most advanced iPhone ever'
    );
  });
});
