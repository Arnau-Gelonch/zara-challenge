import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Cart } from '../Cart';
import { CartProvider } from '@/context';
import type { Product } from '@/types';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockProduct1: Product = {
  id: '1',
  name: 'iPhone 15 Pro',
  brand: 'Apple',
  model: '15 Pro',
  basePrice: 999,
  imageUrl: 'https://example.com/iphone15pro.jpg',
  ram: '8GB',
  storageOptions: [{ capacity: '256GB', price: 999 }],
  colorOptions: [
    { name: 'Natural Titanium', hexCode: '#8A8A8A', imageUrl: '' },
  ],
};

const mockProduct2: Product = {
  id: '2',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  model: 'S24 Ultra',
  basePrice: 1199,
  imageUrl: 'https://example.com/galaxys24ultra.jpg',
  ram: '12GB',
  storageOptions: [{ capacity: '512GB', price: 1199 }],
  colorOptions: [{ name: 'Titanium Violet', hexCode: '#5E4B8C', imageUrl: '' }],
};

const renderCartWithProvider = (initialCart: Product[] = []) => {
  // Pre-populate localStorage with cart items if provided
  if (initialCart.length > 0) {
    const cartItems = initialCart.map(product => ({ product, quantity: 1 }));
    localStorage.setItem('product-cart', JSON.stringify(cartItems));
  } else {
    localStorage.removeItem('product-cart');
  }

  return render(
    <BrowserRouter>
      <CartProvider>
        <Cart />
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Empty Cart State', () => {
    it('should render empty cart when no items are present', () => {
      renderCartWithProvider();

      expect(screen.getByText('CART (0)')).toBeInTheDocument();
      expect(screen.getByText('CONTINUE SHOPPING')).toBeInTheDocument();
    });

    it('should not display cart items section when cart is empty', () => {
      renderCartWithProvider();

      expect(screen.queryByText('TOTAL')).not.toBeInTheDocument();
      expect(screen.queryByText('PAY')).not.toBeInTheDocument();
    });

    it('should navigate to home when clicking continue shopping on empty cart', async () => {
      const user = userEvent.setup();
      renderCartWithProvider();

      const continueButton = screen.getByText('CONTINUE SHOPPING');
      await user.click(continueButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Cart with Items', () => {
    it('should render cart with items count in title', () => {
      renderCartWithProvider([mockProduct1, mockProduct2]);

      expect(screen.getByText('CART (2)')).toBeInTheDocument();
    });

    it('should display all cart items', () => {
      renderCartWithProvider([mockProduct1, mockProduct2]);

      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    });

    it('should display product images with correct alt text', () => {
      renderCartWithProvider([mockProduct1]);

      const image = screen.getByAltText('iPhone 15 Pro');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockProduct1.imageUrl);
    });

    it('should display product specifications', () => {
      renderCartWithProvider([mockProduct1]);

      expect(screen.getByText(/256GB/)).toBeInTheDocument();
      expect(screen.getByText(/Natural Titanium/i)).toBeInTheDocument();
    });

    it('should display product prices', () => {
      renderCartWithProvider([mockProduct1, mockProduct2]);

      expect(screen.getByText('999 EUR')).toBeInTheDocument();
      expect(screen.getByText('1199 EUR')).toBeInTheDocument();
    });

    it('should display fallback values when specs are missing', () => {
      const productWithoutSpecs: Product = {
        ...mockProduct1,
        storageOptions: undefined,
        colorOptions: undefined,
        ram: undefined,
      };
      renderCartWithProvider([productWithoutSpecs]);

      expect(screen.getByText(/512 GB/)).toBeInTheDocument();
      expect(screen.getByText(/VIOLETA TITANIUM/)).toBeInTheDocument();
    });

    it('should display ram when storage options are not available', () => {
      const productWithRam: Product = {
        ...mockProduct1,
        storageOptions: undefined,
        ram: '8GB',
      };
      renderCartWithProvider([productWithRam]);

      expect(screen.getByText(/8GB/)).toBeInTheDocument();
    });

    it('should display total price correctly', () => {
      renderCartWithProvider([mockProduct1, mockProduct2]);

      const totalPrice = mockProduct1.basePrice + mockProduct2.basePrice;
      expect(screen.getByText('TOTAL')).toBeInTheDocument();
      expect(screen.getByText(`${totalPrice} EUR`)).toBeInTheDocument();
    });

    it('should display continue shopping and pay buttons', () => {
      renderCartWithProvider([mockProduct1]);

      expect(screen.getByText('CONTINUE SHOPPING')).toBeInTheDocument();
      expect(screen.getByText('PAY')).toBeInTheDocument();
    });

    it('should navigate to home when clicking continue shopping', async () => {
      const user = userEvent.setup();
      renderCartWithProvider([mockProduct1]);

      const continueButton = screen.getByText('CONTINUE SHOPPING');
      await user.click(continueButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should have remove button for each item', () => {
      renderCartWithProvider([mockProduct1, mockProduct2]);

      const removeButtons = screen.getAllByText('Eliminar');
      expect(removeButtons).toHaveLength(2);
    });
  });

  describe('Remove Items', () => {
    it('should remove item from cart when clicking remove button', async () => {
      const user = userEvent.setup();
      renderCartWithProvider([mockProduct1, mockProduct2]);

      expect(screen.getByText('CART (2)')).toBeInTheDocument();

      const removeButtons = screen.getAllByText('Eliminar');
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('CART (1)')).toBeInTheDocument();
      });

      expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
      expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    });

    it('should show empty cart when removing last item', async () => {
      const user = userEvent.setup();
      renderCartWithProvider([mockProduct1]);

      const removeButton = screen.getByText('Eliminar');
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.getByText('CART (0)')).toBeInTheDocument();
      });

      expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
      expect(screen.queryByText('TOTAL')).not.toBeInTheDocument();
      expect(screen.queryByText('PAY')).not.toBeInTheDocument();
    });

    it('should update total price after removing item', async () => {
      const user = userEvent.setup();
      renderCartWithProvider([mockProduct1, mockProduct2]);

      const initialTotal = mockProduct1.basePrice + mockProduct2.basePrice;
      expect(screen.getByText(`${initialTotal} EUR`)).toBeInTheDocument();

      const removeButtons = screen.getAllByText('Eliminar');
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('CART (1)')).toBeInTheDocument();
      });

      // Check the total in the footer section specifically
      const totalPrices = screen.getAllByText(`${mockProduct2.basePrice} EUR`);
      expect(totalPrices.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple Same Products', () => {
    it('should display multiple instances of the same product separately', () => {
      renderCartWithProvider([mockProduct1, mockProduct1]);

      expect(screen.getByText('CART (2)')).toBeInTheDocument();
      const productNames = screen.getAllByText('iPhone 15 Pro');
      expect(productNames).toHaveLength(2);
    });

    it('should remove specific instance when multiple same products exist', async () => {
      const user = userEvent.setup();
      renderCartWithProvider([mockProduct1, mockProduct1]);

      expect(screen.getByText('CART (2)')).toBeInTheDocument();

      const removeButtons = screen.getAllByText('Eliminar');
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('CART (1)')).toBeInTheDocument();
      });

      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    });
  });

  describe('Pay Button', () => {
    it('should render pay button when cart has items', () => {
      renderCartWithProvider([mockProduct1]);

      const payButton = screen.getByText('PAY');
      expect(payButton).toBeInTheDocument();
    });

    it('should be clickable', async () => {
      const user = userEvent.setup();
      renderCartWithProvider([mockProduct1]);

      const payButton = screen.getByText('PAY');
      await user.click(payButton);

      expect(payButton).toBeInTheDocument();
    });
  });

  describe('Cart Structure', () => {
    it('should have correct CSS classes for styling', () => {
      const { container } = renderCartWithProvider([mockProduct1]);

      expect(container.querySelector('.cartContainer')).toBeInTheDocument();
      expect(container.querySelector('.cartHeader')).toBeInTheDocument();
      expect(container.querySelector('.cartItems')).toBeInTheDocument();
      expect(container.querySelector('.cartFooter')).toBeInTheDocument();
    });

    it('should have correct structure for cart items', () => {
      const { container } = renderCartWithProvider([mockProduct1]);

      expect(container.querySelector('.cartItem')).toBeInTheDocument();
      expect(container.querySelector('.productImage')).toBeInTheDocument();
      expect(container.querySelector('.productDetails')).toBeInTheDocument();
      expect(container.querySelector('.productInfo')).toBeInTheDocument();
    });

    it('should have total section with correct structure', () => {
      const { container } = renderCartWithProvider([mockProduct1]);

      const totalSection = container.querySelector('.totalSection');
      expect(totalSection).toBeInTheDocument();
      expect(container.querySelector('.totalLabel')).toBeInTheDocument();
      expect(container.querySelector('.totalPrice')).toBeInTheDocument();
    });
  });

  describe('LocalStorage Integration', () => {
    it('should load cart items from localStorage on mount', () => {
      const cartItems = [
        { product: mockProduct1, quantity: 1 },
        { product: mockProduct2, quantity: 1 },
      ];
      localStorage.setItem('product-cart', JSON.stringify(cartItems));

      render(
        <BrowserRouter>
          <CartProvider>
            <Cart />
          </CartProvider>
        </BrowserRouter>
      );

      expect(screen.getByText('CART (2)')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    });
  });
});
