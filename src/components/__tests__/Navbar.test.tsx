import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { CartProvider } from '@/context';

describe('Navbar', () => {
  it('should render logo link to home', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </BrowserRouter>
    );

    const links = screen.getAllByRole('link');
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    expect(homeLink).toBeInTheDocument();
  });

  it('should render cart link', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </BrowserRouter>
    );

    const cartLinks = screen.getAllByRole('link');
    const cartLink = cartLinks.find(
      link => link.getAttribute('href') === '/cart'
    );
    expect(cartLink).toBeInTheDocument();
  });

  it('should display cart count of 0 when cart is empty', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
