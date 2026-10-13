import {
  AchievementDefinition,
  HyderabadEventType,
  PowerUpType,
  SavedProgress,
  UpgradeDefinition,
} from './types';

export const ROUND_DURATION_SECONDS = 60;
export const INITIAL_LIVES = 3;
export const MAX_LIVES = 5;

export const SCORING = {
  NORMAL_BISCUIT: 10,
  GOLDEN_BISCUIT: 50,
  SPECIAL_BISCUIT: 25,
  CHAI_CLICK_BASE: 1,
  CHAI_CUP_COMPLETE_BONUS: 20,
  PERFECT_BREW_STREAK_BONUS: 15,
  GOLDEN_CHAI_EVENT_TAP: 120,
};

export const POWERUP_META: Record<
  PowerUpType,
  {
    name: string;
    shortDesc: string;
    durationMs: number;
    color: string;
    badge: string;
  }
> = {
  CHAI_BOOST: {
    name: 'Chai Boost',
    shortDesc: '2x Points for 5s',
    durationMs: 5000,
    color: '#D97706',
    badge: '☕',
  },
  BISCUIT_MAGNET: {
    name: 'Biscuit Magnet',
    shortDesc: 'Attracts biscuits to tray',
    durationMs: 6500,
    color: '#2563EB',
    badge: '🧲',
  },
  SLOW_MOTION: {
    name: 'Slow Motion',
    shortDesc: 'Slows falling speed for 5s',
    durationMs: 5000,
    color: '#0D9488',
    badge: '⏳',
  },
  GOLDEN_HOUR: {
    name: 'Golden Hour',
    shortDesc: 'High Golden Biscuit chance',
    durationMs: 7000,
    color: '#F59E0B',
    badge: '✨',
  },
  EXTRA_LIFE: {
    name: 'Extra Life',
    shortDesc: '+1 Life Restored',
    durationMs: 0,
    color: '#DC2626',
    badge: '❤️',
  },
};

export const HYDERABAD_EVENTS_META: Record<
  HyderabadEventType,
  {
    title: string;
    subtitle: string;
    durationMs: number;
    accentColor: string;
  }
> = {
  CHARMINAR_RUSH: {
    title: 'Charminar Rush!',
    subtitle: 'Biscuits fall faster & all points are 1.5x multiplied!',
    durationMs: 10000,
    accentColor: '#F59E0B',
  },
  RAINY_EVENING: {
    title: 'Monsoon Over Hussain Sagar',
    subtitle: 'Cozy rainy café vibe! Chai brewing & warm catches earn +50% points.',
    durationMs: 10000,
    accentColor: '#38BDF8',
  },
  BAKERY_DELIVERY: {
    title: 'Fresh Subhan Bakery Batch!',
    subtitle: 'Oven-fresh Osmania biscuits raining down in abundance!',
    durationMs: 8000,
    accentColor: '#FB923C',
  },
  GOLDEN_CHAI: {
    title: 'Special Zafrani Golden Chai!',
    subtitle: 'Click the glowing Golden Tea Glass on screen for +120 Bonus Points!',
    durationMs: 7500,
    accentColor: '#FBBF24',
  },
  CAFE_RUSH_HOUR: {
    title: 'Nimrah Café Rush Hour!',
    subtitle: 'High speed surge! Survive for +25 bonus Osmaniye Coins!',
    durationMs: 9000,
    accentColor: '#EF4444',
  },
};

export const UPGRADES_CATALOG: UpgradeDefinition[] = [
  {
    id: 'biggerTray',
    name: 'Bigger Silver Tray',
    hindiSub: 'Bada Dastarkhwan Tray',
    description: 'Widens your vintage café tea tray so catching fast Osmania biscuits is much easier.',
    effectSummary: (lvl) => `Tray width +${lvl * 16}% (Next: +${(lvl + 1) * 16}%)`,
    baseCost: 40,
    costMultiplier: 1.55,
    maxLevel: 8,
    modeTag: 'Biscuit Catcher',
  },
  {
    id: 'fasterHands',
    name: 'Ustad Faster Hands',
    hindiSub: 'Tez Chai Pouring',
    description: 'Increases brew gauge fill per tap so you complete cups of Irani chai faster.',
    effectSummary: (lvl) => `Brew fill speed +${lvl * 18}% (Next: +${(lvl + 1) * 18}%)`,
    baseCost: 40,
    costMultiplier: 1.55,
    maxLevel: 8,
    modeTag: 'Irani Chai Rush',
  },
  {
    id: 'luckyBiscuitJar',
    name: 'Lucky Pearled Biscuit Jar',
    hindiSub: 'Shahi Osmania Martaban',
    description: 'Increases the probability of Golden (+50 pts) and Special power-up biscuits spawning.',
    effectSummary: (lvl) => `Golden chance +${lvl * 4}% (Next: +${(lvl + 1) * 4}%)`,
    baseCost: 55,
    costMultiplier: 1.65,
    maxLevel: 7,
    modeTag: 'Biscuit Catcher',
  },
  {
    id: 'premiumTeaLeaves',
    name: 'Assam & Elaichi Tea Leaves',
    hindiSub: 'Khaas Dum Patti',
    description: 'Multiplies points earned from every click and completed cup in Irani Chai Rush & Biscuit Catcher.',
    effectSummary: (lvl) => `Point multiplier +${lvl * 15}% (Next: +${(lvl + 1) * 15}%)`,
    baseCost: 65,
    costMultiplier: 1.7,
    maxLevel: 8,
    modeTag: 'Both Modes',
  },
  {
    id: 'superStrainer',
    name: 'Brass Super Strainer',
    hindiSub: 'Pital Ki Channi',
    description: 'Extends the active duration of Chai Boost, Magnet, Slow Motion, and Golden Hour power-ups.',
    effectSummary: (lvl) => `Power-up duration +${lvl * 1.0}s (Next: +${(lvl + 1) * 1.0}s)`,
    baseCost: 50,
    costMultiplier: 1.6,
    maxLevel: 6,
    modeTag: 'Both Modes',
  },
];

export const ACHIEVEMENTS_CATALOG: AchievementDefinition[] = [
  {
    id: 'biscuit_combo',
    title: 'Biscuit Combo',
    description: 'Catch 5 Osmania biscuits consecutively without missing.',
    rewardCoins: 25,
    badgeIcon: '🍪',
  },
  {
    id: 'perfect_tray',
    title: 'Perfect Tray',
    description: 'Reach a streak of 10 consecutive biscuits caught without a single drop.',
    rewardCoins: 50,
    badgeIcon: '🥈',
  },
  {
    id: 'chai_champion',
    title: 'Chai Champion',
    description: 'Brew 20+ chai clicks rapidly and complete 5 cups in one round.',
    rewardCoins: 45,
    badgeIcon: '☕',
  },
  {
    id: 'hyderabad_hero',
    title: 'Hyderabad Hero',
    description: 'Score 500 or more points in a single 60-second round.',
    rewardCoins: 80,
    badgeIcon: '🕌',
  },
  {
    id: 'golden_bite',
    title: 'Golden Bite',
    description: 'Catch your first shimmering Golden Osmania Biscuit.',
    rewardCoins: 30,
    badgeIcon: '✨',
  },
  {
    id: 'ustad_brewer',
    title: 'Ustad of Dum Chai',
    description: 'Brew 12 or more cups of Irani Chai in a single round.',
    rewardCoins: 75,
    badgeIcon: '👑',
  },
  {
    id: 'charminar_survivor',
    title: 'Old City Regular',
    description: 'Experience and survive any Hyderabad Special Café Event.',
    rewardCoins: 40,
    badgeIcon: '🌧️',
  },
  {
    id: 'osmania_tycoon',
    title: 'Irani Café Patron',
    description: 'Purchase at least 3 upgrades in the Café Upgrade Shop.',
    rewardCoins: 60,
    badgeIcon: '🏺',
  },
];

export const DEFAULT_SAVED_PROGRESS: SavedProgress = {
  nickname: 'CharminarChaiwala',
  coins: 60, // Starter coins so player can test or save for upgrades
  highScores: {
    BISCUIT_CATCHER: 0,
    CHAI_RUSH: 0,
  },
  upgrades: {
    biggerTray: 0,
    fasterHands: 0,
    luckyBiscuitJar: 0,
    premiumTeaLeaves: 0,
    superStrainer: 0,
  },
  unlockedAchievements: [],
  leaderboard: [
    {
      id: 'seed-1',
      nickname: 'NimrahUstad',
      score: 640,
      mode: 'BISCUIT_CATCHER',
      date: '2026-10-10',
      metricCount: 42,
    },
    {
      id: 'seed-2',
      nickname: 'NilouferQueen',
      score: 520,
      mode: 'CHAI_RUSH',
      date: '2026-10-11',
      metricCount: 14,
    },
    {
      id: 'seed-3',
      nickname: 'AbidsBiscuitKing',
      score: 390,
      mode: 'BISCUIT_CATCHER',
      date: '2026-10-12',
      metricCount: 28,
    },
  ],
  totalBiscuitsAllTime: 0,
  totalChaiCupsAllTime: 0,
  soundMuted: false,
};

export function getUpgradeCost(baseCost: number, multiplier: number, currentLevel: number): number {
  return Math.round(baseCost * Math.pow(multiplier, currentLevel));
}
