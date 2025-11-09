import { render, screen, fireEvent } from '@testing-library/react';
import { ProductInfo } from '../ProductInfo';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15 Pro',
  brand: 'Apple',
  basePrice: 999,
  imageUrl: 'https://example.com/iphone.jpg',
  storageOptions: [
    { capacity: '128GB', price: 999 },
    { capacity: '256GB', price: 1099 },
    { capacity: '512GB', price: 1299 },
  ],
  colorOptions: [
    {
      name: 'Black',
      hexCode: '#000000',
      imageUrl: 'https://example.com/black.jpg',
    },
    {
      name: 'White',
      hexCode: '#FFFFFF',
      imageUrl: 'https://example.com/white.jpg',
    },
    {
      name: 'Blue',
      hexCode: '#0000FF',
      imageUrl: 'https://example.com/blue.jpg',
    },
  ],
};

describe('ProductInfo', () => {
  const mockOnStorageChange = jest.fn();
  const mockOnColorChange = jest.fn();
  const mockOnAddToCart = jest.fn();
  const mockGetPrice = jest.fn(() => 999);

  beforeEach(() => {
    mockOnStorageChange.mockClear();
    mockOnColorChange.mockClear();
    mockOnAddToCart.mockClear();
    mockGetPrice.mockClear();
  });

  it('should render product information correctly', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={null}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText(/From/)).toBeInTheDocument();
    expect(screen.getByText(/999/)).toBeInTheDocument();
  });

  it('should render storage options', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={null}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    expect(screen.getByText('128GB')).toBeInTheDocument();
    expect(screen.getByText('256GB')).toBeInTheDocument();
    expect(screen.getByText('512GB')).toBeInTheDocument();
  });

  it('should call onStorageChange when storage is selected', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={null}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const storageButton = screen.getByText('256GB');
    fireEvent.click(storageButton);

    expect(mockOnStorageChange).toHaveBeenCalledWith('256GB');
  });

  it('should render color options', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={null}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const colorButtons = screen.getAllByRole('button', {
      name: /Black|White|Blue/,
    });
    expect(colorButtons).toHaveLength(3);
  });

  it('should call onColorChange when color is selected', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={null}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const colorButton = screen.getByRole('button', { name: 'White' });
    fireEvent.click(colorButton);

    expect(mockOnColorChange).toHaveBeenCalledWith(1);
  });

  it('should show color name on hover', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={0}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const colorButton = screen.getByRole('button', { name: 'Blue' });
    fireEvent.mouseEnter(colorButton);

    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('should have inactive add button when storage or color not selected', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={null}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const addButton = screen.getByText('AÑADIR');
    expect(addButton).not.toHaveClass('addButtonActive');
  });

  it('should have active add button when both storage and color selected', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage="128GB"
        selectedColor={0}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const addButton = screen.getByText('AÑADIR');
    expect(addButton).toHaveClass('addButtonActive');
  });

  it('should call onAddToCart when add button is clicked', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage="128GB"
        selectedColor={0}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const addButton = screen.getByText('AÑADIR');
    fireEvent.click(addButton);

    expect(mockOnAddToCart).toHaveBeenCalled();
  });

  it('should display product image', () => {
    render(
      <ProductInfo
        product={mockProduct}
        currentImage="https://example.com/iphone.jpg"
        selectedStorage=""
        selectedColor={null}
        onStorageChange={mockOnStorageChange}
        onColorChange={mockOnColorChange}
        onAddToCart={mockOnAddToCart}
        getPrice={mockGetPrice}
      />
    );

    const image = screen.getByAltText('iPhone 15 Pro') as HTMLImageElement;
    expect(image.src).toBe('https://example.com/iphone.jpg');
  });
});
