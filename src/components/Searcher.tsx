import type { ChangeEvent } from 'react';
import { CloseIcon } from '@/assets';
import styles from './Searcher.module.css';

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Searcher = ({
  value,
  onChange,
  placeholder = 'Search for a smartphone...',
}: Props) => {
  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className={styles.searcherContainer}>
      <input
        type="text"
        className={styles.searcherInput}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
