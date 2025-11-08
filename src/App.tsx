import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context';
import { Navbar } from '@/components';
import { ProductList, ProductDetail } from '@/pages';

export const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<div>Cart</div>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};
