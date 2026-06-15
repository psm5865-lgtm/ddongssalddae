import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { WeeklyStamps } from '../components/WeeklyStamps';
import { Mascot } from '../components/Mascot';
import {
  useRecords,
  currentWeekDates,
  recordMoods,
} from '../store/records';
import { useCollection, ownedCount, TOTAL_ITEMS } from '../store/collection';
import { stageForCount } from '../mascot/stages';
import { moodByScore } from '../activities/mood';
import { weeklyTitle } from '../report/titles';
import styles from './Report.module.css';

export function Report() {
  const navigate = useNavigate();
  const [records] = useRecords();
  const { state: collection } = useCollection();

  const week = currentWeekDates();
  const weekSet = new Set(week.map((d) => d.dateStr));
  const weekRecords = records.filter((r) => weekSet.has(r.date));

  const weekCount = weekRecords.length;
  const weekMinutes = Math.round(
    weekRecords.reduce((s, r) => s + (r.durationSec ?? 0), 0) / 60,
  );
  const weekMoods = weekRecords.flatMap(recordMoods);
  const avgMood =
    weekMoods.length > 0
      ? Math.round(weekMoods.reduce((s, m) => s + m, 0) / weekMoods.length)
      : null;
  const mood = avgMood != null ? moodByScore(avgMood) : null;

  const total = records.length;
  const stage = stageForCount(total);
  const owned = ownedCount(collection);
  const title = weeklyTitle(weekCount);

  return (
    <div className="screen">
      <div className={styles.topBar}>
        <button
          className={styles.back}
          onClick={() => navigate('/home')}
          aria-label="뒤로"
        >
          ‹
        </button>
        <span className={styles.topTitle}>이번 주 리포트</span>
        <span className={styles.spacer} />
      </div>

      <div className={styles.titleCard}>
        <div className={styles.titleLabel}>이번 주 당신의 칭호</div>
        <div className={styles.titleBig}>{title.title}</div>
        <p className={styles.titleSub}>{title.sub}</p>
      </div>

      <div className={styles.lead}>
        이번 주 스크롤 대신{' '}
        <span className={styles.leadStrong}>{weekMinutes}분</span> 마음챙김했어요
      </div>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{weekCount}</span>
          <span className={styles.statLabel}>이번 주 횟수</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{mood ? mood.emoji : '–'}</span>
          <span className={styles.statLabel}>
            평균 기분{mood ? ` · ${mood.label}` : ''}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{owned}</span>
          <span className={styles.statLabel}>모은 도감 / {TOTAL_ITEMS}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValueSm}>{stage.name}</span>
          <span className={styles.statLabel}>뿌직이 단계</span>
        </div>
      </div>

      <div className={styles.mascotRow}>
        <Mascot total={total} equipped={collection.equipped} coreSize={64} />
      </div>

      <WeeklyStamps records={records} />

      <div className={styles.footer}>
        <PrimaryButton variant="secondary" onClick={() => navigate('/home')}>
          홈으로
        </PrimaryButton>
      </div>
    </div>
  );
}
