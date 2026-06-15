import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PrimaryButton } from '../components/PrimaryButton';
import { GachaReveal } from '../components/GachaReveal';
import {
  useRecords,
  thisWeekCount,
  recordNotes,
  recordMoods,
} from '../store/records';
import { useSettings, nicknameOrFallback } from '../store/settings';
import { useMascot } from '../store/mascot';
import { useCollection } from '../store/collection';
import { drawItem } from '../collection/items';
import { justEvolved, stageForCount } from '../mascot/stages';
import { moodByScore } from '../activities/mood';
import styles from './Complete.module.css';

export function Complete() {
  const navigate = useNavigate();
  const [records] = useRecords();
  const [settings] = useSettings();
  const [mascot] = useMascot();
  const { state: collection, addItem } = useCollection();

  const weekCount = thisWeekCount(records);
  const total = records.length;
  const name = nicknameOrFallback(settings.nickname);

  // 뽑기 — 마운트 시 1회만 추첨, 1회만 지급(StrictMode 이중 실행 가드)
  const [drawn] = useState(() => drawItem(collection.owned));
  const [isNew] = useState(() => !((collection.owned[drawn.id] ?? 0) > 0));
  const addedRef = useRef(false);
  useEffect(() => {
    if (addedRef.current) return;
    addedRef.current = true;
    addItem(drawn.id);
  }, [drawn.id, addItem]);

  // 진화
  const evolved = justEvolved(total);
  const stage = stageForCount(total);

  // recap
  const last = records.length > 0 ? records[records.length - 1] : undefined;
  const lastNote = last ? recordNotes(last)[0]?.note : undefined;
  const moods = last ? recordMoods(last) : [];
  const moodEmoji =
    moods.length > 0 ? moodByScore(moods[moods.length - 1])?.emoji : undefined;

  return (
    <div className="screen">
      <div className={styles.body}>
        <div className={styles.headline}>오늘도 한 건 했어요, {name}님 👏</div>

        <GachaReveal item={drawn} isNew={isNew} />

        {evolved && (
          <motion.div
            className={styles.evolve}
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 16 }}
          >
            🎉 {mascot.name}가 ‘{stage.name}’(으)로 자랐어요!
          </motion.div>
        )}

        {(moodEmoji || lastNote) && (
          <div className={styles.recap}>
            {moodEmoji && (
              <div className={styles.moodLine}>
                오늘 기분 <span className={styles.moodEmoji}>{moodEmoji}</span>
              </div>
            )}
            {lastNote && <div className={styles.noteText}>“{lastNote}”</div>}
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
        <PrimaryButton
          variant="secondary"
          onClick={() => navigate('/collection')}
        >
          도감에서 꾸미기
        </PrimaryButton>
        <PrimaryButton onClick={() => navigate('/home', { replace: true })}>
          닫기
        </PrimaryButton>
      </div>
    </div>
  );
}
