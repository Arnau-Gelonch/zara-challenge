import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context';
import styles from './Cart.module.css';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handlePay = () => {};

  if (items.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <h1 className={styles.title}>CART (0)</h1>
        </div>

        <div className={styles.cartFooter}>
          <button
            className={styles.continueShoppingButton}
            onClick={handleContinueShopping}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1 className={styles.title}>CART ({items.length})</h1>
      </div>

      <div className={styles.cartItems}>
        {items.map(({ product }, index) => (
          <div key={`${product.id}-${index}`} className={styles.cartItem}>
            <div className={styles.productImage}>
              <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className={styles.productDetails}>
              <div className={styles.productInfo}>
                <div className={styles.productNameAndSpecs}>
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.productSpecs}>
                    {product.storageOptions?.[0]?.capacity ||
                      product.ram ||
                      '512 GB'}{' '}
                    | {product.colorOptions?.[0]?.name || 'VIOLETA TITANIUM'}
                  </p>
                </div>
                <p className={styles.productPrice}>{product.basePrice} EUR</p>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => removeFromCart(product.id, index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartFooter}>
        <button
          className={styles.continueShoppingButton}
          onClick={handleContinueShopping}
        >
          CONTINUE SHOPPING
        </button>

        <div className={styles.totalSection}>
          <span className={styles.totalLabel}>TOTAL</span>
          <span className={styles.totalPrice}>{totalPrice} EUR</span>
        </div>

        <button className={styles.payButton} onClick={handlePay}>
          PAY
        </button>
      </div>
    </div>
  );
};
