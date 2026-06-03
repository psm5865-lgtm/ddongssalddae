export type Mood = { score: 1 | 2 | 3 | 4 | 5; emoji: string; label: string };

export const MOOD_PROMPT = '지금 기분은 어때요?';

export const MOODS: Mood[] = [
  { score: 5, emoji: '😄', label: '아주 좋아요' },
  { score: 4, emoji: '🙂', label: '좋아요' },
  { score: 3, emoji: '😐', label: '그저 그래요' },
  { score: 2, emoji: '😕', label: '별로예요' },
  { score: 1, emoji: '😢', label: '힘들어요' },
];

export function moodByScore(score: number): Mood | undefined {
  return MOODS.find((m) => m.score === score);
}
