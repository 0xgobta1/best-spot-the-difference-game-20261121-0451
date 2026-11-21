// Almost Alike — every sound the game makes, synthesised with WebAudio.
// No audio files: each effect is a short oscillator phrase, so the game
// stays a handful of static files and plays offline.

/** Lazily created AudioContext; null until the first user gesture. */
let context = null;

function audioContext() {
  if (context === null) {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return null;
    context = new AC();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

/** One tone: frequency, start delay, length, waveform, volume. */
function tone(ctx, freq, delay, length, type, volume) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + length);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + length + 0.05);
}

/** The satisfying mark on a find: two rising notes and a soft chime. */
export function playFound() {
  const ctx = audioContext();
  if (!ctx) return;
  tone(ctx, 523.25, 0, 0.14, 'sine', 0.22);
  tone(ctx, 783.99, 0.07, 0.2, 'sine', 0.22);
  tone(ctx, 1046.5, 0.14, 0.3, 'triangle', 0.14);
}

/** A dull thud for a wrong click. */
export function playMiss() {
  const ctx = audioContext();
  if (!ctx) return;
  tone(ctx, 160, 0, 0.16, 'square', 0.1);
  tone(ctx, 110, 0.05, 0.18, 'square', 0.08);
}

/** A soft sparkle when a hint lands. */
export function playHint() {
  const ctx = audioContext();
  if (!ctx) return;
  tone(ctx, 880, 0, 0.12, 'sine', 0.14);
  tone(ctx, 1174.66, 0.08, 0.18, 'sine', 0.12);
}

/** A little fanfare when a scene is cleared. */
export function playSceneClear() {
  const ctx = audioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => tone(ctx, freq, i * 0.11, 0.26, 'triangle', 0.18));
}

/** A longer fanfare for finishing the whole hunt. */
export function playCampaignClear() {
  const ctx = audioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
  notes.forEach((freq, i) => tone(ctx, freq, i * 0.12, 0.3, 'triangle', 0.18));
}

/** Two low notes when the clock runs out. */
export function playTimeUp() {
  const ctx = audioContext();
  if (!ctx) return;
  tone(ctx, 392, 0, 0.25, 'triangle', 0.16);
  tone(ctx, 311.13, 0.22, 0.4, 'triangle', 0.16);
}

/** A click for moving the cursor or pressing a button. */
export function playClick() {
  const ctx = audioContext();
  if (!ctx) return;
  tone(ctx, 660, 0, 0.06, 'sine', 0.1);
}
