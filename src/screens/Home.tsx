import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { WeeklyStamps } from '../components/WeeklyStamps';
import { useRecords, countToday, todayString } from '../store/records';
import { useSettings, nicknameOrFallback } from '../store/settings';
import styles from './Home.module.css';

export function Home() {
  const navigate = useNavigate();
  const [records] = useRecords();
  const [settings] = useSettings();
  const today = todayString();
  const todayCount = countToday(records, today);
  const total = records.length;
  const name = nicknameOrFallback(settings.nickname);

  return (
    <div className="screen">
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.brand}>똥쌀때</span>
          <button
            type="button"
            className={styles.settingsBtn}
            onClick={() => navigate('/settings')}
            aria-label="설정"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
        <h1 className={styles.greeting}>안녕하세요, {name}님</h1>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroCard}>
          <span className={styles.heroLabel}>지금 화장실 안인가요?</span>
          <div className={styles.heroQuestion}>
            앉으셨다면
            <br />
            {settings.limitMin}분만 함께해요.
          </div>
          <span className={styles.heroDesc}>
            오늘의 마음챙김은 시작한 뒤에 알려드려요.
          </span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaText}>
            오늘 마음챙김{' '}
            <span className={styles.metaStrong}>{todayCount}회</span>
          </span>
          <span className={styles.metaText}>
            누적 <span className={styles.metaStrong}>{total}회</span>
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <WeeklyStamps records={records} />
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={() => navigate('/session')}>
          앉으셨나요? 시작하기
        </PrimaryButton>
        <p className={styles.smallNote}>
          앱은 한 활동이 끝나면 자연스럽게 닫힙니다.
        </p>
      </div>
    </div>
  );
}
