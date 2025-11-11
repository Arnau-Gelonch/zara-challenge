import { useState, useEffect } from 'react';
import {
  ProductCard,
  Searcher,
  EmptyState,
  ErrorState,
  Loader,
} from '@/components';
import { useProducts } from '@/hooks';
import styles from './ProductList.module.css';

export const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data, isLoading, isError } = useProducts({ search: debouncedSearch });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (isInitialLoad && searchTerm !== '') {
        setIsInitialLoad(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, isInitialLoad]);

  useEffect(() => {
    if (data && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [data, isInitialLoad]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const products = data?.data ?? [];
  const totalProducts = products.length;

  const showLoader = isLoading && isInitialLoad;

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

      {showLoader && <Loader />}

      {isError && (
        <ErrorState message="Error loading products. Please try again." />
      )}

      {!showLoader && !isError && (
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
