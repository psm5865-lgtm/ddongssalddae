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
import { FortuneCard } from '../components/FortuneCard';
import { OXQuizCard } from '../components/OXQuizCard';
import { PsychoTestCard } from '../components/PsychoTestCard';
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
import { buildDeck, type Activity, type ActivityType } from '../activities';
import styles from './Session.module.css';

// 카드별 최소 머무는 시간(ms). 차분 카드는 가이드가 끝날 때까지를 백스톱으로,
// 읽기 카드는 잠깐 음미할 시간을. 탭/쓰기는 0(선택·완료가 게이트).
// 차분 카드의 dwell = '건너뛰기 활성' 시점(절반쯤). 그 전엔 집중, 그 후엔 스킵 가능.
// onComplete가 오면 그냥 '다음'. 읽기 카드는 잠깐 음미 시간. 탭/놀이/쓰기는 0(선택·완료가 게이트).
const DWELL_MS: Record<ActivityType, number> = {
  breathing: 18000, // 3사이클 ≈36s → 절반 지나면 건너뛰기
  stretch: 25000, // 4동작 ≈51s → 절반 지나면 건너뛰기
  trivia: 8000,
  quotes: 8000,
  fortune: 6000,
  balance: 0,
  mood: 0,
  oxquiz: 0,
  psychotest: 0,
  gratitude: 0,
  goals: 0,
};

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
  const [answered, setAnswered] = useState(false); // 퀴즈·심리테스트 응답 여부
  const [dwellReady, setDwellReady] = useState(false);

  useEffect(() => {
    setNote('');
    setBreathingDone(false);
    setStretchDone(false);
    setChoice(undefined);
    setMood(undefined);
    setAnswered(false);

    // 카드별 최소 머무름 — setTimeout 기반이라 탭이 가려져도 안정적으로 동작
    setDwellReady(false);
    const ms = DWELL_MS[current.type] ?? 0;
    if (ms <= 0) {
      setDwellReady(true);
      return;
    }
    const id = window.setTimeout(() => setDwellReady(true), ms);
    return () => window.clearTimeout(id);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

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
        return breathingDone || dwellReady; // 완주하거나, 절반 지나면 건너뛰기 가능
      case 'stretch':
        return stretchDone || dwellReady;
      case 'gratitude':
      case 'goals':
        return true; // 쓰기는 선택 — 안 써도 다음
      case 'balance':
        return choice != null;
      case 'mood':
        return mood != null;
      case 'oxquiz':
      case 'psychotest':
        return answered;
      case 'quotes':
      case 'trivia':
      case 'fortune':
        return dwellReady; // 잠깐 읽을 시간을 둔다
    }
  }, [current.type, breathingDone, stretchDone, dwellReady, choice, mood, answered]);

  // 차분 카드를 다 안 끝냈는데 넘길 수 있는 상태 = '건너뛰기'
  const isCalmSkip =
    (current.type === 'breathing' && !breathingDone && dwellReady) ||
    (current.type === 'stretch' && !stretchDone && dwellReady);

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
        case 'oxquiz':
        case 'psychotest':
          return '골라보세요';
        case 'quotes':
        case 'trivia':
        case 'fortune':
          return '잠깐 읽어볼까요';
        default:
          return '다음';
      }
    }
    if (isCalmSkip) return isLast ? '마치기' : '건너뛰기 ›';
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
          {current.type === 'fortune' && (
            <FortuneCard fortune={current.fortune} />
          )}
          {current.type === 'oxquiz' && (
            <OXQuizCard quiz={current.quiz} onAnswered={() => setAnswered(true)} />
          )}
          {current.type === 'psychotest' && (
            <PsychoTestCard
              test={current.test}
              onPicked={() => setAnswered(true)}
            />
          )}
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
