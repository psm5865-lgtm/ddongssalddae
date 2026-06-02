import { useLocalStorage } from '../hooks/useLocalStorage';

export type Settings = {
  nickname: string;
  limitMin: 3 | 5 | 7;
  onboarded: boolean;
};

const SETTINGS_KEY = 'ddongssalddae:settings';

const DEFAULT_SETTINGS: Settings = {
  nickname: '',
  limitMin: 5,
  onboarded: false,
};

function merge(raw: Partial<Settings> | null | undefined): Settings {
  return { ...DEFAULT_SETTINGS, ...(raw ?? {}) };
}

export function useSettings(): [
  Settings,
  (value: Settings | ((prev: Settings) => Settings)) => void,
] {
  const [raw, setRaw] = useLocalStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

  const setSettings = (value: Settings | ((prev: Settings) => Settings)) => {
    setRaw((prevRaw) => {
      const prevMerged = merge(prevRaw);
      return typeof value === 'function'
        ? (value as (prev: Settings) => Settings)(prevMerged)
        : value;
    });
  };

  return [merge(raw), setSettings];
}

export function nicknameOrFallback(nickname: string): string {
  const trimmed = nickname.trim();
  return trimmed.length > 0 ? trimmed : '그대';
}
