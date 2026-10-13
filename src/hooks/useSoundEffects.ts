import { useCallback, useRef } from 'react';

export function useSoundEffects(muted: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback((): AudioContext | null => {
    if (muted || typeof window === 'undefined') return null;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, [muted]);

  const playTone = useCallback(
    (
      freq: number,
      type: OscillatorType,
      duration: number,
      volume = 0.12,
      slideToFreq?: number
    ) => {
      const ctx = getContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (slideToFreq) {
          osc.frequency.exponentialRampToValueAtTime(slideToFreq, ctx.currentTime + duration);
        }
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignore audio errors
      }
    },
    [getContext]
  );

  const playBiscuitCatch = useCallback(
    (combo = 1) => {
      const pitchBoost = Math.min(combo * 18, 220);
      playTone(480 + pitchBoost, 'triangle', 0.11, 0.14, 680 + pitchBoost);
    },
    [playTone]
  );

  const playGoldenCatch = useCallback(() => {
    playTone(587.33, 'sine', 0.14, 0.15, 880);
    setTimeout(() => playTone(880, 'triangle', 0.22, 0.15, 1174.66), 80);
  }, [playTone]);

  const playBiscuitMiss = useCallback(() => {
    playTone(220, 'sawtooth', 0.24, 0.11, 110);
  }, [playTone]);

  const playChaiClick = useCallback(
    (progressRatio = 0.5) => {
      const base = 320 + Math.round(progressRatio * 240);
      playTone(base, 'sine', 0.06, 0.09, base + 70);
    },
    [playTone]
  );

  const playChaiCupComplete = useCallback(() => {
    playTone(523.25, 'triangle', 0.12, 0.14);
    setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.14), 70);
    setTimeout(() => playTone(783.99, 'triangle', 0.22, 0.16), 140);
  }, [playTone]);

  const playPowerUp = useCallback(() => {
    playTone(440, 'sine', 0.12, 0.14, 660);
    setTimeout(() => playTone(660, 'sine', 0.18, 0.15, 990), 90);
  }, [playTone]);

  const playEventStart = useCallback(() => {
    playTone(392, 'triangle', 0.15, 0.14);
    setTimeout(() => playTone(523.25, 'triangle', 0.25, 0.15), 110);
  }, [playTone]);

  const playAchievement = useCallback(() => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      setTimeout(() => playTone(n, 'triangle', 0.16, 0.15), idx * 75);
    });
  }, [playTone]);

  const playGameOver = useCallback(() => {
    const notes = [392, 349.23, 329.63, 261.63];
    notes.forEach((n, idx) => {
      setTimeout(() => playTone(n, 'sawtooth', 0.22, 0.1), idx * 120);
    });
  }, [playTone]);

  const playButtonClick = useCallback(() => {
    playTone(600, 'sine', 0.045, 0.07, 720);
  }, [playTone]);

  return {
    playBiscuitCatch,
    playGoldenCatch,
    playBiscuitMiss,
    playChaiClick,
    playChaiCupComplete,
    playPowerUp,
    playEventStart,
    playAchievement,
    playGameOver,
    playButtonClick,
  };
}
