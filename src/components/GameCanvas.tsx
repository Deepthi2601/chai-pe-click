import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  AchievementId,
  ActiveHyderabadEvent,
  ActivePowerUp,
  FallingBiscuit,
  FloatingText,
  GameMode,
  HyderabadEventType,
  Particle,
  PowerUpType,
  RoundStats,
  UpgradeLevels,
} from '../game/types';
import {
  HYDERABAD_EVENTS_META,
  INITIAL_LIVES,
  MAX_LIVES,
  POWERUP_META,
  ROUND_DURATION_SECONDS,
  SCORING,
} from '../game/constants';
import {
  calculateBiscuitPoints,
  calculateChaiBrewFillPerClick,
  calculateCoinsFromScore,
  evaluateRoundAchievements,
  getPointMultiplier,
  getTrayWidth,
} from '../game/scoring';
import {
  drawFallingBiscuit,
  drawGoldenChaiBonusTarget,
  drawIraniCafeBackground,
  drawIraniChaiStation,
  drawParticlesAndFloatingText,
  drawSilverTray,
} from '../game/cafeRenderer';

interface GameCanvasProps {
  mode: GameMode;
  isPaused: boolean;
  upgrades: UpgradeLevels;
  highScore: number;
  alreadyUnlockedAchievements: AchievementId[];
  onHudUpdate: (hud: {
    score: number;
    timeLeft: number;
    level: number;
    lives: number;
    combo: number;
    chaiCups: number;
    brewProgress: number;
    activePowerUps: ActivePowerUp[];
    activeEvent: ActiveHyderabadEvent | null;
  }) => void;
  onGameOver: (stats: RoundStats) => void;
  sounds: {
    playBiscuitCatch: (combo?: number) => void;
    playGoldenCatch: () => void;
    playBiscuitMiss: () => void;
    playChaiClick: (progressRatio?: number) => void;
    playChaiCupComplete: () => void;
    playPowerUp: () => void;
    playEventStart: () => void;
    playGameOver: () => void;
  };
}

const POWERUP_POOL: PowerUpType[] = [
  'CHAI_BOOST',
  'BISCUIT_MAGNET',
  'SLOW_MOTION',
  'GOLDEN_HOUR',
  'EXTRA_LIFE',
];

const EVENT_POOL: HyderabadEventType[] = [
  'CHARMINAR_RUSH',
  'RAINY_EVENING',
  'BAKERY_DELIVERY',
  'GOLDEN_CHAI',
  'CAFE_RUSH_HOUR',
];

export const GameCanvas: React.FC<GameCanvasProps> = ({
  mode,
  isPaused,
  upgrades,
  highScore,
  alreadyUnlockedAchievements,
  onHudUpdate,
  onGameOver,
  sounds,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shakeOffset, setShakeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reduced motion check
  const reducedMotionRef = useRef<boolean>(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  // Mutable game engine state inside ref to avoid React re-renders on every animation frame
  const stateRef = useRef({
    score: 0,
    timeLeft: ROUND_DURATION_SECONDS,
    level: 1,
    lives: INITIAL_LIVES,
    combo: 0,
    maxCombo: 0,
    biscuitsCaught: 0,
    goldenCaught: 0,
    specialCaught: 0,
    biscuitsMissed: 0,
    chaiClicks: 0,
    chaiCupsBrewed: 0,
    perfectBrews: 0,
    brewProgress: 0,
    clickPulse: 0,
    isPouring: false,
    lastPourAt: 0,
    eventsSurvived: 0,
    survivedCafeRush: false,
    trayX: 400,
    targetTrayX: 400,
    keysPressed: { left: false, right: false },
    biscuits: [] as FallingBiscuit[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    activePowerUps: [] as ActivePowerUp[],
    activeEvent: null as ActiveHyderabadEvent | null,
    lastSpawnAt: 0,
    nextEventAt: 13000,
    elapsedMs: 0,
    lastFrameTime: 0,
    gameOverTriggered: false,
    holdBrewInterval: null as number | null,
  });

  const triggerScreenShake = useCallback((intensity = 6) => {
    if (reducedMotionRef.current) return;
    setShakeOffset({
      x: (Math.random() - 0.5) * intensity * 2,
      y: (Math.random() - 0.5) * intensity * 2,
    });
    setTimeout(() => setShakeOffset({ x: 0, y: 0 }), 140);
  }, []);

  const spawnParticles = useCallback(
    (x: number, y: number, color: string, count = 12) => {
      if (reducedMotionRef.current) return;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 1.5 + Math.random() * 4.2;
        stateRef.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          radius: 2.5 + Math.random() * 3,
          color,
          alpha: 1,
          decay: 0.024 + Math.random() * 0.018,
        });
      }
    },
    []
  );

  const addFloatingText = useCallback(
    (x: number, y: number, text: string, color = '#FEF08A', scale = 1) => {
      stateRef.current.floatingTexts.push({
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        text,
        color,
        opacity: 1,
        vy: -1.4,
        scale,
      });
    },
    []
  );

  const activatePowerUp = useCallback(
    (type: PowerUpType, x: number, y: number) => {
      const st = stateRef.current;
      sounds.playPowerUp();
      const meta = POWERUP_META[type];

      if (type === 'EXTRA_LIFE') {
        st.lives = Math.min(MAX_LIVES, st.lives + 1);
        addFloatingText(x, y - 18, '❤️ +1 LIFE!', '#F87171', 1.15);
        return;
      }

      const bonusDurationMs = upgrades.superStrainer * 1000;
      const totalDuration = meta.durationMs + bonusDurationMs;
      const expiresAt = st.elapsedMs + totalDuration;

      const existingIdx = st.activePowerUps.findIndex((p) => p.type === type);
      if (existingIdx >= 0) {
        st.activePowerUps[existingIdx] = { type, expiresAt, totalDuration };
      } else {
        st.activePowerUps.push({ type, expiresAt, totalDuration });
      }
      addFloatingText(x, y - 18, `${meta.badge} ${meta.name.toUpperCase()}!`, meta.color, 1.15);
    },
    [addFloatingText, sounds, upgrades.superStrainer]
  );

  // Handle Chai brewing click or tap
  const performChaiBrewTap = useCallback(
    (clientX?: number, clientY?: number) => {
      const st = stateRef.current;
      if (isPaused || st.gameOverTriggered) return;

      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const tapX =
        clientX && rect
          ? clientX - rect.left
          : (canvas?.width || 600) / 2 + (Math.random() - 0.5) * 60;
      const tapY =
        clientY && rect
          ? clientY - rect.top
          : (canvas?.height || 500) * 0.48 + (Math.random() - 0.5) * 40;

      // Check if player tapped the Golden Chai bonus event target
      if (
        st.activeEvent?.type === 'GOLDEN_CHAI' &&
        !st.activeEvent.goldenChaiTapped &&
        st.activeEvent.goldenChaiX !== undefined &&
        st.activeEvent.goldenChaiY !== undefined
      ) {
        const dx = tapX - st.activeEvent.goldenChaiX;
        const dy = tapY - st.activeEvent.goldenChaiY;
        if (Math.hypot(dx, dy) <= 56) {
          st.activeEvent.goldenChaiTapped = true;
          st.score += SCORING.GOLDEN_CHAI_EVENT_TAP;
          sounds.playGoldenCatch();
          spawnParticles(st.activeEvent.goldenChaiX, st.activeEvent.goldenChaiY, '#FBBF24', 20);
          addFloatingText(
            st.activeEvent.goldenChaiX,
            st.activeEvent.goldenChaiY,
            `+${SCORING.GOLDEN_CHAI_EVENT_TAP} ZAFRANI CHAI!`,
            '#FDE047',
            1.3
          );
          triggerScreenShake(7);
          return;
        }
      }

      if (mode !== 'CHAI_RUSH') return;

      st.chaiClicks += 1;
      st.combo += 1;
      if (st.combo > st.maxCombo) st.maxCombo = st.combo;

      st.clickPulse = 1;
      st.isPouring = true;
      st.lastPourAt = st.elapsedMs;

      const mult = getPointMultiplier(upgrades, st.activePowerUps, st.activeEvent);
      const clickPts = Math.max(1, Math.round(SCORING.CHAI_CLICK_BASE * mult));
      st.score += clickPts;

      const fillAmount = calculateChaiBrewFillPerClick(upgrades.fasterHands);
      st.brewProgress += fillAmount;

      sounds.playChaiClick(st.brewProgress / 100);
      spawnParticles(tapX, tapY, '#F59E0B', 5);
      addFloatingText(tapX, tapY - 12, `+${clickPts}`, '#FEF3C7', 0.95);

      // Random chance to trigger a helpful power-up every 22 clicks in Chai Rush
      if (st.chaiClicks % 24 === 0) {
        activatePowerUp('CHAI_BOOST', tapX, tapY - 25);
      }

      // Check if cup is completed
      if (st.brewProgress >= 100) {
        st.brewProgress -= 100;
        st.chaiCupsBrewed += 1;
        st.perfectBrews += 1;
        st.level = 1 + Math.floor(st.chaiCupsBrewed / 3);

        const cupBonus = Math.round(
          (SCORING.CHAI_CUP_COMPLETE_BONUS +
            (st.perfectBrews % 3 === 0 ? SCORING.PERFECT_BREW_STREAK_BONUS : 0)) *
            mult
        );
        st.score += cupBonus;
        sounds.playChaiCupComplete();
        spawnParticles((canvas?.width || 600) / 2, (canvas?.height || 500) * 0.5, '#FDE047', 18);
        addFloatingText(
          (canvas?.width || 600) / 2,
          (canvas?.height || 500) * 0.36,
          `☕ CUP #${st.chaiCupsBrewed} BREWED! +${cupBonus}`,
          '#FBBF24',
          1.25
        );
      }
    },
    [
      activatePowerUp,
      addFloatingText,
      isPaused,
      mode,
      sounds,
      spawnParticles,
      triggerScreenShake,
      upgrades,
    ]
  );

  // Finish game safely once
  const finalizeGameOver = useCallback(() => {
    const st = stateRef.current;
    if (st.gameOverTriggered) return;
    st.gameOverTriggered = true;

    if (st.holdBrewInterval) {
      window.clearInterval(st.holdBrewInterval);
      st.holdBrewInterval = null;
    }

    sounds.playGameOver();

    const coinsEarned = calculateCoinsFromScore(
      st.score,
      st.eventsSurvived,
      st.survivedCafeRush
    );

    const newlyUnlocked = evaluateRoundAchievements({
      mode,
      score: st.score,
      maxCombo: st.maxCombo,
      goldenCaught: st.goldenCaught,
      chaiClicks: st.chaiClicks,
      chaiCupsBrewed: st.chaiCupsBrewed,
      eventsSurvived: st.eventsSurvived,
      alreadyUnlocked: alreadyUnlockedAchievements,
    });

    onGameOver({
      mode,
      score: st.score,
      coinsEarned,
      levelReached: st.level,
      biscuitsCaught: st.biscuitsCaught,
      goldenCaught: st.goldenCaught,
      specialCaught: st.specialCaught,
      biscuitsMissed: st.biscuitsMissed,
      maxCombo: st.maxCombo,
      chaiClicks: st.chaiClicks,
      chaiCupsBrewed: st.chaiCupsBrewed,
      perfectBrews: st.perfectBrews,
      eventsSurvived: st.eventsSurvived,
      timeElapsed: Math.round(ROUND_DURATION_SECONDS - st.timeLeft),
      isNewHighScore: st.score > highScore && st.score > 0,
      newlyUnlockedAchievements: newlyUnlocked,
    });
  }, [alreadyUnlockedAchievements, highScore, mode, onGameOver, sounds]);

  // Resize canvas to match container
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(320, Math.floor(rect.width));
      canvas.height = Math.max(420, Math.floor(rect.height));
      stateRef.current.trayX = Math.min(
        Math.max(stateRef.current.trayX, 60),
        canvas.width - 60
      );
      stateRef.current.targetTrayX = stateRef.current.trayX;
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Keyboard listeners for Biscuit Catcher & Spacebar for Chai Rush
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keysPressed.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keysPressed.right = true;
      } else if ((e.key === ' ' || e.key === 'Enter') && mode === 'CHAI_RUSH') {
        e.preventDefault();
        performChaiBrewTap();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keysPressed.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keysPressed.right = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [mode, performChaiBrewTap]);

  // Main requestAnimationFrame loop
  useEffect(() => {
    let animationFrameId: number;
    let lastHudSync = 0;

    const step = (timestamp: number) => {
      const st = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!st.lastFrameTime) {
        st.lastFrameTime = timestamp;
      }
      const rawDelta = timestamp - st.lastFrameTime;
      st.lastFrameTime = timestamp;

      // Clamp delta so tab-switching doesn't cause huge jumps
      const dt = isPaused || st.gameOverTriggered ? 0 : Math.min(rawDelta, 50);

      if (dt > 0) {
        st.elapsedMs += dt;
        st.timeLeft = Math.max(0, ROUND_DURATION_SECONDS - st.elapsedMs / 1000);

        // Expire finished power-ups
        st.activePowerUps = st.activePowerUps.filter((p) => p.expiresAt > st.elapsedMs);

        // Manage Hyderabad Special Events
        if (st.activeEvent && st.elapsedMs >= st.activeEvent.expiresAt) {
          if (st.activeEvent.type === 'CAFE_RUSH_HOUR') {
            st.survivedCafeRush = true;
          }
          st.eventsSurvived += 1;
          st.activeEvent = null;
          st.nextEventAt = st.elapsedMs + 14000;
        } else if (!st.activeEvent && st.elapsedMs >= st.nextEventAt && st.timeLeft > 9) {
          const picked = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
          const meta = HYDERABAD_EVENTS_META[picked];
          st.activeEvent = {
            type: picked,
            title: meta.title,
            subtitle: meta.subtitle,
            expiresAt: st.elapsedMs + meta.durationMs,
            totalDuration: meta.durationMs,
            goldenChaiX:
              picked === 'GOLDEN_CHAI'
                ? 80 + Math.random() * Math.max(120, canvas.width - 160)
                : undefined,
            goldenChaiY:
              picked === 'GOLDEN_CHAI'
                ? 110 + Math.random() * Math.max(100, canvas.height * 0.35)
                : undefined,
            goldenChaiTapped: false,
          };
          sounds.playEventStart();
        }

        // Update Mode A: Biscuit Catcher Physics
        if (mode === 'BISCUIT_CATCHER') {
          st.level = 1 + Math.floor(st.elapsedMs / 12000);

          const trayWidth = getTrayWidth(canvas.width, upgrades.biggerTray);
          const halfTray = trayWidth / 2;

          // Keyboard movement
          const moveSpeed = 0.58 * dt;
          if (st.keysPressed.left) {
            st.targetTrayX -= moveSpeed;
          }
          if (st.keysPressed.right) {
            st.targetTrayX += moveSpeed;
          }

          st.targetTrayX = Math.max(
            halfTray + 8,
            Math.min(canvas.width - halfTray - 8, st.targetTrayX)
          );
          st.trayX += (st.targetTrayX - st.trayX) * 0.28;

          // Spawn biscuits
          const isBakeryEvent = st.activeEvent?.type === 'BAKERY_DELIVERY';
          const isRushEvent =
            st.activeEvent?.type === 'CHARMINAR_RUSH' ||
            st.activeEvent?.type === 'CAFE_RUSH_HOUR';
          const baseSpawnInterval = Math.max(330, 880 - st.level * 75);
          const spawnInterval = isBakeryEvent
            ? baseSpawnInterval * 0.48
            : isRushEvent
            ? baseSpawnInterval * 0.72
            : baseSpawnInterval;

          if (st.elapsedMs - st.lastSpawnAt >= spawnInterval) {
            st.lastSpawnAt = st.elapsedMs;

            const hasGoldenHour = st.activePowerUps.some((p) => p.type === 'GOLDEN_HOUR');
            const goldenChance =
              0.12 + upgrades.luckyBiscuitJar * 0.04 + (hasGoldenHour ? 0.32 : 0);
            const specialChance = 0.11 + upgrades.luckyBiscuitJar * 0.015;

            const roll = Math.random();
            const variant =
              roll < goldenChance
                ? 'GOLDEN'
                : roll < goldenChance + specialChance
                ? 'SPECIAL'
                : 'NORMAL';

            const powerUp =
              variant === 'SPECIAL'
                ? POWERUP_POOL[Math.floor(Math.random() * POWERUP_POOL.length)]
                : undefined;

            const radius = variant === 'GOLDEN' ? 23 : 21;
            const speedBase = 2.2 + st.level * 0.42 + Math.random() * 1.1;

            st.biscuits.push({
              id: `${st.elapsedMs}-${Math.random()}`,
              x: radius + 16 + Math.random() * Math.max(60, canvas.width - (radius + 16) * 2),
              y: -radius - 10,
              radius,
              speed: speedBase,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() - 0.5) * 0.05,
              variant,
              powerUp,
              wobblePhase: Math.random() * Math.PI * 2,
            });
          }

          const hasSlowMo = st.activePowerUps.some((p) => p.type === 'SLOW_MOTION');
          const hasMagnet = st.activePowerUps.some((p) => p.type === 'BISCUIT_MAGNET');
          const speedMultiplier =
            (hasSlowMo ? 0.52 : 1) * (isRushEvent ? 1.25 : 1) * (dt / 16.67);

          const trayY = canvas.height - 56;
          const trayHeight = 20;

          const remainingBiscuits: FallingBiscuit[] = [];

          for (const b of st.biscuits) {
            b.y += b.speed * speedMultiplier;
            b.rotation += b.rotationSpeed * speedMultiplier;
            b.x += Math.sin(st.elapsedMs * 0.003 + b.wobblePhase) * 0.35;

            // Magnet attraction toward tray
            if (hasMagnet && b.y > canvas.height * 0.28) {
              const dx = st.trayX - b.x;
              b.x += dx * 0.065 * (dt / 16.67);
            }

            // Collision with Silver Tray
            const withinX = Math.abs(b.x - st.trayX) <= halfTray + b.radius * 0.72;
            const withinY =
              b.y + b.radius >= trayY && b.y - b.radius <= trayY + trayHeight + 10;

            if (withinX && withinY) {
              st.biscuitsCaught += 1;
              st.combo += 1;
              if (st.combo > st.maxCombo) st.maxCombo = st.combo;

              const pts = calculateBiscuitPoints(
                b.variant,
                st.combo,
                upgrades,
                st.activePowerUps,
                st.activeEvent
              );
              st.score += pts;

              if (b.variant === 'GOLDEN') {
                st.goldenCaught += 1;
                sounds.playGoldenCatch();
                spawnParticles(b.x, b.y, '#FACC15', 16);
                addFloatingText(b.x, b.y - 10, `+${pts} GOLDEN!`, '#FDE047', 1.25);
              } else if (b.variant === 'SPECIAL' && b.powerUp) {
                st.specialCaught += 1;
                activatePowerUp(b.powerUp, b.x, b.y);
                spawnParticles(b.x, b.y, '#38BDF8', 15);
                addFloatingText(b.x, b.y - 28, `+${pts}`, '#FEF08A', 1.05);
              } else {
                sounds.playBiscuitCatch(st.combo);
                spawnParticles(b.x, b.y, '#D97706', 9);
                const comboText = st.combo >= 5 ? ` (${st.combo}x!)` : '';
                addFloatingText(b.x, b.y - 10, `+${pts}${comboText}`, '#FEF3C7', 1);
              }
              continue;
            }

            // Missed biscuit below bottom of canvas
            if (b.y - b.radius > canvas.height + 12) {
              st.biscuitsMissed += 1;
              st.combo = 0;
              st.lives = Math.max(0, st.lives - 1);
              sounds.playBiscuitMiss();
              triggerScreenShake(8);
              addFloatingText(
                Math.min(Math.max(b.x, 50), canvas.width - 50),
                canvas.height - 70,
                'MISSED! -1 ❤️',
                '#F87171',
                1.1
              );

              if (st.lives <= 0) {
                finalizeGameOver();
                return;
              }
              continue;
            }

            remainingBiscuits.push(b);
          }

          st.biscuits = remainingBiscuits;
        } else {
          // Mode B: Irani Chai Rush animations & decay
          st.clickPulse = Math.max(0, st.clickPulse - 0.08 * (dt / 16.67));
          if (st.elapsedMs - st.lastPourAt > 240) {
            st.isPouring = false;
          }
        }

        // Update particles
        st.particles = st.particles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12,
            alpha: p.alpha - p.decay,
          }))
          .filter((p) => p.alpha > 0);

        // Update floating score texts
        st.floatingTexts = st.floatingTexts
          .map((ft) => ({
            ...ft,
            y: ft.y + ft.vy,
            opacity: ft.opacity - 0.022,
          }))
          .filter((ft) => ft.opacity > 0);

        // Check timer end
        if (st.timeLeft <= 0) {
          finalizeGameOver();
          return;
        }
      }

      // Render Scene
      drawIraniCafeBackground(
        ctx,
        canvas.width,
        canvas.height,
        timestamp,
        st.activeEvent,
        reducedMotionRef.current
      );

      if (mode === 'BISCUIT_CATCHER') {
        const trayWidth = getTrayWidth(canvas.width, upgrades.biggerTray);
        const hasMagnet = st.activePowerUps.some((p) => p.type === 'BISCUIT_MAGNET');
        const hasBoost = st.activePowerUps.some((p) => p.type === 'CHAI_BOOST');

        st.biscuits.forEach((b) => drawFallingBiscuit(ctx, b, timestamp));

        drawSilverTray(
          ctx,
          st.trayX,
          canvas.height - 56,
          trayWidth,
          20,
          hasMagnet,
          hasBoost
        );
      } else {
        drawIraniChaiStation(
          ctx,
          canvas.width,
          canvas.height,
          st.brewProgress,
          st.chaiCupsBrewed,
          st.clickPulse,
          st.isPouring,
          timestamp,
          reducedMotionRef.current
        );
      }

      // Draw Golden Chai Bonus Event Target if active
      if (
        st.activeEvent?.type === 'GOLDEN_CHAI' &&
        !st.activeEvent.goldenChaiTapped &&
        st.activeEvent.goldenChaiX !== undefined &&
        st.activeEvent.goldenChaiY !== undefined
      ) {
        drawGoldenChaiBonusTarget(
          ctx,
          st.activeEvent.goldenChaiX,
          st.activeEvent.goldenChaiY,
          timestamp
        );
      }

      drawParticlesAndFloatingText(ctx, st.particles, st.floatingTexts);

      // Sync HUD ~10 times per second to keep React overhead low
      if (timestamp - lastHudSync > 90) {
        lastHudSync = timestamp;
        onHudUpdate({
          score: st.score,
          timeLeft: Math.ceil(st.timeLeft),
          level: st.level,
          lives: st.lives,
          combo: st.combo,
          chaiCups: st.chaiCupsBrewed,
          brewProgress: st.brewProgress,
          activePowerUps: [...st.activePowerUps],
          activeEvent: st.activeEvent ? { ...st.activeEvent } : null,
        });
      }

      animationFrameId = window.requestAnimationFrame(step);
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    activatePowerUp,
    addFloatingText,
    finalizeGameOver,
    isPaused,
    mode,
    onHudUpdate,
    sounds,
    spawnParticles,
    triggerScreenShake,
    upgrades,
  ]);

  // Clean up hold-to-brew interval on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.holdBrewInterval) {
        window.clearInterval(stateRef.current.holdBrewInterval);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || mode !== 'BISCUIT_CATCHER') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.targetTrayX = e.clientX - rect.left;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    const canvas = canvasRef.current;
    if (canvas && mode === 'BISCUIT_CATCHER') {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.targetTrayX = e.clientX - rect.left;
    }

    performChaiBrewTap(e.clientX, e.clientY);

    if (mode === 'CHAI_RUSH') {
      if (stateRef.current.holdBrewInterval) {
        window.clearInterval(stateRef.current.holdBrewInterval);
      }
      stateRef.current.holdBrewInterval = window.setInterval(() => {
        performChaiBrewTap(e.clientX, e.clientY);
      }, 135);
    }
  };

  const handlePointerUpOrLeave = () => {
    if (stateRef.current.holdBrewInterval) {
      window.clearInterval(stateRef.current.holdBrewInterval);
      stateRef.current.holdBrewInterval = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex-1 min-h-[440px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-[#13281E]"
      style={{
        transform: `translate3d(${shakeOffset.x}px, ${shakeOffset.y}px, 0)`,
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        onPointerCancel={handlePointerUpOrLeave}
        className="w-full h-full block touch-none cursor-pointer"
        aria-label={
          mode === 'BISCUIT_CATCHER'
            ? 'Biscuit Catcher game area. Move tray left or right to catch falling Osmania biscuits.'
            : 'Irani Chai Rush game area. Tap or hold the tea glass to brew cups of chai.'
        }
      />
    </div>
  );
};
