import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import { experiences } from "../data/content";

export default function Experience() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(experiences[0].id);
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="experience" className="relative z-10 px-5 py-28 md:px-10 md:py-44" aria-labelledby="exp-title">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading id="exp-title" index="02" label="Experience" lines={["WHERE I'VE", "BEEN BUILDING."]} />

        <div className="relative">
          {/* timeline rail */}
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-[var(--line)] md:left-[11px]" aria-hidden="true">
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-[#FFF700]"
              style={{ scaleY: reduce ? 1 : fill }}
            />
          </div>

          <ol ref={listRef} className="space-y-4 md:space-y-6">
            {experiences.map((exp, i) => {
              const isOpen = open === exp.id;
              return (
                <li key={exp.id} className="relative pl-10 md:pl-16">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-9 z-10 h-4 w-4 rounded-full border-2 transition-all duration-300 md:top-11 md:h-6 md:w-6 ${
                      isOpen
                        ? "scale-110 border-[#FFF700] bg-[#FFF700]"
                        : "border-[var(--fg)] bg-[var(--bg)]"
                    }`}
                  />

                  <Reveal delay={0.04}>
                    <article
                      className={`border hairline transition-colors duration-500 ${
                        isOpen ? "liquid-glass" : "bg-transparent hover:bg-[var(--glass-bg)]"
                      }`}
                    >
                      <h3>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`exp-${exp.id}`}
                          data-cursor={isOpen ? "Close" : "Open"}
                          onClick={() => setOpen(isOpen ? null : exp.id)}
                          className="grid w-full grid-cols-[1fr_auto] items-start gap-6 p-6 text-left md:p-9"
                        >
                          <span className="block">
                            <span className="eyebrow mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                              <span>{exp.period}</span>
                            </span>
                            <span className="display block text-[clamp(1.6rem,4vw,3.4rem)] leading-[0.95]">
                              {exp.org}
                            </span>
                            <span className="mt-3 block font-serif text-[clamp(1.05rem,1.8vw,1.5rem)] italic text-[var(--muted)]">
                              {exp.role}
                            </span>
                            {!isOpen && (
                              <span className="mt-4 hidden max-w-xl text-[0.95rem] text-[var(--muted)] md:block">
                                {exp.summary}
                              </span>
                            )}
                          </span>
                          <span
                            className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border hairline transition-all duration-300 ${
                              isOpen ? "rotate-45 border-[#FFF700] bg-[#FFF700] text-[#090909]" : ""
                            }`}
                            aria-hidden="true"
                          >
                            <Plus size={18} />
                          </span>
                        </button>
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`exp-${exp.id}`}
                            role="region"
                            aria-label={`${exp.org} details`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-10 px-6 pb-8 md:grid-cols-12 md:px-9 md:pb-10">
                              <ul className="space-y-4 md:col-span-7">
                                {exp.highlights.map((h) => (
                                  <li key={h} className="flex gap-4 text-base leading-relaxed md:text-lg">
                                    <span className="mt-[0.65em] h-px w-5 shrink-0 bg-[#FFF700]" aria-hidden="true" />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                              <div className="md:col-span-5">
                                <p className="text-[0.95rem] leading-relaxed text-[var(--muted)]">{exp.extra}</p>
                                <p className="eyebrow mt-6">{exp.location}</p>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                  {exp.tags.map((t) => (
                                    <li
                                      key={t}
                                      className="rounded-full border hairline px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em]"
                                    >
                                      {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
