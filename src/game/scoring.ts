import {
  AchievementId,
  ActiveHyderabadEvent,
  ActivePowerUp,
  BiscuitVariant,
  GameMode,
  UpgradeLevels,
} from './types';
import { SCORING } from './constants';

export function getTrayWidth(canvasWidth: number, biggerTrayLevel: number): number {
  const baseWidth = Math.max(96, Math.min(148, canvasWidth * 0.18));
  return Math.round(baseWidth * (1 + biggerTrayLevel * 0.16));
}

export function getPointMultiplier(
  upgrades: UpgradeLevels,
  activePowerUps: ActivePowerUp[],
  activeEvent: ActiveHyderabadEvent | null
): number {
  let mult = 1 + upgrades.premiumTeaLeaves * 0.15;

  if (activePowerUps.some((p) => p.type === 'CHAI_BOOST')) {
    mult *= 2;
  }

  if (activeEvent) {
    if (activeEvent.type === 'CHARMINAR_RUSH' || activeEvent.type === 'RAINY_EVENING') {
      mult *= 1.5;
    }
  }

  return mult;
}

export function calculateBiscuitPoints(
  variant: BiscuitVariant,
  combo: number,
  upgrades: UpgradeLevels,
  activePowerUps: ActivePowerUp[],
  activeEvent: ActiveHyderabadEvent | null
): number {
  const base =
    variant === 'GOLDEN'
      ? SCORING.GOLDEN_BISCUIT
      : variant === 'SPECIAL'
      ? SCORING.SPECIAL_BISCUIT
      : SCORING.NORMAL_BISCUIT;

  const comboBonus = combo >= 10 ? 1.35 : combo >= 5 ? 1.2 : 1.0;
  const mult = getPointMultiplier(upgrades, activePowerUps, activeEvent);

  return Math.round(base * comboBonus * mult);
}

export function calculateChaiBrewFillPerClick(fasterHandsLevel: number): number {
  // Base 10 clicks per cup (10% per click), fasterHands increases fill by +18% per level
  const baseFill = 10;
  return baseFill * (1 + fasterHandsLevel * 0.18);
}

export function calculateCoinsFromScore(
  score: number,
  eventsSurvived: number,
  survivedCafeRush: boolean
): number {
  const baseCoins = Math.max(5, Math.floor(score / 12));
  const eventBonus = eventsSurvived * 8 + (survivedCafeRush ? 25 : 0);
  return baseCoins + eventBonus;
}

export function evaluateRoundAchievements(params: {
  mode: GameMode;
  score: number;
  maxCombo: number;
  goldenCaught: number;
  chaiClicks: number;
  chaiCupsBrewed: number;
  eventsSurvived: number;
  alreadyUnlocked: AchievementId[];
}): AchievementId[] {
  const unlocked = new Set<AchievementId>(params.alreadyUnlocked);
  const newlyUnlocked: AchievementId[] = [];

  const grant = (id: AchievementId) => {
    if (!unlocked.has(id)) {
      unlocked.add(id);
      newlyUnlocked.push(id);
    }
  };

  if (params.maxCombo >= 5) grant('biscuit_combo');
  if (params.maxCombo >= 10) grant('perfect_tray');
  if (params.goldenCaught >= 1) grant('golden_bite');
  if (params.score >= 500) grant('hyderabad_hero');
  if (params.mode === 'CHAI_RUSH' && params.chaiClicks >= 20 && params.chaiCupsBrewed >= 5) {
    grant('chai_champion');
  }
  if (params.mode === 'CHAI_RUSH' && params.chaiCupsBrewed >= 12) {
    grant('ustad_brewer');
  }
  if (params.eventsSurvived >= 1) {
    grant('charminar_survivor');
  }

  return newlyUnlocked;
}
