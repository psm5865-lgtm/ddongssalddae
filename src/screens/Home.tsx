import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { WeeklyStamps } from '../components/WeeklyStamps';
import { Mascot } from '../components/Mascot';
import {
  useRecords,
  countToday,
  todayString,
  recordHasNote,
} from '../store/records';
import { useSettings, nicknameOrFallback } from '../store/settings';
import { useMascot } from '../store/mascot';
import { useCollection, ownedCount, TOTAL_ITEMS } from '../store/collection';
import {
  stageForCount,
  nextStage,
  conditionFor,
  mascotLine,
} from '../mascot/stages';
import styles from './Home.module.css';

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function Home() {
  const navigate = useNavigate();
  const [records] = useRecords();
  const [settings] = useSettings();
  const [mascot] = useMascot();
  const { state: collection } = useCollection();

  const today = todayString();
  const todayCount = countToday(records, today);
  const total = records.length;
  const noteCount = records.filter(recordHasNote).length;
  const owned = ownedCount(collection);

  const stage = stageForCount(total);
  const { next, remaining } = nextStage(total);
  const cond = conditionFor(records);
  const [seed] = useState(() => Math.floor(Math.random() * 997));
  const line = mascotLine(cond, seed);
  const nick = nicknameOrFallback(settings.nickname);

  const progress = next
    ? `${next.name}까지 ${remaining}번 남았어요`
    : '최종 진화 완료! 👑';

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
        <h1 className={styles.greeting}>안녕하세요, {nick}님</h1>
      </div>

      <div className={styles.mascotCard}>
        <Mascot
          total={total}
          equipped={collection.equipped}
          condition={cond}
          coreSize={112}
          onTap={() => navigate('/collection')}
        />
        <div className={styles.mascotName}>
          {mascot.name}{' '}
          <span className={styles.mascotStage}>· {stage.name}</span>
        </div>
        <p className={styles.mascotLine}>{line}</p>
        <div className={styles.mascotProgress}>{progress}</div>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaText}>
          오늘 <span className={styles.metaStrong}>{todayCount}회</span>
        </span>
        <span className={styles.metaText}>
          누적 <span className={styles.metaStrong}>{total}회</span>
        </span>
      </div>

      <div className={styles.section}>
        <WeeklyStamps records={records} />

        <button
          type="button"
          className={styles.journalRow}
          onClick={() => navigate('/collection')}
        >
          <span className={styles.journalText}>🎁 똥 도감</span>
          <span className={styles.journalMeta}>
            {owned}/{TOTAL_ITEMS} 수집
            <Chevron />
          </span>
        </button>

        <button
          type="button"
          className={styles.journalRow}
          onClick={() => navigate('/report')}
        >
          <span className={styles.journalText}>📊 이번 주 리포트</span>
          <span className={styles.journalMeta}>
            보러가기
            <Chevron />
          </span>
        </button>

        <button
          type="button"
          className={styles.journalRow}
          onClick={() => navigate('/journal')}
        >
          <span className={styles.journalText}>📝 내가 적은 기록</span>
          <span className={styles.journalMeta}>
            {noteCount > 0 ? `${noteCount}개` : '비어 있어요'}
            <Chevron />
          </span>
        </button>
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={() => navigate('/session')}>
          앉으셨나요? 시작하기
        </PrimaryButton>
        <p className={styles.smallNote}>
          한 세트 끝나면 자연스럽게 닫혀요. 시원하게 누고 가세요.
        </p>
      </div>
    </div>
  );
}
