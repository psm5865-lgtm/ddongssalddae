import { BALANCE_PROMPT, type BalancePair } from '../activities/balance';
import styles from './BalanceCard.module.css';

type Props = {
  pair: BalancePair;
  value?: 'a' | 'b';
  onChange: (choice: 'a' | 'b') => void;
};

export function BalanceCard({ pair, value, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.prompt}>{BALANCE_PROMPT}</div>
      <div className={styles.options}>
        <button
          type="button"
          className={`${styles.opt} ${value === 'a' ? styles.sel : ''}`}
          onClick={() => onChange('a')}
        >
          {pair.a}
        </button>
        <div className={styles.vs}>VS</div>
        <button
          type="button"
          className={`${styles.opt} ${value === 'b' ? styles.sel : ''}`}
          onClick={() => onChange('b')}
        >
          {pair.b}
        </button>
      </div>
    </div>
  );
}
