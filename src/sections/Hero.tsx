import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, Download } from "lucide-react";
import HeroField from "../components/visuals/HeroField";
import Button from "../components/ui/Button";
import { profile } from "../data/content";

const ease = [0.22, 1, 0.36, 1] as const;

function Line({
  text,
  delay,
  ready,
  className = "",
}: {
  text: string;
  delay: number;
  ready: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="-mb-[0.08em] block overflow-hidden pb-[0.1em]" aria-hidden="true">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: "108%" }}
        animate={ready ? { y: 0 } : { y: "108%" }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {text.split("").map((c, i) => (
          <span key={i} className="ch">
            {c}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

const formulas = [
  { t: "e^(iπ) + 1 = 0", cls: "left-[6%] top-[22%]", d: 7 },
  { t: "∇L(θ) = 0", cls: "right-[30%] top-[16%] hidden md:block", d: 9 },
  { t: "σ(x) = 1 / (1 + e⁻ˣ)", cls: "right-[7%] bottom-[34%] hidden md:block", d: 8 },
  { t: "∫ f(x) dx", cls: "left-[42%] bottom-[30%] hidden lg:block", d: 10 },
];

export default function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // pointer parallax for the glass orb
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const ox = useSpring(px, { stiffness: 60, damping: 18 });
  const oy = useSpring(py, { stiffness: 60, damping: 18 });
  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 60);
      py.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, px, py]);

  const fadeIn = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      <HeroField />

      {/* glass lens sitting behind the type */}
      <motion.div
        aria-hidden="true"
        className="liquid-glass lg-lens pointer-events-none absolute right-[6%] top-[30%] z-[5] h-[clamp(130px,19vw,280px)] w-[clamp(130px,19vw,280px)] rounded-full"
        style={{ x: ox, y: oy }}
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: 1.4, delay: 0.6, ease }}
      />

      {formulas.map((f) => (
        <motion.span
          key={f.t}
          aria-hidden="true"
          className={`absolute z-[6] font-mono text-[0.7rem] tracking-wide text-[var(--muted)] md:text-xs ${f.cls}`}
          animate={reduce ? undefined : { y: [0, -14, 0] }}
          transition={{ duration: f.d, repeat: Infinity, ease: "easeInOut" }}
        >
          {f.t}
        </motion.span>
      ))}

      <motion.div
        style={{ y, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-between px-5 pb-10 pt-28 md:px-10 md:pt-32"
      >
        <motion.div {...fadeIn(0.2)} className="flex items-start justify-between gap-6">
          <p className="eyebrow">Portfolio — 2026</p>
          <p className="eyebrow text-right">
            Surabaya, ID
            <br />
            7.26°S · 112.75°E
          </p>
        </motion.div>

        <div className="my-10 md:my-12">
          <h1 id="hero-title" className="display text-[clamp(2.6rem,10.4vw,10.5rem)]" aria-label="Mathematics meets intelligence.">
            <Line text="MATHEMATICS" delay={0.25} ready={ready} />
            <span className="flex items-center gap-[2vw]">
              <Line text="MEETS" delay={0.4} ready={ready} className="stroke-text" />
              <motion.span
                aria-hidden="true"
                className="mb-[0.05em] hidden h-px flex-1 origin-left bg-[#FFF700] sm:block"
                initial={reduce ? false : { scaleX: 0 }}
                animate={ready ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.4, delay: 0.9, ease }}
              />
            </span>
            <Line text="INTELLIGENCE." delay={0.55} ready={ready} className="text-accent" />
          </h1>
        </div>

        <div className="grid items-end gap-10 md:grid-cols-12">
          <motion.div {...fadeIn(0.9)} className="md:col-span-5">
            <p className="eyebrow mb-3">Portfolio of</p>
            <p className="display text-[clamp(2.4rem,6vw,5.5rem)] text-accent">{profile.name}</p>
            <p className="mt-3 font-mono text-[clamp(0.68rem,1.5vw,1rem)] uppercase tracking-[0.28em]">
              {profile.surname}
            </p>
          </motion.div>

          <motion.div {...fadeIn(1.05)} className="md:col-span-6 md:col-start-7">
            <p className="serif-italic max-w-xl text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1.15]">
              {profile.tagline}
            </p>
            <p className="eyebrow mt-5 max-w-lg leading-relaxed">{profile.role}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                variant="accent"
                href="#projects"
                cursor="Go"
                icon={<ArrowDownRight size={16} strokeWidth={2} />}
              >
                Explore My Work
              </Button>
              <Button
                href={profile.cv}
                download
                cursor="CV"
                icon={<Download size={15} strokeWidth={2} />}
              >
                Download CV
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          aria-label="Scroll to About"
          {...fadeIn(1.3)}
          className="absolute bottom-10 right-5 hidden items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)] [writing-mode:vertical-rl] md:flex md:right-8"
        >
          Scroll
          <span className="relative h-14 w-px overflow-hidden bg-[var(--line)]">
            <motion.span
              className="absolute inset-x-0 top-0 h-6 bg-[#FFF700]"
              animate={reduce ? undefined : { y: [-24, 56] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
