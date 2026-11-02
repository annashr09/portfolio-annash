import { motion, useReducedMotion } from "framer-motion";
import type { ProjectItem } from "../../data/content";

/**
 * Abstract illustrations used as project "thumbnails". They depict the *kind*
 * of work (tree ensemble, classification, typeset maths, distributions) —
 * they are not screenshots and carry no performance numbers.
 * Always drawn on a fixed obsidian tile so the lemon identity holds in both themes.
 */

const Y = "#FFF700";
const W = "#F5F5F0";

// deterministic pseudo-random so SSR/CSR and re-renders never differ
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function Forest() {
  const reduce = useReducedMotion();
  // three small trees
  const tree = (cx: number, cy: number, scale: number, key: string, hot: number) => {
    const levels = [
      [[0, 0]],
      [[-1, 1], [1, 1]],
      [[-1.6, 2], [-0.6, 2], [0.6, 2], [1.6, 2]],
    ];
    const pos = (l: number, i: number) => ({
      x: cx + levels[l][i][0] * 34 * scale,
      y: cy + levels[l][i][1] * 46 * scale,
    });
    const edges: { a: { x: number; y: number }; b: { x: number; y: number }; hot: boolean }[] = [];
    for (let l = 0; l < 2; l++) {
      levels[l].forEach((_, i) => {
        [i * 2, i * 2 + 1].forEach((c) => {
          if (l === 0 && c > 1) return;
          if (levels[l + 1][c]) {
            edges.push({ a: pos(l, i), b: pos(l + 1, c), hot: (l === 0 && c === hot) || (l === 1 && c === hot * 2 + (hot ? 1 : 0)) });
          }
        });
      });
    }
    return (
      <g key={key}>
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            stroke={e.hot ? Y : W}
            strokeOpacity={e.hot ? 1 : 0.25}
            strokeWidth={e.hot ? 2 : 1}
            className={e.hot && !reduce ? "dash-flow" : undefined}
          />
        ))}
        {levels.flatMap((lv, l) =>
          lv.map((_, i) => {
            const p = pos(l, i);
            return (
              <circle
                key={`${l}-${i}`}
                cx={p.x}
                cy={p.y}
                r={l === 2 ? 5 : 6.5}
                fill={l === 2 ? Y : "#171717"}
                stroke={l === 2 ? Y : W}
                strokeOpacity={l === 2 ? 1 : 0.6}
                strokeWidth="1.2"
              />
            );
          }),
        )}
      </g>
    );
  };
  return (
    <>
      {tree(90, 70, 1, "a", 0)}
      {tree(200, 100, 1.15, "b", 1)}
      {tree(312, 70, 1, "c", 1)}
      <text x="24" y="276" fill={W} fillOpacity="0.55" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="2">
        ENSEMBLE OF DECISION TREES
      </text>
    </>
  );
}

function Scatter() {
  const r = rng(11);
  const pts = Array.from({ length: 46 }, (_, i) => {
    const cls = i % 2;
    const cx = cls ? 270 : 130;
    const cy = cls ? 90 : 190;
    return { x: cx + (r() - 0.5) * 150, y: cy + (r() - 0.5) * 110, cls };
  });
  return (
    <>
      <line x1="40" y1="40" x2="360" y2="250" stroke={W} strokeOpacity="0.18" />
      <motion.line
        x1="60"
        y1="250"
        x2="350"
        y2="40"
        stroke={Y}
        strokeWidth="1.5"
        strokeDasharray="5 5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.cls ? 4.5 : 4}
          fill={p.cls ? Y : "none"}
          stroke={p.cls ? Y : W}
          strokeWidth="1.4"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.02 * i, duration: 0.4 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
      <text x="24" y="276" fill={W} fillOpacity="0.55" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="2">
        CLASSIFICATION BOUNDARY
      </text>
    </>
  );
}

function Latex() {
  return (
    <>
      <text x="200" y="118" textAnchor="middle" fill={W} fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="58">
        ∫₀¹ x² dx = ⅓
      </text>
      <text x="200" y="188" textAnchor="middle" fill={Y} fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="40">
        lim (1 + 1/n)ⁿ = e
      </text>
      <line x1="60" y1="222" x2="340" y2="222" stroke={W} strokeOpacity="0.2" />
      <text x="24" y="276" fill={W} fillOpacity="0.55" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="2">
        CALCULUS I &amp; II · TYPESET
      </text>
    </>
  );
}

function Stats() {
  const bars = [8, 14, 26, 46, 72, 98, 112, 98, 72, 46, 26, 14, 8];
  const bw = 22;
  const gap = 4;
  const x0 = 200 - (bars.length * (bw + gap)) / 2;
  const bell = bars
    .map((_, i) => {
      const x = x0 + i * (bw + gap) + bw / 2;
      const y = 230 - bars[i] * 1.5;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  return (
    <>
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={x0 + i * (bw + gap)}
          width={bw}
          fill={Y}
          fillOpacity={0.18 + (b / 112) * 0.6}
          initial={{ y: 230, height: 0 }}
          whileInView={{ y: 230 - b * 1.5, height: b * 1.5 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <path d={bell} fill="none" stroke={W} strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="30" y1="230" x2="370" y2="230" stroke={W} strokeOpacity="0.5" />
      <text x="24" y="276" fill={W} fillOpacity="0.55" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="2">
        DISTRIBUTION · STATISTICAL COMPUTING
      </text>
    </>
  );
}

export default function ProjectVisual({
  kind,
  fit = "slice",
}: {
  kind: ProjectItem["visual"];
  /** "slice" fills the tile (cards); "meet" shows the whole illustration (modal). */
  fit?: "slice" | "meet";
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      aria-hidden="true"
      preserveAspectRatio={`xMidYMid ${fit}`}
    >
      <rect width="400" height="300" fill="#171717" />
      <defs>
        <pattern id={`dots-${kind}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#F5F5F0" fillOpacity="0.12" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#dots-${kind})`} />
      {kind === "forest" && <Forest />}
      {kind === "scatter" && <Scatter />}
      {kind === "latex" && <Latex />}
      {kind === "stats" && <Stats />}
    </svg>
  );
}
