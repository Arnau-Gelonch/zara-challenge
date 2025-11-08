import type { ProductSpecs } from '@/types';
import styles from './Specifications.module.css';

interface SpecificationsProps {
  specs: ProductSpecs;
  brand?: string;
  name?: string;
  description?: string;
}

export const Specifications = ({
  specs,
  brand,
  name,
  description,
}: SpecificationsProps) => {
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
  ].filter(spec => spec.value);

  if (specEntries.length === 0) {
    return null;
  }

  return (
    <div className={styles.specifications}>
      <h3 className={styles.title}>Specifications</h3>
      <table className={styles.table}>
        <tbody>
          {specEntries.map(spec => (
            <tr key={spec.label} className={styles.row}>
              <td className={styles.label}>{spec.label}</td>
              <td className={styles.value}>{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
