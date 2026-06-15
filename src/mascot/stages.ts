import type { SessionRecord } from '../store/records';

// 마스코트 '뿌직이'의 진화 단계. 단계는 누적 세션 수에서 파생(별도 저장 X).
export type MascotStage = {
  id: number;
  name: string;
  emoji: string;
  minSessions: number;
  blurb: string;
  aura?: string; // 고단계 기본 배경 오라(스킨 장착 시 스킨이 우선)
};

export const STAGES: MascotStage[] = [
  { id: 0, name: '몽글알', emoji: '🥚', minSessions: 0, blurb: '아직 알이에요. 첫 한 건이면 깨어나요.' },
  { id: 1, name: '방울이', emoji: '💧', minSessions: 1, blurb: '갓 태어난 한 방울. 말랑말랑해요.' },
  { id: 2, name: '새싹똥', emoji: '🌱', minSessions: 3, blurb: '뭔가 자라기 시작했어요.' },
  { id: 3, name: '똥이', emoji: '💩', minSessions: 7, blurb: '드디어 똥다운 똥! 의젓해졌어요.' },
  { id: 4, name: '황금똥', emoji: '💩', minSessions: 15, blurb: '광이 나요. 만지면 부자 된대요(아마도).', aura: 'radial-gradient(circle, #FFEFB0 0%, transparent 72%)' },
  { id: 5, name: '무지개똥', emoji: '💩', minSessions: 30, blurb: '빛깔이 예사롭지 않아요. 전설 직전.', aura: 'conic-gradient(from 0deg, #FFD1D1, #FFE9C7, #D7F5C9, #CFEFFB, #E1D6FB, #FFD1D1)' },
  { id: 6, name: '왕똥', emoji: '💩', minSessions: 50, blurb: '변기 위의 황제. 경배하라.', aura: 'radial-gradient(circle, #FFE08A 0%, #FFF6DA 45%, transparent 73%)' },
];

export function stageForCount(total: number): MascotStage {
  let s = STAGES[0];
  for (const st of STAGES) if (total >= st.minSessions) s = st;
  return s;
}

export function nextStage(total: number): { next: MascotStage | null; remaining: number } {
  const cur = stageForCount(total);
  const next = STAGES.find((s) => s.id === cur.id + 1) ?? null;
  return { next, remaining: next ? Math.max(0, next.minSessions - total) : 0 };
}

// 이번 세션(누적 totalAfter회째)으로 단계가 올라갔는지
export function justEvolved(totalAfter: number): boolean {
  if (totalAfter <= 0) return false;
  return stageForCount(totalAfter - 1).id !== stageForCount(totalAfter).id;
}

export type Condition = 'happy' | 'ok' | 'lonely';

export function daysSinceLast(
  records: SessionRecord[],
  today: Date = new Date(),
): number | null {
  if (records.length === 0) return null;
  const lastTs = Math.max(...records.map((r) => r.ts));
  const last = new Date(lastTs);
  const a = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const b = Date.UTC(last.getFullYear(), last.getMonth(), last.getDate());
  return Math.round((a - b) / 86400000);
}

export function conditionFor(
  records: SessionRecord[],
  today: Date = new Date(),
): Condition {
  const d = daysSinceLast(records, today);
  if (d === null) return 'ok';
  if (d <= 0) return 'happy';
  if (d <= 2) return 'ok';
  return 'lonely';
}

const LINES: Record<Condition, string[]> = {
  happy: [
    '오늘도 한 건 하러 오셨군요. 환영해요.',
    '왔다! 기다렸어요.',
    '오, 좋은 타이밍이에요.',
    '앉으세요. 같이 있어줄게요.',
  ],
  ok: ['또 만났네요.', '천천히 앉아요.', '준비되면 시작해요.', '오늘은 어떤 똥을 쌀까요.'],
  lonely: [
    '오랜만이에요... 안 잊었죠?',
    '며칠 굶었더니 시무룩해요.',
    '돌아와줘서 고마워요. 삐지려던 참이었어요.',
  ],
};

export function mascotLine(cond: Condition, seed: number): string {
  const pool = LINES[cond];
  return pool[Math.abs(seed) % pool.length];
}
