import { useState, useEffect } from 'react';
import {
  ProductCard,
  Searcher,
  Loader,
  EmptyState,
  ErrorState,
} from '@/components';
import { fetchProducts } from '@/services';
import type { Product } from '@/types';
import styles from './ProductList.module.css';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchProducts({
        limit: 20,
        search: searchTerm || undefined,
      });
      setProducts(response.data);
    } catch {
      setError('Error loading products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.productListContainer}>
      <div className={styles.productListHeader}>
        <Searcher
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a smartphone..."
        />
        <p className={styles.resultsCount}>{products.length} RESULTS</p>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <Loader />
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              style={{ '--card-index': index } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products found." />
      )}
    </div>
  );
};
