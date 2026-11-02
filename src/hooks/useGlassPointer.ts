import { useEffect } from "react";

/**
 * Feeds pointer position into every `.liquid-glass` surface (--mx / --my),
 * which drives the moving specular highlight. One global listener.
 */
export function useGlassPointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const el = t.closest<HTMLElement>(".liquid-glass");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}
