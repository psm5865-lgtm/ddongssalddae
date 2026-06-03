import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { CountdownRing } from '../components/CountdownRing';
import { BreathingCircle } from '../components/BreathingCircle';
import { TextEntry } from '../components/TextEntry';
import { QuoteCard } from '../components/QuoteCard';
import { BalanceCard } from '../components/BalanceCard';
import { MoodCheck } from '../components/MoodCheck';
import { TriviaCard } from '../components/TriviaCard';
import { StretchGuide } from '../components/StretchGuide';
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
  const [records, setRecords] = useRecords();
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
  const [stretchDone, setStretchDone] = useState(false);
  const [choice, setChoice] = useState<'a' | 'b' | undefined>(undefined);
  const [mood, setMood] = useState<number | undefined>(undefined);

  const vibratedRef = useRef(false);
  useEffect(() => {
    if (isOver && !vibratedRef.current) {
      vibratedRef.current = true;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(200);
      }
    }
  }, [isOver]);

  // 기분 체크인용 최근 기록(오래된→최신)
  const recentMoods = records
    .filter((r) => typeof r.mood === 'number')
    .slice(-7)
    .map((r) => r.mood as number);

  const finish = () => {
    const trimmedNote = note.trim();
    const record: SessionRecord = {
      date: todayString(),
      ts: Date.now(),
      activityType: activity.type,
      durationSec: elapsedSec,
      ...(trimmedNote ? { note: trimmedNote } : {}),
      ...(mood != null ? { mood } : {}),
      ...(activity.type === 'balance' && choice
        ? { choice: choice === 'a' ? activity.pair.a : activity.pair.b }
        : {}),
    };
    setRecords((prev) => [...prev, record]);
    setLastType(activity.type);
    navigate('/complete', { replace: true });
  };

  const canFinish = useMemo(() => {
    switch (activity.type) {
      case 'breathing':
        return breathingDone || elapsedSec >= 30;
      case 'stretch':
        return stretchDone || elapsedSec >= 30;
      case 'gratitude':
      case 'goals':
        return note.trim().length > 0;
      case 'balance':
        return choice != null;
      case 'mood':
        return mood != null;
      case 'quotes':
      case 'trivia':
        return true;
    }
  }, [activity.type, breathingDone, stretchDone, elapsedSec, note, choice, mood]);

  const buttonLabel = (() => {
    switch (activity.type) {
      case 'quotes':
        return '마음에 새겼어요';
      case 'trivia':
        return '알았어요';
      case 'breathing':
        return breathingDone ? '끝내기' : '먼저 호흡에 집중해요';
      case 'stretch':
        return stretchDone ? '끝내기' : '스트레칭에 집중해요';
      case 'balance':
        return choice ? '골랐어요' : '둘 중 하나 골라요';
      case 'mood':
        return mood != null ? '기록할게요' : '기분을 골라요';
      case 'gratitude':
      case 'goals':
        return '저장하고 끝내기';
    }
  })();

  return (
    <div className="screen">
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate('/home', { replace: true })}
          aria-label="그만두기"
        >
          ‹
        </button>
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

        {activity.type === 'stretch' && (
          <StretchGuide onComplete={() => setStretchDone(true)} />
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

        {activity.type === 'balance' && (
          <BalanceCard pair={activity.pair} value={choice} onChange={setChoice} />
        )}

        {activity.type === 'mood' && (
          <MoodCheck value={mood} onChange={setMood} recent={recentMoods} />
        )}

        {activity.type === 'trivia' && <TriviaCard trivia={activity.trivia} />}

        {isOver && (
          <div className={styles.overBanner}>
            <span className={styles.overDot} />
            이제 일어나는 게 좋겠어요. 오래 앉아 있으면 몸에 좋지 않아요.
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={finish} disabled={!canFinish}>
          {buttonLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}
