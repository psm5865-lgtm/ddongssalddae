import { formatMMSS } from '../hooks/useCountdown';
import styles from './CountdownRing.module.css';

type Props = {
  totalSec: number;
  elapsedSec: number;
  isOver: boolean;
};

const SIZE = 88;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export function CountdownRing({ totalSec, elapsedSec, isOver }: Props) {
  const progress = Math.min(1, elapsedSec / totalSec);
  const offset = CIRC * (1 - progress);
  const display = isOver
    ? `+${formatMMSS(elapsedSec - totalSec)}`
    : formatMMSS(Math.max(0, totalSec - elapsedSec));

  return (
    <div className={`${styles.wrap} ${isOver ? styles.overTime : ''}`}>
      <svg className={styles.svg} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          className={styles.track}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className={styles.progress}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={styles.label}>{display}</span>
    </div>
  );
}
