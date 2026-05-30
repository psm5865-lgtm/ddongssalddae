import styles from './QuoteCard.module.css';

type Props = {
  quote: string;
};

export function QuoteCard({ quote }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>"</div>
      <div className={styles.quote}>{quote}</div>
      <div className={styles.hint}>천천히 한 번 더 읽어보세요</div>
    </div>
  );
}
