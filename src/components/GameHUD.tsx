import React from 'react';
import { Volume2, VolumeX, Pause, Heart, Flame } from 'lucide-react';
import { ActiveHyderabadEvent, ActivePowerUp, GameMode } from '../game/types';
import { MAX_LIVES, POWERUP_META } from '../game/constants';

interface GameHUDProps {
  mode: GameMode;
  score: number;
  highScore: number;
  timeLeft: number;
  level: number;
  lives: number;
  combo: number;
  chaiCups: number;
  brewProgress: number;
  activePowerUps: ActivePowerUp[];
  activeEvent: ActiveHyderabadEvent | null;
  soundMuted: boolean;
  onToggleSound: () => void;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  mode,
  score,
  highScore,
  timeLeft,
  level,
  lives,
  combo,
  chaiCups,
  brewProgress,
  activePowerUps,
  activeEvent,
  soundMuted,
  onToggleSound,
  onPause,
}) => {
  const bestScore = Math.max(score, highScore);
  const isLowTime = timeLeft <= 10;

  return (
    <div className="w-full space-y-2">
      {/* Main Top HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#1F352A]/95 border border-amber-500/25 shadow-lg">
        {/* Score & Best Score */}
        <div className="flex items-center gap-5">
          <div>
            <div className="text-[11px] font-medium text-amber-200/70">Score</div>
            <div className="text-2xl font-bold text-amber-50 font-mono-tabular leading-tight">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="h-7 w-px bg-amber-500/20" />

          <div>
            <div className="text-[11px] font-medium text-amber-200/70">Best</div>
            <div className="text-lg font-semibold text-amber-300 font-mono-tabular leading-tight">
              {bestScore.toLocaleString()}
            </div>
          </div>

          <div className="hidden sm:block h-7 w-px bg-amber-500/20" />

          <div className="hidden sm:block">
            <div className="text-[11px] font-medium text-amber-200/70">Level</div>
            <div className="text-lg font-semibold text-amber-100 font-mono-tabular leading-tight">
              Lv. {level}
            </div>
          </div>
        </div>

        {/* Center Countdown Timer */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-1.5 rounded-lg border font-mono-tabular text-xl font-bold transition-colors ${
              isLowTime
                ? 'bg-red-950/80 border-red-400 text-red-200'
                : 'bg-[#14241C] border-amber-500/30 text-amber-100'
            }`}
          >
            00:{String(Math.max(0, timeLeft)).padStart(2, '0')}
          </div>

          {combo >= 3 && (
            <div className="flex items-center gap-1 text-amber-300 font-mono-tabular text-sm font-bold">
              <Flame className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{combo}x Streak</span>
            </div>
          )}
        </div>

        {/* Mode-specific Metric + Controls */}
        <div className="flex items-center gap-4">
          {mode === 'BISCUIT_CATCHER' ? (
            <div className="flex items-center gap-1" aria-label={`Lives remaining: ${lives}`}>
              {Array.from({ length: MAX_LIVES }).map((_, idx) => {
                const active = idx < lives;
                return (
                  <Heart
                    key={idx}
                    className={`w-5 h-5 transition-transform ${
                      active
                        ? 'text-red-400 fill-red-500 scale-100'
                        : 'text-amber-100/20 scale-90'
                    }`}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] font-medium text-amber-200/70">Chai Cups</div>
                <div className="text-base font-bold text-amber-300 font-mono-tabular leading-tight">
                  ☕ {chaiCups}
                </div>
              </div>
              <div className="w-20 h-2.5 bg-[#14241C] rounded-full overflow-hidden border border-amber-500/30">
                <div
                  className="h-full bg-amber-400 transition-all duration-100"
                  style={{ width: `${Math.min(100, Math.round(brewProgress))}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-[#14241C] hover:bg-amber-900/40 text-amber-100 border border-amber-500/25 transition-colors cursor-pointer"
              aria-label={soundMuted ? 'Unmute sound' : 'Mute sound'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Power-Ups & Hyderabad Special Event Row */}
      {(activePowerUps.length > 0 || activeEvent) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#1A2E24]/90 border border-amber-500/20 text-xs">
          {/* Active Power-Ups */}
          <div className="flex flex-wrap items-center gap-3">
            {activePowerUps.map((p) => {
              const meta = POWERUP_META[p.type];
              return (
                <div
                  key={p.type}
                  className="flex items-center gap-1.5 font-medium text-amber-100"
                >
                  <span>{meta.badge}</span>
                  <span>{meta.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-300/90">{meta.shortDesc}</span>
                </div>
              );
            })}
          </div>

          {/* Active Hyderabad Event Banner */}
          {activeEvent && (
            <div className="flex items-center gap-2 text-amber-200 font-medium">
              <span className="font-semibold text-amber-300">{activeEvent.title}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-100/85">{activeEvent.subtitle}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
