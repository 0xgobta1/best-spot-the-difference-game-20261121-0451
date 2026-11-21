// Almost Alike — the six scenes. Every scene paints one rich picture with
// `paint(ctx)` and hides ten fair differences in `differences`. The right-hand
// panel is the same picture with every difference's `apply(ctx)` painted over
// it, so the two panels are identical except for the differences themselves.
// Each difference carries its centre (x, y) in panel space (592 x 540), a hit
// radius, and a short label the game shows when it is found.

import { disc, ring, ellipse, rect, poly, star, cloud, gull, pine, lantern, book, label } from './helpers.js';

function skyGradient(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 540);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  rect(ctx, 0, 0, 592, 540);
}

function seaGradient(ctx, top, bottom, y0 = 300) {
  const g = ctx.createLinearGradient(0, y0, 0, 540);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  rect(ctx, 0, y0, 592, 540 - y0);
}

/** Repaint a disc with the panel's own vertical gradient, so an erased object
 *  leaves sky (or dusk, or sea) exactly as the base picture has it there. */
function gradientPatch(ctx, x, y, r, top, bottom) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, 0, 540);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

/** Same, but for the sea band (its gradient runs from y = 300, not 0). */
function seaPatch(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const g = ctx.createLinearGradient(0, 300, 0, 540);
  g.addColorStop(0, '#2e7fa8');
  g.addColorStop(1, '#1d5f86');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

// ---------------------------------------------------------------- harbour ---
function paintHarbour(ctx) {
  skyGradient(ctx, '#a8d8ee', '#eaf6fb');
  // Sun with eight rays, top left.
  ctx.fillStyle = '#ffd166';
  disc(ctx, 90, 80, 34);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(90 + Math.cos(a) * 44, 80 + Math.sin(a) * 44);
    ctx.lineTo(90 + Math.cos(a) * 58, 80 + Math.sin(a) * 58);
    ctx.stroke();
  }
  cloud(ctx, 300, 70, 1.1, '#ffffff');
  cloud(ctx, 470, 110, 0.9, '#ffffff');
  gull(ctx, 200, 90, 1, '#3a4a5a');
  gull(ctx, 250, 70, 0.9, '#3a4a5a');
  gull(ctx, 350, 120, 1.1, '#3a4a5a');
  // Sea.
  seaGradient(ctx, '#2e7fa8', '#1d5f86');
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 3;
  for (const [x, y, w] of [[60, 340, 70], [300, 380, 90], [120, 450, 80], [420, 500, 90], [220, 510, 70]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - 8, x + w, y);
    ctx.stroke();
  }
  // Wooden pier, left.
  ctx.fillStyle = '#8a6d4b';
  rect(ctx, 40, 330, 220, 14);
  ctx.fillStyle = '#6e5638';
  for (const x of [52, 110, 168, 226]) rect(ctx, x, 344, 10, 34);
  ctx.fillStyle = '#a5855f';
  for (const x of [60, 120, 180, 240]) rect(ctx, x, 330, 4, 14);
  // Sailboat with a red sail, centre left.
  ctx.fillStyle = '#7a4a2b';
  poly(ctx, [[120, 400], [210, 400], [195, 424], [135, 424]]);
  ctx.fillStyle = '#e5534b';
  poly(ctx, [[165, 400], [165, 322], [205, 400]]);
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[160, 400], [160, 330], [128, 400]]);
  ctx.strokeStyle = '#5b3a22';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(165, 322);
  ctx.lineTo(165, 400);
  ctx.stroke();
  // Anchor hanging on the hull.
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(150, 414, 6, 0, Math.PI);
  ctx.moveTo(150, 408);
  ctx.lineTo(150, 420);
  ctx.moveTo(144, 414);
  ctx.lineTo(156, 414);
  ctx.stroke();
  // Rowboat, centre right.
  ctx.fillStyle = '#2f6fb2';
  poly(ctx, [[300, 430], [380, 430], [365, 452], [315, 452]]);
  ctx.fillStyle = '#7a4a2b';
  rect(ctx, 322, 418, 8, 14);
  rect(ctx, 352, 418, 8, 14);
  // Orange buoy.
  ctx.fillStyle = '#ff7f2a';
  disc(ctx, 420, 430, 12);
  ctx.fillStyle = '#ffffff';
  rect(ctx, 408, 426, 24, 5);
  // Lighthouse, right, red and white stripes.
  ctx.fillStyle = '#f2f2f2';
  poly(ctx, [[468, 300], [532, 300], [522, 130], [478, 130]]);
  ctx.fillStyle = '#e5534b';
  poly(ctx, [[472, 262], [528, 262], [525, 222], [475, 222]]);
  poly(ctx, [[477, 182], [523, 182], [520, 142], [480, 142]]);
  ctx.fillStyle = '#2b2b2b';
  rect(ctx, 470, 118, 60, 14);
  ctx.fillStyle = '#ffd166';
  disc(ctx, 500, 112, 10);
  ctx.fillStyle = '#ffd166';
  rect(ctx, 496, 96, 8, 8);
  // Lit window on the tower.
  ctx.fillStyle = '#ffd166';
  rect(ctx, 494, 200, 12, 16);
}

const harbourDiffs = [
  {
    id: 'sun-rays', label: 'Sun rays', x: 90, y: 80, r: 46,
    apply(ctx) {
      gradientPatch(ctx, 90, 80, 70, '#a8d8ee', '#eaf6fb');
      ctx.fillStyle = '#ffd166';
      disc(ctx, 90, 80, 34);
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (let i = 0; i < 5; i += 1) {
        const a = (i / 5) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(90 + Math.cos(a) * 44, 80 + Math.sin(a) * 44);
        ctx.lineTo(90 + Math.cos(a) * 58, 80 + Math.sin(a) * 58);
        ctx.stroke();
      }
    },
  },
  {
    id: 'gull-missing', label: 'A gull', x: 250, y: 70, r: 24,
    apply(ctx) {
      gradientPatch(ctx, 250, 70, 22, '#a8d8ee', '#eaf6fb');
    },
  },
  {
    id: 'sail-colour', label: 'Sail colour', x: 185, y: 360, r: 30,
    apply(ctx) {
      ctx.fillStyle = '#2a9d8f';
      poly(ctx, [[165, 400], [165, 322], [205, 400]]);
    },
  },
  {
    id: 'stripe-colour', label: 'Lighthouse stripe', x: 500, y: 242, r: 28,
    apply(ctx) {
      ctx.fillStyle = '#f2f2f2';
      poly(ctx, [[472, 262], [528, 262], [525, 222], [475, 222]]);
    },
  },
  {
    id: 'buoy-extra', label: 'Extra buoy', x: 500, y: 470, r: 24,
    apply(ctx) {
      ctx.fillStyle = '#ff7f2a';
      disc(ctx, 500, 470, 12);
      ctx.fillStyle = '#ffffff';
      rect(ctx, 488, 466, 24, 5);
    },
  },
  {
    id: 'cloud-missing', label: 'A cloud', x: 470, y: 110, r: 34,
    apply(ctx) {
      gradientPatch(ctx, 470, 110, 40, '#a8d8ee', '#eaf6fb');
    },
  },
  {
    id: 'fish-extra', label: 'Jumping fish', x: 280, y: 480, r: 26,
    apply(ctx) {
      ctx.fillStyle = '#7fb8d9';
      ellipse(ctx, 280, 478, 16, 7, -0.5);
      ctx.fillStyle = '#ffffff';
      disc(ctx, 268, 488, 4);
      disc(ctx, 292, 490, 4);
    },
  },
  {
    id: 'pier-post', label: 'Pier post', x: 231, y: 360, r: 22,
    apply(ctx) {
      seaPatch(ctx, 224, 344, 14, 34);
    },
  },
  {
    id: 'window-light', label: 'Tower window', x: 500, y: 208, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#2b2b2b';
      rect(ctx, 494, 200, 12, 16);
    },
  },
  {
    id: 'anchor-missing', label: 'Boat anchor', x: 150, y: 412, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#7a4a2b';
      rect(ctx, 142, 404, 16, 18);
    },
  },
];

// ----------------------------------------------------------------- garden ---
function paintGarden(ctx) {
  skyGradient(ctx, '#9fd8f0', '#e8f7e3');
  ctx.fillStyle = '#ffd166';
  disc(ctx, 500, 70, 30);
  cloud(ctx, 140, 70, 1, '#ffffff');
  cloud(ctx, 330, 50, 0.8, '#ffffff');
  // Grass.
  ctx.fillStyle = '#69b455';
  rect(ctx, 0, 330, 592, 210);
  ctx.fillStyle = '#57a047';
  for (let i = 0; i < 24; i += 1) {
    const x = 20 + i * 25;
    poly(ctx, [[x, 540], [x + 4, 512], [x + 8, 540]]);
  }
  // Big tree, left.
  ctx.fillStyle = '#6e4a2f';
  rect(ctx, 66, 200, 26, 140);
  ctx.fillStyle = '#3f9142';
  disc(ctx, 80, 170, 62);
  disc(ctx, 36, 205, 40);
  disc(ctx, 126, 205, 42);
  ctx.fillStyle = '#ff8fa3';
  for (const [x, y] of [[52, 150], [104, 138], [80, 185], [130, 175], [38, 190]]) disc(ctx, x, y, 7);
  // Flower bed, right.
  const tulips = [[420, 470, '#e5534b'], [455, 460, '#ffd166'], [490, 472, '#e5534b'], [525, 462, '#b388ff'], [555, 474, '#ffd166']];
  for (const [x, y, c] of tulips) {
    ctx.strokeStyle = '#2f7a33';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 34);
    ctx.stroke();
    ctx.fillStyle = c;
    ellipse(ctx, x, y, 9, 13);
  }
  // Picnic table with a white cloth, centre.
  ctx.fillStyle = '#8a6d4b';
  rect(ctx, 190, 380, 220, 12);
  rect(ctx, 200, 392, 10, 90);
  rect(ctx, 390, 392, 10, 90);
  ctx.fillStyle = '#fdf6ec';
  poly(ctx, [[180, 380], [420, 380], [410, 470], [190, 470]]);
  ctx.fillStyle = '#e5534b';
  rect(ctx, 180, 380, 240, 8);
  // Teapot, centre of the table.
  ctx.fillStyle = '#4a90d9';
  ellipse(ctx, 300, 360, 34, 24);
  ctx.fillStyle = '#e5534b';
  disc(ctx, 300, 332, 7);
  ctx.strokeStyle = '#4a90d9';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(268, 356, 14, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = '#4a90d9';
  poly(ctx, [[330, 350], [352, 344], [334, 366]]);
  // Three cups.
  for (const x of [230, 300, 368]) {
    ctx.fillStyle = '#ffffff';
    rect(ctx, x - 14, 360, 28, 20);
    ctx.fillStyle = '#ffd166';
    rect(ctx, x - 14, 360, 28, 5);
  }
  // Cake on a stand, right of the table.
  ctx.fillStyle = '#c9c9c9';
  rect(ctx, 428, 372, 54, 4);
  rect(ctx, 452, 376, 6, 12);
  ctx.fillStyle = '#f7d774';
  poly(ctx, [[432, 372], [478, 372], [470, 348], [440, 348]]);
  ctx.fillStyle = '#e5534b';
  disc(ctx, 455, 344, 5);
  // Cat sitting on the grass, right.
  ctx.fillStyle = '#f2a541';
  ellipse(ctx, 500, 500, 26, 30);
  disc(ctx, 500, 462, 18);
  poly(ctx, [[486, 450], [492, 432], [498, 448]]);
  poly(ctx, [[502, 448], [508, 432], [514, 450]]);
  ctx.fillStyle = '#2b2b2b';
  disc(ctx, 494, 460, 2.5);
  disc(ctx, 506, 460, 2.5);
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(524, 516);
  ctx.quadraticCurveTo(548, 500, 540, 472);
  ctx.stroke();
  // Butterfly, upper right.
  ctx.fillStyle = '#ff8c42';
  ellipse(ctx, 462, 150, 12, 16, -0.5);
  ellipse(ctx, 486, 150, 12, 16, 0.5);
  ctx.fillStyle = '#2b2b2b';
  ellipse(ctx, 474, 152, 4, 14);
  // Sun with a smile.
  ctx.fillStyle = '#ffd166';
  disc(ctx, 500, 70, 30);
  ctx.fillStyle = '#8a6d1f';
  disc(ctx, 492, 66, 3);
  disc(ctx, 508, 66, 3);
  ctx.strokeStyle = '#8a6d1f';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(500, 72, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

const gardenDiffs = [
  {
    id: 'teapot-knob', label: 'Teapot knob', x: 300, y: 332, r: 18,
    apply(ctx) {
      ctx.fillStyle = '#4a90d9';
      disc(ctx, 300, 332, 7);
    },
  },
  {
    id: 'cup-missing', label: 'A teacup', x: 368, y: 370, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#fdf6ec';
      rect(ctx, 352, 358, 34, 22);
    },
  },
  {
    id: 'butterfly-wing', label: 'Butterfly wing', x: 486, y: 150, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#b388ff';
      ellipse(ctx, 486, 150, 12, 16, 0.5);
    },
  },
  {
    id: 'flower-count', label: 'A tulip', x: 525, y: 470, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#69b455';
      ellipse(ctx, 525, 462, 12, 16);
      rect(ctx, 522, 462, 6, 34);
    },
  },
  {
    id: 'cat-tail', label: 'Cat tail', x: 540, y: 494, r: 24,
    apply(ctx) {
      ctx.fillStyle = '#69b455';
      ctx.strokeStyle = '#69b455';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(524, 516);
      ctx.quadraticCurveTo(548, 500, 540, 472);
      ctx.stroke();
      ctx.strokeStyle = '#f2a541';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(478, 516);
      ctx.quadraticCurveTo(458, 500, 466, 476);
      ctx.stroke();
    },
  },
  {
    id: 'spoon-extra', label: 'Extra spoon', x: 262, y: 372, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#c9c9c9';
      ellipse(ctx, 262, 366, 5, 8);
      rect(ctx, 260, 372, 4, 12);
    },
  },
  {
    id: 'cake-slice', label: 'Cake slice', x: 455, y: 358, r: 22,
    apply(ctx) {
      // The slice is gone: grass shows through where it stood, cherry and all.
      ctx.fillStyle = '#69b455';
      poly(ctx, [[452, 348], [470, 348], [478, 372], [452, 372]]);
      disc(ctx, 455, 344, 6);
    },
  },
  {
    id: 'bee-extra', label: 'A bee', x: 440, y: 430, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#ffd166';
      ellipse(ctx, 440, 430, 9, 7);
      ctx.fillStyle = '#2b2b2b';
      rect(ctx, 436, 424, 3, 12);
      rect(ctx, 442, 424, 3, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ellipse(ctx, 438, 420, 6, 4, -0.4);
    },
  },
  {
    id: 'sun-smile', label: 'Sun smile', x: 500, y: 74, r: 24,
    apply(ctx) {
      ctx.fillStyle = '#ffd166';
      disc(ctx, 500, 74, 12);
    },
  },
  {
    id: 'cup-stripe', label: 'Cup stripe', x: 230, y: 362, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#4a90d9';
      rect(ctx, 216, 360, 28, 5);
    },
  },
];

// ------------------------------------------------------------------ cabin ---
function paintCabin(ctx) {
  skyGradient(ctx, '#2b2a55', '#7a5a8a');
  // Moon and stars.
  ctx.fillStyle = '#f4ead8';
  disc(ctx, 500, 80, 30);
  ctx.fillStyle = '#ffffff';
  for (const [x, y, r] of [[80, 60, 3], [150, 110, 2.5], [240, 50, 3], [330, 90, 2.5], [420, 45, 3], [560, 150, 2.5], [60, 160, 2.5], [280, 130, 2]]) star(ctx, x, y, r + 2, r);
  // Snowy mountains.
  ctx.fillStyle = '#5a5470';
  poly(ctx, [[0, 300], [140, 180], [280, 300]]);
  ctx.fillStyle = '#4a4460';
  poly(ctx, [[200, 300], [380, 160], [592, 300]]);
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[140, 180], [112, 214], [168, 214]]);
  poly(ctx, [[380, 160], [348, 200], [412, 200]]);
  // Snow ground.
  ctx.fillStyle = '#eef2f7';
  rect(ctx, 0, 300, 592, 240);
  ctx.fillStyle = '#dde6ef';
  ellipse(ctx, 120, 480, 90, 16);
  ellipse(ctx, 460, 500, 110, 18);
  // Pine trees.
  pine(ctx, 60, 330, 90, '#6e4a2f', '#2f6b3a');
  pine(ctx, 540, 340, 110, '#6e4a2f', '#2f6b3a');
  pine(ctx, 480, 330, 70, '#6e4a2f', '#2f6b3a');
  // Cabin, centre.
  ctx.fillStyle = '#7a4a2b';
  rect(ctx, 200, 340, 190, 130);
  ctx.fillStyle = '#5b3a22';
  poly(ctx, [[185, 344], [405, 344], [295, 268]]);
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[185, 344], [405, 344], [295, 268]]);
  ctx.fillStyle = '#e8eef5';
  poly(ctx, [[200, 336], [390, 336], [295, 276]]);
  // Chimney with smoke curling right.
  ctx.fillStyle = '#8a8a8a';
  rect(ctx, 340, 276, 26, 60);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  disc(ctx, 366, 262, 10);
  disc(ctx, 382, 246, 13);
  disc(ctx, 400, 228, 16);
  // Door with a wreath, windows lit.
  ctx.fillStyle = '#4a2f1d';
  rect(ctx, 278, 400, 34, 70);
  ctx.fillStyle = '#2f7a33';
  ring(ctx, 295, 420, 12, 6);
  ctx.fillStyle = '#e5534b';
  disc(ctx, 295, 432, 3);
  ctx.fillStyle = '#ffd166';
  rect(ctx, 222, 372, 28, 28);
  rect(ctx, 340, 372, 28, 28);
  ctx.fillStyle = '#5b3a22';
  rect(ctx, 234, 372, 4, 28);
  rect(ctx, 352, 372, 4, 28);
  // Fence, left foreground.
  ctx.fillStyle = '#8a6d4b';
  for (const x of [30, 70, 110, 150]) rect(ctx, x, 430, 8, 44);
  rect(ctx, 20, 440, 150, 6);
  rect(ctx, 20, 460, 150, 6);
  // Deer, right.
  ctx.fillStyle = '#a9805a';
  ellipse(ctx, 470, 450, 30, 18);
  disc(ctx, 496, 428, 12);
  poly(ctx, [[490, 418], [494, 406], [498, 418]]);
  poly(ctx, [[500, 418], [504, 406], [506, 418]]);
  ctx.strokeStyle = '#8a6d4b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(492, 420);
  ctx.quadraticCurveTo(486, 404, 478, 402);
  ctx.moveTo(500, 420);
  ctx.quadraticCurveTo(506, 404, 514, 402);
  ctx.stroke();
  ctx.strokeStyle = '#a9805a';
  ctx.lineWidth = 4;
  for (const x of [452, 466, 478, 490]) {
    ctx.beginPath();
    ctx.moveTo(x, 464);
    ctx.lineTo(x, 486);
    ctx.stroke();
  }
  // Snowman, left.
  ctx.fillStyle = '#ffffff';
  disc(ctx, 130, 500, 26);
  disc(ctx, 130, 462, 19);
  disc(ctx, 130, 432, 14);
  ctx.fillStyle = '#2b2b2b';
  disc(ctx, 130, 452, 3);
  disc(ctx, 130, 466, 3);
  disc(ctx, 130, 482, 3);
  ctx.fillStyle = '#e5534b';
  poly(ctx, [[130, 428], [156, 432], [130, 436]]);
  ctx.fillStyle = '#2b2b2b';
  rect(ctx, 116, 414, 28, 6);
  rect(ctx, 122, 402, 16, 12);
}

const cabinDiffs = [
  {
    id: 'smoke-direction', label: 'Chimney smoke', x: 390, y: 240, r: 30,
    apply(ctx) {
      gradientPatch(ctx, 390, 240, 34, '#2b2a55', '#7a5a8a');
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      disc(ctx, 352, 260, 10);
      disc(ctx, 338, 244, 13);
      disc(ctx, 322, 226, 15);
    },
  },
  {
    id: 'window-dark', label: 'Cabin window', x: 354, y: 386, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#3a2a1a';
      rect(ctx, 340, 372, 28, 28);
    },
  },
  {
    id: 'antler-missing', label: 'Deer antler', x: 508, y: 410, r: 20,
    apply(ctx) {
      // The antler stands against snow, not sky: patch with snow.
      ctx.fillStyle = '#eef2f7';
      ctx.strokeStyle = '#eef2f7';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(500, 420);
      ctx.quadraticCurveTo(506, 404, 514, 402);
      ctx.stroke();
    },
  },
  {
    id: 'pine-missing', label: 'A pine tree', x: 480, y: 300, r: 30,
    apply(ctx) {
      // Mountain above the snow line, snow below it (tight around the tree).
      ctx.fillStyle = '#4a4460';
      rect(ctx, 456, 258, 48, 42);
      ctx.fillStyle = '#eef2f7';
      rect(ctx, 456, 300, 48, 30);
    },
  },
  {
    id: 'snowman-button', label: 'Snowman button', x: 130, y: 466, r: 16,
    apply(ctx) {
      ctx.fillStyle = '#ffffff';
      disc(ctx, 130, 466, 5);
    },
  },
  {
    id: 'moon-phase', label: 'The moon', x: 500, y: 80, r: 30,
    apply(ctx) {
      // Dusk sky swallows the moon's right side: a crescent is left.
      gradientPatch(ctx, 514, 74, 26, '#2b2a55', '#7a5a8a');
    },
  },
  {
    id: 'fence-plank', label: 'Fence plank', x: 110, y: 452, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#eef2f7';
      rect(ctx, 108, 430, 12, 44);
    },
  },
  {
    id: 'star-missing', label: 'A star', x: 330, y: 90, r: 16,
    apply(ctx) {
      gradientPatch(ctx, 330, 90, 10, '#2b2a55', '#7a5a8a');
    },
  },
  {
    id: 'wreath-missing', label: 'Door wreath', x: 295, y: 420, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#4a2f1d';
      disc(ctx, 295, 420, 14);
    },
  },
  {
    id: 'bird-extra', label: 'Bird on chimney', x: 353, y: 270, r: 18,
    apply(ctx) {
      ctx.fillStyle = '#2b2b2b';
      ellipse(ctx, 353, 270, 9, 6);
      disc(ctx, 360, 265, 4);
      poly(ctx, [[346, 268], [338, 264], [346, 272]]);
    },
  },
];

export const SCENES_PART_ONE = [
  { id: 'harbour', name: 'Harbour Dawn', sub: 'Boats, gulls and a lighthouse', difficulty: 1, paint: paintHarbour, differences: harbourDiffs },
  { id: 'garden', name: 'Garden Tea Party', sub: 'A picnic under the old tree', difficulty: 2, paint: paintGarden, differences: gardenDiffs },
  { id: 'cabin', name: 'Mountain Cabin', sub: 'Snow, smoke and a shy deer', difficulty: 3, paint: paintCabin, differences: cabinDiffs },
];

// ----------------------------------------------------------------- market ---
function paintMarket(ctx) {
  skyGradient(ctx, '#141a33', '#2c3560');
  ctx.fillStyle = '#ffffff';
  for (const [x, y, r] of [[70, 60, 2.5], [180, 40, 2], [300, 70, 2.5], [430, 50, 2], [540, 90, 2.5], [120, 120, 2], [250, 110, 2]]) star(ctx, x, y, r + 2, r);
  // String lights across the top, each bulb on a short drop from the wire.
  ctx.strokeStyle = '#0c0f1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.quadraticCurveTo(296, 110, 592, 60);
  ctx.stroke();
  const bulbs = [[60, 76], [130, 88], [200, 95], [270, 98], [340, 96], [410, 90], [480, 80], [545, 68]];
  for (const [x, y] of bulbs) {
    const t = x / 592;
    const wireY = 60 + 100 * t * (1 - t);
    ctx.beginPath();
    ctx.moveTo(x, wireY);
    ctx.lineTo(x, y + 2);
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    disc(ctx, x, y + 8, 6);
    ctx.fillStyle = 'rgba(255,209,102,0.25)';
    disc(ctx, x, y + 8, 12);
  }
  // Cobblestones.
  ctx.fillStyle = '#3a3f58';
  rect(ctx, 0, 400, 592, 140);
  ctx.fillStyle = '#454a68';
  for (let row = 0; row < 4; row += 1) {
    for (let i = 0; i < 8; i += 1) {
      const x = 10 + i * 74 + (row % 2) * 30;
      ellipse(ctx, x, 420 + row * 32, 30, 12);
    }
  }
  // Left stall: fruit, striped awning.
  ctx.fillStyle = '#e5534b';
  poly(ctx, [[30, 200], [210, 200], [196, 240], [44, 240]]);
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[30, 200], [75, 200], [66, 240], [44, 240]]);
  poly(ctx, [[120, 200], [165, 200], [156, 240], [132, 240]]);
  ctx.fillStyle = '#7a4a2b';
  rect(ctx, 40, 240, 8, 160);
  rect(ctx, 192, 240, 8, 160);
  ctx.fillStyle = '#a5855f';
  rect(ctx, 36, 330, 168, 14);
  // Fruit piles: oranges, apples, lemons.
  for (let i = 0; i < 5; i += 1) {
    ctx.fillStyle = '#ff7f2a';
    disc(ctx, 62 + i * 16, 322 - (i % 2) * 10, 10);
  }
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = '#e5534b';
    disc(ctx, 150 + i * 15, 322 - (i % 2) * 10, 10);
  }
  ctx.fillStyle = '#f2f2f2';
  rect(ctx, 56, 296, 44, 20);
  label(ctx, 'TEH', 78, 306, 13, '#2b2b2b', 800);
  // Vendor behind the stall.
  ctx.fillStyle = '#f2c9a0';
  disc(ctx, 120, 268, 16);
  ctx.fillStyle = '#2f6fb2';
  ellipse(ctx, 120, 306, 26, 22);
  ctx.fillStyle = '#ffd166';
  ellipse(ctx, 120, 252, 18, 8);
  ctx.fillStyle = '#e8a93d';
  rect(ctx, 102, 250, 36, 6);
  ctx.fillStyle = '#2b2b2b';
  disc(ctx, 114, 266, 2.5);
  disc(ctx, 126, 266, 2.5);
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(120, 272, 6, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // Right stall: steaming pot, umbrella.
  ctx.fillStyle = '#2a9d8f';
  poly(ctx, [[380, 200], [560, 200], [546, 240], [394, 240]]);
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[425, 200], [470, 200], [461, 240], [437, 240]]);
  ctx.fillStyle = '#7a4a2b';
  rect(ctx, 390, 240, 8, 160);
  rect(ctx, 542, 240, 8, 160);
  ctx.fillStyle = '#a5855f';
  rect(ctx, 386, 330, 168, 14);
  // Steaming pot.
  ctx.fillStyle = '#5b5b6b';
  ellipse(ctx, 470, 318, 34, 16);
  rect(ctx, 436, 300, 68, 18);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  disc(ctx, 460, 286, 8);
  disc(ctx, 474, 270, 11);
  disc(ctx, 488, 252, 13);
  // Umbrella over the right stall.
  ctx.fillStyle = '#b388ff';
  poly(ctx, [[420, 190], [530, 190], [475, 140]]);
  ctx.fillStyle = '#ffd166';
  poly(ctx, [[452, 190], [498, 190], [475, 140]]);
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(475, 140);
  ctx.lineTo(475, 120);
  ctx.stroke();
  // Price tag on the fruit stall.
  ctx.fillStyle = '#ffffff';
  rect(ctx, 160, 344, 34, 18);
  label(ctx, '5', 177, 353, 14, '#2b2b2b', 800);
  // Banner strung between the stalls.
  ctx.fillStyle = '#ffd166';
  rect(ctx, 210, 210, 170, 26);
  label(ctx, 'PASAR MALAM', 295, 223, 15, '#2b2b2b', 800);
  // Cat asleep on the left stall's edge.
  ctx.fillStyle = '#3a3a3a';
  ellipse(ctx, 190, 326, 16, 8);
  disc(ctx, 178, 320, 7);
}

const marketDiffs = [
  {
    id: 'lantern-colour', label: 'Lantern colour', x: 200, y: 103, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#58d68d';
      disc(ctx, 200, 103, 6);
      ctx.fillStyle = 'rgba(88,214,141,0.25)';
      disc(ctx, 200, 103, 12);
    },
  },
  {
    id: 'sign-text', label: 'Stall sign', x: 78, y: 306, r: 24,
    apply(ctx) {
      ctx.fillStyle = '#f2f2f2';
      rect(ctx, 56, 296, 44, 20);
      label(ctx, 'KOPI', 78, 306, 13, '#2b2b2b', 800);
    },
  },
  {
    id: 'fruit-count', label: 'An orange', x: 126, y: 322, r: 20,
    apply(ctx) {
      gradientPatch(ctx, 126, 322, 10, '#141a33', '#2c3560');
    },
  },
  {
    id: 'vendor-hat', label: 'Vendor hat', x: 120, y: 254, r: 22,
    apply(ctx) {
      // Night sky shows through where the hat was; hair is left instead.
      ctx.fillStyle = '#20264a';
      ellipse(ctx, 120, 252, 18, 8);
      rect(ctx, 102, 250, 36, 6);
      ctx.fillStyle = '#3a2a1a';
      disc(ctx, 120, 250, 16);
    },
  },
  {
    id: 'bulb-out', label: 'A string bulb', x: 340, y: 104, r: 18,
    apply(ctx) {
      gradientPatch(ctx, 340, 104, 13, '#141a33', '#2c3560');
      // The drop line stays: only the bulb itself is dark.
      ctx.strokeStyle = '#0c0f1e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(340, 84.5);
      ctx.lineTo(340, 98);
      ctx.stroke();
    },
  },
  {
    id: 'cat-extra', label: 'Market cat', x: 520, y: 326, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#3a3a3a';
      ellipse(ctx, 520, 326, 16, 8);
      disc(ctx, 508, 320, 7);
    },
  },
  {
    id: 'price-tag', label: 'Price tag', x: 177, y: 353, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#ffffff';
      rect(ctx, 160, 344, 34, 18);
      label(ctx, '8', 177, 353, 14, '#2b2b2b', 800);
    },
  },
  {
    id: 'umbrella-stripe', label: 'Umbrella stripe', x: 475, y: 165, r: 24,
    apply(ctx) {
      ctx.fillStyle = '#b388ff';
      poly(ctx, [[452, 190], [498, 190], [475, 140]]);
    },
  },
  {
    id: 'steam-missing', label: 'Pot steam', x: 474, y: 268, r: 26,
    apply(ctx) {
      gradientPatch(ctx, 460, 286, 10, '#141a33', '#2c3560');
      gradientPatch(ctx, 474, 270, 13, '#141a33', '#2c3560');
      gradientPatch(ctx, 488, 252, 15, '#141a33', '#2c3560');
    },
  },
  {
    id: 'banner-missing', label: 'Night banner', x: 295, y: 223, r: 30,
    apply(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 540);
      g.addColorStop(0, '#141a33');
      g.addColorStop(1, '#2c3560');
      ctx.fillStyle = g;
      ctx.fillRect(210, 210, 170, 26);
    },
  },
];

// ---------------------------------------------------------------- station ---
function paintStation(ctx) {
  skyGradient(ctx, '#05060f', '#101736');
  ctx.fillStyle = '#ffffff';
  const stars = [[40, 50, 2.5], [110, 90, 2], [190, 40, 3], [260, 80, 2], [330, 45, 2.5], [410, 70, 2], [480, 40, 3], [550, 100, 2], [90, 160, 2], [230, 150, 2.5], [360, 140, 2], [520, 170, 2.5], [150, 210, 2], [300, 200, 2], [440, 210, 2]];
  for (const [x, y, r] of stars) star(ctx, x, y, r + 2, r);
  // Comet.
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(520, 60);
  ctx.lineTo(470, 100);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  disc(ctx, 522, 58, 5);
  // Ringed planet, left.
  ctx.fillStyle = '#c96f4a';
  disc(ctx, 150, 330, 78);
  ctx.fillStyle = '#e08a63';
  disc(ctx, 126, 306, 18);
  disc(ctx, 172, 352, 12);
  disc(ctx, 150, 372, 8);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.ellipse(150, 330, 108, 26, -0.35, 0, Math.PI * 2);
  ctx.stroke();
  // Small moon.
  ctx.fillStyle = '#c9ced6';
  disc(ctx, 300, 250, 16);
  // Astronaut, centre right.
  ctx.fillStyle = '#f2f2f2';
  ellipse(ctx, 420, 300, 34, 42);
  disc(ctx, 420, 238, 24);
  ctx.fillStyle = '#7cc7ff';
  disc(ctx, 420, 238, 17);
  ctx.fillStyle = '#ffffff';
  disc(ctx, 414, 232, 5);
  // Backpack, tanks, tether.
  ctx.fillStyle = '#d8d8d8';
  rect(ctx, 448, 272, 16, 52);
  ctx.fillStyle = '#ffffff';
  rect(ctx, 452, 276, 8, 20);
  ctx.fillStyle = '#ff7f2a';
  rect(ctx, 452, 300, 8, 20);
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(440, 340);
  ctx.quadraticCurveTo(480, 380, 520, 360);
  ctx.stroke();
  // Arms and legs.
  ctx.strokeStyle = '#f2f2f2';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(392, 290);
  ctx.lineTo(360, 310);
  ctx.moveTo(448, 290);
  ctx.lineTo(478, 268);
  ctx.moveTo(402, 338);
  ctx.lineTo(384, 372);
  ctx.moveTo(438, 338);
  ctx.lineTo(456, 372);
  ctx.stroke();
  // Mission patch on the chest.
  ctx.fillStyle = '#e5534b';
  disc(ctx, 412, 300, 8);
  ctx.fillStyle = '#ffffff';
  star(ctx, 412, 300, 5, 2);
  // Satellite, top right.
  ctx.fillStyle = '#9aa3bd';
  rect(ctx, 500, 130, 56, 30);
  ctx.fillStyle = '#2f6fb2';
  rect(ctx, 478, 138, 20, 14);
  rect(ctx, 558, 138, 20, 14);
  ctx.strokeStyle = '#c9ced6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(528, 130);
  ctx.lineTo(540, 108);
  ctx.stroke();
  ctx.fillStyle = '#c9ced6';
  disc(ctx, 542, 106, 6);
  // Rocket, bottom left, flame on.
  ctx.fillStyle = '#e8e8e8';
  poly(ctx, [[80, 470], [110, 470], [104, 400], [86, 400]]);
  ctx.fillStyle = '#e5534b';
  poly(ctx, [[86, 400], [104, 400], [95, 372]]);
  ctx.fillStyle = '#7cc7ff';
  disc(ctx, 95, 432, 9);
  ctx.fillStyle = '#ff9f2e';
  poly(ctx, [[84, 470], [106, 470], [95, 500]]);
  ctx.fillStyle = '#ffd166';
  poly(ctx, [[89, 470], [101, 470], [95, 490]]);
  // Control panel strip, bottom.
  ctx.fillStyle = '#1c2340';
  rect(ctx, 0, 500, 592, 40);
  ctx.fillStyle = '#58d68d';
  disc(ctx, 40, 520, 6);
  disc(ctx, 70, 520, 6);
  ctx.fillStyle = '#ffd166';
  disc(ctx, 100, 520, 6);
  ctx.fillStyle = '#2b3560';
  rect(ctx, 140, 512, 120, 16);
  ctx.fillStyle = '#58d68d';
  rect(ctx, 148, 516, 40, 8);
}

const stationDiffs = [
  {
    id: 'moon-extra', label: 'Second moon', x: 360, y: 220, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#c9ced6';
      disc(ctx, 360, 220, 12);
    },
  },
  {
    id: 'star-missing', label: 'A star', x: 330, y: 45, r: 16,
    apply(ctx) {
      gradientPatch(ctx, 330, 45, 8, '#05060f', '#101736');
    },
  },
  {
    id: 'patch-colour', label: 'Mission patch', x: 412, y: 300, r: 18,
    apply(ctx) {
      ctx.fillStyle = '#2f6fb2';
      disc(ctx, 412, 300, 8);
      ctx.fillStyle = '#ffffff';
      star(ctx, 412, 300, 5, 2);
    },
  },
  {
    id: 'dish-angle', label: 'Satellite dish', x: 540, y: 108, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#101736';
      ctx.strokeStyle = '#101736';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(528, 130);
      ctx.lineTo(540, 108);
      ctx.stroke();
      disc(ctx, 542, 106, 8);
      ctx.strokeStyle = '#c9ced6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(528, 130);
      ctx.lineTo(514, 110);
      ctx.stroke();
      ctx.fillStyle = '#c9ced6';
      disc(ctx, 512, 108, 6);
    },
  },
  {
    id: 'rocket-flame', label: 'Rocket flame', x: 95, y: 482, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#101736';
      poly(ctx, [[84, 470], [106, 470], [95, 500]]);
    },
  },
  {
    id: 'panel-light', label: 'Panel light', x: 100, y: 520, r: 16,
    apply(ctx) {
      ctx.fillStyle = '#1c2340';
      disc(ctx, 100, 520, 6);
    },
  },
  {
    id: 'flag-missing', label: 'Backpack flag', x: 456, y: 282, r: 16,
    apply(ctx) {
      ctx.fillStyle = '#d8d8d8';
      rect(ctx, 452, 276, 8, 20);
    },
  },
  {
    id: 'crater-extra', label: 'Planet crater', x: 190, y: 320, r: 18,
    apply(ctx) {
      ctx.fillStyle = '#e08a63';
      disc(ctx, 190, 320, 10);
    },
  },
  {
    id: 'tether-missing', label: 'Tether cable', x: 482, y: 366, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#101736';
      ctx.strokeStyle = '#101736';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(440, 340);
      ctx.quadraticCurveTo(480, 380, 520, 360);
      ctx.stroke();
    },
  },
  {
    id: 'tank-colour', label: 'Oxygen tank', x: 456, y: 310, r: 16,
    apply(ctx) {
      ctx.fillStyle = '#ffffff';
      rect(ctx, 452, 300, 8, 20);
    },
  },
];

// ---------------------------------------------------------------- library ---
function paintLibrary(ctx) {
  skyGradient(ctx, '#3a2a1a', '#5b4128');
  // Window with the moon, centre top.
  ctx.fillStyle = '#1c2340';
  rect(ctx, 236, 40, 120, 130);
  ctx.fillStyle = '#f4ead8';
  disc(ctx, 296, 90, 24);
  ctx.fillStyle = '#7a5a3a';
  rect(ctx, 292, 40, 8, 130);
  rect(ctx, 236, 100, 120, 8);
  ctx.fillStyle = '#5b4128';
  rect(ctx, 226, 30, 140, 10);
  // Bookshelves, left and right.
  for (const shelfX of [20, 420]) {
    ctx.fillStyle = '#6e4a2f';
    rect(ctx, shelfX, 60, 150, 400);
    ctx.fillStyle = '#8a6d4b';
    for (const y of [140, 220, 300, 380]) rect(ctx, shelfX, y, 150, 8);
    const colours = ['#e5534b', '#2f6fb2', '#2a9d8f', '#ffd166', '#b388ff', '#e5534b', '#2f6fb2'];
    for (let row = 0; row < 4; row += 1) {
      let x = shelfX + 8;
      for (let i = 0; i < 7; i += 1) {
        const w = 16 + ((i * 3 + row) % 3) * 3;
        const h = 62 + ((i + row) % 2) * 10;
        book(ctx, x, 140 + row * 80 - h + 8, w, h - 8, colours[(i + row) % colours.length]);
        x += w + 2;
      }
    }
  }
  // Ladder leaning on the right shelf: rails first, then rungs that meet them.
  ctx.strokeStyle = '#a5855f';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(400, 460);
  ctx.lineTo(430, 150);
  ctx.moveTo(420, 460);
  ctx.lineTo(450, 150);
  ctx.stroke();
  ctx.lineWidth = 4;
  for (let i = 0; i < 6; i += 1) {
    const y = 420 - i * 48;
    const t = (460 - y) / 310;
    ctx.beginPath();
    ctx.moveTo(402 + 30 * t, y);
    ctx.lineTo(418 + 30 * t, y);
    ctx.stroke();
  }
  // Globe on a stand, left foreground.
  ctx.fillStyle = '#7a4a2b';
  rect(ctx, 96, 470, 8, 30);
  ellipse(ctx, 100, 502, 22, 6);
  ctx.fillStyle = '#4a90d9';
  disc(ctx, 100, 440, 30);
  ctx.fillStyle = '#69b455';
  ellipse(ctx, 92, 432, 12, 8, -0.4);
  ellipse(ctx, 110, 450, 10, 7, 0.5);
  ctx.fillStyle = '#ffd166';
  star(ctx, 100, 440, 6, 2.5);
  // Reading lamp, right foreground, lit.
  ctx.fillStyle = '#2b2b2b';
  rect(ctx, 520, 420, 6, 60);
  ellipse(ctx, 523, 484, 20, 6);
  ctx.fillStyle = '#2a9d8f';
  poly(ctx, [[500, 420], [546, 420], [538, 392], [508, 392]]);
  ctx.fillStyle = 'rgba(255,209,102,0.3)';
  disc(ctx, 523, 428, 26);
  ctx.fillStyle = '#ffd166';
  disc(ctx, 523, 428, 10);
  // Owl perched on the left shelf top.
  ctx.fillStyle = '#8a6d4b';
  ellipse(ctx, 100, 52, 20, 16);
  disc(ctx, 100, 34, 14);
  poly(ctx, [[88, 26], [92, 14], [96, 24]]);
  poly(ctx, [[104, 24], [108, 14], [112, 26]]);
  ctx.fillStyle = '#ffffff';
  disc(ctx, 94, 32, 5);
  disc(ctx, 106, 32, 5);
  ctx.fillStyle = '#2b2b2b';
  disc(ctx, 94, 32, 2.5);
  disc(ctx, 106, 32, 2.5);
  ctx.fillStyle = '#e8a93d';
  poly(ctx, [[97, 38], [103, 38], [100, 43]]);
  // Rug, centre bottom.
  ctx.fillStyle = '#8a2f3d';
  rect(ctx, 200, 470, 200, 56);
  ctx.fillStyle = '#ffd166';
  rect(ctx, 210, 480, 180, 6);
  rect(ctx, 210, 510, 180, 6);
  ctx.fillStyle = '#f2f2f2';
  disc(ctx, 300, 498, 10);
  // Stack of books on the rug.
  book(ctx, 250, 448, 34, 10, '#2f6fb2');
  book(ctx, 254, 438, 30, 10, '#e5534b');
  book(ctx, 258, 428, 26, 10, '#2a9d8f');
  // Candle on the floor, right.
  ctx.fillStyle = '#f2f2f2';
  rect(ctx, 340, 470, 10, 30);
  ctx.fillStyle = '#ff9f2e';
  ellipse(ctx, 345, 462, 5, 9);
  ctx.fillStyle = '#ffd166';
  ellipse(ctx, 345, 464, 3, 6);
  // Portrait on the wall, above the rug.
  ctx.fillStyle = '#c9a227';
  rect(ctx, 276, 190, 44, 54);
  ctx.fillStyle = '#2f6fb2';
  rect(ctx, 282, 196, 32, 42);
  ctx.fillStyle = '#f2c9a0';
  disc(ctx, 298, 214, 8);
  ctx.fillStyle = '#3a3a3a';
  disc(ctx, 298, 204, 9);
}

const libraryDiffs = [
  {
    id: 'book-spine', label: 'Book spine', x: 54, y: 108, r: 20,
    apply(ctx) {
      // The second book of the top-left row, recoloured in place.
      ctx.fillStyle = '#e5534b';
      rect(ctx, 46, 76, 16, 64);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      rect(ctx, 49, 84, 10, 2);
      rect(ctx, 49, 90, 10, 2);
    },
  },
  {
    id: 'owl-eyes', label: 'Owl eyes', x: 100, y: 32, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#8a6d4b';
      disc(ctx, 94, 32, 5);
      disc(ctx, 106, 32, 5);
    },
  },
  {
    id: 'globe-star', label: 'Globe star', x: 100, y: 440, r: 18,
    apply(ctx) {
      ctx.fillStyle = '#4a90d9';
      disc(ctx, 100, 440, 7);
    },
  },
  {
    id: 'lamp-light', label: 'Lamp light', x: 523, y: 428, r: 24,
    apply(ctx) {
      ctx.fillStyle = '#3a2a1a';
      disc(ctx, 523, 428, 26);
      ctx.fillStyle = '#2b2b2b';
      rect(ctx, 520, 420, 6, 34);
      ctx.fillStyle = '#2a9d8f';
      poly(ctx, [[500, 420], [546, 420], [538, 392], [508, 392]]);
    },
  },
  {
    id: 'ladder-rung', label: 'Ladder rung', x: 423, y: 324, r: 18,
    apply(ctx) {
      // The third rung from the bottom, between the rails only.
      ctx.fillStyle = '#4e3822';
      rect(ctx, 415, 321, 18, 6);
    },
  },
  {
    id: 'rug-stripe', label: 'Rug stripe', x: 300, y: 483, r: 22,
    apply(ctx) {
      ctx.fillStyle = '#2f6fb2';
      rect(ctx, 210, 480, 180, 6);
    },
  },
  {
    id: 'book-stack', label: 'Book stack', x: 271, y: 433, r: 20,
    apply(ctx) {
      // The top book of the stack is gone: wall shows through.
      const g = ctx.createLinearGradient(0, 0, 0, 540);
      g.addColorStop(0, '#3a2a1a');
      g.addColorStop(1, '#5b4128');
      ctx.fillStyle = g;
      ctx.fillRect(258, 428, 26, 10);
    },
  },
  {
    id: 'candle-flame', label: 'Candle flame', x: 345, y: 462, r: 18,
    apply(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(345, 462, 6, 10, 0, 0, Math.PI * 2);
      ctx.clip();
      const g = ctx.createLinearGradient(0, 0, 0, 540);
      g.addColorStop(0, '#3a2a1a');
      g.addColorStop(1, '#5b4128');
      ctx.fillStyle = g;
      ctx.fillRect(339, 452, 12, 20);
      ctx.restore();
    },
  },
  {
    id: 'portrait-missing', label: 'Wall portrait', x: 298, y: 217, r: 26,
    apply(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 540);
      g.addColorStop(0, '#3a2a1a');
      g.addColorStop(1, '#5b4128');
      ctx.fillStyle = g;
      ctx.fillRect(276, 190, 44, 54);
    },
  },
  {
    id: 'mouse-extra', label: 'Little mouse', x: 380, y: 512, r: 20,
    apply(ctx) {
      ctx.fillStyle = '#9a9a9a';
      ellipse(ctx, 380, 512, 12, 7);
      disc(ctx, 391, 508, 5);
      ctx.fillStyle = '#e8a0a0';
      disc(ctx, 389, 503, 3);
      ctx.strokeStyle = '#9a9a9a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(368, 512);
      ctx.quadraticCurveTo(356, 514, 352, 506);
      ctx.stroke();
    },
  },
];

export const SCENES_PART_TWO = [
  { id: 'market', name: 'Night Market', sub: 'Lanterns, fruit and a sleepy cat', difficulty: 4, paint: paintMarket, differences: marketDiffs },
  { id: 'station', name: 'Space Station', sub: 'One astronaut, one loose tether', difficulty: 5, paint: paintStation, differences: stationDiffs },
  { id: 'library', name: 'Library of Whispers', sub: 'Books, an owl and a quiet rug', difficulty: 5, paint: paintLibrary, differences: libraryDiffs },
];

/** All six scenes, in campaign order. */
export const SCENES = [...SCENES_PART_ONE, ...SCENES_PART_TWO];

/** Look a scene up by id. */
export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
