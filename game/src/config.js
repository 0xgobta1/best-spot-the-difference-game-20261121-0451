// Almost Alike — every tuning number, colour and layout constant in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to the
// window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** Two picture panels, side by side, with a gap between them. */
export const PANEL = { width: 592, height: 540, y: 84, leftX: 24, rightX: 664, gap: 48 };

/** Header band (title, scene name, timer, score) and footer band (controls). */
export const HEADER = { height: 72 };
export const FOOTER = { y: 636, height: 72 };

/** How many differences every scene hides. */
export const DIFFERENCES_PER_SCENE = 10;

/** Seconds on the clock when a scene starts. */
export const SCENE_TIME_SECONDS = 300;

/** Points for a find, before the combo multiplier. */
export const SCORE = {
  find: 100,
  comboStep: 25,
  comboMax: 200,
  mistake: -25,
  hintCost: 50,
  timeBonusPerSecond: 5,
  sceneClearBonus: 250,
};

/** Hints a player may spend in one scene. */
export const HINTS_PER_SCENE = 3;

/** Magnifier lens: diameter in screen pixels, zoom factor. */
export const MAGNIFIER = { diameter: 170, zoom: 2, ringWidth: 5 };

/** The crosshair cursor the keyboard drives. */
export const CURSOR = { step: 14, fastStep: 56, radius: 16 };

export const PALETTE = {
  backdrop: '#171a26',
  header: '#1f2436',
  headerLine: '#343b52',
  panelFrame: '#3a415c',
  panelShadow: 'rgba(0, 0, 0, 0.45)',
  text: '#f2f4fa',
  muted: '#9aa3bd',
  accent: '#ffd166',
  accentDark: '#e8a93d',
  good: '#58d68d',
  goodDark: '#1f7a44',
  bad: '#ff6b6b',
  hint: '#7cc7ff',
  cursor: '#ffffff',
  markerRing: '#ffe066',
  markerCheck: '#1f7a44',
  button: '#2c3550',
  buttonHover: '#3a4568',
  star: '#ffd166',
  starEmpty: '#3a415c',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Where the best campaign score is kept between visits (this browser only). */
export const BEST_KEY = 'almost-alike.best';

/** Scene ids in campaign order, easiest first. */
export const SCENE_ORDER = ['harbour', 'garden', 'cabin', 'market', 'station', 'library'];

/** The four screenshot states the maker ships (see shots.js). */
export const SHOT_NAMES = ['1-play.jpg', '2-magnifier.jpg', '3-hint.jpg', '4-complete.jpg'];
