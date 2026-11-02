import { motion, useReducedMotion } from "framer-motion";

/**
 * Fixed background layer: drifting lemon light sources + faint crosshair grid.
 * Gives the liquid-glass surfaces something to refract.
 */
export default function Atmosphere() {
  const reduce = useReducedMotion();
  const drift = (a: number, b: number, d: number) =>
    reduce
      ? undefined
      : {
          x: [0, a, -a * 0.6, 0],
          y: [0, b, -b * 0.7, 0],
          transition: { duration: d, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -left-[12vw] top-[8vh] h-[46vw] w-[46vw] rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: "#FFF700" }}
        animate={drift(80, 60, 26)}
      />
      <motion.div
        className="absolute -right-[14vw] bottom-[-6vh] h-[38vw] w-[38vw] rounded-full opacity-[0.1] blur-[120px]"
        style={{ background: "#FDFF00" }}
        animate={drift(-70, -50, 32)}
      />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 25vh",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 0%, transparent 75%)",
        }}
      />
    </div>
  );
}
