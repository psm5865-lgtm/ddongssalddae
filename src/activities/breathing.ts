export type BreathingPhase = {
  label: '들이쉬기' | '멈춤' | '내쉬기';
  seconds: number;
  scale: number;
};

export const BREATHING_CYCLE: BreathingPhase[] = [
  { label: '들이쉬기', seconds: 4, scale: 1.4 },
  { label: '멈춤', seconds: 7, scale: 1.4 },
  { label: '내쉬기', seconds: 8, scale: 1.0 },
];

export const BREATHING_CYCLES = 4;

export const BREATHING_INTRO = '4초 들이쉬고, 7초 멈추고, 8초 내쉬어요.';
