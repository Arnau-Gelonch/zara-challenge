import { useState, useEffect } from 'react';
import type { Product, ColorOption, StorageOption } from '@/types';
import styles from './ProductInfo.module.css';

interface ProductInfoProps {
  product: Product;
  currentImage: string;
  selectedStorage: string;
  selectedColor: number | null;
  onStorageChange: (capacity: string) => void;
  onColorChange: (index: number) => void;
  onAddToCart: () => void;
  getPrice: () => number;
}

export const ProductInfo = ({
  product,
  currentImage,
  selectedStorage,
  selectedColor,
  onStorageChange,
  onColorChange,
  onAddToCart,
  getPrice,
}: ProductInfoProps) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState(currentImage);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPrice = getPrice();
  const [displayPrice, setDisplayPrice] = useState(currentPrice);
  const [isPriceTransitioning, setIsPriceTransitioning] = useState(false);

  const currentColorName =
    hoveredColor ||
    (selectedColor !== null
      ? product.colorOptions?.[selectedColor]?.name
      : '') ||
    '';
  const [displayColorName, setDisplayColorName] = useState(currentColorName);
  const [isColorNameTransitioning, setIsColorNameTransitioning] =
    useState(false);

  useEffect(() => {
    if (currentImage !== displayImage) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayImage(currentImage);
        setIsTransitioning(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentImage, displayImage]);

  useEffect(() => {
    if (currentPrice !== displayPrice) {
      setIsPriceTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayPrice(currentPrice);
        setIsPriceTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentPrice, displayPrice]);

  useEffect(() => {
    if (currentColorName !== displayColorName) {
      setIsColorNameTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayColorName(currentColorName);
        setIsColorNameTransitioning(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentColorName, displayColorName]);

  return (
    <div className={styles.productInfo}>
      <div className={styles.imageColumn}>
        <div className={styles.imageContainer}>
          {displayImage && (
            <img
              src={displayImage}
              alt={product.name}
              className={styles.image}
            />
          )}
          {isTransitioning && currentImage && (
            <img
              src={currentImage}
              alt={product.name}
              className={`${styles.image} ${styles.imageTransition}`}
            />
          )}
        </div>
      </div>

      <div className={styles.infoColumn}>
        <div className={styles.headerGroup}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.price}>
            From{' '}
            <span className={styles.priceValueContainer}>
              <span className={styles.priceValue}>{displayPrice}</span>
              {isPriceTransitioning && (
                <span
                  className={`${styles.priceValue} ${styles.priceValueTransition}`}
                >
                  {currentPrice}
                </span>
              )}
            </span>{' '}
            EUR
          </p>
        </div>

        {product.storageOptions && product.storageOptions.length > 0 && (
          <div className={styles.optionGroup}>
            <p className={styles.optionLabel}>
              STORAGE ¿HOW MUCH SPACE DO YOU NEED?
            </p>
            <div className={styles.storageOptions}>
              {product.storageOptions.map((option: StorageOption) => (
                <button
                  key={option.capacity}
                  className={`${styles.storageButton} ${
                    selectedStorage === option.capacity
                      ? styles.storageButtonActive
                      : ''
                  }`}
                  onClick={() => onStorageChange(option.capacity)}
                >
                  {option.capacity}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colorOptions && product.colorOptions.length > 0 && (
          <div className={styles.optionGroup}>
            <p className={styles.optionLabel}>COLOR. PICK YOUR FAVOURITE.</p>
            <div className={styles.colorOptionsContainer}>
              <div className={styles.colorButtons}>
                {product.colorOptions.map(
                  (color: ColorOption, index: number) => (
                    <button
                      key={color.name}
                      className={`${styles.colorButton} ${
                        selectedColor === index ? styles.colorButtonActive : ''
                      }`}
                      style={{ backgroundColor: color.hexCode }}
                      onClick={() => onColorChange(index)}
                      onMouseEnter={() => setHoveredColor(color.name)}
                      onMouseLeave={() => setHoveredColor(null)}
                      aria-label={color.name}
                    />
                  )
                )}
              </div>
              <span className={styles.colorNameContainer}>
                <span className={styles.colorName}>
                  {displayColorName || '\u00A0'}
                </span>
                {isColorNameTransitioning && (
                  <span
                    className={`${styles.colorName} ${styles.colorNameTransition}`}
                  >
                    {currentColorName || '\u00A0'}
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        <button
          className={`${styles.addButton} ${
            selectedStorage && selectedColor !== null
              ? styles.addButtonActive
              : ''
          }`}
          onClick={onAddToCart}
        >
          AÑADIR
        </button>
      </div>
    </div>
  );
};
