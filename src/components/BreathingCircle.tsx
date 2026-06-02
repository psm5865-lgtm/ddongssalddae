import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BREATHING_CYCLE, BREATHING_CYCLES } from '../activities/breathing';
import styles from './BreathingCircle.module.css';

type Props = {
  onComplete?: () => void;
};

const GUIDE: Record<string, string> = {
  들이쉬기: '코로 천천히 들이마셔요',
  멈춤: '잠시 그대로 멈춰요',
  내쉬기: '입으로 길게 내쉬어요',
};

export function BreathingCircle({ onComplete }: Props) {
  const [cycle, setCycle] = useState(0); // 0..BREATHING_CYCLES
  const [phaseIdx, setPhaseIdx] = useState(0); // 0..2
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const phase = BREATHING_CYCLE[phaseIdx];
    const id = window.setTimeout(() => {
      if (phaseIdx < BREATHING_CYCLE.length - 1) {
        setPhaseIdx(phaseIdx + 1);
      } else {
        const nextCycle = cycle + 1;
        if (nextCycle >= BREATHING_CYCLES) {
          setDone(true);
          onComplete?.();
        } else {
          setCycle(nextCycle);
          setPhaseIdx(0);
        }
      }
    }, phase.seconds * 1000);
    return () => window.clearTimeout(id);
  }, [phaseIdx, cycle, done, onComplete]);

  const currentPhase = BREATHING_CYCLE[phaseIdx];

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <div className={styles.halo} />
        <motion.div
          className={styles.circle}
          animate={{ scale: done ? 1.0 : currentPhase.scale }}
          transition={{
            duration: done ? 0.6 : currentPhase.seconds,
            ease:
              currentPhase.label === '들이쉬기'
                ? 'easeOut'
                : currentPhase.label === '내쉬기'
                  ? 'easeIn'
                  : 'linear',
          }}
        >
          {done ? '잘했어요' : currentPhase.label}
        </motion.div>
      </div>
      <div className={styles.guide}>
        {done ? '깊게 잘 쉬었어요' : GUIDE[currentPhase.label]}
      </div>
      <div className={styles.cycle}>
        {done
          ? `${BREATHING_CYCLES}/${BREATHING_CYCLES} 사이클 완료`
          : `${cycle + 1}/${BREATHING_CYCLES} 사이클`}
      </div>
    </div>
  );
}
