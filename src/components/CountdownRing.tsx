import { formatMMSS } from '../hooks/useCountdown';
import styles from './CountdownRing.module.css';

type Props = {
  totalSec: number; // 권장(건강) 시간
  elapsedSec: number;
  isOver: boolean; // 권장 시간 초과 여부
};

const SIZE = 88;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

// 카운트다운이 아니라 '경과 시간'을 조용히 보여줘요(카운트업).
// 링은 권장 시간까지 차오르고, 넘으면 앰버로 바뀌어 '이제 그만' 신호를 줘요.
export function CountdownRing({ totalSec, elapsedSec, isOver }: Props) {
  const progress = Math.min(1, elapsedSec / totalSec);
  const offset = CIRC * (1 - progress);

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
      <span className={styles.label}>{formatMMSS(elapsedSec)}</span>
    </div>
  );
}
