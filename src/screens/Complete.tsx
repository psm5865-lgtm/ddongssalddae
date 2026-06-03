import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  useRecords,
  thisWeekCount,
  recordItems,
  recordNotes,
  recordMoods,
  ACTIVITY_TAG,
} from '../store/records';
import { useSettings, nicknameOrFallback } from '../store/settings';
import { moodByScore } from '../activities/mood';
import styles from './Complete.module.css';

export function Complete() {
  const navigate = useNavigate();
  const [records] = useRecords();
  const [settings] = useSettings();

  const weekCount = thisWeekCount(records);
  const total = records.length;
  const name = nicknameOrFallback(settings.nickname);

  const last = records.length > 0 ? records[records.length - 1] : undefined;
  const chips = last ? recordItems(last).map((i) => ACTIVITY_TAG[i.type]) : [];
  const lastNote = last ? recordNotes(last)[0]?.note : undefined;
  const moods = last ? recordMoods(last) : [];
  const moodEmoji =
    moods.length > 0 ? moodByScore(moods[moods.length - 1])?.emoji : undefined;

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

        {chips.length > 0 && (
          <div className={styles.chips}>
            {chips.map((c, i) => (
              <span key={i} className={styles.chip}>
                {c}
              </span>
            ))}
          </div>
        )}

        {moodEmoji && (
          <div className={styles.moodLine}>
            오늘 기분 <span className={styles.moodEmoji}>{moodEmoji}</span>
          </div>
        )}

        {lastNote && (
          <div className={styles.noteCard}>
            <div className={styles.noteLabel}>오늘 이렇게 적었어요</div>
            <div className={styles.noteText}>“{lastNote}”</div>
          </div>
        )}

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
