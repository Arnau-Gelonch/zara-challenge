import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '@/context';
import { useProduct } from '@/hooks';
import { fetchProductById } from '@/services';
import {
  Loader,
  ErrorState,
  ProductInfo,
  ProductSpecifications,
  SimilarItems,
} from '@/components';
import { ArrowIcon } from '@/assets';
import styles from './ProductDetail.module.css';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useProduct(id || '');

  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  // Scroll to top when id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (product) {
      // No seleccionar nada por defecto
      if (product.colorOptions && product.colorOptions.length > 0) {
        setCurrentImage(product.colorOptions[0].imageUrl);
      } else {
        setCurrentImage(product.imageUrl);
      }

      // Prefetch similar products
      if (product.similarProducts && product.similarProducts.length > 0) {
        product.similarProducts.forEach(similarProduct => {
          queryClient.prefetchQuery({
            queryKey: ['product', similarProduct.id],
            queryFn: () => fetchProductById(similarProduct.id),
            staleTime: 1000 * 60 * 5, // 5 minutos
          });
        });
      }
    }
  }, [product, queryClient]);

  const handleAddToCart = () => {
    if (!product) return;

    const productToAdd = {
      ...product,
      imageUrl: currentImage,
    };

    addToCart(productToAdd);
  };

  const handleColorChange = (index: number) => {
    setSelectedColor(index);
    if (product?.colorOptions && product.colorOptions[index]) {
      setCurrentImage(product.colorOptions[index].imageUrl);
    }
  };

  const getPrice = () => {
    if (!product) return 0;
    const storageOption = product.storageOptions?.find(
      opt => opt.capacity === selectedStorage
    );
    return storageOption ? storageOption.price : product.basePrice;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ErrorState message="Error loading product details. Please try again." />
    );
  }

  return (
    <div>
      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowIcon /> BACK
        </button>
      </div>
      <div className={styles.container}>
        <ProductInfo
          product={product}
          currentImage={currentImage}
          selectedStorage={selectedStorage}
          selectedColor={selectedColor}
          onStorageChange={setSelectedStorage}
          onColorChange={handleColorChange}
          onAddToCart={handleAddToCart}
          getPrice={getPrice}
        />

        {product.specs && (
          <ProductSpecifications
            specs={product.specs}
            brand={product.brand}
            name={product.name}
            description={product.description}
          />
        )}

        {product.similarProducts && product.similarProducts.length > 0 && (
          <SimilarItems products={product.similarProducts} />
        )}
      </div>
    </div>
  );
};
