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
  recordMoods,
  type SessionRecord,
  type SessionItem,
} from '../store/records';
import { buildDeck, type Activity } from '../activities';
import styles from './Session.module.css';

export function Session() {
  const navigate = useNavigate();
  const [settings] = useSettings();
  const [records, setRecords] = useRecords();
  const [lastType, setLastType] = useLastActivityType();

  // 세션당 덱 1회 생성
  const deckRef = useRef<Activity[] | null>(null);
  if (deckRef.current === null) {
    deckRef.current = buildDeck({
      limitMin: settings.limitMin,
      prevType: lastType,
    });
  }
  const deck = deckRef.current;
  const resultsRef = useRef<SessionItem[]>(deck.map((a) => ({ type: a.type })));

  const [index, setIndex] = useState(0);
  const current = deck[index];
  const isLast = index === deck.length - 1;

  const totalSec = settings.limitMin * 60;
  const { elapsedSec, isOver } = useCountdown(totalSec, true);

  // 카드 입력 상태 (카드 전환 시 리셋)
  const [note, setNote] = useState('');
  const [breathingDone, setBreathingDone] = useState(false);
  const [stretchDone, setStretchDone] = useState(false);
  const [choice, setChoice] = useState<'a' | 'b' | undefined>(undefined);
  const [mood, setMood] = useState<number | undefined>(undefined);

  const cardStartRef = useRef(0);
  useEffect(() => {
    setNote('');
    setBreathingDone(false);
    setStretchDone(false);
    setChoice(undefined);
    setMood(undefined);
    cardStartRef.current = elapsedSec;
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps
  const cardElapsed = elapsedSec - cardStartRef.current;

  const vibratedRef = useRef(false);
  useEffect(() => {
    if (isOver && !vibratedRef.current) {
      vibratedRef.current = true;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(200);
      }
    }
  }, [isOver]);

  // 기분 스트립용 최근 기록(오래된→최신, 항목 평탄화)
  const recentMoods = records.flatMap(recordMoods).slice(-7);

  const finish = () => {
    const items = resultsRef.current;
    const firstNote = items.find((i) => i.note && i.note.trim())?.note?.trim();
    const lastMood = [...items].reverse().find((i) => i.mood != null)?.mood;
    const firstChoice = items.find((i) => i.choice)?.choice;
    const record: SessionRecord = {
      date: todayString(),
      ts: Date.now(),
      activityType: items[0].type,
      durationSec: elapsedSec,
      items,
      ...(firstNote ? { note: firstNote } : {}),
      ...(lastMood != null ? { mood: lastMood } : {}),
      ...(firstChoice ? { choice: firstChoice } : {}),
    };
    setRecords((prev) => [...prev, record]);
    setLastType(items[items.length - 1].type);
    navigate('/complete', { replace: true });
  };

  const handleNext = () => {
    const item: SessionItem = { type: current.type };
    const t = note.trim();
    if (
      (current.type === 'gratitude' ||
        current.type === 'goals' ||
        current.type === 'quotes') &&
      t
    ) {
      item.note = t;
    }
    if (current.type === 'mood' && mood != null) item.mood = mood;
    if (current.type === 'balance' && choice) {
      item.choice = choice === 'a' ? current.pair.a : current.pair.b;
    }
    resultsRef.current[index] = item;

    if (isLast) finish();
    else setIndex((i) => i + 1);
  };

  const canAdvance = useMemo(() => {
    switch (current.type) {
      case 'breathing':
        return breathingDone || cardElapsed >= 8;
      case 'stretch':
        return stretchDone || cardElapsed >= 8;
      case 'gratitude':
      case 'goals':
        return true; // 쓰기는 선택 — 안 써도 다음
      case 'balance':
        return choice != null;
      case 'mood':
        return mood != null;
      case 'quotes':
      case 'trivia':
        return true;
    }
  }, [current.type, breathingDone, stretchDone, cardElapsed, choice, mood]);

  const buttonLabel = (() => {
    if (!canAdvance) {
      switch (current.type) {
        case 'breathing':
          return '먼저 호흡에 집중해요';
        case 'stretch':
          return '스트레칭에 집중해요';
        case 'balance':
          return '둘 중 하나 골라요';
        case 'mood':
          return '기분을 골라요';
        default:
          return '다음';
      }
    }
    return isLast ? '마치기' : '다음';
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
          <span className={styles.title}>{current.title}</span>
        </div>
        <CountdownRing
          totalSec={totalSec}
          elapsedSec={elapsedSec}
          isOver={isOver}
        />
      </div>

      <div className={styles.dots} aria-hidden="true">
        {deck.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${
              i === index ? styles.dotActive : i < index ? styles.dotDone : ''
            }`}
          />
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.card} key={index}>
          {current.type === 'breathing' && (
            <BreathingCircle onComplete={() => setBreathingDone(true)} />
          )}
          {current.type === 'stretch' && (
            <StretchGuide onComplete={() => setStretchDone(true)} />
          )}
          {current.type === 'gratitude' && (
            <TextEntry
              prompt={current.prompt}
              placeholder={current.placeholder}
              value={note}
              onChange={setNote}
            />
          )}
          {current.type === 'goals' && (
            <TextEntry
              prompt={current.prompt}
              placeholder={current.placeholder}
              value={note}
              onChange={setNote}
            />
          )}
          {current.type === 'quotes' && (
            <QuoteCard quote={current.quote} value={note} onChange={setNote} />
          )}
          {current.type === 'balance' && (
            <BalanceCard pair={current.pair} value={choice} onChange={setChoice} />
          )}
          {current.type === 'mood' && (
            <MoodCheck value={mood} onChange={setMood} recent={recentMoods} />
          )}
          {current.type === 'trivia' && <TriviaCard trivia={current.trivia} />}
        </div>

        {isOver && (
          <div className={styles.overBanner}>
            <span className={styles.overDot} />
            이제 일어나는 게 좋겠어요. 오래 앉아 있으면 몸에 좋지 않아요.
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={handleNext} disabled={!canAdvance}>
          {buttonLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}
