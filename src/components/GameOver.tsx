import React, { useState } from 'react';
import { RotateCcw, Home, Share2, ShoppingBag, Award, Check } from 'lucide-react';
import { RoundStats } from '../game/types';
import { ACHIEVEMENTS_CATALOG } from '../game/constants';

interface GameOverProps {
  stats: RoundStats;
  highScore: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onOpenShop: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  stats,
  highScore,
  onPlayAgain,
  onMainMenu,
  onOpenShop,
}) => {
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const bestScore = Math.max(stats.score, highScore);
  const totalAttempts = stats.biscuitsCaught + stats.biscuitsMissed;
  const accuracy =
    totalAttempts > 0 ? Math.round((stats.biscuitsCaught / totalAttempts) * 100) : 100;

  const handleShareScore = async () => {
    const modeLabel =
      stats.mode === 'BISCUIT_CATCHER' ? 'Biscuit Catcher' : 'Irani Chai Rush';
    const message = `I scored ${stats.score.toLocaleString()} points in Chai Pe Click! (${modeLabel})\nCan you beat my Hyderabad chai-and-biscuit record? ☕🍪`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Chai Pe Click! ☕🍪',
          text: message,
        });
        setShareFeedback('Shared!');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        setShareFeedback('Copied to Clipboard!');
      } else {
        setShareFeedback('Score ready to share!');
      }
    } catch {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(message).catch(() => {});
        setShareFeedback('Copied to Clipboard!');
      }
    }

    setTimeout(() => setShareFeedback(null), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1D3328] border border-amber-500/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-xs font-medium text-amber-300">
            {stats.mode === 'BISCUIT_CATCHER' ? 'Biscuit Catcher Round' : 'Irani Chai Rush Round'}{' '}
            <span aria-hidden="true">·</span> Level {stats.levelReached}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-50">
            {stats.isNewHighScore ? 'New Café High Score! 🎉' : 'Shift Complete at the Café!'}
          </h1>

          <p className="text-sm text-amber-100/80">
            {stats.isNewHighScore
              ? 'Wah Ustad! The entire Charminar crowd is applauding your record!'
              : 'Great effort! Check your stats below and upgrade your café gear.'}
          </p>
        </div>

        {/* Primary Score & Best Score */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#13241B] border border-amber-500/20 text-center">
          <div>
            <div className="text-xs text-amber-200/70">Final Score</div>
            <div className="text-2xl font-bold text-amber-300 font-mono-tabular mt-0.5">
              {stats.score.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-xs text-amber-200/70">Highest Score</div>
            <div className="text-2xl font-bold text-amber-100 font-mono-tabular mt-0.5">
              {bestScore.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-xs text-amber-200/70">Coins Earned</div>
            <div className="text-2xl font-bold text-amber-400 font-mono-tabular mt-0.5">
              +{stats.coinsEarned} 🪙
            </div>
          </div>

          <div>
            <div className="text-xs text-amber-200/70">Best Streak</div>
            <div className="text-2xl font-bold text-amber-100 font-mono-tabular mt-0.5">
              {stats.maxCombo}x
            </div>
          </div>
        </div>

        {/* Mode-Specific Statistics */}
        {stats.mode === 'BISCUIT_CATCHER' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Biscuits Caught</div>
              <div className="text-lg font-bold text-amber-50 font-mono-tabular">
                🍪 {stats.biscuitsCaught}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Golden Caught</div>
              <div className="text-lg font-bold text-amber-300 font-mono-tabular">
                ✨ {stats.goldenCaught}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Tray Accuracy</div>
              <div className="text-lg font-bold text-amber-50 font-mono-tabular">
                {accuracy}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Events Survived</div>
              <div className="text-lg font-bold text-amber-50 font-mono-tabular">
                {stats.eventsSurvived}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Chai Cups Brewed</div>
              <div className="text-lg font-bold text-amber-300 font-mono-tabular">
                ☕ {stats.chaiCupsBrewed}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Total Pour Taps</div>
              <div className="text-lg font-bold text-amber-50 font-mono-tabular">
                {stats.chaiClicks}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Brewing Rate</div>
              <div className="text-lg font-bold text-amber-50 font-mono-tabular">
                {(stats.chaiCupsBrewed / Math.max(1, stats.timeElapsed / 60)).toFixed(1)}/min
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#16291F] border border-amber-500/15">
              <div className="text-xs text-amber-200/70">Events Survived</div>
              <div className="text-lg font-bold text-amber-50 font-mono-tabular">
                {stats.eventsSurvived}
              </div>
            </div>
          </div>
        )}

        {/* Newly Unlocked Achievements Banner */}
        {stats.newlyUnlockedAchievements.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-400/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Award className="w-4 h-4" />
              <span>New Hyderabad Achievements Unlocked!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stats.newlyUnlockedAchievements.map((id) => {
                const ach = ACHIEVEMENTS_CATALOG.find((a) => a.id === id);
                if (!ach) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#13241B] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{ach.badgeIcon}</span>
                      <div>
                        <div className="font-bold text-amber-100">{ach.title}</div>
                        <div className="text-amber-200/70 text-[11px]">{ach.description}</div>
                      </div>
                    </div>
                    <span className="font-mono-tabular font-bold text-amber-300 shrink-0">
                      +{ach.rewardCoins} 🪙
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={handleShareScore}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#13241B] hover:bg-amber-900/40 text-amber-200 border border-amber-400/35 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {shareFeedback ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{shareFeedback}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share Score</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenShop}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#13241B] hover:bg-amber-900/40 text-amber-100 border border-amber-500/30 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Upgrade Shop</span>
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#13241B] hover:bg-amber-900/40 text-amber-100 border border-amber-500/30 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
