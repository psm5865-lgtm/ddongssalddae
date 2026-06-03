import { MOODS, MOOD_PROMPT, moodByScore } from '../activities/mood';
import styles from './MoodCheck.module.css';

type Props = {
  value?: number;
  onChange: (score: number) => void;
  recent: number[]; // 최근 기분 점수(오래된→최신)
};

export function MoodCheck({ value, onChange, recent }: Props) {
  const selected = MOODS.find((m) => m.score === value);

  return (
    <div className={styles.wrap}>
      <div className={styles.prompt}>{MOOD_PROMPT}</div>
      <div className={styles.row}>
        {MOODS.map((m) => (
          <button
            type="button"
            key={m.score}
            className={`${styles.face} ${value === m.score ? styles.sel : ''}`}
            onClick={() => onChange(m.score)}
            aria-label={m.label}
          >
            <span className={styles.emoji}>{m.emoji}</span>
          </button>
        ))}
      </div>
      <div className={styles.label}>{selected ? selected.label : ' '}</div>

      {recent.length > 0 && (
        <div className={styles.strip}>
          <span className={styles.stripLabel}>최근</span>
          {recent.map((s, i) => (
            <span key={i} className={styles.stripEmoji}>
              {moodByScore(s)?.emoji ?? '·'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
