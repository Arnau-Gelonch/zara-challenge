import styles from './EmptyState.module.css';

interface Props {
  message?: string;
}

export const EmptyState = ({ message = 'No products found.' }: Props) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.spinner} />
      <p className={styles.emptyStateMessage}>{message}</p>
    </div>
  );
};
