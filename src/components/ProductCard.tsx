import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProductById } from '@/services';
import type { Product } from '@/types';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  style?: React.CSSProperties;
}

export const ProductCard = ({ product, style }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleMouseEnter = () => {
    // Prefetch product details on hover
    queryClient.prefetchQuery({
      queryKey: ['product', product.id],
      queryFn: () => fetchProductById(product.id),
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  return (
    <div
      className={styles.productCard}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      style={style}
    >
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
