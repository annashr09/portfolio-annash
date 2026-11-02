import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const W = 640;
const H = 320;
const X0 = 0;
const X1 = 12;
const YMIN = -1.2;
const YMAX = 1.2;
const N = 240;

const f = (x: number) => Math.sin(x) * Math.exp(-0.12 * x) * 1.1;
const sx = (x: number) => ((x - X0) / (X1 - X0)) * W;
const sy = (y: number) => H - ((y - YMIN) / (YMAX - YMIN)) * H;

/**
 * f(x) = 1.1 · sin(x) · e^(−0.12x) with a live definite integral.
 * Move the pointer (or use ←/→) to sweep x; it autoplays until touched.
 */
export default function FunctionPlot() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "-80px" });
  const [idx, setIdx] = useState(Math.floor(N * 0.45));
  const [manual, setManual] = useState(false);

  const { xs, ys, cum } = useMemo(() => {
    const xs: number[] = [];
    const ys: number[] = [];
    const cum: number[] = [0];
    for (let i = 0; i <= N; i++) {
      const x = X0 + ((X1 - X0) * i) / N;
      xs.push(x);
      ys.push(f(x));
      if (i > 0) cum.push(cum[i - 1] + ((ys[i] + ys[i - 1]) / 2) * (xs[i] - xs[i - 1]));
    }
    return { xs, ys, cum };
  }, []);

  const curve = useMemo(
    () => xs.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(" "),
    [xs, ys],
  );
  const area = useMemo(() => {
    let d = `M${sx(xs[0])},${sy(0)}`;
    for (let i = 0; i <= idx; i++) d += ` L${sx(xs[i]).toFixed(1)},${sy(ys[i]).toFixed(1)}`;
    d += ` L${sx(xs[idx]).toFixed(1)},${sy(0)} Z`;
    return d;
  }, [xs, ys, idx]);

  // autoplay sweep until the user interacts
  useEffect(() => {
    if (reduce || manual || !inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = ((now - start) / 9000) % 2;
      const q = p <= 1 ? p : 2 - p;
      setIdx(Math.round(q * N));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, manual, inView]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    setManual(true);
    setIdx(Math.round(p * N));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setIdx((i) => Math.min(N, i + 4));
    else if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 4));
    else return;
    setManual(true);
    e.preventDefault();
  };

  const x = xs[idx];
  const y = ys[idx];

  return (
    <div ref={wrap} className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-pan-y"
        role="img"
        tabIndex={0}
        aria-label={`Plot of f of x equals sine x times decaying exponential. At x equals ${x.toFixed(2)}, f equals ${y.toFixed(2)}, and the integral from 0 to x is ${cum[idx].toFixed(3)}. Use left and right arrow keys to move.`}
        onPointerMove={onMove}
        onKeyDown={onKey}
        data-cursor="Scrub"
      >
        {/* grid */}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={sx(i)} x2={sx(i)} y1={0} y2={H} stroke="var(--line)" strokeWidth="1" />
        ))}
        {[-1, -0.5, 0, 0.5, 1].map((v) => (
          <line
            key={`h${v}`}
            x1={0}
            x2={W}
            y1={sy(v)}
            y2={sy(v)}
            stroke={v === 0 ? "var(--fg)" : "var(--line)"}
            strokeOpacity={v === 0 ? 0.5 : 1}
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="#FFF700" fillOpacity="0.22" />
        <path d={curve} fill="none" stroke="var(--fg)" strokeWidth="2" strokeLinejoin="round" />
        {/* cursor */}
        <line x1={sx(x)} x2={sx(x)} y1={0} y2={H} stroke="#FFF700" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx={sx(x)} cy={sy(y)} r="6" fill="#FFF700" stroke="var(--bg)" strokeWidth="2" />
      </svg>
      <dl className="mt-5 grid grid-cols-3 gap-4 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
        <div>
          <dt className="text-[var(--muted)]">x</dt>
          <dd className="mt-1 text-lg tabular-nums normal-case tracking-normal">{x.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">f(x)</dt>
          <dd className="mt-1 text-lg tabular-nums normal-case tracking-normal">{y.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">∫₀ˣ f(t) dt</dt>
          <dd className="mt-1 text-lg tabular-nums normal-case tracking-normal text-accent">
            {cum[idx].toFixed(3)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
