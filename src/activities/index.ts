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

export function pickRandomActivity(prevType?: ActivityType | null): Activity {
  const candidates = prevType
    ? ALL_TYPES.filter((t) => t !== prevType)
    : ALL_TYPES;
  const type = pick(candidates);

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

export function activityLabel(type: ActivityType): string {
  return TITLES[type];
}
