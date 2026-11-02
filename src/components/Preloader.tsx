import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  onDone: () => void;
  skip: boolean;
}

/** Short intro: counter + curtain wipe. Skipped for reduced motion and repeat visits. */
export default function Preloader({ onDone, skip }: Props) {
  const [visible, setVisible] = useState(!skip);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setVisible(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        try {
          sessionStorage.setItem("intro-seen", "1");
        } catch {
          /* ignore */
        }
        onDone();
      }}
    >
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-[#090909] p-6 text-[#F5F5F0] md:p-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-start justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[#999]">
            <span>Annash R.P.S.</span>
            <span>Portfolio · 2026</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="display text-[clamp(1.6rem,4vw,3rem)]">
              Math<span className="text-[#FFF700]">.</span>
              <br />
              Meets<span className="text-[#FFF700]">.</span>
              <br />
              Intelligence<span className="text-[#FFF700]">.</span>
            </p>
            <p
              className="font-mono text-[clamp(4rem,16vw,12rem)] font-light leading-none tabular-nums text-[#FFF700]"
              aria-hidden="true"
            >
              {String(n).padStart(2, "0")}
            </p>
          </div>
          <span
            className="absolute bottom-0 left-0 h-[3px] bg-[#FFF700]"
            style={{ width: `${n}%` }}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
