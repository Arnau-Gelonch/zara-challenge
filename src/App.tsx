import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context';
import { Navbar } from '@/components';
import { ProductList, ProductDetail, Cart } from '@/pages';
import { TanStackProvider } from './plugins';

export const App = () => {
  return (
    <TanStackProvider>
      <CartProvider>
        <BrowserRouter basename="/zara-challenge">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TanStackProvider>
  );
};
