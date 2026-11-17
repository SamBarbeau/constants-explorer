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
    title: "Why do some turns make spokes?",
    blurb: "Place each dot a little farther from the center. A quarter turn puts every fifth dot back on the same spoke.\n\nNow split a full turn in the golden ratio: the larger part is φ times the smaller. Turn by the smaller part (about 137.5°) each time, and the dots fill the gaps.",
    formula:
      "φ ≈ 1.618 · golden angle = 360° / φ² ≈ 137.508° · distance from center grows as √(dot number)",
    caption: "The orange dot is the newest. Switch between 90° and the golden angle.",
    controls: [
      range(
        "angle",
        "Turn between dots",
        0,
        180,
        0.01,
        360 / PHI ** 2,
        [
          ["golden angle", 360 / PHI ** 2],
          ["90°", 90],
          ["137°", 137],
          ["144°", 144],
        ],
        (v) => v.toFixed(3) + "°",
      ),
      range("seeds", "Dots", 1, 1000, 1, 500, [
        ["20", 20],
        ["100", 100],
        ["500", 500],
        ["1,000", 1000],
      ]),
    ],
    readings: (s) => [
      ["turn between dots", s.angle.toFixed(3) + "°"],
      ["dots placed", String(Math.round(s.seeds))],
    ],
    feedback: (s) =>
      Math.abs(s.angle - 90) < 0.001
        ? "90° makes four spokes."
        : Math.abs(s.angle - 144) < 0.001
          ? "After five turns of 144°, the direction repeats."
          : Math.abs(s.angle - 360 / PHI ** 2) < 0.001
            ? "The golden angle fills the gaps between earlier dots."
            : "Move the angle slightly and watch the pattern change.",
    playLabel: "Grow the seed pattern",
    tour: { key: "seeds", from: 1, to: 1000, integer: true },
    draw(w, h, s) {
      const n = Math.round(s.seeds),
        r = Math.min(w, h) * 0.41,
        cx = w / 2,
        cy = h / 2;
      // A fixed radial scale lets the pattern grow outward as seeds are added.
      const spacing = r / Math.sqrt(1000),
        size = Math.max(1.3, Math.min(2.4, spacing * 0.45));
      for (let i = 0; i < n; i++) {
        const a = (i * s.angle * Math.PI) / 180,
          d = spacing * Math.sqrt(i + 0.5);
        circle(
          cx + d * Math.cos(a),
          cy + d * Math.sin(a),
          i === n - 1 ? size + 1 : size,
          i === n - 1 ? RUST : BLUE,
          true,
        );
      }
      label(s.angle.toFixed(3) + "° per dot", 18, 25, BLUE);
    },
  },
  {
    key: "pi",
    glyph: "π",
    short: "pi",
    name: "Pi",
    value: "3.1415926535…",
    title: "How far around is a circle?",
    blurb: "A diameter goes straight across a circle through its center. A string wrapped once around the edge measures just over three diameters. The exact number of diameters is π, whatever the size of the circle.",
    formula: "distance around = π × diameter",
    caption: "Each tick on the ruler marks one diameter.",
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
        ? "The string reaches about 0.14 diameters past the third tick."
        : "Straighten the string to measure it.",
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
    title: "How much can $1 grow in a year?",
    blurb: "Start with $1 at 100% annual interest. One payment doubles it. Two 50% payments give you $2.25 because the second earns interest on the first. Split the rate into ever smaller payments and the final balance approaches e dollars.",
    formula: "after n payments: (1 + 1/n)ⁿ · the limit is e",
    caption: "Blue steps show interest payments. The orange curve shows continuous growth.",
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
        ? "Starting balance: $1."
        : s.n === 2
          ? k === 1
            ? "First payment: $0.50 on your starting dollar."
            : "Second payment: $0.75, because you now earn interest on $1.50."
          : `${k} of ${s.n} payments received. At year’s end: $${((1 + 1 / s.n) ** s.n).toFixed(4)}.`;
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
    title: "What shape of paper keeps its proportions when cut in half?",
    blurb: "Cut across the middle of the long side, then turn one half sideways. If the original sheet was √2 times as long as it was wide, the half has the same ratio. That’s the idea behind A4 and A5 paper.",
    formula: "original: r · half-sheet, turned: 2/r · a match needs r² = 2",
    caption: "Blue: whole sheet. Orange: rotated half. Both outlines are scaled to the same height.",
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
        ? "The outlines match: half the area, same proportions."
        : Math.abs(s.ratio - Math.SQRT2) < 0.003
          ? "Nearly the same shape. Choose √2 for the exact match."
          : "Adjust the width until the two right edges line up.",
    playLabel: "Match the outlines",
    tour: { key: "ratio", seekFromCurrent: true, to: Math.SQRT2, duration: 3200 },
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
    title: "How does a spinning wheel draw a wave?",
    blurb: "Track the height of a Ferris wheel seat as it turns at a steady speed. One lap draws one sine wave, from the middle to the top, down to the bottom, and back. That full turn measures τ radians.",
    formula: "one turn = τ radians = 2π radians = 360°",
    caption: "The dashed line connects the seat to its height on the graph.",
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
        ? "The seat starts level with the center."
        : s.turn > 0.98
          ? "One full turn completes the wave."
          : Math.abs(s.turn - 0.25) < 0.015
            ? "At the top: height +1."
            : Math.abs(s.turn - 0.75) < 0.015
              ? "At the bottom: height −1."
              : Math.abs(s.turn - 0.5) < 0.015
                ? "Half a turn: back at zero, moving down."
                : "Height changes fastest near the middle.",
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
    title: "How much area sits between the steps and the curve?",
    blurb: "Make a staircase with steps one unit wide and heights 1, ½, ⅓, and so on. Each step leaves a sliver above the curve 1/x. The slivers get smaller, and their total area approaches γ.",
    formula: "area after n steps = (1 + ½ + … + 1/n) − ln(n + 1) → γ",
    caption: "Top: the newest slivers, magnified. Bottom: total area on a fixed scale. Each tick to the right means ten times as many steps.",
    controls: [
      range(
        "power",
        "Follow the steps",
        0,
        4,
        0.01,
        0,
        [
          ["1", 0],
          ["10", 1],
          ["100", 2],
          ["1,000", 3],
          ["10,000", 4],
        ],
        (v) => Math.round(10 ** v).toLocaleString(),
      ),
    ],
    readings: (s) => {
      const n = Math.round(10 ** s.power);
      return [
        ["total blue area", (harmonics[n] - Math.log(n + 1)).toFixed(6)],
        ["newest sliver", (1 / n - Math.log1p(1 / n)).toPrecision(3)],
      ];
    },
    feedback: (s) => {
      const n = Math.round(10 ** s.power);
      return n === 1
        ? "The first sliver accounts for over half the total."
        : n <= 6
          ? "Each step adds a smaller sliver."
          : `Steps ${(n - 5).toLocaleString()}–${n.toLocaleString()}. Compare the newest sliver with the total.`;
    },
    playLabel: "Add steps",
    tour: { key: "power", from: 0, to: 4 },
    draw(w, h, s) {
      const n = Math.round(10 ** s.power),
        start = Math.max(1, n - 5),
        count = n - start + 1;
      const low = 1 / (n + 1),
        span = 1 / start - low,
        zoom = 0.5 / span;
      const left = 38,
        right = w - 24,
        top = 51,
        bottom = h * 0.47;
      const X = (x) => left + ((x - start) / count) * (right - left),
        Y = (y) => bottom - ((y - low) / span) * (bottom - top);
      label(
        n === 1
          ? "step 1"
          : `steps ${start.toLocaleString()}–${n.toLocaleString()}`,
        18,
        23,
        INK,
      );
      label(
        `vertical zoom ×${zoom.toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
        18,
        40,
        MUTED,
      );
      for (let i = start; i <= n; i++) {
        const pts = [
          [X(i), Y(1 / i)],
          [X(i + 1), Y(1 / i)],
        ];
        for (let j = 24; j >= 0; j--) {
          const x = i + j / 24;
          pts.push([X(x), Y(1 / x)]);
        }
        path(
          pts,
          i === n ? BLUE : "#0369a170",
          i === n ? "#0369a14a" : "#0369a120",
        );
      }
      const curve = [];
      for (let j = 0; j <= 160; j++) {
        const x = start + (count * j) / 160;
        curve.push([X(x), Y(1 / x)]);
      }
      path(curve, RUST);
      label(String(start), left, bottom + 18, MUTED, "left");
      label(String(n + 1), right, bottom + 18, MUTED, "right");
      label("total blue area", 18, h * 0.64, BLUE);
      const gx = (k) => left + (Math.log10(k) / 4) * (right - left),
        gy = (v) => h * 0.89 - ((v - 0.28) / 0.32) * (h * 0.19),
        GAMMA = 0.5772156649015329;
      line(left, gy(0.3), right, gy(0.3), LINE);
      label("0.3", left - 6, gy(0.3) + 4, MUTED, "right");
      line(left, gy(GAMMA), right, gy(GAMMA), MUTED, 1, [3, 3]);
      label("γ", left - 6, gy(GAMMA) + 4, INK, "right");
      const total = [];
      for (let i = 1; i <= n; i++) {
        if (i > 80 && i !== n && i % Math.max(1, Math.floor(n / 250)) !== 0)
          continue;
        total.push([gx(i), gy(harmonics[i] - Math.log(i + 1))]);
      }
      path(total, BLUE);
      circle(gx(n), gy(harmonics[n] - Math.log(n + 1)), 3.5, BLUE, true);
      for (const k of [1, 10, 100, 1000, 10000])
        label(
          k === 1000 ? "1k" : k === 10000 ? "10k" : String(k),
          gx(k),
          h - 0.025 * h,
          MUTED,
          k === 1 ? "left" : k === 10000 ? "right" : "center",
        );
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
  animationProgress = 0,
  tourStart = 0;
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
  const duration = tour.duration || 8000;
  if (animationProgress === 0) {
    tourStart = tour.seekFromCurrent ? active.state[c.key] : tour.from;
    // Replay from a visibly different sheet if the outlines already match.
    if (tour.seekFromCurrent && Math.abs(tourStart - tour.to) < 0.003) tourStart = c.max;
  }
  started = performance.now() - animationProgress * duration;
  $("play").textContent = "Pause";
  const frame = (now) => {
    const t = Math.max(0, Math.min(1, (now - started) / duration));
    animationProgress = t;
    const fraction = tour.seekFromCurrent ? t * t * (3 - 2 * t) : t;
    active.state[c.key] = t === 1 ? tour.to : tourStart + (tour.to - tourStart) * fraction;
    if (tour.integer) active.state[c.key] = Math.round(active.state[c.key]);
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
