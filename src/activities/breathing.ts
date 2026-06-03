export type BreathingPhase = {
  label: '들이쉬기' | '멈춤' | '내쉬기';
  seconds: number;
  scale: number;
};

export const BREATHING_CYCLE: BreathingPhase[] = [
  { label: '들이쉬기', seconds: 4, scale: 1.4 },
  { label: '멈춤', seconds: 2, scale: 1.4 },
  { label: '내쉬기', seconds: 6, scale: 1.0 },
];

export const BREATHING_CYCLES = 6;

export const BREATHING_INTRO = '4초 들이쉬고, 2초 멈추고, 6초 길게 내쉬어요.';
