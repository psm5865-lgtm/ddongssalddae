import { useEffect, useRef, useState } from 'react';

export type CountdownState = {
  elapsedSec: number;
  remainingSec: number;
  isOver: boolean;
};

export function useCountdown(totalSec: number, running: boolean): CountdownState {
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      startedAtRef.current = null;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (now: number) => {
      if (startedAtRef.current === null) startedAtRef.current = now;
      const sec = Math.floor((now - startedAtRef.current) / 1000);
      setElapsed(sec);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const remaining = Math.max(0, totalSec - elapsed);
  return {
    elapsedSec: elapsed,
    remainingSec: remaining,
    isOver: elapsed >= totalSec,
  };
}

export function formatMMSS(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(1, '0')}:${s.toString().padStart(2, '0')}`;
}
