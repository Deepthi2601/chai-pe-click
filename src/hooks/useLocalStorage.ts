import { useState, useEffect, useCallback } from 'react';
import {
  AchievementId,
  GameMode,
  LeaderboardEntry,
  SavedProgress,
  UpgradeId,
} from '../game/types';
import {
  ACHIEVEMENTS_CATALOG,
  DEFAULT_SAVED_PROGRESS,
  UPGRADES_CATALOG,
  getUpgradeCost,
} from '../game/constants';

const STORAGE_KEY = 'chai_pe_click_save_v1';

function sanitizeProgress(raw: unknown): SavedProgress {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_SAVED_PROGRESS;
  }
  const obj = raw as Partial<SavedProgress>;
  return {
    nickname:
      typeof obj.nickname === 'string' && obj.nickname.trim().length > 0
        ? obj.nickname.trim().slice(0, 20)
        : DEFAULT_SAVED_PROGRESS.nickname,
    coins: typeof obj.coins === 'number' && !Number.isNaN(obj.coins) && obj.coins >= 0 ? Math.floor(obj.coins) : DEFAULT_SAVED_PROGRESS.coins,
    highScores: {
      BISCUIT_CATCHER:
        typeof obj.highScores?.BISCUIT_CATCHER === 'number' && obj.highScores.BISCUIT_CATCHER >= 0
          ? Math.floor(obj.highScores.BISCUIT_CATCHER)
          : 0,
      CHAI_RUSH:
        typeof obj.highScores?.CHAI_RUSH === 'number' && obj.highScores.CHAI_RUSH >= 0
          ? Math.floor(obj.highScores.CHAI_RUSH)
          : 0,
    },
    upgrades: {
      biggerTray: Math.max(0, Math.min(8, Number(obj.upgrades?.biggerTray) || 0)),
      fasterHands: Math.max(0, Math.min(8, Number(obj.upgrades?.fasterHands) || 0)),
      luckyBiscuitJar: Math.max(0, Math.min(7, Number(obj.upgrades?.luckyBiscuitJar) || 0)),
      premiumTeaLeaves: Math.max(0, Math.min(8, Number(obj.upgrades?.premiumTeaLeaves) || 0)),
      superStrainer: Math.max(0, Math.min(6, Number(obj.upgrades?.superStrainer) || 0)),
    },
    unlockedAchievements: Array.isArray(obj.unlockedAchievements)
      ? (obj.unlockedAchievements.filter((id) =>
          ACHIEVEMENTS_CATALOG.some((a) => a.id === id)
        ) as AchievementId[])
      : [],
    leaderboard: Array.isArray(obj.leaderboard) && obj.leaderboard.length > 0
      ? obj.leaderboard.slice(0, 25)
      : DEFAULT_SAVED_PROGRESS.leaderboard,
    totalBiscuitsAllTime:
      typeof obj.totalBiscuitsAllTime === 'number' && obj.totalBiscuitsAllTime >= 0
        ? obj.totalBiscuitsAllTime
        : 0,
    totalChaiCupsAllTime:
      typeof obj.totalChaiCupsAllTime === 'number' && obj.totalChaiCupsAllTime >= 0
        ? obj.totalChaiCupsAllTime
        : 0,
    soundMuted: Boolean(obj.soundMuted),
  };
}

export function useGameStorage() {
  const [progress, setProgress] = useState<SavedProgress>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_SAVED_PROGRESS;
      return sanitizeProgress(JSON.parse(saved));
    } catch {
      return DEFAULT_SAVED_PROGRESS;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore quota errors gracefully
    }
  }, [progress]);

  const setNickname = useCallback((name: string) => {
    const clean = name.trim().slice(0, 20) || 'CharminarChaiwala';
    setProgress((prev) => ({ ...prev, nickname: clean }));
  }, []);

  const toggleSound = useCallback(() => {
    setProgress((prev) => ({ ...prev, soundMuted: !prev.soundMuted }));
  }, []);

  const purchaseUpgrade = useCallback(
    (upgradeId: UpgradeId): { success: boolean; newlyUnlocked: AchievementId[] } => {
      const def = UPGRADES_CATALOG.find((u) => u.id === upgradeId);
      if (!def) return { success: false, newlyUnlocked: [] };

      let purchased = false;
      const newlyUnlocked: AchievementId[] = [];

      setProgress((prev) => {
        const currentLevel = prev.upgrades[upgradeId] || 0;
        if (currentLevel >= def.maxLevel) return prev;
        const cost = getUpgradeCost(def.baseCost, def.costMultiplier, currentLevel);
        if (prev.coins < cost) return prev;

        purchased = true;
        const nextUpgrades = {
          ...prev.upgrades,
          [upgradeId]: currentLevel + 1,
        };

        const totalUpgradesCount = Object.values(nextUpgrades).reduce((a, b) => a + b, 0);
        let nextAchievements = [...prev.unlockedAchievements];
        let bonusAchievementCoins = 0;

        if (totalUpgradesCount >= 3 && !nextAchievements.includes('osmania_tycoon')) {
          nextAchievements.push('osmania_tycoon');
          newlyUnlocked.push('osmania_tycoon');
          const ach = ACHIEVEMENTS_CATALOG.find((a) => a.id === 'osmania_tycoon');
          if (ach) bonusAchievementCoins += ach.rewardCoins;
        }

        return {
          ...prev,
          coins: prev.coins - cost + bonusAchievementCoins,
          upgrades: nextUpgrades,
          unlockedAchievements: nextAchievements,
        };
      });

      return { success: purchased, newlyUnlocked };
    },
    []
  );

  const recordRoundResult = useCallback(
    (params: {
      mode: GameMode;
      score: number;
      coinsEarned: number;
      metricCount: number;
      newAchievements: AchievementId[];
    }) => {
      setProgress((prev) => {
        const currentHigh = prev.highScores[params.mode] || 0;
        const nextHigh = Math.max(currentHigh, params.score);

        // Calculate reward coins from newly unlocked achievements
        const trulyNewAchievements = params.newAchievements.filter(
          (id) => !prev.unlockedAchievements.includes(id)
        );
        const achievementCoinReward = trulyNewAchievements.reduce((sum, id) => {
          const def = ACHIEVEMENTS_CATALOG.find((a) => a.id === id);
          return sum + (def ? def.rewardCoins : 0);
        }, 0);

        const entry: LeaderboardEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          nickname: prev.nickname || 'CharminarChaiwala',
          score: params.score,
          mode: params.mode,
          date: new Date().toISOString().split('T')[0],
          metricCount: params.metricCount,
        };

        const nextLeaderboard = [...prev.leaderboard, entry]
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 15);

        return {
          ...prev,
          coins: prev.coins + params.coinsEarned + achievementCoinReward,
          highScores: {
            ...prev.highScores,
            [params.mode]: nextHigh,
          },
          unlockedAchievements: [
            ...prev.unlockedAchievements,
            ...trulyNewAchievements,
          ],
          leaderboard: nextLeaderboard,
          totalBiscuitsAllTime:
            params.mode === 'BISCUIT_CATCHER'
              ? prev.totalBiscuitsAllTime + params.metricCount
              : prev.totalBiscuitsAllTime,
          totalChaiCupsAllTime:
            params.mode === 'CHAI_RUSH'
              ? prev.totalChaiCupsAllTime + params.metricCount
              : prev.totalChaiCupsAllTime,
        };
      });
    },
    []
  );

  const resetAllProgress = useCallback(() => {
    setProgress(DEFAULT_SAVED_PROGRESS);
  }, []);

  return {
    progress,
    setNickname,
    toggleSound,
    purchaseUpgrade,
    recordRoundResult,
    resetAllProgress,
  };
}
