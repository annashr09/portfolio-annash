import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import FunctionPlot from "../components/visuals/FunctionPlot";
import { education } from "../data/content";

// Degree runs July 2023 → August 2027 (expected). Progress is computed from today's date.
const START = new Date("2023-07-01").getTime();
const END = new Date("2027-08-31").getTime();
function degreeProgress() {
  return Math.max(0, Math.min(1, (Date.now() - START) / (END - START)));
}

export default function Education() {
  const reduce = useReducedMotion();
  const progress = degreeProgress();

  return (
    <section id="education" className="relative z-10 px-5 py-28 md:px-10 md:py-44" aria-labelledby="edu-title">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading id="edu-title" index="04" label="Education" lines={["THE", "FOUNDATION."]} />

        <div className="grid gap-px border hairline bg-[var(--line)] lg:grid-cols-12">
          {/* Primary: ITS */}
          <Reveal className="bg-[var(--bg)] lg:col-span-7">
            <article className="relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden p-7 md:p-12">
              <span
                aria-hidden="true"
                className="stroke-text pointer-events-none absolute -right-6 -top-10 select-none font-serif text-[clamp(14rem,30vw,28rem)] italic leading-none opacity-30"
              >
                ∑
              </span>
              <div className="relative">
                <p className="eyebrow mb-5 text-accent">{education[0].period}</p>
                <h3 className="display text-[clamp(2rem,5vw,4.4rem)] leading-[0.92]">{education[0].degree}</h3>
                <p className="mt-4 font-serif text-[clamp(1.2rem,2vw,1.8rem)] italic">{education[0].school}</p>
                <p className="eyebrow mt-4">{education[0].location}</p>
              </div>

              <div className="relative mt-14">
                <p className="eyebrow mb-4">{education[0].note}</p>
                <div
                  role="progressbar"
                  aria-label="Progress through the degree timeline"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  className="relative h-px w-full bg-[var(--line)]"
                >
                  <motion.span
                    className="absolute left-0 top-0 h-[3px] -translate-y-px origin-left bg-[#FFF700]"
                    style={{ width: `${progress * 100}%` }}
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFF700]"
                    style={{ left: `${progress * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4 flex justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                  <span>Jul 2023</span>
                  <span className="text-[var(--fg)]">{Math.round(progress * 100)}% of the timeline</span>
                  <span>Aug 2027</span>
                </div>
              </div>
            </article>
          </Reveal>

          {/* Secondary: SMA */}
          <Reveal delay={0.1} className="bg-[var(--bg)] lg:col-span-5">
            <article className="flex h-full min-h-[320px] flex-col justify-between p-7 md:p-12">
              <div>
                <p className="eyebrow mb-5">{education[1].period}</p>
                <h3 className="display text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.95]">{education[1].school}</h3>
                <p className="mt-4 font-serif text-[clamp(1.1rem,1.8vw,1.5rem)] italic">{education[1].degree}</p>
                <p className="eyebrow mt-4">
                  {education[1].note} · {education[1].location}
                </p>
              </div>
              <p className="font-serif text-[clamp(3rem,7vw,6rem)] italic leading-none text-accent" aria-hidden="true">
                f′(x)
              </p>
            </article>
          </Reveal>

          {/* Interactive plot */}
          <Reveal className="bg-[var(--bg)] lg:col-span-12">
            <div className="grid gap-10 p-7 md:p-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-4 text-accent">Fig. 02 — Interactive</p>
                <h3 className="display text-[clamp(1.6rem,3vw,2.6rem)] leading-[0.95]">Calculus, in motion.</h3>
                <p className="mt-5 max-w-sm leading-relaxed text-[var(--muted)]">
                  A decaying sine wave and its running integral. Sweep across the curve with your pointer or the
                  arrow keys to watch the shaded area accumulate.
                </p>
              </div>
              <div className="lg:col-span-8">
                <FunctionPlot />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
