import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { CountdownRing } from '../components/CountdownRing';
import { BreathingCircle } from '../components/BreathingCircle';
import { TextEntry } from '../components/TextEntry';
import { QuoteCard } from '../components/QuoteCard';
import { useCountdown } from '../hooks/useCountdown';
import { useSettings } from '../store/settings';
import {
  useRecords,
  useLastActivityType,
  todayString,
  type SessionRecord,
} from '../store/records';
import { pickRandomActivity, type Activity } from '../activities';
import styles from './Session.module.css';

export function Session() {
  const navigate = useNavigate();
  const [settings] = useSettings();
  const [, setRecords] = useRecords();
  const [lastType, setLastType] = useLastActivityType();

  const activityRef = useRef<Activity | null>(null);
  if (activityRef.current === null) {
    activityRef.current = pickRandomActivity(lastType);
  }
  const activity = activityRef.current;

  const totalSec = settings.limitMin * 60;
  const { elapsedSec, isOver } = useCountdown(totalSec, true);

  const [note, setNote] = useState('');
  const [breathingDone, setBreathingDone] = useState(false);

  const vibratedRef = useRef(false);
  useEffect(() => {
    if (isOver && !vibratedRef.current) {
      vibratedRef.current = true;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(200);
      }
    }
  }, [isOver]);

  const finish = () => {
    const trimmedNote = note.trim();
    const record: SessionRecord = {
      date: todayString(),
      ts: Date.now(),
      activityType: activity.type,
      durationSec: elapsedSec,
      ...(trimmedNote ? { note: trimmedNote } : {}),
    };
    setRecords((prev) => [...prev, record]);
    setLastType(activity.type);
    navigate('/complete', { replace: true });
  };

  const canFinish = useMemo(() => {
    if (activity.type === 'breathing') return breathingDone || elapsedSec >= 30;
    if (activity.type === 'gratitude' || activity.type === 'goals')
      return note.trim().length > 0;
    return true;
  }, [activity.type, breathingDone, elapsedSec, note]);

  return (
    <div className="screen">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.eyebrow}>오늘의 마음챙김</span>
          <span className={styles.title}>{activity.title}</span>
        </div>
        <CountdownRing
          totalSec={totalSec}
          elapsedSec={elapsedSec}
          isOver={isOver}
        />
      </div>

      <div className={styles.body}>
        {activity.type === 'breathing' && (
          <BreathingCircle onComplete={() => setBreathingDone(true)} />
        )}

        {activity.type === 'gratitude' && (
          <TextEntry
            prompt={activity.prompt}
            placeholder={activity.placeholder}
            value={note}
            onChange={setNote}
          />
        )}

        {activity.type === 'goals' && (
          <TextEntry
            prompt={activity.prompt}
            placeholder={activity.placeholder}
            value={note}
            onChange={setNote}
          />
        )}

        {activity.type === 'quotes' && (
          <QuoteCard quote={activity.quote} value={note} onChange={setNote} />
        )}

        {isOver && (
          <div className={styles.overBanner}>
            <span className={styles.overDot} />
            이제 일어나는 게 좋겠어요. 오래 앉아 있으면 몸에 좋지 않아요.
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={finish} disabled={!canFinish}>
          {activity.type === 'quotes'
            ? '마음에 새겼어요'
            : activity.type === 'breathing'
              ? breathingDone
                ? '끝내기'
                : '먼저 호흡에 집중해요'
              : '저장하고 끝내기'}
        </PrimaryButton>
      </div>
    </div>
  );
}
