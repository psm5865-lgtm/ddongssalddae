import type { Fortune } from '../activities/fortune';
import styles from './FortuneCard.module.css';

export function FortuneCard({ fortune }: { fortune: Fortune }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.poop}>💩</div>
      <div className={styles.stars}>
        <span className={styles.on}>{'★'.repeat(fortune.stars)}</span>
        <span className={styles.off}>{'★'.repeat(5 - fortune.stars)}</span>
      </div>
      <div className={styles.index}>쾌변 지수 {fortune.stars} / 5</div>
      <p className={styles.line}>{fortune.line}</p>
    </div>
  );
}
