import { BREATHING_INTRO } from './breathing';
import { GOAL_PROMPTS, GOAL_PLACEHOLDER } from './goals';
import { GRATITUDE_PROMPTS, GRATITUDE_PLACEHOLDER } from './gratitude';
import { QUOTES } from './quotes';
import { BALANCE_PAIRS, type BalancePair } from './balance';
import { TRIVIA, type Trivia } from './trivia';

export type ActivityType =
  | 'breathing'
  | 'gratitude'
  | 'goals'
  | 'quotes'
  | 'balance'
  | 'mood'
  | 'trivia'
  | 'stretch';

export type Activity =
  | { type: 'breathing'; title: string; subtitle: string }
  | { type: 'gratitude'; title: string; prompt: string; placeholder: string }
  | { type: 'goals'; title: string; prompt: string; placeholder: string }
  | { type: 'quotes'; title: string; quote: string }
  | { type: 'balance'; title: string; pair: BalancePair }
  | { type: 'mood'; title: string }
  | { type: 'trivia'; title: string; trivia: Trivia }
  | { type: 'stretch'; title: string };

const TITLES: Record<ActivityType, string> = {
  breathing: '깊게 숨 한 번',
  gratitude: '오늘의 한 줄',
  goals: '작은 다짐 하나',
  quotes: '오늘의 문장',
  balance: '오늘의 선택',
  mood: '기분 체크인',
  trivia: '오늘의 한 입',
  stretch: '몸 펴기',
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 타입 → 콘텐츠 채운 Activity 1개
function buildActivity(type: ActivityType): Activity {
  switch (type) {
    case 'breathing':
      return { type: 'breathing', title: TITLES.breathing, subtitle: BREATHING_INTRO };
    case 'gratitude':
      return {
        type: 'gratitude',
        title: TITLES.gratitude,
        prompt: pick(GRATITUDE_PROMPTS),
        placeholder: GRATITUDE_PLACEHOLDER,
      };
    case 'goals':
      return {
        type: 'goals',
        title: TITLES.goals,
        prompt: pick(GOAL_PROMPTS),
        placeholder: GOAL_PLACEHOLDER,
      };
    case 'quotes':
      return { type: 'quotes', title: TITLES.quotes, quote: pick(QUOTES) };
    case 'balance':
      return { type: 'balance', title: TITLES.balance, pair: pick(BALANCE_PAIRS) };
    case 'mood':
      return { type: 'mood', title: TITLES.mood };
    case 'trivia':
      return { type: 'trivia', title: TITLES.trivia, trivia: pick(TRIVIA) };
    case 'stretch':
      return { type: 'stretch', title: TITLES.stretch };
  }
}

const ALL_TYPES: ActivityType[] = [
  'breathing',
  'gratitude',
  'goals',
  'quotes',
  'balance',
  'mood',
  'trivia',
  'stretch',
];

export function pickRandomActivity(prevType?: ActivityType | null): Activity {
  const candidates = prevType
    ? ALL_TYPES.filter((t) => t !== prevType)
    : ALL_TYPES;
  return buildActivity(pick(candidates));
}

// ─── 덱(여러 카드) 엔진 ─────────────────────────────────────────────
type Bucket = 'calm' | 'tap' | 'read' | 'write';

const BUCKETS: Record<Bucket, ActivityType[]> = {
  calm: ['breathing', 'stretch'], // 가이드형, 시간 채움, 차분히 연다
  tap: ['balance', 'mood'], // 원탭 가벼운 상호작용
  read: ['trivia', 'quotes'], // 읽기(호기심/음미)
  write: ['gratitude', 'goals'], // 선택형 쓰기(덱당 최대 1장)
};

const SIZE_BY_LIMIT: Record<3 | 5 | 7, number> = { 3: 4, 5: 5, 7: 7 };

const TEMPLATE_BY_SIZE: Record<number, Bucket[]> = {
  // 차분(호흡·스트레칭) 카드를 '시간의 척추'로 — 5·7분은 둘 다 넣어 충분히 채운다
  4: ['calm', 'tap', 'read', 'write'],
  5: ['calm', 'read', 'tap', 'write', 'calm'],
  7: ['calm', 'read', 'tap', 'read', 'tap', 'write', 'calm'],
};

// 한 세션 = 짧은 카드 여러 장. 호흡으로 열고 → 탭/읽기 변주 → 쓰기로 닫기.
export function buildDeck(opts: {
  limitMin: 3 | 5 | 7;
  prevType?: ActivityType | null;
}): Activity[] {
  const size = SIZE_BY_LIMIT[opts.limitMin] ?? 5;
  const template = TEMPLATE_BY_SIZE[size] ?? TEMPLATE_BY_SIZE[5];

  let prev: ActivityType | null = opts.prevType ?? null;
  let usedWrite = false;
  const usedTypes: ActivityType[] = [];
  const deck: Activity[] = [];

  for (const bucket of template) {
    let pool =
      bucket === 'write' && usedWrite
        ? BUCKETS.read.slice() // (방어) 쓰기 2장 방지 → 읽기로 대체
        : BUCKETS[bucket].slice();

    // 직전 타입과 연속 금지
    const noPrev = pool.filter((t) => t !== prev);
    if (noPrev.length) pool = noPrev;

    // 이번 덱에서 아직 안 쓴 타입 우선(변주)
    const fresh = pool.filter((t) => !usedTypes.includes(t));
    const type = pick(fresh.length ? fresh : pool);

    if (bucket === 'write') usedWrite = true;
    deck.push(buildActivity(type));
    usedTypes.push(type);
    prev = type;
  }

  return deck;
}

export function activityLabel(type: ActivityType): string {
  return TITLES[type];
}
