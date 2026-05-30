import { BREATHING_INTRO } from './breathing';
import { GOAL_PROMPTS, GOAL_PLACEHOLDER } from './goals';
import { GRATITUDE_PROMPTS, GRATITUDE_PLACEHOLDER } from './gratitude';
import { QUOTES } from './quotes';

export type ActivityType = 'breathing' | 'gratitude' | 'goals' | 'quotes';

export type Activity =
  | { type: 'breathing'; title: string; subtitle: string }
  | { type: 'gratitude'; title: string; prompt: string; placeholder: string }
  | { type: 'goals'; title: string; prompt: string; placeholder: string }
  | { type: 'quotes'; title: string; quote: string };

const ALL_TYPES: ActivityType[] = ['breathing', 'gratitude', 'goals', 'quotes'];

const TITLES: Record<ActivityType, string> = {
  breathing: '깊게 숨 한 번',
  gratitude: '오늘의 한 줄',
  goals: '작은 다짐 하나',
  quotes: '오늘의 문장',
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
      return {
        type: 'breathing',
        title: TITLES.breathing,
        subtitle: BREATHING_INTRO,
      };
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
      return {
        type: 'quotes',
        title: TITLES.quotes,
        quote: pick(QUOTES),
      };
  }
}

export function activityLabel(type: ActivityType): string {
  return TITLES[type];
}
