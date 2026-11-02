import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Interactive point field: particles drift along a sine flow, connect to
 * neighbours, and reach toward the pointer. Pauses off-screen.
 */
export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = theme === "dark";
    const ink = dark ? "245,245,240" : "9,9,9";
    const accent = dark ? "255,247,0" : "9,9,9";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let pts: P[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let visible = true;
    let t = 0;

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(40, Math.min(120, Math.floor((w * h) / 14000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.004;
      const link = 130;

      for (const p of pts) {
        if (!reduce) {
          // gentle sine-flow field
          p.vx += Math.cos(p.y * 0.006 + t * 3) * 0.004;
          p.vy += Math.sin(p.x * 0.006 + t * 3) * 0.004;
          // pointer attraction
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 200 * 200 && d2 > 1) {
              const f = (1 - Math.sqrt(d2) / 200) * 0.02;
              p.vx += dx * f * 0.05;
              p.vy += dy * f * 0.05;
            }
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < link) {
            ctx.strokeStyle = `rgba(${ink},${(1 - d / link) * 0.16})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.active) {
          const dx = a.x - mouse.x;
          const dy = a.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 190) {
            ctx.strokeStyle = `rgba(${accent},${(1 - d / 190) * 0.75})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${ink},0.55)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Faint axis curve: y = sin(x) travelling wave
      ctx.strokeStyle = `rgba(${accent},${dark ? 0.35 : 0.25})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = h * 0.72 + Math.sin(x * 0.012 + t * 6) * 26 + Math.sin(x * 0.031 - t * 4) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    init();
    start();
    if (reduce) draw();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = mouse.y >= 0 && mouse.y <= r.height && e.pointerType === "mouse";
    };
    const onLeave = () => (mouse.active = false);
    const onResize = () => {
      init();
      if (reduce) draw();
    };
    const onVis = () => {
      if (!document.hidden && visible && !reduce) start();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) start();
    });
    io.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce, theme]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
