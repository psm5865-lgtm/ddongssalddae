import styles from './QuoteCard.module.css';

type Props = {
  quote: string;
  value: string;
  onChange: (v: string) => void;
};

export function QuoteCard({ quote, value, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>“</div>
      <div className={styles.quote}>{quote}</div>
      <div className={styles.hint}>천천히 한 번 더 읽어보세요</div>
      <div className={styles.fieldWrap}>
        <input
          className={styles.field}
          type="text"
          maxLength={140}
          placeholder="떠오른 생각이 있다면 한 줄 (선택)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
