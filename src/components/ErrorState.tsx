import styles from './ErrorState.module.css';

interface Props {
  message?: string;
}

export const ErrorState = ({
  message = 'Something went wrong. Please try again.',
}: Props) => {
  return (
    <div className={styles.errorState}>
      <div className={styles.spinner} />
      <p className={styles.errorStateMessage}>{message}</p>
    </div>
  );
};
