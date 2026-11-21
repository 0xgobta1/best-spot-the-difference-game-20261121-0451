// Almost Alike — the game itself: state, rules and the frame loop. The game
// has five states (menu, playing, sceneClear, timeUp, campaignClear) and one
// rule that matters: a click counts only when it lands on a difference the
// player has not found yet, on either picture, nearest difference wins.

import { PANEL, SCENE_ORDER } from './config.js';
import { SCENES, sceneById } from './scenes.js';
import { Renderer } from './render.js';
import { InputController } from './input.js';
import { ScoreKeeper, loadBestScore, saveBestScore } from './score.js';
import { HintSystem } from './hints.js';
import { Magnifier } from './magnifier.js';
import { playFound, playMiss, playHint, playSceneClear, playCampaignClear, playTimeUp, playClick } from './audio.js';
import { applyShot } from './shots.js';

export class Game {
  constructor(canvas, statusEl) {
    this.canvas = canvas;
    this.statusEl = statusEl;
    this.renderer = new Renderer(canvas);
    this.input = new InputController(this);
    this.scoreKeeper = new ScoreKeeper();
    this.hints = new HintSystem();
    this.magnifier = new Magnifier();
    this.sceneList = SCENE_ORDER.map((id) => sceneById(id));
    this.state = 'menu';
    this.sceneIndex = 0;
    this.scene = this.sceneList[0];
    this.found = new Set();
    /** Wrong clicks, as {px, py, at}, drawn as fading red crosses. */
    this.misses = [];
    /** Short-lived message over the footer. */
    this.toast = null;
    this.sceneStars = {};
    this.campaignScore = 0;
    this.scoreBanked = false;
    this.bestScore = loadBestScore();
    this.clearBonus = null;
    this.menuCards = [];
    this.hoverCard = -1;
    /** Shot mode freezes the clock so screenshots are deterministic. */
    this.frozen = false;
    this.lastTime = 0;
  }

  /** Total points across every scene played this campaign. */
  totalScore() {
    return this.campaignScore + (this.scoreBanked ? 0 : this.scoreKeeper.score);
  }

  boot() {
    this.renderer.fit();
    window.addEventListener('resize', () => this.renderer.fit());
    this.input.attach(this.canvas);
    const params = new URLSearchParams(window.location.search);
    if (params.has('shot')) {
      applyShot(this, params.get('shot') ?? 'play');
      this.frozen = true;
    } else if (params.has('selftest')) {
      this.runSelfTest();
    }
    this.announce('Almost Alike. Choose a scene to start hunting differences.');
    requestAnimationFrame((t) => this.frame(t));
  }

  frame(now) {
    const dt = this.lastTime ? Math.min(0.1, (now - this.lastTime) / 1000) : 0;
    this.lastTime = now;
    if (this.state === 'playing' && !this.frozen) {
      const ranOut = this.scoreKeeper.tick(dt);
      if (ranOut) {
        this.state = 'timeUp';
        playTimeUp();
        this.announce(`Time's up. You found ${this.found.size} of 10 differences.`);
      }
    }
    this.renderer.draw(this);
    requestAnimationFrame((t) => this.frame(t));
  }

  announce(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  showToast(text, good = true) {
    this.toast = { text, good, at: performance.now() };
  }

  // ---------------------------------------------------------- scene flow ---
  startScene(index) {
    this.sceneIndex = index;
    this.scene = this.sceneList[index];
    this.found = new Set();
    this.misses = [];
    this.scoreKeeper.reset();
    this.scoreBanked = false;
    this.hints.reset();
    this.clearBonus = null;
    this.state = 'playing';
    this.input.cursor.visible = false;
    this.input.cursor.x = PANEL.leftX + PANEL.width / 2;
    this.input.cursor.y = PANEL.y + PANEL.height / 2;
    playClick();
    this.announce(`${this.scene.name}. Find 10 differences. ${this.scoreKeeper.clockText()} on the clock.`);
  }

  jumpToScene(index) {
    if (index < 0 || index >= this.sceneList.length) return;
    this.startScene(index);
  }

  nextScene() {
    if (this.state !== 'sceneClear') return;
    if (this.sceneIndex + 1 >= this.sceneList.length) {
      this.finishCampaign();
      return;
    }
    this.startScene(this.sceneIndex + 1);
  }

  restartScene() {
    if (this.state === 'playing' || this.state === 'timeUp' || this.state === 'sceneClear') {
      this.startScene(this.sceneIndex);
    }
  }

  backToMenu() {
    this.state = 'menu';
    playClick();
    this.announce('Menu. Choose a scene to start hunting differences.');
  }

  finishCampaign() {
    this.state = 'campaignClear';
    saveBestScore(this.totalScore());
    this.bestScore = Math.max(this.bestScore, this.totalScore());
    playCampaignClear();
    this.announce(`Campaign complete. You found all sixty differences. Score ${this.totalScore()}.`);
  }

  // ------------------------------------------------------------- playing ---
  /** The pointer moved: the lens follows it, the menu tracks its hover. */
  pointerMoved(x, y) {
    this.magnifier.moveTo(x, y);
    if (this.state === 'menu') {
      this.hoverCard = this.menuCards.findIndex((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
    }
  }

  /** The keyboard crosshair moved. */
  cursorMoved(x, y) {
    this.magnifier.moveTo(x, y);
  }

  /** A click anywhere: menu cards, or a difference check while playing. */
  pointerClicked(x, y) {
    if (this.state === 'menu') {
      const i = this.menuCards.findIndex((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
      if (i >= 0) this.startScene(i);
      return;
    }
    if (this.state === 'playing') this.checkSpot(x, y);
  }

  /** Enter/Space checks the spot under the keyboard crosshair. */
  keyboardCheck(x, y) {
    if (this.state === 'playing') this.checkSpot(x, y);
  }

  /** The spot (x, y) in field coordinates: which difference is it, if any? */
  checkSpot(x, y) {
    const panel = this.panelAt(x, y);
    if (!panel) return;
    const px = x - panel.x0;
    const py = y - PANEL.y;
    let nearest = null;
    let nearestDist = Infinity;
    for (const d of this.scene.differences) {
      if (this.found.has(d.id)) continue;
      const dist = Math.hypot(d.x - px, d.y - py);
      if (dist <= d.r && dist < nearestDist) {
        nearest = d;
        nearestDist = dist;
      }
    }
    if (nearest) {
      this.found.add(nearest.id);
      this.hints.clear();
      const gained = this.scoreKeeper.registerFind();
      playFound();
      this.showToast(`Found: ${nearest.label}! +${gained}`, true);
      this.announce(`Found ${nearest.label}. ${this.found.size} of 10.`);
      if (this.found.size === this.scene.differences.length) this.clearScene();
    } else {
      this.misses.push({ px, py, at: performance.now() });
      this.scoreKeeper.registerMistake();
      playMiss();
      this.showToast('Not a difference — try again', false);
    }
  }

  /** Which picture panel holds field point (x, y), or null. */
  panelAt(x, y) {
    if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
    if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) return { x0: PANEL.leftX };
    if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) return { x0: PANEL.rightX };
    return null;
  }

  clearScene() {
    this.clearBonus = this.scoreKeeper.finishScene();
    this.campaignScore += this.scoreKeeper.score;
    this.scoreBanked = true;
    const stars = this.scoreKeeper.starsForScene();
    this.sceneStars[this.scene.id] = Math.max(this.sceneStars[this.scene.id] ?? 0, stars);
    this.state = 'sceneClear';
    playSceneClear();
    this.announce(`${this.scene.name} complete. All 10 differences found.`);
  }

  requestHint() {
    if (this.state !== 'playing') return;
    const target = this.hints.useHint(this.scene.differences, this.found);
    if (!target) {
      this.showToast(this.hints.remaining <= 0 ? 'No hints left in this scene' : 'Nothing left to hint at', false);
      return;
    }
    this.scoreKeeper.registerHint();
    playHint();
    this.showToast(`Hint: look near the ${target.label.toLowerCase()}`, true);
    this.announce(`Hint used. ${this.hints.remaining} left.`);
  }

  toggleMagnifier() {
    const on = this.magnifier.toggle();
    this.showToast(on ? 'Magnifier on — move the pointer to look closer' : 'Magnifier off', true);
  }

  // ------------------------------------------------------------ self-test ---
  /** ?selftest=1: play every difference of scene 1 by the same code path a
   *  click takes, then report the result in the document title and a div.
   *  ?selftest=all does the same for all six scenes, one after another. */
  runSelfTest() {
    const params = new URLSearchParams(window.location.search);
    const all = params.get('selftest') === 'all';
    const scenes = all ? [0, 1, 2, 3, 4, 5] : [0];
    const lines = [];
    let passed = true;
    for (const index of scenes) {
      this.startScene(index);
      const results = [];
      for (const d of this.scene.differences) {
        this.checkSpot(PANEL.leftX + d.x, PANEL.y + d.y);
        results.push(`${d.id}:${this.found.has(d.id) ? 'ok' : 'FAIL'}`);
      }
      const ok = this.found.size === 10 && this.state === 'sceneClear';
      if (!ok) passed = false;
      lines.push(`scene${index + 1}=${this.found.size}/10${ok ? '' : ' FAIL'} ${results.join(' ')}`);
    }
    const wrong = this.checkSpotWrong();
    if (wrong !== 'ok') passed = false;
    const summary = `SELFTEST ${passed ? 'PASS' : 'FAIL'} wrong=${wrong} | ${lines.join(' | ')}`;
    document.title = summary;
    const div = document.createElement('div');
    div.id = 'selftest';
    div.textContent = summary;
    document.body.appendChild(div);
  }

  /** A click on empty sky must count as a miss, not a find. */
  checkSpotWrong() {
    const before = this.found.size;
    this.state = 'playing';
    // Top-left corner of the left panel is plain sky in scene 1.
    this.checkSpot(PANEL.leftX + 8, PANEL.y + 8);
    return this.found.size === before && this.misses.length > 0 ? 'ok' : 'FAIL';
  }
}

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
const game = new Game(canvas, statusEl);
window.addEventListener('error', (event) => {
  document.title = `PAGEERROR: ${event.message}`;
});
game.boot();
