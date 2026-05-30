import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PrimaryButton } from '../components/PrimaryButton';
import { useRecords, thisWeekCount } from '../store/records';
import { useSettings, nicknameOrFallback } from '../store/settings';
import styles from './Complete.module.css';

export function Complete() {
  const navigate = useNavigate();
  const [records] = useRecords();
  const [settings] = useSettings();

  const weekCount = thisWeekCount(records);
  const total = records.length;
  const name = nicknameOrFallback(settings.nickname);

  return (
    <div className="screen">
      <div className={styles.body}>
        <motion.div
          className={styles.stampWrap}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <motion.div
            className={styles.stamp}
            initial={{ rotate: -20, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
          >
            ✓
          </motion.div>
        </motion.div>

        <div className={styles.headline}>오늘도 잘 했어요, {name}님</div>
        <div className={styles.subline}>
          핸드폰을 들고 있어도
          <br />
          마음은 잠시 쉬었어요.
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{weekCount}</span>
            <span className={styles.statLabel}>이번 주</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{total}</span>
            <span className={styles.statLabel}>누적</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={() => navigate('/home', { replace: true })}>
          닫기
        </PrimaryButton>
      </div>
    </div>
  );
}
