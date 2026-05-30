import { currentWeekDates, isDateStamped, thisWeekCount, type SessionRecord } from '../store/records';
import styles from './WeeklyStamps.module.css';

type Props = {
  records: SessionRecord[];
};

export function WeeklyStamps({ records }: Props) {
  const week = currentWeekDates();
  const count = thisWeekCount(records);

  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <span>이번 주 마음챙김</span>
        <span className={styles.count}>{count}/7</span>
      </div>
      <div className={styles.row}>
        {week.map((d) => {
          const done = isDateStamped(records, d.dateStr);
          return (
            <div key={d.dateStr} className={styles.cell}>
              <span
                className={`${styles.label} ${d.isToday ? styles.todayLabel : ''}`}
              >
                {d.label}
              </span>
              <div
                className={`${styles.stamp} ${done ? styles.stampDone : ''} ${
                  d.isToday ? styles.stampToday : ''
                }`}
              >
                ✓
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
