import React, { useState } from 'react';
import { ArrowLeft, Trophy, Award, HelpCircle, Share2, Check } from 'lucide-react';
import { AchievementId, GameMode, LeaderboardEntry } from '../game/types';
import { ACHIEVEMENTS_CATALOG, POWERUP_META } from '../game/constants';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  highScores: {
    BISCUIT_CATCHER: number;
    CHAI_RUSH: number;
  };
  nickname: string;
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  highScores,
  nickname,
  onBack,
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | GameMode>('ALL');
  const [copied, setCopied] = useState(false);

  const filtered = entries.filter((e) =>
    filterMode === 'ALL' ? true : e.mode === filterMode
  );

  const bestOverall = Math.max(
    highScores.BISCUIT_CATCHER,
    highScores.CHAI_RUSH,
    entries[0]?.score || 0
  );

  const handleShareBest = async () => {
    const text = `I scored ${bestOverall.toLocaleString()} points in Chai Pe Click! Can you beat my Hyderabad chai-and-biscuit record? ☕🍪`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Chai Pe Click!', text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1D3328] border border-amber-500/25 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <Trophy className="w-4 h-4" />
            <span>Local Browser Leaderboard · Saved on this Device</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-50 mt-1">Hyderabad Café Hall of Fame</h1>
          <p className="text-xs text-amber-100/75 mt-1">
            Playing as <span className="font-semibold text-amber-300">{nickname}</span> · Local high
            scores recorded on this device.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShareBest}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied Record!' : 'Share Best Score'}</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13241B] hover:bg-amber-900/30 text-amber-100 border border-amber-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Mode Filter Segmented Control */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#13241B] border border-amber-500/25">
          {(['ALL', 'BISCUIT_CATCHER', 'CHAI_RUSH'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterMode(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterMode === tab
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-amber-100/75 hover:text-amber-50'
              }`}
            >
              {tab === 'ALL'
                ? 'All Modes'
                : tab === 'BISCUIT_CATCHER'
                ? 'Biscuit Catcher'
                : 'Irani Chai Rush'}
            </button>
          ))}
        </div>

        <div className="text-xs text-amber-200/80 font-mono-tabular">
          Biscuit Best: {highScores.BISCUIT_CATCHER.toLocaleString()} · Chai Best:{' '}
          {highScores.CHAI_RUSH.toLocaleString()}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl bg-[#1D3328] border border-amber-500/25 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-amber-100/70">
            No scores recorded for this mode yet. Play a round to claim the #1 spot!
          </div>
        ) : (
          <div className="divide-y divide-amber-500/15">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#223B2E] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 text-sm font-bold font-mono-tabular text-amber-300">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-amber-50 text-sm">{item.nickname}</div>
                    <div className="text-xs text-amber-200/70">
                      {item.mode === 'BISCUIT_CATCHER'
                        ? `Biscuit Catcher · ${item.metricCount} biscuits`
                        : `Irani Chai Rush · ${item.metricCount} cups`}{' '}
                      · {item.date}
                    </div>
                  </div>
                </div>

                <div className="text-lg font-bold font-mono-tabular text-amber-300">
                  {item.score.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface AchievementsViewProps {
  unlocked: AchievementId[];
  onBack: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ unlocked, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between gap-4 bg-[#1D3328] border border-amber-500/25 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <Award className="w-4 h-4" />
            <span>
              Unlocked {unlocked.length} of {ACHIEVEMENTS_CATALOG.length} Badges
            </span>
          </div>
          <h1 className="text-3xl font-bold text-amber-50 mt-1">Hyderabad Café Achievements</h1>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13241B] hover:bg-amber-900/30 text-amber-100 border border-amber-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {ACHIEVEMENTS_CATALOG.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border flex items-start justify-between gap-4 ${
                isUnlocked
                  ? 'bg-[#1D3328] border-amber-400/40'
                  : 'bg-[#15261E] border-amber-500/15 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="text-2xl p-2.5 rounded-xl bg-[#12221A] border border-amber-500/20">
                  {ach.badgeIcon}
                </div>
                <div>
                  <h2 className="font-bold text-amber-50 text-base">{ach.title}</h2>
                  <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                  <div className="text-[11px] font-mono-tabular text-amber-300 mt-2">
                    Reward: +{ach.rewardCoins} Coins · {isUnlocked ? 'UNLOCKED ✓' : 'LOCKED'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HowToPlayView: React.FC<{ onBack: () => void; onStartPlay: () => void }> = ({
  onBack,
  onStartPlay,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between gap-4 bg-[#1D3328] border border-amber-500/25 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <HelpCircle className="w-4 h-4" />
            <span>Rules, Power-Ups & Special Events</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-50 mt-1">How to Play Chai Pe Click!</h1>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13241B] hover:bg-amber-900/30 text-amber-100 border border-amber-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#1D3328] border border-amber-500/25 space-y-3">
          <h2 className="text-xl font-bold text-amber-50">Mode A: Biscuit Catcher 🍪</h2>
          <p className="text-sm text-amber-100/80 leading-relaxed">
            Move your silver tea tray left and right using your mouse, touch drag, or Arrow / A-D
            keys. Catch Normal Biscuits (+10), Golden Biscuits (+50), and Special Power-Up Biscuits
            (+25). Missing a biscuit costs 1 life!
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1D3328] border border-amber-500/25 space-y-3">
          <h2 className="text-xl font-bold text-amber-50">Mode B: Irani Chai Rush ☕</h2>
          <p className="text-sm text-amber-100/80 leading-relaxed">
            Click, tap rapidly, hold the pointer down, or tap Spacebar to pour steaming Irani chai.
            Every tap scores points and fills the glass. Completing a full cup awards +20 bonus
            points, plus streak bonuses every 3 cups!
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#1D3328] border border-amber-500/25 space-y-4">
        <h2 className="text-xl font-bold text-amber-50">Power-Ups & Special Biscuits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {Object.entries(POWERUP_META).map(([key, meta]) => (
            <div key={key} className="p-3.5 rounded-xl bg-[#13241B] border border-amber-500/20">
              <div className="font-bold text-amber-200 text-sm">
                {meta.badge} {meta.name}
              </div>
              <div className="text-amber-100/75 mt-1">{meta.shortDesc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onStartPlay}
          className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-colors cursor-pointer"
        >
          Choose Mode & Start Playing
        </button>
      </div>
    </div>
  );
};
