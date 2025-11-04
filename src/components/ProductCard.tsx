import { useNavigate } from 'react-router-dom';
import type { Product } from '@/types';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  style?: React.CSSProperties;
}

export const ProductCard = ({ product, style }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={styles.productCard} onClick={handleClick} style={style}>
      <div className={styles.productCardImage}>
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className={styles.productCardContent}>
        <div className={styles.productInfo}>
          <p className={styles.productBrand}>{product.brand}</p>
          <h3 className={styles.productName}>{product.name}</h3>
        </div>
        <p className={styles.productPrice}>{product.basePrice} EUR</p>
      </div>
    </div>
  );
};
