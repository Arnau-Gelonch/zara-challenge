import { useRef, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { SimilarProduct, Product } from '@/types';
import styles from './SimilarItems.module.css';

interface SimilarItemsProps {
  products: SimilarProduct[];
}

export const SimilarItems = ({ products }: SimilarItemsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isAnimating = false;
    let velocity = 0;
    let currentScrollLeft = container.scrollLeft;

    const animate = () => {
      if (Math.abs(velocity) > 0.1) {
        currentScrollLeft += velocity;
        currentScrollLeft = Math.max(
          0,
          Math.min(
            currentScrollLeft,
            container.scrollWidth - container.clientWidth
          )
        );
        container.scrollLeft = currentScrollLeft;

        velocity *= 0.92;

        requestAnimationFrame(animate);
      } else {
        isAnimating = false;
        velocity = 0;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      velocity += e.deltaY * 0.5;

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      isAnimating = false;
      velocity = 0;
    };
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  const convertToProduct = (similarProduct: SimilarProduct): Product => ({
    id: similarProduct.id,
    brand: similarProduct.brand,
    name: similarProduct.name,
    basePrice: similarProduct.basePrice,
    imageUrl: similarProduct.imageUrl,
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>SIMILAR ITEMS</h2>
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        {products.map(product => (
          <div key={product.id} className={styles.cardWrapper}>
            <ProductCard product={convertToProduct(product)} />
          </div>
        ))}
      </div>
    </div>
  );
};
