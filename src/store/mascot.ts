import { useLocalStorage } from '../hooks/useLocalStorage';

// 마스코트는 이름만 저장. 단계·컨디션은 records에서 파생(src/mascot/stages.ts).
export type MascotState = { name: string };

const KEY = 'ddongssalddae:mascot';
const DEFAULT: MascotState = { name: '뿌직이' };

function merge(raw: Partial<MascotState> | null | undefined): MascotState {
  return { ...DEFAULT, ...(raw ?? {}) };
}

export function useMascot(): [
  MascotState,
  (value: MascotState | ((prev: MascotState) => MascotState)) => void,
] {
  const [raw, setRaw] = useLocalStorage<MascotState>(KEY, DEFAULT);
  const set = (value: MascotState | ((prev: MascotState) => MascotState)) => {
    setRaw((prev) =>
      typeof value === 'function'
        ? (value as (p: MascotState) => MascotState)(merge(prev))
        : value,
    );
  };
  return [merge(raw), set];
}
