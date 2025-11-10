import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '@/services';
import { useCart } from '@/context';
import {
  Loader,
  ErrorState,
  ProductInfo,
  ProductSpecifications,
  SimilarItems,
} from '@/components';
import { ArrowIcon } from '@/assets';
import type { Product } from '@/types';
import styles from './ProductDetail.module.css';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);

        // No seleccionar nada por defecto
        if (data.colorOptions && data.colorOptions.length > 0) {
          setCurrentImage(data.colorOptions[0].imageUrl);
        } else {
          setCurrentImage(data.imageUrl);
        }
      } catch {
        setError('Error loading product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return <ErrorState message={error || 'Product not found'} />;
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
