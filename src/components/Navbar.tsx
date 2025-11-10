import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context';
import { CartIconEmpty, CartIconFilled, LogoIcon } from '@/assets';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          <LogoIcon />
        </Link>

        <Link
          to="/cart"
          className={`${styles.cartIcon} ${isCartPage ? styles.cartIconOnCartPage : ''}`}
        >
          {totalItems > 0 ? <CartIconFilled /> : <CartIconEmpty />}
          <span className={styles.cartCount}>{totalItems}</span>
        </Link>
      </div>
    </nav>
  );
};
