export type StretchStep = {
  name: string;
  seconds: number;
  instruction: string;
};

export const STRETCH_INTRO = '앉은 채로 따라 해요. 천천히, 무리하지 말고.';

// 앉아서 할 수 있는 가벼운 스트레칭. 총 약 51초(짧게).
export const STRETCH_SEQUENCE: StretchStep[] = [
  { name: '목 오른쪽', seconds: 12, instruction: '고개를 천천히 오른쪽으로 기울여요' },
  { name: '목 왼쪽', seconds: 12, instruction: '반대로 왼쪽으로 천천히 기울여요' },
  { name: '어깨 으쓱', seconds: 12, instruction: '어깨를 귀까지 올렸다가 툭 내려요' },
  { name: '심호흡', seconds: 15, instruction: '크게 들이쉬고, 길게 내쉬어요' },
];
