import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ActivityType } from '../activities';

export type SessionItem = {
  type: ActivityType;
  note?: string;
  mood?: number;
  choice?: string;
};

export type SessionRecord = {
  date: string; // 'YYYY-MM-DD'
  ts: number;   // session end timestamp
  activityType: ActivityType; // 대표 타입(= items[0].type), 후방호환용
  durationSec: number;
  items?: SessionItem[]; // 덱 전체. 옛 기록엔 없음(옵셔널 → 마이그레이션 불필요)
  note?: string;   // 상위 미러(후방호환 + Complete 편의)
  mood?: number;
  choice?: string;
};

/** 활동 타입 → 짧은 한국어 태그 (Journal·Complete 공용) */
export const ACTIVITY_TAG: Record<ActivityType, string> = {
  breathing: '호흡',
  gratitude: '감사',
  goals: '다짐',
  quotes: '문장',
  balance: '선택',
  mood: '기분',
  trivia: '지식',
  stretch: '스트레칭',
  fortune: '운세',
  oxquiz: '퀴즈',
  psychotest: '테스트',
};

/** 기록의 카드 항목들. 옛 flat 기록이면 상위 필드로 1개 합성. */
export function recordItems(r: SessionRecord): SessionItem[] {
  if (r.items && r.items.length > 0) return r.items;
  const item: SessionItem = { type: r.activityType };
  if (r.note != null) item.note = r.note;
  if (r.mood != null) item.mood = r.mood;
  if (r.choice != null) item.choice = r.choice;
  return [item];
}

/** 메모가 있는 항목만 {type, note}로 */
export function recordNotes(
  r: SessionRecord,
): { type: ActivityType; note: string }[] {
  return recordItems(r)
    .filter((i) => i.note && i.note.trim().length > 0)
    .map((i) => ({ type: i.type, note: (i.note as string).trim() }));
}

/** 기분 점수들 */
export function recordMoods(r: SessionRecord): number[] {
  return recordItems(r)
    .filter((i) => typeof i.mood === 'number')
    .map((i) => i.mood as number);
}

export function recordHasNote(r: SessionRecord): boolean {
  return recordNotes(r).length > 0;
}

const RECORDS_KEY = 'ddongssalddae:records';
const LAST_TYPE_KEY = 'ddongssalddae:last-type';

export function todayString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useRecords() {
  return useLocalStorage<SessionRecord[]>(RECORDS_KEY, []);
}

export function useLastActivityType() {
  return useLocalStorage<ActivityType | null>(LAST_TYPE_KEY, null);
}

export function countToday(records: SessionRecord[], today: string): number {
  return records.filter((r) => r.date === today).length;
}

export function isDateStamped(records: SessionRecord[], dateStr: string): boolean {
  return records.some((r) => r.date === dateStr);
}

export function currentWeekDates(today: Date = new Date()): {
  date: Date;
  dateStr: string;
  label: string;
  isToday: boolean;
}[] {
  // Week starts on Monday
  const day = today.getDay(); // 0 (Sun) ~ 6 (Sat)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + diffToMonday);

  const labels = ['월', '화', '수', '목', '금', '토', '일'];
  const todayStr = todayString(today);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = todayString(d);
    return {
      date: d,
      dateStr,
      label: labels[i],
      isToday: dateStr === todayStr,
    };
  });
}

export function thisWeekCount(records: SessionRecord[], today: Date = new Date()): number {
  const week = currentWeekDates(today);
  const set = new Set(week.map((d) => d.dateStr));
  return records.filter((r) => set.has(r.date)).length;
}

/** 'YYYY-MM-DD' → '오늘' / '어제' / 'M월 D일' */
export function formatRecordDate(dateStr: string, today: Date = new Date()): string {
  if (dateStr === todayString(today)) return '오늘';
  const yest = new Date(today);
  yest.setHours(0, 0, 0, 0);
  yest.setDate(yest.getDate() - 1);
  if (dateStr === todayString(yest)) return '어제';
  const parts = dateStr.split('-');
  return `${Number(parts[1])}월 ${Number(parts[2])}일`;
}
