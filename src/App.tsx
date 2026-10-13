import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Home, Award } from 'lucide-react';
import {
  AchievementId,
  ActiveHyderabadEvent,
  ActivePowerUp,
  GameMode,
  RoundStats,
  ScreenState,
  UpgradeId,
} from './game/types';
import { ACHIEVEMENTS_CATALOG, INITIAL_LIVES, ROUND_DURATION_SECONDS } from './game/constants';
import { useGameStorage } from './hooks/useLocalStorage';
import { useSoundEffects } from './hooks/useSoundEffects';
import { MainMenu } from './components/MainMenu';
import { ModeSelector } from './components/ModeSelector';
import { GameHUD } from './components/GameHUD';
import { GameCanvas } from './components/GameCanvas';
import { GameOver } from './components/GameOver';
import { UpgradeShop } from './components/UpgradeShop';
import { Leaderboard, AchievementsView, HowToPlayView } from './components/Leaderboard';

export function App() {
  const {
    progress,
    setNickname,
    toggleSound,
    purchaseUpgrade,
    recordRoundResult,
  } = useGameStorage();

  const sounds = useSoundEffects(progress.soundMuted);

  const [screen, setScreen] = useState<ScreenState>('WELCOME');
  const [selectedMode, setSelectedMode] = useState<GameMode>('BISCUIT_CATCHER');
  const [roundKey, setRoundKey] = useState<number>(1);
  const [lastRoundStats, setLastRoundStats] = useState<RoundStats | null>(null);
  const [achievementToast, setAchievementToast] = useState<AchievementId | null>(null);

  const [hudState, setHudState] = useState<{
    score: number;
    timeLeft: number;
    level: number;
    lives: number;
    combo: number;
    chaiCups: number;
    brewProgress: number;
    activePowerUps: ActivePowerUp[];
    activeEvent: ActiveHyderabadEvent | null;
  }>({
    score: 0,
    timeLeft: ROUND_DURATION_SECONDS,
    level: 1,
    lives: INITIAL_LIVES,
    combo: 0,
    chaiCups: 0,
    brewProgress: 0,
    activePowerUps: [],
    activeEvent: null,
  });

  const startRound = useCallback(
    (mode: GameMode) => {
      sounds.playButtonClick();
      setSelectedMode(mode);
      setHudState({
        score: 0,
        timeLeft: ROUND_DURATION_SECONDS,
        level: 1,
        lives: INITIAL_LIVES,
        combo: 0,
        chaiCups: 0,
        brewProgress: 0,
        activePowerUps: [],
        activeEvent: null,
      });
      setRoundKey((k) => k + 1);
      setScreen('PLAYING');
    },
    [sounds]
  );

  const handleGameOver = useCallback(
    (stats: RoundStats) => {
      setLastRoundStats(stats);
      recordRoundResult({
        mode: stats.mode,
        score: stats.score,
        coinsEarned: stats.coinsEarned,
        metricCount:
          stats.mode === 'BISCUIT_CATCHER' ? stats.biscuitsCaught : stats.chaiCupsBrewed,
        newAchievements: stats.newlyUnlockedAchievements,
      });

      if (stats.newlyUnlockedAchievements.length > 0) {
        sounds.playAchievement();
        setAchievementToast(stats.newlyUnlockedAchievements[0]);
        setTimeout(() => setAchievementToast(null), 4000);
      }

      setScreen('GAME_OVER');
    },
    [recordRoundResult, sounds]
  );

  const handlePurchaseUpgrade = useCallback(
    (id: UpgradeId) => {
      const res = purchaseUpgrade(id);
      if (res.success) {
        sounds.playPowerUp();
        if (res.newlyUnlocked.length > 0) {
          sounds.playAchievement();
          setAchievementToast(res.newlyUnlocked[0]);
          setTimeout(() => setAchievementToast(null), 4000);
        }
      }
    },
    [purchaseUpgrade, sounds]
  );

  const navigateTo = useCallback(
    (next: ScreenState) => {
      sounds.playButtonClick();
      setScreen(next);
    },
    [sounds]
  );

  const toastMeta = achievementToast
    ? ACHIEVEMENTS_CATALOG.find((a) => a.id === achievementToast)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#16281F] text-[#FDF8F0]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-amber-500/20 bg-[#12221A]">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => navigateTo('WELCOME')}
          className="text-lg font-extrabold tracking-tight text-amber-50 font-display whitespace-nowrap shrink-0 cursor-pointer"
        >
          Chai Pe Click!
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-100/80">
          <button
            type="button"
            onClick={() => navigateTo('MODE_SELECT')}
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Modes
          </button>
          <button
            type="button"
            onClick={() => navigateTo('UPGRADE_SHOP')}
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Upgrade Shop
          </button>
          <button
            type="button"
            onClick={() => navigateTo('LEADERBOARD')}
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Leaderboard
          </button>
          <button
            type="button"
            onClick={() => navigateTo('ACHIEVEMENTS')}
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Badges
          </button>
          <button
            type="button"
            onClick={() => navigateTo('HOW_TO_PLAY')}
            className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How to Play
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              screen === 'PLAYING' ? setScreen('PAUSED') : navigateTo('MODE_SELECT')
            }
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {screen === 'PLAYING' ? 'Pause Game' : 'Play Now'}
          </button>
        </div>
      </header>

      {/* Celebratory Achievement Toast */}
      {toastMeta && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1D3328] border border-amber-400 shadow-2xl">
          <div className="text-2xl">{toastMeta.badgeIcon}</div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Award className="w-3.5 h-3.5" />
              <span>Achievement Unlocked! (+{toastMeta.rewardCoins} Coins)</span>
            </div>
            <div className="text-sm font-bold text-amber-50">{toastMeta.title}</div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {screen === 'WELCOME' && (
          <MainMenu
            progress={progress}
            onUpdateNickname={setNickname}
            onSelectModeAndStart={startRound}
            onNavigate={navigateTo}
          />
        )}

        {screen === 'MODE_SELECT' && (
          <ModeSelector
            highScores={progress.highScores}
            upgrades={progress.upgrades}
            onStartMode={startRound}
            onBack={() => navigateTo('WELCOME')}
          />
        )}

        {(screen === 'PLAYING' || screen === 'PAUSED') && (
          <div className="flex-1 flex flex-col gap-3 min-h-[540px] relative">
            <GameHUD
              mode={selectedMode}
              score={hudState.score}
              highScore={progress.highScores[selectedMode]}
              timeLeft={hudState.timeLeft}
              level={hudState.level}
              lives={hudState.lives}
              combo={hudState.combo}
              chaiCups={hudState.chaiCups}
              brewProgress={hudState.brewProgress}
              activePowerUps={hudState.activePowerUps}
              activeEvent={hudState.activeEvent}
              soundMuted={progress.soundMuted}
              onToggleSound={toggleSound}
              onPause={() => setScreen(screen === 'PAUSED' ? 'PLAYING' : 'PAUSED')}
            />

            <GameCanvas
              key={roundKey}
              mode={selectedMode}
              isPaused={screen === 'PAUSED'}
              upgrades={progress.upgrades}
              highScore={progress.highScores[selectedMode]}
              alreadyUnlockedAchievements={progress.unlockedAchievements}
              onHudUpdate={setHudState}
              onGameOver={handleGameOver}
              sounds={sounds}
            />

            {/* Pause Overlay Modal */}
            {screen === 'PAUSED' && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-xs rounded-2xl p-4">
                <div className="w-full max-w-sm p-6 rounded-2xl bg-[#1D3328] border border-amber-500/35 shadow-2xl text-center space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-50">Chai Break (Paused)</h2>
                    <p className="text-xs text-amber-200/80 mt-1">
                      Take a sip of Irani chai. Your 60-second timer is paused.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setScreen('PLAYING')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Resume Game</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => startRound(selectedMode)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#13241B] hover:bg-amber-900/40 text-amber-100 border border-amber-500/30 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restart Round</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('WELCOME')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#13241B] hover:bg-amber-900/40 text-amber-100 border border-amber-500/30 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      <Home className="w-4 h-4" />
                      <span>Return to Menu</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === 'GAME_OVER' && lastRoundStats && (
          <GameOver
            stats={lastRoundStats}
            highScore={progress.highScores[lastRoundStats.mode]}
            onPlayAgain={() => startRound(lastRoundStats.mode)}
            onMainMenu={() => navigateTo('WELCOME')}
            onOpenShop={() => navigateTo('UPGRADE_SHOP')}
          />
        )}

        {screen === 'UPGRADE_SHOP' && (
          <UpgradeShop
            coins={progress.coins}
            upgrades={progress.upgrades}
            onPurchase={handlePurchaseUpgrade}
            onBack={() => navigateTo('WELCOME')}
          />
        )}

        {screen === 'LEADERBOARD' && (
          <Leaderboard
            entries={progress.leaderboard}
            highScores={progress.highScores}
            nickname={progress.nickname}
            onBack={() => navigateTo('WELCOME')}
          />
        )}

        {screen === 'ACHIEVEMENTS' && (
          <AchievementsView
            unlocked={progress.unlockedAchievements}
            onBack={() => navigateTo('WELCOME')}
          />
        )}

        {screen === 'HOW_TO_PLAY' && (
          <HowToPlayView
            onBack={() => navigateTo('WELCOME')}
            onStartPlay={() => navigateTo('MODE_SELECT')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
