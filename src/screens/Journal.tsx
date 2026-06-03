import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  useRecords,
  formatRecordDate,
  type SessionRecord,
} from '../store/records';
import type { ActivityType } from '../activities';
import styles from './Journal.module.css';

const TAG: Record<ActivityType, string> = {
  gratitude: '감사',
  goals: '다짐',
  quotes: '문장',
  breathing: '호흡',
  balance: '선택',
  mood: '기분',
  trivia: '지식',
  stretch: '스트레칭',
};

export function Journal() {
  const navigate = useNavigate();
  const [records] = useRecords();

  const written = records
    .filter((r) => r.note && r.note.trim().length > 0)
    .sort((a, b) => b.ts - a.ts);

  // 날짜별 묶기 (이미 최신순 정렬돼 있어서 순서대로 그룹)
  const groups: { date: string; items: SessionRecord[] }[] = [];
  for (const r of written) {
    const last = groups[groups.length - 1];
    if (last && last.date === r.date) last.items.push(r);
    else groups.push({ date: r.date, items: [r] });
  }

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
        <span className={styles.topTitle}>내가 적은 기록</span>
        <span className={styles.spacer} />
      </div>

      {written.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyEmoji}>🌱</div>
          <div className={styles.emptyTitle}>아직 적은 기록이 없어요</div>
          <p className={styles.emptyBody}>
            감사·다짐·문장에서 한 줄 적으면
            <br />
            여기에 차곡차곡 모여요.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {groups.map((g) => (
            <div key={g.date} className={styles.group}>
              <div className={styles.dateLabel}>{formatRecordDate(g.date)}</div>
              {g.items.map((r) => (
                <div key={r.ts} className={styles.card}>
                  <span className={styles.tag}>{TAG[r.activityType]}</span>
                  <p className={styles.note}>{r.note}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <PrimaryButton variant="secondary" onClick={() => navigate('/home')}>
          홈으로
        </PrimaryButton>
      </div>
    </div>
  );
}
