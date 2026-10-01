"use strict";
const $ = (id) => document.getElementById(id);
const PHI = (1 + Math.sqrt(5)) / 2,
  TAU = 2 * Math.PI,
  GOLDEN = 360 / PHI ** 2;
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
    title: "01 / a little turn, a lot of order",
    blurb:
      "Place a seed, turn, place another. A simple rule produces a surprisingly rich pattern. A turn that is a simple fraction of a circle repeats in spokes. The golden angle resists that repetition: it comes from φ, whose continued fraction is all ones.",
    formula: "φ = 1 + 1/φ · golden angle = 360°/φ²",
    challenge:
      "Try 144°: five spokes. Then choose golden and add seeds. Notice the interlacing spirals without the empty rays. Other irrational angles can distribute seeds well, too.",
    caption:
      "Each dot follows the same rule: angle = seed number × turn; radius ∝ √(seed number). Blue is your angle; the small reference uses the golden angle.",
    controls: [
      range(
        "angle",
        "Turn per seed",
        0,
        180,
        0.01,
        GOLDEN,
        [
          ["golden", GOLDEN],
          ["90°", 90],
          ["137°", 137],
          ["144°", 144],
        ],
        (v) => v.toFixed(3) + "°",
      ),
      range("seeds", "Seeds", 50, 1000, 10, 500, [
        ["100", 100],
        ["500", 500],
        ["1,000", 1000],
      ]),
    ],
    readings: (s) => [
      ["turn / circle", (s.angle / 360).toFixed(6)],
      ["golden angle", GOLDEN.toFixed(6) + "°"],
    ],
    draw(w, h, s) {
      const seed = (cx, cy, r, angle, n, reference) => {
        for (let i = 0; i < n; i++) {
          const a = (i * angle * Math.PI) / 180,
            d = r * Math.sqrt((i + 0.5) / n);
          circle(
            cx + d * Math.cos(a),
            cy + d * Math.sin(a),
            reference ? 1 : Math.max(1.3, 3 - s.seeds / 600),
            reference ? GREEN : BLUE,
            true,
          );
        }
      };
      seed(
        w * 0.46,
        h * 0.48,
        Math.min(w * 0.39, h * 0.39),
        s.angle,
        s.seeds,
        false,
      );
      ctx.fillStyle = "#f5f4f1";
      ctx.fillRect(w * 0.71, h * 0.68, w * 0.29, h * 0.32);
      seed(w * 0.84, h * 0.81, Math.min(w, h) * 0.105, GOLDEN, 180, true);
      label("golden", w * 0.84, h * 0.96, GREEN, "center");
      label(s.angle.toFixed(3) + "°", 22, 28, BLUE);
    },
  },
  {
    key: "pi",
    glyph: "π",
    short: "pi",
    name: "Pi",
    value: "3.1415926535…",
    title: "02 / squeeze a circle",
    blurb:
      "A circle sits between two polygons: one just inside, one just outside. Their perimeters bound its circumference. Divide each by the diameter and you trap π between two numbers. More sides make the trap tighter.",
    formula: "n sin(π/n) < π < n tan(π/n)",
    challenge:
      "Start with a hexagon, then double the sides. Watch the gap shrink by roughly a factor of four. The formulas here use π to illustrate the geometric bounds; Archimedes obtained bounds using geometry.",
    caption:
      "Blue: inscribed polygon (lower bound). Rust: circumscribed polygon (upper bound). The dark circle has radius 1, so its diameter is 2.",
    controls: [
      range("sides", "Polygon sides", 3, 192, 1, 6, [
        ["6", 6],
        ["12", 12],
        ["48", 48],
        ["192", 192],
      ]),
    ],
    readings: (s) => [
      ["lower bound", (s.sides * Math.sin(Math.PI / s.sides)).toFixed(7)],
      ["upper bound", (s.sides * Math.tan(Math.PI / s.sides)).toFixed(7)],
    ],
    draw(w, h, s) {
      const r = Math.min(w, h) * 0.22,
        cx = w / 2,
        cy = h * 0.48,
        n = s.sides;
      const poly = (radius, offset, color, fill) => {
        const points = [];
        for (let i = 0; i <= n; i++) {
          const a = (TAU * i) / n + offset;
          points.push([cx + radius * Math.cos(a), cy + radius * Math.sin(a)]);
        }
        path(points, color, fill);
      };
      poly(r / Math.cos(Math.PI / n), -Math.PI / 2, RUST, "#b5634210");
      circle(cx, cy, r, INK);
      poly(r, -Math.PI / 2 + Math.PI / n, BLUE, "#0369a116");
      line(cx, cy, cx + r, cy, INK, 1, [3, 3]);
      label("r = 1", cx + 10, cy - 8, INK);
      label(
        "gap = " +
          (n * (Math.tan(Math.PI / n) - Math.sin(Math.PI / n))).toFixed(7),
        w / 2,
        h - 25,
        RUST,
        "center",
      );
    },
  },
  {
    key: "e",
    glyph: "e",
    short: "Euler’s number",
    name: "Euler’s number",
    value: "2.7182818284…",
    title: "03 / growth that feeds itself",
    blurb:
      "Start with 1 and a 100% annual growth rate. Apply it once: you get 2. Split it into two 50% steps: 2.25, because the second step also grows the first step’s gain. Divide the year ever more finely and the result approaches e.",
    formula: "(1 + 1/n)ⁿ → e as n → ∞",
    challenge:
      "Compare yearly, monthly, and daily growth. The rate stays the same; only the timing changes. The continuous curve is eᵗ: its slope always equals its height.",
    caption:
      "Blue steps: the balance after each compounding period. Rust curve: continuous growth eᵗ. Both begin at 1; continuous growth ends at e.",
    controls: [
      range("n", "Compounding periods", 1, 365, 1, 4, [
        ["yearly", 1],
        ["quarterly", 4],
        ["monthly", 12],
        ["daily", 365],
      ]),
    ],
    readings: (s) => [
      ["ending balance", Math.exp(s.n * Math.log1p(1 / s.n)).toFixed(7)],
      [
        "distance from e",
        (Math.E - Math.exp(s.n * Math.log1p(1 / s.n))).toFixed(7),
      ],
    ],
    draw(w, h, s) {
      const X = (t) => 45 + t * (w - 75),
        Y = (v) => h - 45 - ((v - 0.8) / 2.2) * (h - 85);
      for (const v of [1, 2, Math.E]) {
        line(45, Y(v), w - 30, Y(v));
        label(v === Math.E ? "e" : v, 30, Y(v) + 4, MUTED, "right");
      }
      const curve = [];
      for (let i = 0; i <= 120; i++)
        curve.push([X(i / 120), Y(Math.exp(i / 120))]);
      path(curve, RUST);
      const steps = [[X(0), Y(1)]];
      for (let i = 1; i <= s.n; i++) {
        steps.push(
          [X(i / s.n), Y((1 + 1 / s.n) ** (i - 1))],
          [X(i / s.n), Y((1 + 1 / s.n) ** i)],
        );
      }
      path(steps, BLUE);
      circle(X(1), Y((1 + 1 / s.n) ** s.n), 4, BLUE, true);
      label("start", 45, h - 18);
      label("one year", w - 30, h - 18, MUTED, "right");
    },
  },
  {
    key: "sqrt2",
    glyph: "√2",
    short: "root two",
    name: "The square root of two",
    value: "1.4142135623…",
    title: "04 / the rectangle that repeats",
    blurb:
      "The diagonal of a unit square is √2, since 1² + 1² = 2. The same number solves a practical puzzle: which rectangle keeps its proportions when folded in half? A rectangle with long side √2 and short side 1. This is the ratio used by A-series paper.",
    formula: "r = 2/r → r² = 2 → r = √2",
    challenge:
      "Change the paper’s aspect ratio. Compare the original with its half, rotated and scaled to the same height. At √2 their outlines match exactly.",
    caption:
      "Blue: original rectangle. Rust dashed outline: half the sheet, rotated and scaled to the same short side. The dotted line marks the fold.",
    controls: [
      range(
        "ratio",
        "Long side / short side",
        1,
        2,
        0.001,
        Math.SQRT2,
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
      ["original ratio", s.ratio.toFixed(6)],
      ["after halving", (2 / s.ratio).toFixed(6)],
    ],
    draw(w, h, s) {
      const unit = Math.min(w / 2.7, h * 0.43),
        x = (w - 2.2 * unit) / 2,
        y = h * 0.29;
      ctx.fillStyle = "#0369a115";
      ctx.fillRect(x, y, unit * s.ratio, unit);
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, unit * s.ratio, unit);
      line(
        x + (unit * s.ratio) / 2,
        y,
        x + (unit * s.ratio) / 2,
        y + unit,
        BLUE,
        1,
        [3, 4],
      );
      ctx.strokeStyle = RUST;
      ctx.setLineDash([7, 5]);
      ctx.strokeRect(x, y, (unit * 2) / s.ratio, unit);
      ctx.setLineDash([]);
      label("1", x - 12, y + unit / 2, BLUE, "right");
      label(
        s.ratio.toFixed(4),
        x + (unit * s.ratio) / 2,
        y - 15,
        BLUE,
        "center",
      );
      label(
        "difference: " + Math.abs(s.ratio - 2 / s.ratio).toFixed(6),
        w / 2,
        h - 30,
        MUTED,
        "center",
      );
    },
  },
  {
    key: "tau",
    glyph: "τ",
    short: "tau",
    name: "Tau: one whole turn",
    value: "6.2831853071…",
    title: "05 / a circle becomes a wave",
    blurb:
      "Radians measure an angle by the arc it cuts out, divided by the radius. A full circle has circumference 2πr, so a complete turn is τ = 2π radians. Follow a point around the circle: its vertical position traces a sine wave.",
    formula: "angle = arc / radius · y = sin(τ × turns)",
    challenge:
      "Try a quarter turn, a half turn, and a full turn. The height goes 1, 0, 0 — but watch the path between them. One revolution is exactly one wave.",
    caption:
      "The blue point travels counterclockwise. Its height is carried across to the wave. The highlighted arc is the angle in radians.",
    controls: [
      range(
        "turn",
        "Turns",
        0,
        1,
        0.001,
        0.125,
        [
          ["0", 0],
          ["¼", 0.25],
          ["½", 0.5],
          ["¾", 0.75],
          ["1", 1],
        ],
        (v) => (v * 360).toFixed(1) + "°",
      ),
    ],
    readings: (s) => [
      ["angle in radians", (TAU * s.turn).toFixed(6)],
      ["height: sin(angle)", Math.sin(TAU * s.turn).toFixed(6)],
    ],
    draw(w, h, s) {
      const r = Math.min(w * 0.19, h * 0.28),
        cx = w * 0.24,
        cy = h * 0.49,
        a = TAU * s.turn,
        gx = w * 0.52,
        gw = w * 0.42;
      line(cx - r - 8, cy, w - 15, cy);
      line(cx, cy - r - 15, cx, cy + r + 15);
      circle(cx, cy, r, LINE);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, -a, true);
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 3;
      ctx.stroke();
      const px = cx + r * Math.cos(a),
        py = cy - r * Math.sin(a);
      line(cx, cy, px, py, INK, 2);
      circle(px, py, 4, BLUE, true);
      const wave = [];
      for (let i = 0; i <= 160; i++)
        wave.push([gx + (i / 160) * gw, cy - r * Math.sin((TAU * i) / 160)]);
      path(wave, LINE);
      const trace = [];
      for (let i = 0; i <= 160; i++) {
        const t = (s.turn * i) / 160;
        trace.push([gx + t * gw, cy - r * Math.sin(TAU * t)]);
      }
      path(trace, BLUE);
      line(px, py, gx + s.turn * gw, py, RUST, 1, [3, 4]);
      circle(gx + s.turn * gw, py, 4, RUST, true);
      label("0", gx, cy + r + 25);
      label("τ", gx + gw, cy + r + 25, MUTED, "right");
      label("one turn = one wave", w / 2, h - 28, MUTED, "center");
    },
  },
  {
    key: "gamma",
    glyph: "γ",
    short: "Euler–Mascheroni",
    name: "The Euler–Mascheroni constant",
    value: "0.5772156649…",
    title: "06 / the gap that stays",
    blurb:
      "Add 1 + ½ + ⅓ + … + 1/n. Compare that sum with ln(n), the area under 1/x from 1 to n. Both keep growing, but their difference settles toward γ. The close-up shows a gap that stabilizes even as the two totals climb.",
    formula: "Hₙ − ln(n) → γ ≈ 0.5772156649",
    challenge:
      "Increase n by a factor of ten. The two totals grow by about ln(10), while their gap barely changes. We still do not know whether γ is rational.",
    caption:
      "Blue: harmonic sum Hₙ. Rust: ln(n). Below: their difference on a magnified scale, approaching the dashed γ line. Horizontal scale is logarithmic.",
    controls: [
      range(
        "power",
        "Number of terms",
        0,
        4,
        0.01,
        1.5,
        [
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
        ["terms", n.toLocaleString()],
        ["Hₙ − ln(n)", (harmonics[n] - Math.log(n)).toFixed(7)],
      ];
    },
    draw(w, h, s) {
      const n = Math.round(10 ** s.power),
        X = (k) => 45 + (Math.log10(k) / 4) * (w - 75),
        Y = (v) => h * 0.43 - (v / 10) * (h * 0.32),
        G = (v) => h * 0.84 - ((v - 0.55) / 0.5) * (h * 0.24);
      const hi = [],
        lo = [],
        gap = [];
      for (let i = 1; i <= n; i++) {
        if (i > 100 && i % Math.max(1, Math.floor(n / 400)) !== 0 && i !== n)
          continue;
        hi.push([X(i), Y(harmonics[i])]);
        lo.push([X(i), Y(Math.log(i))]);
        gap.push([X(i), G(harmonics[i] - Math.log(i))]);
      }
      line(45, Y(0), w - 30, Y(0));
      path(hi, BLUE);
      path(lo, RUST);
      label("Hₙ " + harmonics[n].toFixed(3), 45, 24, BLUE);
      label("ln(n) " + Math.log(n).toFixed(3), w - 25, 24, RUST, "right");
      label("the gap, magnified", 45, h * 0.55, INK);
      line(45, G(0.5772156649), w - 30, G(0.5772156649), GREEN, 1, [4, 4]);
      path(gap, BLUE);
      circle(X(n), G(harmonics[n] - Math.log(n)), 4, BLUE, true);
      label("γ", w - 17, G(0.5772156649) + 4, GREEN);
      for (let p = 0; p <= 4; p++)
        label((10 ** p).toLocaleString(), X(10 ** p), h - 20, MUTED, "center");
    },
  },
];
// One bounded precomputation; no continuous work while a diagram is idle.
const harmonics = new Float64Array(10001);
for (let n = 1; n < harmonics.length; n++)
  harmonics[n] = harmonics[n - 1] + 1 / n;
let active,
  animation = 0,
  started = 0;
for (const e of experiments) {
  e.state = Object.fromEntries(e.controls.map((c) => [c.key, c.value]));
  const b = document.createElement("button");
  b.textContent = e.glyph + " " + e.short;
  b.dataset.key = e.key;
  b.onclick = () => select(e);
  $("picker").append(b);
}
function stop() {
  cancelAnimationFrame(animation);
  animation = 0;
  $("play").textContent = "Play experiment";
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
  $("blurb").textContent = e.blurb;
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
    stop();
    return;
  }
  const c = active.controls[0];
  started = performance.now();
  $("play").textContent = "Pause";
  const frame = (now) => {
    const t = Math.min(1, (now - started) / 10000);
    const v = c.min + (c.max - c.min) * t;
    active.state[c.key] = Math.round(v / c.step) * c.step;
    $("control-" + c.key).value = active.state[c.key];
    render();
    if (t < 1) animation = requestAnimationFrame(frame);
    else stop();
  };
  animation = requestAnimationFrame(frame);
};
$("reset").onclick = () => {
  for (const c of active.controls) active.state[c.key] = c.value;
  select(active);
};
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop();
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
