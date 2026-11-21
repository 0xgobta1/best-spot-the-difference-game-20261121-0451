// Almost Alike — the magnifier lens. A circle that follows the pointer and
// shows the picture underneath at double size, so a small difference can be
// studied up close without leaving the game. It draws from the panel's own
// offscreen canvas, so what it shows is exactly what the game shows.

import { MAGNIFIER, PANEL } from './config.js';

export class Magnifier {
  constructor() {
    /** The lens is off until the player turns it on. */
    this.enabled = false;
    /** Pointer position in logical field coordinates. */
    this.x = 640;
    this.y = 360;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  /** Which panel, if any, the lens sits over, and where inside it. */
  panelUnder() {
    const { width, height, y, leftX, rightX } = PANEL;
    if (this.y < y || this.y > y + height) return null;
    if (this.x >= leftX && this.x <= leftX + width) {
      return { panel: 'left', px: this.x - leftX, py: this.y - y };
    }
    if (this.x >= rightX && this.x <= rightX + width) {
      return { panel: 'right', px: this.x - rightX, py: this.y - y };
    }
    return null;
  }

  /** Draw the lens over the composed frame. */
  draw(ctx, leftCanvas, rightCanvas) {
    if (!this.enabled) return;
    const under = this.panelUnder();
    if (!under) return;
    const source = under.panel === 'left' ? leftCanvas : rightCanvas;
    const radius = MAGNIFIER.diameter / 2;
    const zoom = MAGNIFIER.zoom;
    const sourceRadius = radius / zoom;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      source,
      under.px - sourceRadius,
      under.py - sourceRadius,
      sourceRadius * 2,
      sourceRadius * 2,
      this.x - radius,
      this.y - radius,
      radius * 2,
      radius * 2,
    );
    ctx.restore();
    // Ring and a small handle, so the lens reads as a tool, not a hole.
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = MAGNIFIER.ringWidth;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#8a6d4b';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x + radius * 0.7, this.y + radius * 0.7);
    ctx.lineTo(this.x + radius * 1.05, this.y + radius * 1.05);
    ctx.stroke();
    // "2x" tag on the rim.
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(this.x, this.y - radius, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2b2b';
    ctx.font = '800 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2x', this.x, this.y - radius + 1);
  }
}
