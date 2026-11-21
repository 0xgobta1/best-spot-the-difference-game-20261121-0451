// Almost Alike — the four deterministic screenshot states. The maker ships
// screenshots of the game itself, so each shot drives the real game into a
// fixed state through the same code a player uses: start a scene, find some
// differences by their real coordinates, turn the magnifier on, spend a
// hint. The clock is frozen while a shot is showing, so the picture is the
// same on every run.

import { PANEL } from './config.js';

/** Put the game into the named screenshot state. */
export function applyShot(game, shot) {
  switch (shot) {
    case 'play':
      shotPlay(game);
      break;
    case 'magnifier':
      shotMagnifier(game);
      break;
    case 'hint':
      shotHint(game);
      break;
    case 'complete':
      shotComplete(game);
      break;
    default:
      shotPlay(game);
      break;
  }
}

/** The cover: mid-hunt, four found with markers, six still hiding. */
function shotPlay(game) {
  game.startScene(0);
  // Four finds, spread across the picture, by real clicks.
  const picks = [0, 2, 4, 7];
  for (const i of picks) {
    const d = game.scene.differences[i];
    game.checkSpot(PANEL.leftX + d.x, PANEL.y + d.y);
  }
  game.scoreKeeper.timeLeft = 252;
  game.scoreKeeper.score = 450;
  game.scoreKeeper.combo = 2;
}

/** The lens: deep in a hard scene, magnifier open over an unfound spot. */
function shotMagnifier(game) {
  game.startScene(2);
  const picks = [0, 1, 3, 5, 7, 8];
  for (const i of picks) {
    const d = game.scene.differences[i];
    game.checkSpot(PANEL.leftX + d.x, PANEL.y + d.y);
  }
  game.scoreKeeper.timeLeft = 187;
  game.scoreKeeper.score = 780;
  game.scoreKeeper.combo = 3;
  // The lens sits over the deer on the right picture, mid-hunt.
  game.magnifier.enabled = true;
  game.magnifier.moveTo(PANEL.rightX + 480, PANEL.y + 420);
  game.input.cursor.visible = true;
  game.input.cursor.x = PANEL.rightX + 480;
  game.input.cursor.y = PANEL.y + 420;
}

/** The hint: early in the night market, a hint ring pulsing on a find. */
function shotHint(game) {
  game.startScene(3);
  const picks = [1, 6];
  for (const i of picks) {
    const d = game.scene.differences[i];
    game.checkSpot(PANEL.leftX + d.x, PANEL.y + d.y);
  }
  game.scoreKeeper.timeLeft = 264;
  game.scoreKeeper.score = 200;
  game.requestHint();
  game.input.cursor.visible = true;
  game.input.cursor.x = PANEL.leftX + 300;
  game.input.cursor.y = PANEL.y + 200;
  game.magnifier.moveTo(PANEL.leftX + 300, PANEL.y + 200);
}

/** The payoff: a scene cleared, ten of ten, stars and the found list. */
function shotComplete(game) {
  game.startScene(1);
  // Set the clock before the last find, so the time bonus matches it.
  game.scoreKeeper.timeLeft = 214;
  for (const d of game.scene.differences) {
    game.checkSpot(PANEL.leftX + d.x, PANEL.y + d.y);
  }
}
