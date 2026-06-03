import type { Trivia } from '../activities/trivia';
import styles from './TriviaCard.module.css';

export function TriviaCard({ trivia }: { trivia: Trivia }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.tag}>{trivia.kind}</span>
      <div className={styles.text}>{trivia.text}</div>
      <div className={styles.hint}>오늘 하나 알았어요</div>
    </div>
  );
}
