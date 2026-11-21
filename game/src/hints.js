// Almost Alike — the hint system. A hint never gives the answer away for
// free: it spends points, it is limited to a few per scene, and it only
// circles the neighbourhood of one difference the player has not found yet.

import { HINTS_PER_SCENE } from './config.js';

export class HintSystem {
  constructor() {
    this.reset();
  }

  /** Fresh scene, fresh hints. */
  reset() {
    this.remaining = HINTS_PER_SCENE;
    this.active = null;
  }

  /** Spend a hint: returns the unfound difference it points at, or null. */
  useHint(differences, foundIds) {
    if (this.remaining <= 0) return null;
    const unfound = differences.filter((d) => !foundIds.has(d.id));
    if (unfound.length === 0) return null;
    this.remaining -= 1;
    // Point at the unfound difference nearest the middle of the picture:
    // the fairest one to nudge towards, not the hardest or the easiest.
    unfound.sort((a, b) => {
      const da = Math.hypot(a.x - 296, a.y - 270);
      const db = Math.hypot(b.x - 296, b.y - 270);
      return da - db;
    });
    const target = unfound[0];
    this.active = { difference: target, shownAt: performance.now() };
    return target;
  }

  /** The hint ring fades after a few seconds; null once it is gone. */
  currentHint(now = performance.now()) {
    if (!this.active) return null;
    if (now - this.active.shownAt > 4000) {
      this.active = null;
      return null;
    }
    return this.active;
  }

  /** Clear the ring early, for example when its difference is found. */
  clear() {
    this.active = null;
  }
}
