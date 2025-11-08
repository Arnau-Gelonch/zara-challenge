import type { ProductSpecs } from '@/types';
import styles from './ProductSpecifications.module.css';

interface Props {
  specs: ProductSpecs;
  brand?: string;
  name?: string;
  description?: string;
}

export const ProductSpecifications = ({
  specs,
  brand,
  name,
  description,
}: Props) => {
  const specEntries = [
    { label: 'Brand', value: brand },
    { label: 'Name', value: name },
    { label: 'Description', value: description },
    { label: 'Screen', value: specs.screen },
    { label: 'Resolution', value: specs.resolution },
    { label: 'Processor', value: specs.processor },
    { label: 'Main Camera', value: specs.mainCamera },
    { label: 'Selfie Camera', value: specs.selfieCamera },
    { label: 'Battery', value: specs.battery },
    { label: 'OS', value: specs.os },
    { label: 'Refresh Rate', value: specs.screenRefreshRate },
  ].filter(entry => entry.value);

  if (specEntries.length === 0) {
    return null;
  }

  return (
    <div className={styles.specifications}>
      <h2 className={styles.title}>Specifications</h2>
      <table className={styles.table}>
        <tbody>
          {specEntries.map(entry => (
            <tr key={entry.label}>
              <td className={styles.label}>{entry.label}</td>
              <td className={styles.value}>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
