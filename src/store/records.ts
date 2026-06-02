import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ActivityType } from '../activities';

export type SessionRecord = {
  date: string; // 'YYYY-MM-DD'
  ts: number;   // session end timestamp
  activityType: ActivityType;
  durationSec: number;
  note?: string;
};

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
