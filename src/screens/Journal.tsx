import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  useRecords,
  formatRecordDate,
  recordNotes,
  ACTIVITY_TAG,
} from '../store/records';
import type { ActivityType } from '../activities';
import styles from './Journal.module.css';

type Row = { key: string; date: string; type: ActivityType; note: string };

export function Journal() {
  const navigate = useNavigate();
  const [records] = useRecords();

  // 모든 기록의 메모를 평탄화(최신 세션 먼저, 세션 안에선 카드 순서)
  const rows: Row[] = [...records]
    .sort((a, b) => b.ts - a.ts)
    .flatMap((r) =>
      recordNotes(r).map((n, idx) => ({
        key: `${r.ts}-${idx}`,
        date: r.date,
        type: n.type,
        note: n.note,
      })),
    );

  // 날짜별 묶기
  const groups: { date: string; rows: Row[] }[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last && last.date === row.date) last.rows.push(row);
    else groups.push({ date: row.date, rows: [row] });
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

      {rows.length === 0 ? (
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
              {g.rows.map((row) => (
                <div key={row.key} className={styles.card}>
                  <span className={styles.tag}>{ACTIVITY_TAG[row.type]}</span>
                  <p className={styles.note}>{row.note}</p>
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
