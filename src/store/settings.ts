import { useLocalStorage } from '../hooks/useLocalStorage';

export type NotifySettings = {
  /** 기본 OFF. 사용자가 직접 켤 때만 true. 똥쌀때는 먼저 알림을 보내지 않아요. */
  enabled: boolean;
  /** 'HH:MM' — 사용자가 켰을 때 매일 알림 받을 시간. */
  time: string;
  /** 동의(켠) 시각. 실제 토스 미니앱에서는 SDK 동의 시점 기록과 연결. */
  consentAt: number | null;
};

export type Settings = {
  nickname: string;
  limitMin: 3 | 5 | 7;
  onboarded: boolean;
  notify: NotifySettings;
};

const SETTINGS_KEY = 'ddongssalddae:settings';

const DEFAULT_NOTIFY: NotifySettings = {
  enabled: false,
  time: '21:00',
  consentAt: null,
};

const DEFAULT_SETTINGS: Settings = {
  nickname: '',
  limitMin: 5,
  onboarded: false,
  notify: DEFAULT_NOTIFY,
};

function merge(raw: Partial<Settings> | null | undefined): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...(raw ?? {}),
    notify: { ...DEFAULT_NOTIFY, ...(raw?.notify ?? {}) },
  };
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
