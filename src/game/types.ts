export type GameMode = 'BISCUIT_CATCHER' | 'CHAI_RUSH';

export type ScreenState =
  | 'WELCOME'
  | 'MODE_SELECT'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'UPGRADE_SHOP'
  | 'LEADERBOARD'
  | 'ACHIEVEMENTS'
  | 'HOW_TO_PLAY';

export type PowerUpType =
  | 'CHAI_BOOST'
  | 'BISCUIT_MAGNET'
  | 'SLOW_MOTION'
  | 'GOLDEN_HOUR'
  | 'EXTRA_LIFE';

export type HyderabadEventType =
  | 'CHARMINAR_RUSH'
  | 'RAINY_EVENING'
  | 'BAKERY_DELIVERY'
  | 'GOLDEN_CHAI'
  | 'CAFE_RUSH_HOUR';

export type BiscuitVariant = 'NORMAL' | 'GOLDEN' | 'SPECIAL';

export interface FallingBiscuit {
  id: string;
  x: number;
  y: number;
  radius: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  variant: BiscuitVariant;
  powerUp?: PowerUpType;
  wobblePhase: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  expiresAt: number;
  totalDuration: number;
}

export interface ActiveHyderabadEvent {
  type: HyderabadEventType;
  title: string;
  subtitle: string;
  expiresAt: number;
  totalDuration: number;
  goldenChaiX?: number;
  goldenChaiY?: number;
  goldenChaiTapped?: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
  vy: number;
  scale: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export type UpgradeId =
  | 'biggerTray'
  | 'fasterHands'
  | 'luckyBiscuitJar'
  | 'premiumTeaLeaves'
  | 'superStrainer';

export interface UpgradeLevels {
  biggerTray: number;
  fasterHands: number;
  luckyBiscuitJar: number;
  premiumTeaLeaves: number;
  superStrainer: number;
}

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  hindiSub: string;
  description: string;
  effectSummary: (level: number) => string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  modeTag: 'Biscuit Catcher' | 'Irani Chai Rush' | 'Both Modes';
}

export type AchievementId =
  | 'biscuit_combo'
  | 'perfect_tray'
  | 'chai_champion'
  | 'hyderabad_hero'
  | 'golden_bite'
  | 'ustad_brewer'
  | 'charminar_survivor'
  | 'osmania_tycoon';

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  rewardCoins: number;
  badgeIcon: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  mode: GameMode;
  date: string;
  metricCount: number; // Biscuits caught or Chai cups brewed
}

export interface RoundStats {
  mode: GameMode;
  score: number;
  coinsEarned: number;
  levelReached: number;
  biscuitsCaught: number;
  goldenCaught: number;
  specialCaught: number;
  biscuitsMissed: number;
  maxCombo: number;
  chaiClicks: number;
  chaiCupsBrewed: number;
  perfectBrews: number;
  eventsSurvived: number;
  timeElapsed: number;
  isNewHighScore: boolean;
  newlyUnlockedAchievements: AchievementId[];
}

export interface SavedProgress {
  nickname: string;
  coins: number;
  highScores: {
    BISCUIT_CATCHER: number;
    CHAI_RUSH: number;
  };
  upgrades: UpgradeLevels;
  unlockedAchievements: AchievementId[];
  leaderboard: LeaderboardEntry[];
  totalBiscuitsAllTime: number;
  totalChaiCupsAllTime: number;
  soundMuted: boolean;
}
