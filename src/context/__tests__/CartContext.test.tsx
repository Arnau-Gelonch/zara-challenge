import { render, screen, act } from '@testing-library/react';
import { CartProvider } from '../CartContext';
import { useCart } from '../useCart';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15',
  brand: 'Apple',
  model: '15',
  basePrice: 999,
  imageUrl: 'https://example.com/iphone15.jpg',
};

const mockProduct2: Product = {
  id: '2',
  name: 'Galaxy S24',
  brand: 'Samsung',
  model: 'S24',
  basePrice: 899,
  imageUrl: 'https://example.com/galaxys24.jpg',
};

// Helper component para testar el hook
const TestComponent = () => {
  const cart = useCart();
  return (
    <div>
      <div data-testid="items-count">{cart.items.length}</div>
      <div data-testid="total-items">{cart.getTotalItems()}</div>
      <div data-testid="total-price">{cart.getTotalPrice()}</div>
      <button onClick={() => cart.addToCart(mockProduct)}>Add Product 1</button>
      <button onClick={() => cart.addToCart(mockProduct2)}>
        Add Product 2
      </button>
      <button onClick={() => cart.removeFromCart('1')}>Remove Product 1</button>
      <button onClick={() => cart.updateQuantity('1', 5)}>
        Update Quantity
      </button>
      <button onClick={() => cart.clearCart()}>Clear Cart</button>
      {cart.items.map(item => (
        <div key={item.product.id} data-testid={`item-${item.product.id}`}>
          {item.product.name} - Quantity: {item.quantity}
        </div>
      ))}
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('useCart hook', () => {
    it('should throw error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('CartProvider', () => {
    it('should render children correctly', () => {
      render(
        <CartProvider>
          <div>Test Content</div>
        </CartProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should initialize with empty cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    });

    it('should add product to cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('999');
      expect(screen.getByTestId('item-1')).toHaveTextContent(
        'iPhone 15 - Quantity: 1'
      );
    });

    it('should add same product as separate cart items', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
        screen.getByText('Add Product 1').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('1998');
    });

    it('should add multiple different products', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
        screen.getByText('Add Product 2').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('1898');
    });

    it('should remove product from cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
        screen.getByText('Add Product 2').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('2');

      act(() => {
        screen.getByText('Remove Product 1').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('899');
      expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    });

    it('should update product quantity', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
      });

      act(() => {
        screen.getByText('Update Quantity').click();
      });

      expect(screen.getByTestId('total-items')).toHaveTextContent('5');
      expect(screen.getByTestId('total-price')).toHaveTextContent('4995');
      expect(screen.getByTestId('item-1')).toHaveTextContent(
        'iPhone 15 - Quantity: 5'
      );
    });

    it('should remove product when quantity is set to 0 or less', () => {
      const UpdateToZeroComponent = () => {
        const cart = useCart();
        return (
          <>
            <button onClick={() => cart.addToCart(mockProduct)}>
              Add Product 1
            </button>
            <button onClick={() => cart.updateQuantity('1', 0)}>
              Set to Zero
            </button>
            <div data-testid="items-count-zero">{cart.items.length}</div>
          </>
        );
      };

      render(
        <CartProvider>
          <UpdateToZeroComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
      });

      expect(screen.getByTestId('items-count-zero')).toHaveTextContent('1');

      act(() => {
        screen.getByText('Set to Zero').click();
      });

      expect(screen.getByTestId('items-count-zero')).toHaveTextContent('0');
    });

    it('should clear entire cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
        screen.getByText('Add Product 2').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('2');

      act(() => {
        screen.getByText('Clear Cart').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    });

    it('should persist cart to localStorage', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
      });

      const savedCart = localStorage.getItem('product-cart');
      expect(savedCart).toBeTruthy();

      const parsedCart = JSON.parse(savedCart!);
      expect(parsedCart).toHaveLength(1);
      expect(parsedCart[0].product.id).toBe('1');
      expect(parsedCart[0].quantity).toBe(1);
    });

    it('should load cart from localStorage on mount', () => {
      const initialCart = [
        { product: mockProduct, quantity: 2 },
        { product: mockProduct2, quantity: 1 },
      ];
      localStorage.setItem('product-cart', JSON.stringify(initialCart));

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-items')).toHaveTextContent('3');
      expect(screen.getByTestId('total-price')).toHaveTextContent('2897');
    });

    it('should calculate total price correctly with multiple products', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByText('Add Product 1').click();
        screen.getByText('Add Product 1').click();
        screen.getByText('Add Product 2').click();
      });

      // 2 * 999 + 1 * 899 = 2897
      expect(screen.getByTestId('total-price')).toHaveTextContent('2897');
    });
  });
});
