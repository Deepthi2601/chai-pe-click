import {
  ActiveHyderabadEvent,
  ActivePowerUp,
  FallingBiscuit,
  FloatingText,
  Particle,
} from './types';
import { POWERUP_META } from './constants';

export function drawIraniCafeBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  now: number,
  activeEvent: ActiveHyderabadEvent | null,
  reducedMotion: boolean
) {
  // 1. Base Vintage Irani Café Wall Gradient
  const isRainy = activeEvent?.type === 'RAINY_EVENING';
  const isRush = activeEvent?.type === 'CHARMINAR_RUSH' || activeEvent?.type === 'CAFE_RUSH_HOUR';

  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (isRainy) {
    bgGrad.addColorStop(0, '#0F242A');
    bgGrad.addColorStop(0.6, '#183438');
    bgGrad.addColorStop(1, '#231B16');
  } else if (isRush) {
    bgGrad.addColorStop(0, '#2B1912');
    bgGrad.addColorStop(0.6, '#1E3126');
    bgGrad.addColorStop(1, '#2D1C12');
  } else {
    bgGrad.addColorStop(0, '#13281E');
    bgGrad.addColorStop(0.62, '#1C382B');
    bgGrad.addColorStop(1, '#2A1B14');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Wainscoting / Dado Rail at bottom 28%
  const dadoY = height * 0.74;
  ctx.fillStyle = 'rgba(42, 24, 16, 0.55)';
  ctx.fillRect(0, dadoY, width, height - dadoY);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, dadoY);
  ctx.lineTo(width, dadoY);
  ctx.stroke();

  // 3. Center Arched Window with Charminar Silhouette
  const archW = Math.min(280, width * 0.42);
  const archH = Math.min(230, height * 0.36);
  const archX = width / 2 - archW / 2;
  const archY = height * 0.14;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(archX, archY + archH);
  ctx.lineTo(archX, archY + archW * 0.35);
  ctx.quadraticCurveTo(width / 2, archY - 25, archX + archW, archY + archW * 0.35);
  ctx.lineTo(archX + archW, archY + archH);
  ctx.closePath();

  const skyGrad = ctx.createLinearGradient(0, archY, 0, archY + archH);
  if (isRainy) {
    skyGrad.addColorStop(0, '#1E293B');
    skyGrad.addColorStop(1, '#334155');
  } else {
    skyGrad.addColorStop(0, '#451A03');
    skyGrad.addColorStop(0.5, '#78350F');
    skyGrad.addColorStop(1, '#B45309');
  }
  ctx.fillStyle = skyGrad;
  ctx.fill();
  ctx.clip();

  // Silhouette of Charminar inside window
  const cx = width / 2;
  const baseBottom = archY + archH;
  ctx.fillStyle = isRainy ? 'rgba(15, 23, 42, 0.72)' : 'rgba(42, 20, 10, 0.65)';
  // Main central block
  ctx.fillRect(cx - 42, baseBottom - 82, 84, 82);
  // Left & Right minarets
  ctx.fillRect(cx - 48, baseBottom - 135, 14, 135);
  ctx.fillRect(cx + 34, baseBottom - 135, 14, 135);
  ctx.fillRect(cx - 24, baseBottom - 115, 10, 115);
  ctx.fillRect(cx + 14, baseBottom - 115, 10, 115);
  // Domes on minarets
  ctx.beginPath();
  ctx.arc(cx - 41, baseBottom - 135, 8, Math.PI, 0);
  ctx.arc(cx + 41, baseBottom - 135, 8, Math.PI, 0);
  ctx.fill();

  // Rain streaks inside window if RAINY_EVENING
  if (isRainy) {
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
    ctx.lineWidth = 1.5;
    const offset = reducedMotion ? 0 : (now * 0.25) % 40;
    for (let rx = archX - 20; rx < archX + archW + 20; rx += 18) {
      for (let ry = archY; ry < archY + archH; ry += 36) {
        ctx.beginPath();
        ctx.moveTo(rx, ry + offset);
        ctx.lineTo(rx - 5, ry + offset + 14);
        ctx.stroke();
      }
    }
  }
  ctx.restore();

  // Window frame outline
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(archX, archY + archH);
  ctx.lineTo(archX, archY + archW * 0.35);
  ctx.quadraticCurveTo(width / 2, archY - 25, archX + archW, archY + archW * 0.35);
  ctx.lineTo(archX + archW, archY + archH);
  ctx.closePath();
  ctx.stroke();

  // 4. Left & Right Café Shelves with Biscuit Jars & Menu Board
  if (width > 520) {
    // Left Vintage Menu Board
    const boardX = 28;
    const boardY = height * 0.2;
    ctx.fillStyle = 'rgba(24, 16, 12, 0.65)';
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boardX, boardY, 112, 86, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = '600 10px "Fraunces", serif';
    ctx.textAlign = 'center';
    ctx.fillText('CAFE MENU', boardX + 56, boardY + 20);
    ctx.fillStyle = 'rgba(253, 248, 240, 0.65)';
    ctx.font = '500 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Irani Dum Chai ₹20', boardX + 56, boardY + 38);
    ctx.fillText('Osmania (4pc) ₹15', boardX + 56, boardY + 54);
    ctx.fillText('Zafrani Special ₹35', boardX + 56, boardY + 70);

    // Right Shelf with Glass Biscuit Jars (Martaban)
    const shelfX = width - 144;
    const shelfY = height * 0.28;
    ctx.fillStyle = '#451A03';
    ctx.fillRect(shelfX, shelfY + 54, 116, 8);

    // Draw 2 glass jars with biscuits inside
    [shelfX + 18, shelfX + 68].forEach((jx) => {
      ctx.fillStyle = 'rgba(254, 243, 199, 0.14)';
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(jx, shelfY + 10, 32, 44, 6);
      ctx.fill();
      ctx.stroke();
      // Lid
      ctx.fillStyle = '#B45309';
      ctx.fillRect(jx + 4, shelfY + 4, 24, 6);
      // Mini stacked biscuits inside jar
      ctx.fillStyle = '#D97706';
      for (let b = 0; b < 4; b++) {
        ctx.fillRect(jx + 6, shelfY + 42 - b * 7, 20, 5);
      }
    });
  }

  // 5. Hanging Vintage Pendant Lamps
  const lampPositions = [width * 0.22, width * 0.5, width * 0.78];
  lampPositions.forEach((lx, i) => {
    const cordLen = i === 1 ? 38 : 54;
    const sway = reducedMotion ? 0 : Math.sin(now * 0.0015 + i) * 3;

    ctx.strokeStyle = 'rgba(253, 230, 138, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx + sway, cordLen);
    ctx.stroke();

    // Lamp shade
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.moveTo(lx + sway - 18, cordLen + 14);
    ctx.lineTo(lx + sway + 18, cordLen + 14);
    ctx.lineTo(lx + sway + 8, cordLen);
    ctx.lineTo(lx + sway - 8, cordLen);
    ctx.closePath();
    ctx.fill();

    // Warm bulb glow
    const glow = ctx.createRadialGradient(
      lx + sway,
      cordLen + 16,
      2,
      lx + sway,
      cordLen + 16,
      58
    );
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lx + sway, cordLen + 16, 58, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawSilverTray(
  ctx: CanvasRenderingContext2D,
  trayX: number,
  trayY: number,
  trayWidth: number,
  trayHeight: number,
  hasMagnet: boolean,
  hasBoost: boolean
) {
  ctx.save();

  // Optional Magnet Aura
  if (hasMagnet) {
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(trayX, trayY, trayWidth * 0.7, 36, 0, Math.PI, 0);
    ctx.stroke();
  }

  const left = trayX - trayWidth / 2;

  // Tray rim & shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(left + 4, trayY + 5, trayWidth, trayHeight, 10);
  ctx.fill();

  const trayGrad = ctx.createLinearGradient(left, trayY, left, trayY + trayHeight);
  if (hasBoost) {
    trayGrad.addColorStop(0, '#FDE68A');
    trayGrad.addColorStop(0.5, '#F59E0B');
    trayGrad.addColorStop(1, '#B45309');
  } else {
    trayGrad.addColorStop(0, '#F8FAFC');
    trayGrad.addColorStop(0.5, '#CBD5E1');
    trayGrad.addColorStop(1, '#64748B');
  }

  ctx.fillStyle = trayGrad;
  ctx.strokeStyle = hasBoost ? '#FEF3C7' : '#E2E8F0';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(left, trayY, trayWidth, trayHeight, 10);
  ctx.fill();
  ctx.stroke();

  // Decorative handles on left and right of the silver tray
  ctx.strokeStyle = hasBoost ? '#F59E0B' : '#94A3B8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(left + 2, trayY + trayHeight / 2, 7, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(left + trayWidth - 2, trayY + trayHeight / 2, 7, Math.PI * 1.5, Math.PI * 0.5);
  ctx.stroke();

  // Small Irani tea saucer accent in center of tray
  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.fillRect(left + 14, trayY + 4, trayWidth - 28, 3);

  ctx.restore();
}

export function drawFallingBiscuit(
  ctx: CanvasRenderingContext2D,
  b: FallingBiscuit,
  now: number
) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rotation);

  // Subtle glow for Golden or Special biscuits
  if (b.variant === 'GOLDEN') {
    const glow = ctx.createRadialGradient(0, 0, b.radius * 0.4, 0, 0, b.radius * 1.7);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, b.radius * 1.7, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.variant === 'SPECIAL' && b.powerUp) {
    const meta = POWERUP_META[b.powerUp];
    const glow = ctx.createRadialGradient(0, 0, b.radius * 0.4, 0, 0, b.radius * 1.7);
    glow.addColorStop(0, `${meta.color}AA`);
    glow.addColorStop(1, `${meta.color}00`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, b.radius * 1.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scalloped Osmania Biscuit Edge
  const ridges = 12;
  ctx.beginPath();
  for (let i = 0; i < ridges * 2; i++) {
    const angle = (i * Math.PI) / ridges;
    const r = i % 2 === 0 ? b.radius : b.radius * 0.91;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  const biscuitGrad = ctx.createRadialGradient(-4, -4, 3, 0, 0, b.radius);
  if (b.variant === 'GOLDEN') {
    biscuitGrad.addColorStop(0, '#FEF08A');
    biscuitGrad.addColorStop(0.6, '#F59E0B');
    biscuitGrad.addColorStop(1, '#B45309');
  } else if (b.variant === 'SPECIAL') {
    biscuitGrad.addColorStop(0, '#FDE68A');
    biscuitGrad.addColorStop(0.65, '#D97706');
    biscuitGrad.addColorStop(1, '#7C2D12');
  } else {
    // Classic baked Osmania Biscuit: pale golden center with toasted brown edge
    biscuitGrad.addColorStop(0, '#FDE68A');
    biscuitGrad.addColorStop(0.68, '#D97706');
    biscuitGrad.addColorStop(1, '#92400E');
  }

  ctx.fillStyle = biscuitGrad;
  ctx.fill();
  ctx.strokeStyle = b.variant === 'GOLDEN' ? '#FEF9C3' : '#78350F';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Inner stamped ring on Osmania biscuit
  ctx.strokeStyle = 'rgba(120, 53, 15, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, b.radius * 0.64, 0, Math.PI * 2);
  ctx.stroke();

  // Docked pinhole dots or power-up icon
  if (b.variant === 'SPECIAL' && b.powerUp) {
    ctx.rotate(-b.rotation); // Keep badge upright
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(POWERUP_META[b.powerUp].badge, 0, 1);
  } else {
    ctx.fillStyle = b.variant === 'GOLDEN' ? '#92400E' : '#78350F';
    const dots = [
      [0, 0],
      [-6, -5],
      [6, -5],
      [-6, 5],
      [6, 5],
    ];
    dots.forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    if (b.variant === 'GOLDEN' && Math.floor(now / 150) % 2 === 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-5, -6, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

export function drawGoldenChaiBonusTarget(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  now: number
) {
  ctx.save();
  const pulse = 1 + Math.sin(now * 0.008) * 0.08;
  ctx.translate(x, y);
  ctx.scale(pulse, pulse);

  const glow = ctx.createRadialGradient(0, 0, 8, 0, 0, 46);
  glow.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
  glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.fill();

  // Golden glass body
  ctx.fillStyle = '#F59E0B';
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-18, -22);
  ctx.lineTo(18, -22);
  ctx.lineTo(13, 22);
  ctx.lineTo(-13, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFBEB';
  ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TAP +120', 0, 36);
  ctx.restore();
}

export function drawIraniChaiStation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  brewProgress: number, // 0 to 100
  cupsBrewed: number,
  clickPulse: number,
  isPouring: boolean,
  now: number,
  reducedMotion: boolean
) {
  const cx = width / 2;
  const cy = height * 0.56;

  ctx.save();

  // Marble Café Table Top
  const tableY = cy + 95;
  const tableGrad = ctx.createLinearGradient(0, tableY, 0, height);
  tableGrad.addColorStop(0, '#E7E5E4');
  tableGrad.addColorStop(0.15, '#D6D3D1');
  tableGrad.addColorStop(1, '#78716C');
  ctx.fillStyle = tableGrad;
  ctx.beginPath();
  ctx.ellipse(cx, tableY + 45, Math.min(340, width * 0.46), 75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#A8A29E';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Ceramic Saucer (Pirich)
  ctx.fillStyle = '#FFFBEB';
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 88, 92, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cx, cy + 88, 56, 12, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Brass Kettle Spout & Pouring Stream from top when clicking
  const spoutX = cx + 52;
  const spoutY = cy - 135;

  if (isPouring) {
    const streamGrad = ctx.createLinearGradient(cx, spoutY + 10, cx, cy + 60);
    streamGrad.addColorStop(0, '#78350F');
    streamGrad.addColorStop(0.5, '#B45309');
    streamGrad.addColorStop(1, '#D97706');
    ctx.strokeStyle = streamGrad;
    ctx.lineWidth = 10 + Math.sin(now * 0.05) * 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, spoutY + 12);
    ctx.lineTo(cx, cy + 50);
    ctx.stroke();
  }

  // Brass Kettle (Samovar Spout)
  ctx.fillStyle = '#D97706';
  ctx.strokeStyle = '#FEF3C7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(spoutX + 45, spoutY - 22);
  ctx.lineTo(cx - 4, spoutY + 8);
  ctx.lineTo(cx + 6, spoutY + 18);
  ctx.lineTo(spoutX + 55, spoutY - 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Scale effect on glass from tapping
  const scale = 1 + clickPulse * 0.07;
  ctx.translate(cx, cy + 15);
  ctx.scale(scale, scale);

  const glassTopW = 64;
  const glassBottomW = 44;
  const glassH = 144;
  const topY = -glassH / 2;
  const botY = glassH / 2;

  // Clip inside Fluted Irani Tea Glass to fill liquid
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-glassTopW, topY);
  ctx.lineTo(glassTopW, topY);
  ctx.lineTo(glassBottomW, botY);
  ctx.lineTo(-glassBottomW, botY);
  ctx.closePath();
  ctx.clip();

  // Glass background tint
  ctx.fillStyle = 'rgba(255, 251, 235, 0.14)';
  ctx.fillRect(-glassTopW, topY, glassTopW * 2, glassH);

  // Liquid Fill based on brewProgress (0..100)
  const fillRatio = Math.max(0.06, Math.min(1, brewProgress / 100));
  const fillHeight = glassH * fillRatio;
  const liquidTopY = botY - fillHeight;

  const chaiGrad = ctx.createLinearGradient(0, liquidTopY, 0, botY);
  chaiGrad.addColorStop(0, '#D97706'); // Creamy malai caramel top
  chaiGrad.addColorStop(0.25, '#B45309'); // Rich Irani chai body
  chaiGrad.addColorStop(1, '#78350F'); // Deep decoction base

  ctx.fillStyle = chaiGrad;
  ctx.beginPath();
  ctx.moveTo(-glassTopW, liquidTopY);
  // Subtle wave at top of chai
  const waveAmp = isPouring && !reducedMotion ? 4 : 1.5;
  for (let wx = -glassTopW; wx <= glassTopW; wx += 10) {
    const wy = liquidTopY + Math.sin(wx * 0.08 + now * 0.01) * waveAmp;
    ctx.lineTo(wx, wy);
  }
  ctx.lineTo(glassTopW, botY);
  ctx.lineTo(-glassTopW, botY);
  ctx.closePath();
  ctx.fill();

  // Creamy Malai Foam Collar at the surface of the liquid
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(-glassTopW, liquidTopY - 3, glassTopW * 2, 7);

  // Vertical Fluted Glass Ribs
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  [-36, -18, 0, 18, 36].forEach((ribX) => {
    ctx.beginPath();
    ctx.moveTo(ribX, topY + 6);
    ctx.lineTo(ribX * 0.68, botY - 6);
    ctx.stroke();
  });

  ctx.restore();

  // Outer Glass Rim & Outline
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.78)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-glassTopW, topY);
  ctx.lineTo(glassTopW, topY);
  ctx.lineTo(glassBottomW, botY);
  ctx.lineTo(-glassBottomW, botY);
  ctx.closePath();
  ctx.stroke();

  // Animated Steam Wisps rising from the glass
  if (!reducedMotion) {
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.38)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    [-22, 0, 22].forEach((sx, idx) => {
      const phase = now * 0.003 + idx * 1.4;
      const offsetY = ((now * 0.03 + idx * 18) % 38);
      ctx.beginPath();
      ctx.moveTo(sx, topY - 8 - offsetY);
      ctx.quadraticCurveTo(
        sx + Math.sin(phase) * 10,
        topY - 22 - offsetY,
        sx - Math.sin(phase) * 6,
        topY - 36 - offsetY
      );
      ctx.stroke();
    });
  }

  // Instruction prompt on glass
  ctx.fillStyle = '#FFFBEB';
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TAP OR HOLD TO BREW!', 0, 8);
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FDE68A';
  ctx.fillText(`${Math.floor(brewProgress)}% FULL · ${cupsBrewed} CUPS`, 0, 26);

  ctx.restore();
}

export function drawParticlesAndFloatingText(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  floatingTexts: FloatingText[]
) {
  particles.forEach((p) => {
    if (p.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  floatingTexts.forEach((ft) => {
    if (ft.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, ft.opacity);
    ctx.font = `700 ${Math.round(15 * ft.scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  });
}
