// Almost Alike — mouse and keyboard input. The game is played two ways at
// once: click a difference with the mouse, or drive the crosshair with the
// arrow keys and press Enter to check the spot it sits on. Every key the
// footer lists is handled here, and nothing else is.

import { CURSOR, PANEL } from './config.js';

export class InputController {
  constructor(game) {
    this.game = game;
    /** The keyboard crosshair, in logical field coordinates. */
    this.cursor = { x: 320, y: 350, visible: false };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  attach(canvas) {
    this.canvas = canvas;
    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('click', this.onMouseClick);
    window.addEventListener('keydown', this.onKeyDown);
  }

  detach() {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onMouseClick);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  /** Convert a pointer event to logical field coordinates. */
  toField(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  onMouseMove(event) {
    const p = this.toField(event);
    this.game.pointerMoved(p.x, p.y);
  }

  onMouseClick(event) {
    const p = this.toField(event);
    this.game.pointerClicked(p.x, p.y);
  }

  onKeyDown(event) {
    const g = this.game;
    const step = event.shiftKey ? CURSOR.fastStep : CURSOR.step;
    switch (event.key) {
      case 'ArrowLeft':
        this.moveCursor(-step, 0);
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.moveCursor(step, 0);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.moveCursor(0, -step);
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.moveCursor(0, step);
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        g.keyboardCheck(this.cursor.x, this.cursor.y);
        event.preventDefault();
        break;
      case 'h':
      case 'H':
        g.requestHint();
        break;
      case 'm':
      case 'M':
        g.toggleMagnifier();
        break;
      case 'n':
      case 'N':
        g.nextScene();
        break;
      case 'r':
      case 'R':
        g.restartScene();
        break;
      case 'Escape':
        g.backToMenu();
        break;
      default: {
        // Keys 1-6 jump straight to a scene.
        const n = Number.parseInt(event.key, 10);
        if (n >= 1 && n <= 6) g.jumpToScene(n - 1);
        break;
      }
    }
  }

  /** Move the crosshair, keeping it inside the two picture panels. */
  moveCursor(dx, dy) {
    this.cursor.visible = true;
    const { width, height, y, leftX, rightX } = PANEL;
    let { x, y: cy } = this.cursor;
    x += dx;
    cy += dy;
    // The crosshair lives on one panel: crossing the gap jumps panels.
    const inLeft = x >= leftX && x <= leftX + width;
    const inRight = x >= rightX && x <= rightX + width;
    if (!inLeft && !inRight) {
      if (dx > 0 && x > leftX + width) x = rightX + 8;
      else if (dx < 0 && x < rightX) x = leftX + width - 8;
      else x = Math.max(leftX + 8, Math.min(leftX + width - 8, x));
    }
    cy = Math.max(y + 8, Math.min(y + height - 8, cy));
    this.cursor.x = x;
    this.cursor.y = cy;
    this.game.cursorMoved(x, cy);
  }
}
