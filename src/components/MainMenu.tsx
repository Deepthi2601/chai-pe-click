import React, { useState } from 'react';
import { Play, ShoppingBag, Trophy, Award, HelpCircle, Sparkles } from 'lucide-react';
import { GameMode, SavedProgress, ScreenState } from '../game/types';
import { ACHIEVEMENTS_CATALOG } from '../game/constants';

interface MainMenuProps {
  progress: SavedProgress;
  onUpdateNickname: (name: string) => void;
  onSelectModeAndStart: (mode: GameMode) => void;
  onNavigate: (screen: ScreenState) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onUpdateNickname,
  onSelectModeAndStart,
  onNavigate,
}) => {
  const [nicknameInput, setNicknameInput] = useState(progress.nickname);
  const [nameSavedToast, setNameSavedToast] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNickname(nicknameInput);
    setNameSavedToast(true);
    setTimeout(() => setNameSavedToast(false), 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-4">
      {/* Hero Banner Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#1D3328] border border-amber-500/25 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Left Column: Title, Tagline, Nickname & Primary CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-medium text-amber-300/90 flex items-center gap-2">
              <span>Old City Irani Café Arcade</span>
              <span aria-hidden="true">·</span>
              <span>Charminar Edition</span>
              <span aria-hidden="true">·</span>
              <span>60-Second Rush</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-extrabold text-amber-50 tracking-tight leading-[1.1]"
              style={{ textWrap: 'balance' }}
            >
              Chai Pe Click! ☕🍪
            </h1>

            <p className="text-lg sm:text-xl font-display text-amber-300">
              Catch the biscuits. Brew the chai. Rule Hyderabad!
            </p>

            <p className="text-sm sm:text-base text-amber-100/80 max-w-xl leading-relaxed">
              Step inside Hyderabad’s bustling vintage Irani café. Slide your silver saucer tray to
              catch oven-fresh Osmania biscuits from Subhan Bakery, or rapidly pour steaming cups
              of dum Irani chai before the 60-second clock runs out.
            </p>
          </div>

          {/* Player Nickname Form */}
          <form onSubmit={handleSaveName} className="flex flex-wrap items-center gap-3 pt-1">
            <label htmlFor="player-nickname" className="text-xs font-medium text-amber-200/80">
              Café Patron Name:
            </label>
            <input
              id="player-nickname"
              type="text"
              maxLength={20}
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="Enter nickname..."
              className="px-3.5 py-2 rounded-lg bg-[#12221A] border border-amber-500/30 text-sm text-amber-50 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-xs font-semibold text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {nameSavedToast ? 'Saved!' : 'Save Name'}
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('MODE_SELECT')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Play Game</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('UPGRADE_SHOP')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#13241B] hover:bg-[#182D22] text-amber-100 border border-amber-500/30 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Upgrade Shop ({progress.coins} Coins)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('HOW_TO_PLAY')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#13241B] hover:bg-[#182D22] text-amber-100 border border-amber-500/30 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>How to Play</span>
            </button>
          </div>
        </div>

        {/* Right Column: Animated SVG Irani Chai & Osmania Biscuit Illustration */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-[#14251C] border border-amber-500/20 relative overflow-hidden">
          <svg
            viewBox="0 0 280 220"
            className="w-full max-w-[270px] h-auto animate-float-slow"
            role="img"
            aria-label="Illustrated Irani Chai glass and Osmania biscuits"
          >
            {/* Warm Radial Glow */}
            <defs>
              <radialGradient id="chaiGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="140" cy="115" r="95" fill="url(#chaiGlow)" />

            {/* Steam wisps */}
            <path
              d="M100 58 Q92 42 104 28"
              stroke="#FDE68A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-1"
            />
            <path
              d="M122 52 Q130 36 118 22"
              stroke="#FDE68A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-2"
            />
            <path
              d="M142 58 Q134 42 146 28"
              stroke="#FDE68A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-3"
            />

            {/* Ceramic Saucer */}
            <ellipse
              cx="120"
              cy="172"
              rx="66"
              ry="16"
              fill="#FFFBEB"
              stroke="#D97706"
              strokeWidth="3"
            />

            {/* Fluted Irani Tea Glass */}
            <polygon
              points="85,72 155,72 142,168 98,168"
              fill="#B45309"
              stroke="#FEF3C7"
              strokeWidth="3.5"
            />
            {/* Creamy Malai Top Layer */}
            <polygon points="87,82 153,82 151,92 89,92" fill="#FDE68A" />
            {/* Glass Flutes */}
            <line x1="102" y1="76" x2="106" y2="164" stroke="#FEF3C7" strokeOpacity="0.4" strokeWidth="2" />
            <line x1="120" y1="76" x2="120" y2="164" stroke="#FEF3C7" strokeOpacity="0.4" strokeWidth="2" />
            <line x1="138" y1="76" x2="134" y2="164" stroke="#FEF3C7" strokeOpacity="0.4" strokeWidth="2" />

            {/* Golden Osmania Biscuit on the right */}
            <g transform="translate(202, 132) rotate(-14)">
              <circle cx="0" cy="0" r="36" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="29" fill="#F59E0B" />
              <circle
                cx="0"
                cy="0"
                r="21"
                fill="none"
                stroke="#78350F"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle cx="0" cy="0" r="2.2" fill="#78350F" />
              <circle cx="-8" cy="-7" r="2.2" fill="#78350F" />
              <circle cx="8" cy="-7" r="2.2" fill="#78350F" />
              <circle cx="-8" cy="7" r="2.2" fill="#78350F" />
              <circle cx="8" cy="7" r="2.2" fill="#78350F" />
            </g>
          </svg>

          {/* Career Summary Strip */}
          <div className="w-full pt-4 mt-2 border-t border-amber-500/20 flex items-center justify-around text-center">
            <div>
              <div className="text-[11px] text-amber-200/70">Osmaniye Coins</div>
              <div className="text-base font-bold text-amber-300 font-mono-tabular">
                🪙 {progress.coins}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-amber-200/70">Biscuits Caught</div>
              <div className="text-base font-bold text-amber-100 font-mono-tabular">
                {progress.totalBiscuitsAllTime}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-amber-200/70">Chai Cups Brewed</div>
              <div className="text-base font-bold text-amber-100 font-mono-tabular">
                {progress.totalChaiCupsAllTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Mode Cards (2-Column Balanced Split) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Mode A Card */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#1D3328] border border-amber-500/25 space-y-5">
          <div className="space-y-2">
            <div className="text-xs font-medium text-amber-300/90 flex items-center gap-2">
              <span>Mode A</span>
              <span aria-hidden="true">·</span>
              <span>Arcade Reflexes</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                Best: {progress.highScores.BISCUIT_CATCHER.toLocaleString()} pts
              </span>
            </div>
            <h2 className="text-2xl font-bold text-amber-50">Biscuit Catcher 🍪</h2>
            <p className="text-sm text-amber-100/80 leading-relaxed">
              Slide your silver tea tray across the café floor to catch falling Osmania biscuits.
              Snag shimmering Golden Biscuits (+50 pts) and power-up biscuits while protecting your
              3 lives!
            </p>
          </div>
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="text-xs text-amber-200/70">
              Controls: Mouse, Touch Drag, or Arrow Keys / A & D
            </div>
            <button
              type="button"
              onClick={() => onSelectModeAndStart('BISCUIT_CATCHER')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Play Biscuit Catcher
            </button>
          </div>
        </div>

        {/* Mode B Card */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#1D3328] border border-amber-500/25 space-y-5">
          <div className="space-y-2">
            <div className="text-xs font-medium text-amber-300/90 flex items-center gap-2">
              <span>Mode B</span>
              <span aria-hidden="true">·</span>
              <span>Rapid Clicker Rush</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                Best: {progress.highScores.CHAI_RUSH.toLocaleString()} pts
              </span>
            </div>
            <h2 className="text-2xl font-bold text-amber-50">Irani Chai Rush ☕</h2>
            <p className="text-sm text-amber-100/80 leading-relaxed">
              Tap rapidly or hold on the fluted Irani tea glass to pour rich decoction and creamy
              malai. Complete full cups for +20 bonus points and chain perfect brewing streaks!
            </p>
          </div>
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="text-xs text-amber-200/70">
              Controls: Rapid Click / Tap, Hold Button, or Spacebar
            </div>
            <button
              type="button"
              onClick={() => onSelectModeAndStart('CHAI_RUSH')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Play Chai Rush
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Achievements & Leaderboard Preview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="p-6 rounded-2xl bg-[#192D23] border border-amber-500/20 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Award className="w-4 h-4" />
              <span>Hyderabad Achievements</span>
            </div>
            <p className="text-xs text-amber-100/75">
              Unlocked {progress.unlockedAchievements.length} of {ACHIEVEMENTS_CATALOG.length}{' '}
              badges. Earn bonus coins for each milestone!
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('ACHIEVEMENTS')}
            className="px-4 py-2 rounded-lg bg-[#12221A] hover:bg-amber-900/40 text-amber-200 border border-amber-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Badges
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-[#192D23] border border-amber-500/20 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Trophy className="w-4 h-4" />
              <span>Local Café Leaderboard</span>
            </div>
            <p className="text-xs text-amber-100/75">
              Top record:{' '}
              <span className="font-mono-tabular font-semibold text-amber-200">
                {progress.leaderboard[0]?.score.toLocaleString() || 0} pts
              </span>{' '}
              by {progress.leaderboard[0]?.nickname || progress.nickname}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('LEADERBOARD')}
            className="px-4 py-2 rounded-lg bg-[#12221A] hover:bg-amber-900/40 text-amber-200 border border-amber-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
