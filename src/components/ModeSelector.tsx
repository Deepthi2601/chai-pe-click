import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { GameMode, UpgradeLevels } from '../game/types';

interface ModeSelectorProps {
  highScores: {
    BISCUIT_CATCHER: number;
    CHAI_RUSH: number;
  };
  upgrades: UpgradeLevels;
  onStartMode: (mode: GameMode) => void;
  onBack: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  highScores,
  upgrades,
  onStartMode,
  onBack,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-50">Select Your Game Mode</h1>
          <p className="text-sm text-amber-200/80 mt-1">
            Each round lasts 60 seconds. Choose your specialty in the Irani café!
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13241B] hover:bg-amber-900/30 text-amber-100 border border-amber-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Mode A: Biscuit Catcher */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#1D3328] border border-amber-500/30 shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-medium text-amber-300 flex items-center gap-2">
              <span>Mode A</span>
              <span aria-hidden="true">·</span>
              <span>3 Lives</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                High Score: {highScores.BISCUIT_CATCHER.toLocaleString()}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-amber-50">Biscuit Catcher 🍪</h2>

            <p className="text-sm text-amber-100/85 leading-relaxed">
              Freshly baked Osmania biscuits are tumbling from the top shelves! Move your silver tea
              tray horizontally to catch every biscuit before it hits the floor.
            </p>

            <div className="space-y-2 pt-2 text-xs text-amber-100/85 border-t border-amber-500/20">
              <div className="font-semibold text-amber-300">Scoring & Rules:</div>
              <div>Normal Osmania Biscuit: +10 points</div>
              <div>Shimmering Golden Biscuit: +50 points</div>
              <div>Special Power-Up Biscuit: +25 points & activates power-up</div>
              <div>Missed Biscuit: Lose 1 ❤️ Life (3 Lives total)</div>
            </div>

            <div className="space-y-1 pt-2 text-xs text-amber-200/80 border-t border-amber-500/20">
              <div className="font-semibold text-amber-300">Your Active Café Upgrades:</div>
              <div>
                Tray Width Bonus: +{upgrades.biggerTray * 16}% · Golden Chance: +
                {upgrades.luckyBiscuitJar * 4}% · Point Multiplier: +
                {upgrades.premiumTeaLeaves * 15}%
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartMode('BISCUIT_CATCHER')}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Start Biscuit Catcher</span>
          </button>
        </div>

        {/* Mode B: Irani Chai Rush */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#1D3328] border border-amber-500/30 shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-medium text-amber-300 flex items-center gap-2">
              <span>Mode B</span>
              <span aria-hidden="true">·</span>
              <span>Speed Brewing</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                High Score: {highScores.CHAI_RUSH.toLocaleString()}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-amber-50">Irani Chai Rush ☕</h2>

            <p className="text-sm text-amber-100/85 leading-relaxed">
              The evening crowd has gathered at Nimrah Café! Tap rapidly, hold down the mouse/touch
              button, or press Spacebar to pour rich Assam decoction and creamy milk into fluted
              glasses.
            </p>

            <div className="space-y-2 pt-2 text-xs text-amber-100/85 border-t border-amber-500/20">
              <div className="font-semibold text-amber-300">Scoring & Rules:</div>
              <div>Every Tap / Pour Pulse: +1 Chai Point (scaled by multiplier)</div>
              <div>Completing a Full Cup: +20 Bonus Points</div>
              <div>Every 3rd Consecutive Cup: +15 Perfect Brewing Streak Bonus</div>
              <div>Tap Golden Chai glasses during special events for +120 Points!</div>
            </div>

            <div className="space-y-1 pt-2 text-xs text-amber-200/80 border-t border-amber-500/20">
              <div className="font-semibold text-amber-300">Your Active Café Upgrades:</div>
              <div>
                Brew Fill Speed: +{upgrades.fasterHands * 18}% · Point Multiplier: +
                {upgrades.premiumTeaLeaves * 15}% · Power-Up Duration: +
                {upgrades.superStrainer * 1.0}s
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartMode('CHAI_RUSH')}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Start Irani Chai Rush</span>
          </button>
        </div>
      </div>
    </div>
  );
};
