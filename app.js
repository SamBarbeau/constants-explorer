"use strict";
const $ = (id) => document.getElementById(id);
const PHI = (1 + Math.sqrt(5)) / 2,
  TAU = 2 * Math.PI;
const INK = "#082f49",
  BLUE = "#0369a1",
  RUST = "#b56342",
  GREEN = "#397c72",
  LINE = "#d6d3d1",
  MUTED = "#57534e";
const canvas = $("canvas"),
  ctx = canvas.getContext("2d");
const range = (
  key,
  label,
  min,
  max,
  step,
  value,
  presets,
  format = (v) => String(v),
) => ({ key, label, min, max, step, value, presets, format });
const label = (text, x, y, color = MUTED, align = "left") => {
  ctx.fillStyle = color;
  ctx.font = "12px ui-monospace, monospace";
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};
function line(x1, y1, x2, y2, color = LINE, width = 1, dash = []) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}
function circle(x, y, r, color, fill = false) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  fill ? ctx.fill() : ctx.stroke();
}
function path(points, color, fill) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  if (fill) {
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}
const experiments = [
  {
    key: "phi",
    glyph: "φ",
    short: "golden ratio",
    name: "The golden ratio",
    value: "1.6180339887…",
    title: "Can a rectangle leave a smaller copy of itself?",
    blurb:
      "Cut a square off a rectangle. Usually, the leftover piece is a different shape. But at one particular proportion, you can turn that leftover piece and get a smaller copy of the rectangle you started with.\n\nThat proportion is the golden ratio. It is about 1.618 times as wide as it is tall. The same cut can happen again, and again.",
    formula:
      "original: r · leftover, turned: 1/(r − 1) · match them: r = 1/(r − 1)",
    challenge:
      "Try a wide rectangle, then a narrow one. Can you make the two outlines below line up? Use “golden ratio” to see the exact match.",
    caption:
      "The square comes off the left. Below, the original (blue) and the turned leftover (rust) are resized to the same height.",
    controls: [
      range(
        "ratio",
        "Width / height",
        1.2,
        2.2,
        0.001,
        1.8,
        [
          ["narrow", 1.3],
          ["wide", 2],
          ["golden ratio", PHI],
        ],
        (v) => v.toFixed(3),
      ),
    ],
    readings: (s) => [
      ["original shape", s.ratio.toFixed(4) + " : 1"],
      ["leftover shape", (1 / (s.ratio - 1)).toFixed(4) + " : 1"],
    ],
    feedback: (s) =>
      Math.abs(s.ratio - PHI) < 1e-9
        ? "They match. Cut off another square and the same thing happens."
        : Math.abs(s.ratio - PHI) < 0.003
          ? "Almost a match. Choose “golden ratio” to land on it exactly."
          : s.ratio < PHI
            ? "The turned leftover is wider than the original. Make the original a little wider."
            : "The turned leftover is narrower than the original. Make the original a little narrower.",
    playLabel: "Find the match",
    tour: { key: "ratio", values: [2, 1.3, 1.8, PHI] },
    draw(w, h, s) {
      const unit = Math.min((w - 55) / 2.2, h * 0.27),
        x = (w - unit * s.ratio) / 2,
        y = 38;
      ctx.fillStyle = "#0369a118";
      ctx.fillRect(x, y, unit, unit);
      ctx.fillStyle = "#b5634222";
      ctx.fillRect(x + unit, y, (s.ratio - 1) * unit, unit);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, s.ratio * unit, unit);
      line(x + unit, y, x + unit, y + unit, INK, 1, [4, 3]);
      label("square", x + unit / 2, y + unit / 2, BLUE, "center");
      label(
        "leftover",
        x + unit + ((s.ratio - 1) * unit) / 2,
        y + unit + 19,
        RUST,
        "center",
      );
      const other = 1 / (s.ratio - 1),
        u = Math.min((w - 60) / Math.max(s.ratio, other), h * 0.25),
        bx = (w - Math.max(s.ratio, other) * u) / 2,
        by = h * 0.63;
      label(
        "turn the leftover; compare shapes",
        w / 2,
        h * 0.55,
        MUTED,
        "center",
      );
      ctx.fillStyle = "#0369a110";
      ctx.fillRect(bx, by, s.ratio * u, u);
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, s.ratio * u, u);
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = RUST;
      ctx.strokeRect(bx, by, other * u, u);
      ctx.setLineDash([]);
    },
  },
  {
    key: "pi",
    glyph: "π",
    short: "pi",
    name: "Pi",
    value: "3.1415926535…",
    title: "How much string goes around a circle?",
    blurb:
      "Wrap a piece of string around a circle, then pull it straight. It is a little longer than three trips across the circle.\n\nExactly how much longer? About 3.14159 diameters. That number is π. A coin, a dinner plate, a planet: the circle can change size, but this ratio does not.",
    formula: "distance around = π × diameter",
    challenge:
      "Straighten the string and count the diameter-length sections. Then change the circle’s size. The extra bit is always about 0.142 of a diameter.",
    caption:
      "Blue is the string around the circle. The ruler below measures in diameters of the original circle, not centimeters.",
    controls: [
      range(
        "unwrap",
        "Straighten the string",
        0,
        1,
        0.001,
        0,
        [
          ["circle", 0],
          ["halfway", 0.5],
          ["straight", 1],
        ],
        (v) => Math.round(v * 100) + "%",
      ),
      range(
        "size",
        "Circle size",
        0.6,
        1,
        0.01,
        1,
        [
          ["small", 0.6],
          ["large", 1],
        ],
        (v) => Math.round(v * 100) + "%",
      ),
    ],
    readings: (s) => [
      ["string length", "3.14159 diameters"],
      ["beyond three", "0.14159 diameters"],
    ],
    feedback: (s) =>
      s.unwrap > 0.98
        ? "Three full diameters, plus a little extra. That is π."
        : "The string bends, but its length stays the same. Pull it straight to measure it.",
    playLabel: "Unwrap the circle",
    tour: { key: "unwrap", from: 0, to: 1 },
    draw(w, h, s) {
      const r = ((w - 62) / TAU) * s.size,
        L = TAU * r,
        k = (1 - s.unwrap) / r,
        base = h * 0.64;
      const pts = [];
      for (let i = 0; i <= 240; i++) {
        const a = -L / 2 + (i * L) / 240;
        pts.push([
          w / 2 + (k < 1e-7 ? a : Math.sin(k * a) / k),
          base + (k < 1e-7 ? 0 : (Math.cos((k * L) / 2) - Math.cos(k * a)) / k),
        ]);
      }
      path(pts, BLUE);
      circle(...pts[0], 3, BLUE, true);
      circle(...pts[pts.length - 1], 3, BLUE, true);
      const start = w / 2 - L / 2,
        ry = base + 32;
      line(start, ry, start + L, ry, LINE, 2);
      for (let i = 0; i <= 3; i++) {
        const x = start + 2 * r * i;
        line(x, ry - 6, x, ry + 6, INK);
        label(String(i), x, ry + 23, INK, "center");
      }
      line(start + 6 * r, ry, start + L, ry, RUST, 4);
      label("diameters", w / 2, h - 17, MUTED, "center");
      if (s.unwrap < 0.02) {
        line(w / 2 - r, base - r, w / 2 + r, base - r, RUST, 1, [4, 3]);
        label("1 diameter", w / 2, base - r - 10, RUST, "center");
      }
      if (s.unwrap > 0.98) label("π", start + L, base - 12, BLUE, "center");
    },
  },
  {
    key: "e",
    glyph: "e",
    short: "Euler’s number",
    name: "Euler’s number",
    value: "2.7182818284…",
    title: "Can more frequent growth make you infinitely rich?",
    blurb:
      "Start with $1 and a made-up deal: 100% interest over a year. Pay it once at the end and you have $2. Pay half the rate halfway through, then half again at the end, and you have $2.25. The second payment earns interest on the first one, too.\n\nMore frequent payments help, but they do not make the total grow forever. Even with nonstop compounding, that first dollar becomes only about $2.71828. That limit is e.",
    formula: "after n payments: (1 + 1/n)ⁿ · the limit is e",
    challenge:
      "Choose “twice” and play through the year. The first payment adds $0.50; the second adds $0.75. Then compare monthly and daily payments.",
    caption:
      "Blue shows your balance. Each step is an interest payment. The faint rust curve shows nonstop growth for comparison.",
    controls: [
      range("n", "Payments per year", 1, 365, 1, 2, [
        ["once", 1],
        ["twice", 2],
        ["monthly", 12],
        ["daily", 365],
      ]),
      range(
        "time",
        "Through the year",
        0,
        1,
        0.001,
        1,
        [
          ["start", 0],
          ["halfway", 0.5],
          ["end", 1],
        ],
        (v) => Math.round(v * 100) + "%",
      ),
    ],
    readings: (s) => {
      const k = Math.min(s.n, Math.floor(s.time * s.n + 1e-8));
      return [
        ["balance now", "$" + ((1 + 1 / s.n) ** k).toFixed(4)],
        ["each payment", (100 / s.n).toFixed(s.n > 12 ? 3 : 2) + "%"],
      ];
    },
    feedback: (s) => {
      const k = Math.min(s.n, Math.floor(s.time * s.n + 1e-8));
      return k === 0
        ? "You start with $1. Move through the year to collect a payment."
        : s.n === 2
          ? k === 1
            ? "First payment: 50% of $1 is $0.50. You now have $1.50."
            : "Second payment: 50% of $1.50 is $0.75. You end with $2.25."
          : `${k} of ${s.n} payments received. At year’s end: $${((1 + 1 / s.n) ** s.n).toFixed(4)}. Even more payments cannot take this deal past e.`;
    },
    playLabel: "Play through the year",
    tour: { key: "time", from: 0, to: 1 },
    draw(w, h, s) {
      const X = (t) => 43 + t * (w - 70),
        Y = (v) => h - 43 - ((v - 0.8) / 2.2) * (h - 84),
        k = Math.min(s.n, Math.floor(s.time * s.n + 1e-8));
      for (const v of [1, 2, Math.E]) {
        line(43, Y(v), w - 27, Y(v));
        label(v === Math.E ? "e" : `$${v}`, 34, Y(v) + 4, MUTED, "right");
      }
      const curve = [];
      for (let i = 0; i <= 120; i++)
        curve.push([X(i / 120), Y(Math.exp(i / 120))]);
      ctx.globalAlpha = 0.45;
      path(curve, RUST);
      ctx.globalAlpha = 1;
      const pts = [[X(0), Y(1)]];
      for (let i = 1; i <= k; i++)
        pts.push(
          [X(i / s.n), Y((1 + 1 / s.n) ** (i - 1))],
          [X(i / s.n), Y((1 + 1 / s.n) ** i)],
        );
      pts.push([X(s.time), Y((1 + 1 / s.n) ** k)]);
      path(pts, BLUE);
      circle(X(s.time), Y((1 + 1 / s.n) ** k), 4, BLUE, true);
      label("start", 43, h - 17);
      label("one year", w - 27, h - 17, MUTED, "right");
    },
  },
  {
    key: "sqrt2",
    glyph: "√2",
    short: "root two",
    name: "The square root of two",
    value: "1.4142135623…",
    title: "Why does a half-sheet still look like a sheet?",
    blurb:
      "Cut a sheet of paper in half across its long side. Turn one half sideways. Can it have the same shape as the whole sheet?\n\nYes—if the long side is √2 times the short side. That is why A4 and A5 paper have the same proportions. The sizes change, but the shape stays familiar.",
    formula: "original: r · half-sheet, turned: 2/r · a match needs r² = 2",
    challenge:
      "Try 16:9, the shape of many screens. Its half is almost square. Now try √2: the two outlines below fit each other.",
    caption:
      "The dashed line cuts the sheet in half. Below, the whole sheet (blue) and a turned half (rust) have the same height so you can compare their shapes.",
    controls: [
      range(
        "ratio",
        "Long side / short side",
        1,
        2,
        0.001,
        16 / 9,
        [
          ["square", 1],
          ["√2", Math.SQRT2],
          ["16:9", 16 / 9],
          ["2:1", 2],
        ],
        (v) => v.toFixed(4),
      ),
    ],
    readings: (s) => [
      ["whole sheet", s.ratio.toFixed(4) + " : 1"],
      ["half-sheet", (2 / s.ratio).toFixed(4) + " : 1"],
    ],
    feedback: (s) =>
      Math.abs(s.ratio - Math.SQRT2) < 1e-9
        ? "Same shape, half the paper. You can keep halving it."
        : Math.abs(s.ratio - Math.SQRT2) < 0.003
          ? "Nearly the same shape. Choose √2 for the exact match."
          : "The outlines do not match. Halving this sheet changes its proportions.",
    playLabel: "Find the paper shape",
    tour: { key: "ratio", values: [2, 1, 16 / 9, Math.SQRT2] },
    draw(w, h, s) {
      const u = Math.min((w - 60) / 2, h * 0.26),
        x = (w - s.ratio * u) / 2,
        y = 35;
      ctx.fillStyle = "#0369a118";
      ctx.fillRect(x, y, (u * s.ratio) / 2, u);
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, u * s.ratio, u);
      line(
        x + (u * s.ratio) / 2,
        y,
        x + (u * s.ratio) / 2,
        y + u,
        BLUE,
        1,
        [4, 4],
      );
      label("keep half; turn it sideways", w / 2, h * 0.52, MUTED, "center");
      const by = h * 0.63,
        bx = (w - Math.max(s.ratio, 2 / s.ratio) * u) / 2;
      ctx.strokeStyle = BLUE;
      ctx.strokeRect(bx, by, s.ratio * u, u);
      ctx.strokeStyle = RUST;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(bx, by, (2 / s.ratio) * u, u);
      ctx.setLineDash([]);
    },
  },
  {
    key: "tau",
    glyph: "τ",
    short: "tau",
    name: "Tau: one whole turn",
    value: "6.2831853071…",
    title: "How does a spinning point make a wave?",
    blurb:
      "Imagine watching one seat on a Ferris wheel from the side. As it goes around, its height rises, falls, and comes back to where it started. Plot that height over time and you get a sine wave.\n\nOne trip around is one full wave. In radians—the angle unit based on distance around a circle—that full turn is τ. It is exactly twice π.",
    formula: "one turn = τ radians = 2π radians = 360°",
    challenge:
      "Play one turn. Pause at the top or bottom: those are the wave’s peak and trough. Halfway around is not halfway up—it is back at the middle.",
    caption:
      "The blue point goes around the wheel. The rust point records its height. The dashed line connects two points at exactly the same height.",
    controls: [
      range(
        "turn",
        "Turn the wheel",
        0,
        1,
        0.001,
        0,
        [
          ["start", 0],
          ["¼ turn", 0.25],
          ["½ turn", 0.5],
          ["¾ turn", 0.75],
          ["full turn", 1],
        ],
        (v) => Math.round(v * 360) + "°",
      ),
    ],
    readings: (s) => [
      ["angle", (TAU * s.turn).toFixed(3) + " radians"],
      [
        "height",
        Math.abs(Math.sin(TAU * s.turn)) < 1e-8
          ? "0.000"
          : Math.sin(TAU * s.turn).toFixed(3),
      ],
    ],
    feedback: (s) =>
      s.turn < 0.02
        ? "Start at the middle, on the right side of the wheel."
        : s.turn > 0.98
          ? "Back where you started. One full turn has drawn one full wave."
          : Math.abs(s.turn - 0.25) < 0.015
            ? "At the very top: the wave reaches +1."
            : Math.abs(s.turn - 0.75) < 0.015
              ? "At the very bottom: the wave reaches −1."
              : Math.abs(s.turn - 0.5) < 0.015
                ? "Halfway around: back at height 0, now moving downward."
                : "The wheel turns at a steady speed, but its height does not change at a steady speed.",
    playLabel: "Play one turn",
    tour: { key: "turn", from: 0, to: 1 },
    draw(w, h, s) {
      const r = Math.min(w * 0.18, h * 0.27),
        cx = w * 0.24,
        cy = h * 0.48,
        a = TAU * s.turn,
        gx = w * 0.52,
        gw = w * 0.41;
      line(cx - r - 7, cy, w - 14, cy);
      line(cx, cy - r - 12, cx, cy + r + 12);
      circle(cx, cy, r, LINE);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, -a, true);
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2;
      ctx.stroke();
      const px = cx + r * Math.cos(a),
        py = cy - r * Math.sin(a);
      line(cx, cy, px, py, INK, 2);
      circle(px, py, 4, BLUE, true);
      const wave = [],
        trace = [];
      for (let i = 0; i <= 160; i++) {
        wave.push([gx + (i / 160) * gw, cy - r * Math.sin((TAU * i) / 160)]);
        const t = (s.turn * i) / 160;
        trace.push([gx + t * gw, cy - r * Math.sin(TAU * t)]);
      }
      path(wave, LINE);
      path(trace, BLUE);
      line(px, py, gx + s.turn * gw, py, RUST, 1, [3, 4]);
      circle(gx + s.turn * gw, py, 4, RUST, true);
      label("0", gx, cy + r + 24);
      label("τ", gx + gw, cy + r + 24, MUTED, "right");
      label("one turn → one wave", w / 2, h - 25, MUTED, "center");
    },
  },
  {
    key: "gamma",
    glyph: "γ",
    short: "Euler–Mascheroni",
    name: "The Euler–Mascheroni constant",
    value: "0.5772156649…",
    title: "Can infinitely many scraps add up to something small?",
    blurb:
      "Build a staircase with heights 1, ½, ⅓, ¼, and so on. Each step is one unit wide. Now slide the smooth curve 1/x underneath it.\n\nThe steps always sit a little above the curve. Those blue scraps keep getting smaller. Add all of them—even infinitely many—and their total area approaches just 0.57721. That is γ.",
    formula: "scraps after n steps = (1 + ½ + … + 1/n) − ln(n + 1) → γ",
    challenge:
      "Start with one step. Add a few more, then jump to 10,000. The staircase keeps going, but there is very little extra blue area left to collect.",
    caption:
      "Blue is the extra area between the steps and the curve. The diagram shows the first 10 steps at a fixed scale; the total counts every step you add.",
    controls: [
      range(
        "power",
        "Steps to add",
        0,
        4,
        0.01,
        0,
        [
          ["1", 0],
          ["2", Math.log10(2)],
          ["10", 1],
          ["100", 2],
          ["10,000", 4],
        ],
        (v) => Math.round(10 ** v).toLocaleString(),
      ),
    ],
    readings: (s) => {
      const n = Math.round(10 ** s.power);
      return [
        ["blue area so far", (harmonics[n] - Math.log(n + 1)).toFixed(6)],
        [
          "still to come",
          (0.5772156649015329 - harmonics[n] + Math.log(n + 1)).toFixed(6),
        ],
      ];
    },
    feedback: (s) => {
      const n = Math.round(10 ** s.power);
      return n === 1
        ? "The first scrap alone has area about 0.307—already more than half the final total."
        : n < 10
          ? `${n} steps, but each new scrap is smaller than the last.`
          : `${n.toLocaleString()} steps counted. The picture stays zoomed in on the first 10; the blue total keeps inching toward γ.`;
    },
    playLabel: "Collect the scraps",
    tour: { key: "power", values: [0, Math.log10(2), 1, 2, 4] },
    draw(w, h, s) {
      const n = Math.round(10 ** s.power),
        count = Math.min(10, n),
        X = (v) => 35 + ((v - 1) / 10) * (w - 57),
        Y = (v) => h * 0.68 - v * h * 0.5;
      line(35, Y(0), w - 22, Y(0));
      for (let i = 1; i <= count; i++) {
        const pts = [
          [X(i), Y(1 / i)],
          [X(i + 1), Y(1 / i)],
        ];
        for (let j = 20; j >= 0; j--) {
          const x = i + j / 20;
          pts.push([X(x), Y(1 / x)]);
        }
        path(pts, "#0369a180", "#0369a138");
        line(X(i), Y(0), X(i), Y(1 / i), LINE);
      }
      const curve = [];
      for (let i = 0; i <= 200; i++) {
        const x = 1 + i / 20;
        curve.push([X(x), Y(1 / x)]);
      }
      path(curve, RUST);
      for (const i of [1, 2, 5, 10])
        label(String(i), X(i), Y(0) + 20, MUTED, "center");
      label("height 1", 35, 25, BLUE);
      label("curve: 1/x", w - 22, 25, RUST, "right");
      const total = harmonics[n] - Math.log(n + 1),
        barY = h * 0.88,
        bw = w - 74;
      line(37, barY, 37 + bw, barY, LINE, 7);
      line(37, barY, 37 + (bw * total) / 0.5772156649015329, barY, BLUE, 7);
      label("0", 37, barY + 23);
      label("γ ≈ 0.577", w - 37, barY + 23, MUTED, "right");
    },
  },
];
// One bounded precomputation; no continuous work while a diagram is idle.
const harmonics = new Float64Array(10001);
for (let n = 1; n < harmonics.length; n++)
  harmonics[n] = harmonics[n - 1] + 1 / n;
let active,
  animation = 0,
  started = 0,
  animationProgress = 0;
for (const e of experiments) {
  e.state = Object.fromEntries(e.controls.map((c) => [c.key, c.value]));
  const b = document.createElement("button");
  b.textContent = e.glyph + " " + e.short;
  b.dataset.key = e.key;
  b.onclick = () => select(e);
  $("picker").append(b);
}
function stop(restart = true) {
  cancelAnimationFrame(animation);
  animation = 0;
  if (restart) animationProgress = 0;
  $("play").textContent =
    animationProgress > 0 && animationProgress < 1
      ? "Resume"
      : active?.playLabel || "Play experiment";
}
function select(e) {
  stop();
  active = e;
  history.replaceState(null, "", "#" + e.key);
  for (const b of $("picker").children) {
    const selected = b.dataset.key === e.key;
    b.classList.toggle("active", selected);
    b.setAttribute("aria-pressed", selected);
  }
  $("name").textContent = e.name;
  $("value").textContent = e.glyph + " = " + e.value;
  $("experiment-title").textContent = e.title;
  $("blurb").replaceChildren(
    ...e.blurb.split("\n\n").map((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      return p;
    }),
  );
  $("play").textContent = e.playLabel;
  $("formula").textContent = e.formula;
  $("try").textContent = e.challenge;
  $("stage-caption").textContent = e.caption;
  canvas.setAttribute("aria-label", e.name + " — " + e.caption);
  $("controls").replaceChildren();
  for (const c of e.controls) {
    const row = document.createElement("div");
    row.className = "row";
    const id = "control-" + c.key;
    const l = document.createElement("label");
    l.htmlFor = id;
    l.textContent = c.label + " ";
    const output = document.createElement("output");
    output.id = "value-" + c.key;
    l.append(output);
    const input = document.createElement("input");
    Object.assign(input, {
      type: "range",
      id,
      min: c.min,
      max: c.max,
      step: c.step,
      value: e.state[c.key],
    });
    input.oninput = () => {
      stop();
      e.state[c.key] = Number(input.value);
      render();
    };
    row.append(l, input);
    for (const [name, value] of c.presets) {
      const button = document.createElement("button");
      button.className = "tiny";
      button.dataset.control = c.key;
      button.dataset.preset = value;
      button.textContent = name;
      button.onclick = () => {
        stop();
        e.state[c.key] = value;
        input.value = value;
        render();
      };
      row.append(button);
    }
    $("controls").append(row);
  }
  render();
}
function render() {
  if (!active) return;
  const { width: w, height: h } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, w, h);
  for (const c of active.controls) {
    $("value-" + c.key).textContent = c.format(active.state[c.key]);
    $("control-" + c.key).setAttribute(
      "aria-valuetext",
      c.format(active.state[c.key]),
    );
  }
  for (const button of document.querySelectorAll("[data-preset]")) {
    button.setAttribute(
      "aria-pressed",
      String(
        Math.abs(
          active.state[button.dataset.control] - Number(button.dataset.preset),
        ) < 1e-9,
      ),
    );
  }
  $("discovery").textContent = active.feedback(active.state);
  $("approx-wrap").innerHTML =
    '<div class="readings">' +
    active
      .readings(active.state)
      .map(
        ([name, value]) =>
          `<div class="approx"><div class="label">${name}</div><div class="num">${value}</div></div>`,
      )
      .join("") +
    "</div>";
  ctx.save();
  active.draw(w, h, active.state);
  ctx.restore();
}
function resize() {
  const r = canvas.getBoundingClientRect(),
    dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  render();
}
$("play").onclick = () => {
  if (animation) {
    stop(false);
    return;
  }
  const tour = active.tour;
  const c = active.controls.find((c) => c.key === tour.key);
  if (animationProgress >= 1) animationProgress = 0;
  started = performance.now() - animationProgress * 8000;
  $("play").textContent = "Pause";
  const frame = (now) => {
    const t = Math.min(1, (now - started) / 8000);
    animationProgress = t;
    // A small set of useful comparisons, or one complete physical action.
    // Preserve exact preset values such as √2 and φ at the end.
    active.state[c.key] = tour.values
      ? tour.values[
          Math.min(tour.values.length - 1, Math.floor(t * tour.values.length))
        ]
      : tour.from + (tour.to - tour.from) * t;
    $("control-" + c.key).value = active.state[c.key];
    render();
    if (t < 1) animation = requestAnimationFrame(frame);
    else stop(false);
  };
  animation = requestAnimationFrame(frame);
};
$("reset").onclick = () => {
  for (const c of active.controls) active.state[c.key] = c.value;
  select(active);
};
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop(false);
});
window.addEventListener("hashchange", () =>
  select(
    experiments.find((e) => "#" + e.key === location.hash) || experiments[0],
  ),
);
new ResizeObserver(resize).observe(canvas);
select(
  experiments.find((e) => "#" + e.key === location.hash) || experiments[0],
);
resize();
