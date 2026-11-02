import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import MathObject from "../components/visuals/MathObject";
import { about } from "../data/content";

export default function About() {
  const [open, setOpen] = useState<string>(about.facets[0].key);
  const current = about.facets.find((f) => f.key === open) ?? about.facets[0];

  return (
    <section id="about" className="relative z-10 px-5 py-28 md:px-10 md:py-44" aria-labelledby="about-title">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading id="about-title" index="01" label="About" lines={about.heading} />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6 lg:col-start-7 lg:row-start-1">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  className={
                    i === 0
                      ? "text-[clamp(1.25rem,2vw,1.7rem)] font-medium leading-[1.35] tracking-tight"
                      : "text-lg leading-relaxed text-[var(--muted)]"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="lg:col-span-5 lg:row-start-1 lg:-mt-8">
            <div className="relative">
              <div
                className="absolute inset-0 border hairline"
                style={{ transform: "translate(14px,14px)" }}
                aria-hidden="true"
              />
              <div className="relative border hairline bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="eyebrow">Fig. 01 — z = f(x, y)</span>
                  <span className="eyebrow text-accent">Drag ↔</span>
                </div>
                <MathObject />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Interactive profile */}
        <Reveal className="mt-24 md:mt-32">
          <div className="grid gap-px border hairline bg-[var(--line)] lg:grid-cols-12">
            <div role="tablist" aria-label="Profile" className="flex flex-col bg-[var(--bg)] lg:col-span-5">
              {about.facets.map((f, i) => {
                const active = f.key === open;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    id={`tab-${f.key}`}
                    aria-selected={active}
                    aria-controls="profile-panel"
                    tabIndex={active ? 0 : -1}
                    data-cursor="Open"
                    onClick={() => setOpen(f.key)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                        e.preventDefault();
                        const n = about.facets.length;
                        const next = (i + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
                        setOpen(about.facets[next].key);
                        document.getElementById(`tab-${about.facets[next].key}`)?.focus();
                      }
                    }}
                    className="group relative flex items-center justify-between gap-4 border-b hairline px-6 py-6 text-left last:border-b-0 md:px-8"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={`display text-[clamp(1.2rem,2.2vw,1.8rem)] leading-none transition-colors ${
                          active ? "text-accent" : "text-[var(--fg)] group-hover:text-[var(--muted)]"
                        }`}
                      >
                        {f.label}
                      </span>
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        active ? "scale-100 bg-[#FFF700]" : "scale-50 bg-[var(--line)]"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <div
              id="profile-panel"
              role="tabpanel"
              aria-labelledby={`tab-${current.key}`}
              className="relative flex min-h-[280px] items-center bg-[var(--bg)] p-8 md:p-14 lg:col-span-7"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="eyebrow mb-5 text-accent">{current.label}</p>
                  <p className="serif-italic text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15]">{current.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
