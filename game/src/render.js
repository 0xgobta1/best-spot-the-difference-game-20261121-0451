// Almost Alike — everything the player sees. The renderer owns the two
// offscreen picture panels (left: the picture as drawn; right: the same
// picture with every difference applied), then composes each frame: header,
// panels, found markers, hint ring, magnifier, cursor, footer, toasts and
// the menu and end-of-scene overlays.

import { FIELD, PANEL, HEADER, FOOTER, PALETTE, FONT } from './config.js';
import { disc, ring, label } from './helpers.js';

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    /** scene id -> { left, right } offscreen panels, built once per scene. */
    this.panels = new Map();
  }

  /** Build (once) and return the two panels for a scene. */
  panelsFor(scene) {
    const cached = this.panels.get(scene.id);
    if (cached) return cached;
    const left = document.createElement('canvas');
    left.width = PANEL.width;
    left.height = PANEL.height;
    const right = document.createElement('canvas');
    right.width = PANEL.width;
    right.height = PANEL.height;
    const lctx = left.getContext('2d');
    scene.paint(lctx);
    const rctx = right.getContext('2d');
    scene.paint(rctx);
    for (const d of scene.differences) d.apply(rctx);
    const pair = { left, right };
    this.panels.set(scene.id, pair);
    return pair;
  }

  /** Fit the 1280x720 field into the window, letterboxed. */
  fit() {
    const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
    this.canvas.width = FIELD.width;
    this.canvas.height = FIELD.height;
    this.canvas.style.width = `${Math.floor(FIELD.width * scale)}px`;
    this.canvas.style.height = `${Math.floor(FIELD.height * scale)}px`;
  }

  draw(game) {
    const ctx = this.ctx;
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    if (game.state === 'menu') {
      this.drawMenu(game);
      return;
    }
    this.drawHeader(game);
    this.drawPanels(game);
    this.drawFooter(game);
    this.drawToast(game);
    if (game.state === 'sceneClear') this.drawSceneClear(game);
    if (game.state === 'timeUp') this.drawTimeUp(game);
    if (game.state === 'campaignClear') this.drawCampaignClear(game);
  }

  drawHeader(game) {
    const ctx = this.ctx;
    ctx.fillStyle = PALETTE.header;
    ctx.fillRect(0, 0, FIELD.width, HEADER.height);
    ctx.fillStyle = PALETTE.headerLine;
    ctx.fillRect(0, HEADER.height - 2, FIELD.width, 2);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = PALETTE.accent;
    ctx.font = `800 26px ${FONT}`;
    ctx.fillText('ALMOST ALIKE', 24, 30);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `600 13px ${FONT}`;
    ctx.fillText('SPOT THE DIFFERENCE', 24, 54);
    // Scene name and difficulty.
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.text;
    ctx.font = `700 20px ${FONT}`;
    ctx.fillText(game.scene.name, 430, 26);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 13px ${FONT}`;
    ctx.fillText(game.scene.sub, 430, 50);
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = i < game.scene.difficulty ? PALETTE.star : PALETTE.starEmpty;
      ctx.font = '16px sans-serif';
      ctx.fillText('★', 540 + i * 18, 26);
    }
    // The counter: big, in the middle, impossible to miss.
    const found = game.found.size;
    const total = game.scene.differences.length;
    ctx.fillStyle = found === total ? PALETTE.good : PALETTE.accent;
    ctx.font = `800 30px ${FONT}`;
    ctx.fillText(`FOUND ${found} / ${total}`, 720, 28);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 13px ${FONT}`;
    ctx.fillText(`${total - found} still hiding`, 720, 54);
    // Timer and score, right.
    const urgent = game.scoreKeeper.timeLeft <= 30;
    ctx.fillStyle = urgent ? PALETTE.bad : PALETTE.text;
    ctx.font = `800 28px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText(game.scoreKeeper.clockText(), 1120, 28);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 13px ${FONT}`;
    ctx.fillText('TIME LEFT', 1120, 52);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `800 28px ${FONT}`;
    ctx.fillText(String(game.totalScore()), 1256, 28);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 13px ${FONT}`;
    ctx.fillText('SCORE', 1256, 52);
    ctx.textAlign = 'left';
  }

  drawPanels(game) {
    const ctx = this.ctx;
    const { left, right } = this.panelsFor(game.scene);
    ctx.save();
    ctx.shadowColor = PALETTE.panelShadow;
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = PALETTE.panelFrame;
    roundedRect(ctx, PANEL.leftX - 4, PANEL.y - 4, PANEL.width + 8, PANEL.height + 8, 10);
    ctx.fill();
    roundedRect(ctx, PANEL.rightX - 4, PANEL.y - 4, PANEL.width + 8, PANEL.height + 8, 10);
    ctx.fill();
    ctx.restore();
    ctx.drawImage(left, PANEL.leftX, PANEL.y);
    ctx.drawImage(right, PANEL.rightX, PANEL.y);
    // Panel tags.
    this.panelTag('A · ORIGINAL', PANEL.leftX + 12, PANEL.y + 12);
    this.panelTag('B · SPOT THE CHANGES', PANEL.rightX + 12, PANEL.y + 12);
    // Found markers on both panels, at the same spot in each.
    for (const d of game.scene.differences) {
      if (!game.found.has(d.id)) continue;
      for (const x0 of [PANEL.leftX, PANEL.rightX]) {
        const cx = x0 + d.x;
        const cy = PANEL.y + d.y;
        ctx.strokeStyle = PALETTE.markerRing;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.markerCheck;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = PALETTE.markerRing;
        disc(ctx, cx, cy, 9);
        ctx.strokeStyle = PALETTE.markerCheck;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy);
        ctx.lineTo(cx - 1, cy + 3);
        ctx.lineTo(cx + 5, cy - 3);
        ctx.stroke();
      }
    }
    // Miss ripples: red crosses that fade.
    const now = performance.now();
    game.misses = game.misses.filter((m) => now - m.at < 700);
    for (const m of game.misses) {
      const alpha = 1 - (now - m.at) / 700;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = PALETTE.bad;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      for (const x0 of [PANEL.leftX, PANEL.rightX]) {
        const cx = x0 + m.px;
        const cy = PANEL.y + m.py;
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy - 9);
        ctx.lineTo(cx + 9, cy + 9);
        ctx.moveTo(cx + 9, cy - 9);
        ctx.lineTo(cx - 9, cy + 9);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // Hint ring, pulsing on both panels.
    const hint = game.hints.currentHint(now);
    if (hint) {
      const pulse = 1 + 0.12 * Math.sin(now / 160);
      const d = hint.difference;
      for (const x0 of [PANEL.leftX, PANEL.rightX]) {
        const cx = x0 + d.x;
        const cy = PANEL.y + d.y;
        ctx.strokeStyle = PALETTE.hint;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 30 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(124,199,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 38 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // Magnifier lens on top of the panels.
    game.magnifier.draw(ctx, left, right);
    // Keyboard crosshair.
    if (game.input.cursor.visible && game.state === 'playing') {
      const { x, y } = game.input.cursor;
      ctx.strokeStyle = PALETTE.cursor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 24, y);
      ctx.lineTo(x - 8, y);
      ctx.moveTo(x + 8, y);
      ctx.lineTo(x + 24, y);
      ctx.moveTo(x, y - 24);
      ctx.lineTo(x, y - 8);
      ctx.moveTo(x, y + 8);
      ctx.lineTo(x, y + 24);
      ctx.stroke();
      disc(ctx, x, y, 2);
    }
  }

  panelTag(text, x, y) {
    const ctx = this.ctx;
    ctx.font = `700 12px ${FONT}`;
    const w = ctx.measureText(text).width + 18;
    ctx.fillStyle = 'rgba(23,26,38,0.78)';
    roundedRect(ctx, x, y, w, 22, 11);
    ctx.fill();
    ctx.fillStyle = PALETTE.text;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 9, y + 12);
  }

  drawFooter(game) {
    const ctx = this.ctx;
    ctx.fillStyle = PALETTE.header;
    ctx.fillRect(0, FOOTER.y, FIELD.width, FOOTER.height);
    ctx.fillStyle = PALETTE.headerLine;
    ctx.fillRect(0, FOOTER.y, FIELD.width, 2);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `600 14px ${FONT}`;
    ctx.fillText('Click a difference · Arrows move the crosshair · Enter checks · H hint · M magnifier · N next scene · R restart · Esc menu', 24, FOOTER.y + 22);
    // Hints left, combo and best, right.
    const hints = '◉'.repeat(game.hints.remaining) + '○'.repeat(3 - game.hints.remaining);
    ctx.fillStyle = PALETTE.hint;
    ctx.font = `700 15px ${FONT}`;
    ctx.fillText(`Hints ${hints}`, 24, FOOTER.y + 50);
    ctx.textAlign = 'right';
    const combo = game.scoreKeeper.combo;
    ctx.fillStyle = combo >= 3 ? PALETTE.accent : PALETTE.muted;
    ctx.font = `700 15px ${FONT}`;
    ctx.fillText(combo >= 2 ? `Combo x${combo}  ·  ` : '', 900, FOOTER.y + 50);
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText(`Best ${game.bestScore}`, 1256, FOOTER.y + 50);
    ctx.textAlign = 'left';
  }

  drawToast(game) {
    const toast = game.toast;
    if (!toast) return;
    const age = performance.now() - toast.at;
    if (age > 3000) {
      game.toast = null;
      return;
    }
    const alpha = age > 2400 ? 1 - (age - 2400) / 600 : 1;
    const ctx = this.ctx;
    ctx.globalAlpha = alpha;
    ctx.font = `700 18px ${FONT}`;
    const w = ctx.measureText(toast.text).width + 36;
    // A pill just above the footer, over the panels' empty bottom edge:
    // never on top of the footer's own text.
    ctx.fillStyle = 'rgba(23,26,38,0.88)';
    roundedRect(ctx, 640 - w / 2, 588, w, 36, 18);
    ctx.fill();
    ctx.fillStyle = toast.good ? PALETTE.good : PALETTE.bad;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(toast.text, 640, 607);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  drawMenu(game) {
    const ctx = this.ctx;
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    label(ctx, 'ALMOST ALIKE', 640, 84, 54, PALETTE.accent, 800);
    label(ctx, 'Two pictures. Ten differences. How sharp are your eyes?', 640, 132, 19, PALETTE.muted, 500);
    // Scene cards, three per row.
    const cardW = 380;
    const cardH = 150;
    game.menuCards = [];
    game.sceneList.forEach((scene, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 40 + col * (cardW + 20);
      const y = 180 + row * (cardH + 20);
      game.menuCards.push({ scene, x, y, w: cardW, h: cardH });
      const hovered = game.hoverCard === i;
      ctx.fillStyle = hovered ? PALETTE.buttonHover : PALETTE.button;
      roundedRect(ctx, x, y, cardW, cardH, 12);
      ctx.fill();
      ctx.fillStyle = PALETTE.accent;
      ctx.font = `800 15px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${i + 1} · SCENE ${i + 1}`, x + 20, y + 26);
      ctx.fillStyle = PALETTE.text;
      ctx.font = `700 22px ${FONT}`;
      ctx.fillText(scene.name, x + 20, y + 58);
      ctx.fillStyle = PALETTE.muted;
      ctx.font = `500 14px ${FONT}`;
      ctx.fillText(scene.sub, x + 20, y + 86);
      for (let s = 0; s < 5; s += 1) {
        ctx.fillStyle = s < scene.difficulty ? PALETTE.star : PALETTE.starEmpty;
        ctx.font = '15px sans-serif';
        ctx.fillText('★', x + 20 + s * 18, y + 116);
      }
      const stars = game.sceneStars[scene.id] ?? 0;
      ctx.fillStyle = PALETTE.star;
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('★'.repeat(stars) + '☆'.repeat(3 - stars), x + cardW - 20, y + 116);
      ctx.textAlign = 'left';
    });
    label(ctx, 'Click a scene, or press 1–6 · Click a difference on either picture · H hint · M magnifier · Arrows + Enter play by keyboard', 640, 560, 15, PALETTE.muted, 500);
    label(ctx, 'Best campaign score: ' + game.bestScore, 640, 596, 15, PALETTE.accent, 700);
    label(ctx, 'Six original scenes, painted for this game — no two pictures are ever quite the same.', 640, 640, 14, PALETTE.muted, 500);
  }

  drawSceneClear(game) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(10,12,20,0.72)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    const w = 560;
    const h = 380;
    const x = 640 - w / 2;
    const y = 170;
    ctx.fillStyle = PALETTE.header;
    roundedRect(ctx, x, y, w, h, 16);
    ctx.fill();
    ctx.strokeStyle = PALETTE.accent;
    ctx.lineWidth = 2;
    roundedRect(ctx, x, y, w, h, 16);
    ctx.stroke();
    label(ctx, 'SCENE COMPLETE!', 640, y + 48, 32, PALETTE.good, 800);
    const stars = game.scoreKeeper.starsForScene();
    ctx.font = '44px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = i < stars ? PALETTE.star : PALETTE.starEmpty;
      ctx.fillText('★', 580 + i * 60, y + 116);
    }
    label(ctx, `${game.scene.name} — all 10 differences found`, 640, y + 160, 17, PALETTE.text, 600);
    const bonus = game.clearBonus ?? { clearBonus: 0, timeBonus: 0, total: 0 };
    label(ctx, `Scene bonus ${bonus.clearBonus}  ·  Time bonus ${bonus.timeBonus}  ·  Scene score ${game.scoreKeeper.score}`, 640, y + 196, 16, PALETTE.muted, 500);
    label(ctx, `Campaign score ${game.totalScore()}`, 640, y + 228, 20, PALETTE.accent, 800);
    const names = game.scene.differences.map((d) => d.label).join(' · ');
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `500 13px ${FONT}`;
    ctx.textAlign = 'center';
    this.wrapText(names, 640, y + 262, w - 60, 20);
    label(ctx, 'Press N for the next scene · R to replay · Esc for the menu', 640, y + 336, 15, PALETTE.text, 600);
    ctx.textAlign = 'left';
  }

  drawTimeUp(game) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(10,12,20,0.72)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    const w = 520;
    const h = 240;
    const x = 640 - w / 2;
    const y = 240;
    ctx.fillStyle = PALETTE.header;
    roundedRect(ctx, x, y, w, h, 16);
    ctx.fill();
    ctx.strokeStyle = PALETTE.bad;
    ctx.lineWidth = 2;
    roundedRect(ctx, x, y, w, h, 16);
    ctx.stroke();
    label(ctx, "TIME'S UP!", 640, y + 52, 32, PALETTE.bad, 800);
    label(ctx, `You found ${game.found.size} of 10 differences in ${game.scene.name}.`, 640, y + 100, 17, PALETTE.text, 600);
    label(ctx, `${10 - game.found.size} are still hiding in the pictures.`, 640, y + 130, 15, PALETTE.muted, 500);
    label(ctx, 'Press R to try again · Esc for the menu', 640, y + 180, 15, PALETTE.text, 600);
    ctx.textAlign = 'left';
  }

  drawCampaignClear(game) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(10,12,20,0.78)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    const w = 640;
    const h = 420;
    const x = 640 - w / 2;
    const y = 150;
    ctx.fillStyle = PALETTE.header;
    roundedRect(ctx, x, y, w, h, 16);
    ctx.fill();
    ctx.strokeStyle = PALETTE.accent;
    ctx.lineWidth = 2;
    roundedRect(ctx, x, y, w, h, 16);
    ctx.stroke();
    label(ctx, 'YOU FOUND THEM ALL!', 640, y + 50, 32, PALETTE.accent, 800);
    label(ctx, 'Sixty differences across six scenes — every last one.', 640, y + 88, 16, PALETTE.muted, 500);
    label(ctx, `Campaign score ${game.totalScore()}`, 640, y + 130, 26, PALETTE.text, 800);
    const best = Math.max(game.bestScore, game.totalScore());
    label(ctx, `Best score ${best}`, 640, y + 164, 16, PALETTE.accent, 700);
    let rowY = y + 200;
    for (const scene of game.sceneList) {
      const stars = game.sceneStars[scene.id] ?? 0;
      ctx.textAlign = 'left';
      ctx.fillStyle = PALETTE.text;
      ctx.font = `600 16px ${FONT}`;
      ctx.textBaseline = 'middle';
      ctx.fillText(scene.name, x + 40, rowY);
      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.star;
      ctx.font = '16px sans-serif';
      ctx.fillText('★'.repeat(stars) + '☆'.repeat(3 - stars), x + w - 40, rowY);
      rowY += 28;
    }
    ctx.textAlign = 'left';
    label(ctx, 'Press Esc for the menu · R to hunt again from Scene 1', 640, y + h - 36, 15, PALETTE.text, 600);
  }

  /** Centre-aligned wrapped text, one line at a time. */
  wrapText(text, cx, y, maxWidth, lineHeight) {
    const ctx = this.ctx;
    const words = text.split(' ');
    let line = '';
    let lineY = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, cx, lineY);
        line = word;
        lineY += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, cx, lineY);
  }
}
