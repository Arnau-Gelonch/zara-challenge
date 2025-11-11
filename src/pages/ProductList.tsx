import { useState, useEffect } from 'react';
import { ProductCard, Searcher, EmptyState, ErrorState } from '@/components';
import { useProducts } from '@/hooks';
import styles from './ProductList.module.css';

export const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isError } = useProducts({ search: debouncedSearch });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const products = data?.data ?? [];
  const totalProducts = products.length;

  return (
    <div className={styles.productListContainer}>
      <div className={styles.productListHeader}>
        <Searcher
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a smartphone..."
        />
        <p className={styles.resultsCount}>{totalProducts} RESULTS</p>
      </div>

      {isError && (
        <ErrorState message="Error loading products. Please try again." />
      )}

      {!isError && (
        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <EmptyState message="No products found." />
      )}
    </div>
  );
};
