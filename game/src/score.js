// Almost Alike — the clock, the points and the combo. One ScoreKeeper per
// scene: it counts down, pays for finds, and turns a streak of finds without
// a miss into a growing combo bonus.

import { SCORE, SCENE_TIME_SECONDS, BEST_KEY } from './config.js';

export class ScoreKeeper {
  constructor() {
    this.reset();
  }

  /** Start a fresh scene: full clock, no points yet. */
  reset() {
    this.timeLeft = SCENE_TIME_SECONDS;
    this.score = 0;
    this.combo = 0;
    this.found = 0;
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.finished = false;
  }

  /** Tick the clock down by `dt` seconds; true when time just ran out. */
  tick(dt) {
    if (this.finished) return false;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft === 0) {
      this.finished = true;
      return true;
    }
    return false;
  }

  /** A difference was found: combo grows, points pay out. */
  registerFind() {
    this.combo += 1;
    this.found += 1;
    const comboBonus = Math.min(SCORE.comboMax, (this.combo - 1) * SCORE.comboStep);
    const gained = SCORE.find + comboBonus;
    this.score += gained;
    return gained;
  }

  /** A wrong click: the combo breaks and a few points go. */
  registerMistake() {
    this.combo = 0;
    this.mistakes += 1;
    this.score = Math.max(0, this.score + SCORE.mistake);
  }

  /** A hint was spent: it costs points, and breaks the combo. */
  registerHint() {
    this.combo = 0;
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score + -SCORE.hintCost);
  }

  /** The scene is cleared: time left turns into a bonus. */
  finishScene() {
    this.finished = true;
    const timeBonus = Math.round(this.timeLeft) * SCORE.timeBonusPerSecond;
    const total = SCORE.sceneClearBonus + timeBonus;
    this.score += total;
    return { clearBonus: SCORE.sceneClearBonus, timeBonus, total };
  }

  /** Clock text as m:ss. */
  clockText() {
    const total = Math.ceil(this.timeLeft);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  /** Stars for a cleared scene: speed and accuracy both count. */
  starsForScene() {
    if (this.mistakes === 0 && this.timeLeft > 120) return 3;
    if (this.mistakes <= 2 && this.timeLeft > 30) return 2;
    return 1;
  }
}

/** The campaign total across scenes, kept in this browser. */
export function loadBestScore() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    if (score > loadBestScore()) window.localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Private mode or no storage: the score simply is not kept.
  }
}
