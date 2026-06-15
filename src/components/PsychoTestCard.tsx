import { useState } from 'react';
import type { PsychoTest } from '../activities/psychotest';
import styles from './PsychoTestCard.module.css';

export function PsychoTestCard({
  test,
  onPicked,
}: {
  test: PsychoTest;
  onPicked: () => void;
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const chosen = idx !== null ? test.options[idx] : null;

  const choose = (i: number) => {
    if (idx !== null) return;
    setIdx(i);
    onPicked();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>한 컷 심리테스트</div>
      <p className={styles.q}>{test.q}</p>

      {chosen === null ? (
        <div className={styles.opts}>
          {test.options.map((o, i) => (
            <button
              key={i}
              type="button"
              className={styles.opt}
              onClick={() => choose(i)}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.result}>
          <div className={styles.pickedLabel}>“{chosen.label}”</div>
          <p className={styles.resultText}>{chosen.result}</p>
        </div>
      )}
    </div>
  );
}
