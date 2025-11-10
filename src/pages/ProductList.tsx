import { useState, useEffect, useCallback } from 'react';
import { ProductCard, Searcher, EmptyState, ErrorState } from '@/components';
import { fetchProducts } from '@/services';
import type { Product } from '@/types';
import styles from './ProductList.module.css';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
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
  }, [searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, loadProducts]);

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

      {error && <ErrorState message={error} />}

      {!error && (
        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products found." />
      )}
    </div>
  );
};
