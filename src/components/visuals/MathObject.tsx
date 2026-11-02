import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

/**
 * Rotating wireframe torus with labelled x/y/z axes.
 * Drag (mouse or touch) to rotate; auto-rotates when idle.
 */
export default function MathObject() {
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

    let size = 0;
    let dpr = 1;
    let rotX = -0.5;
    let rotY = 0.6;
    let velX = 0;
    let velY = 0.006;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let visible = true;

    const R = 1; // major radius
    const r = 0.42; // minor radius
    const U = 36;
    const V = 18;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = rect.width;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (x: number, y: number, z: number) => {
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      // rotate Y then X
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const persp = 4 / (4 + z2);
      const scale = size * 0.22;
      return { x: size / 2 + x1 * scale * persp, y: size / 2 + y2 * scale * persp, z: z2 };
    };

    const torus = (u: number, v: number) => {
      const a = (u / U) * Math.PI * 2;
      const b = (v / V) * Math.PI * 2;
      return project(
        (R + r * Math.cos(b)) * Math.cos(a),
        r * Math.sin(b),
        (R + r * Math.cos(b)) * Math.sin(a),
      );
    };

    const line = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) => {
      const depth = (a.z + b.z) / 2;
      const alpha = 0.12 + 0.55 * (1 - (depth + 1.6) / 3.2);
      ctx.strokeStyle = `rgba(${accent},${Math.max(0.06, Math.min(0.8, alpha))})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // axes
      const axes: [string, [number, number, number]][] = [
        ["x", [1.9, 0, 0]],
        ["y", [0, -1.9, 0]],
        ["z", [0, 0, 1.9]],
      ];
      const o = project(0, 0, 0);
      ctx.lineWidth = 1;
      ctx.font = "11px 'JetBrains Mono', monospace";
      for (const [name, [x, y, z]] of axes) {
        const p = project(x, y, z);
        const n = project(-x * 0.6, -y * 0.6, -z * 0.6);
        ctx.strokeStyle = `rgba(${ink},0.28)`;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${ink},0.7)`;
        ctx.fillText(name, p.x + 6, p.y - 6);
      }

      // torus wireframe
      ctx.lineWidth = 0.9;
      for (let u = 0; u < U; u++) {
        for (let v = 0; v < V; v++) {
          const p = torus(u, v);
          line(p, torus(u + 1, v));
          line(p, torus(u, v + 1));
        }
      }
      ctx.fillStyle = `rgba(${accent},0.95)`;
      ctx.beginPath();
      ctx.arc(o.x, o.y, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = () => {
      if (!dragging) {
        rotY += velY;
        rotX += velX;
        velX *= 0.95;
        if (Math.abs(velY) > 0.006) velY *= 0.97;
        else velY = 0.006;
      }
      draw();
      if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    if (!reduce) raf = requestAnimationFrame(loop);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY += dx * 0.01;
      rotX += dy * 0.01;
      velY = dx * 0.01;
      velX = dy * 0.01;
      if (reduce) draw();
    };
    const up = () => {
      dragging = false;
    };
    const key = (e: KeyboardEvent) => {
      const step = 0.15;
      if (e.key === "ArrowLeft") rotY -= step;
      else if (e.key === "ArrowRight") rotY += step;
      else if (e.key === "ArrowUp") rotX -= step;
      else if (e.key === "ArrowDown") rotX += step;
      else return;
      e.preventDefault();
      if (reduce) draw();
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("keydown", key);
    };
  }, [reduce, theme]);

  return (
    <canvas
      ref={ref}
      tabIndex={0}
      role="img"
      aria-label="Rotating 3D wireframe torus with coordinate axes. Drag or use arrow keys to rotate."
      data-cursor="Drag"
      className="aspect-square w-full touch-none select-none"
    />
  );
}
