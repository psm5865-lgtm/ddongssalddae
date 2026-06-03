import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { STRETCH_SEQUENCE } from '../activities/stretch';
import styles from './StretchGuide.module.css';

type Props = {
  onComplete?: () => void;
};

export function StretchGuide({ onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const step = STRETCH_SEQUENCE[idx];
    const id = window.setTimeout(() => {
      if (idx < STRETCH_SEQUENCE.length - 1) {
        setIdx(idx + 1);
      } else {
        setDone(true);
        onComplete?.();
      }
    }, step.seconds * 1000);
    return () => window.clearTimeout(id);
  }, [idx, done, onComplete]);

  const step = STRETCH_SEQUENCE[idx];

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <div className={styles.halo} />
        <motion.div
          key={done ? 'done' : idx}
          className={styles.circle}
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {done ? '✓' : idx + 1}
        </motion.div>
      </div>
      <div className={styles.name}>{done ? '잘 풀었어요' : step.name}</div>
      <div className={styles.instr}>
        {done ? '몸이 한결 가벼워졌어요' : step.instruction}
      </div>
      <div className={styles.count}>
        {done
          ? `${STRETCH_SEQUENCE.length}/${STRETCH_SEQUENCE.length} 완료`
          : `${idx + 1}/${STRETCH_SEQUENCE.length}`}
      </div>
    </div>
  );
}
