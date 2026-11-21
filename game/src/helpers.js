// Almost Alike — small canvas drawing helpers shared by every scene painter.
// Each helper draws one shape in the current fill/stroke style; nothing here
// knows about the game, only about putting marks on a canvas.

/** Fill a circle. */
export function disc(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Stroke a circle. */
export function ring(ctx, x, y, r, width) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.lineWidth = width;
  ctx.stroke();
}

/** Fill an ellipse, rotated by `rot` radians. */
export function ellipse(ctx, x, y, rx, ry, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
}

/** Fill a rectangle. */
export function rect(ctx, x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

/** Fill a polygon through the given [x, y] points. */
export function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** A five-pointed star centred at (x, y). */
export function star(ctx, x, y, outer, inner, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** A simple cloud: three overlapping discs. */
export function cloud(ctx, x, y, scale, colour) {
  ctx.fillStyle = colour;
  disc(ctx, x, y, 18 * scale);
  disc(ctx, x + 20 * scale, y + 4 * scale, 14 * scale);
  disc(ctx, x - 20 * scale, y + 5 * scale, 13 * scale);
  rect(ctx, x - 26 * scale, y, 52 * scale, 12 * scale);
}

/** A gull: two arcs like a shallow "m". */
export function gull(ctx, x, y, scale, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

/** A pine tree: trunk plus three stacked triangles. */
export function pine(ctx, x, y, h, trunk, leaf) {
  ctx.fillStyle = trunk;
  rect(ctx, x - 4, y - 14, 8, 14);
  ctx.fillStyle = leaf;
  const w = h * 0.42;
  poly(ctx, [[x, y - h], [x - w * 0.5, y - h * 0.55], [x + w * 0.5, y - h * 0.55]]);
  poly(ctx, [[x, y - h * 0.72], [x - w * 0.62, y - h * 0.28], [x + w * 0.62, y - h * 0.28]]);
  poly(ctx, [[x, y - h * 0.45], [x - w * 0.75, y], [x + w * 0.75, y]]);
}

/** A lantern: rounded body, caps, tassel, glow. */
export function lantern(ctx, x, y, r, body, glow) {
  ctx.fillStyle = glow;
  disc(ctx, x, y, r + 9);
  ctx.fillStyle = body;
  ellipse(ctx, x, y, r, r * 1.15);
  ctx.fillStyle = '#f7d774';
  rect(ctx, x - r * 0.35, y - r * 1.3, r * 0.7, 5);
  rect(ctx, x - r * 0.35, y + r * 1.15, r * 0.7, 5);
  ctx.strokeStyle = '#8a6d1f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + r * 1.15);
  ctx.lineTo(x, y + r * 1.7);
  ctx.stroke();
}

/** A book spine on a shelf: coloured block with two title lines. */
export function book(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  rect(ctx, x, y, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  rect(ctx, x + 3, y + 8, w - 6, 2);
  rect(ctx, x + 3, y + 14, w - 6, 2);
}

/** Centre-aligned text in one call. */
export function label(ctx, text, x, y, size, colour, weight = 600) {
  ctx.fillStyle = colour;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}
