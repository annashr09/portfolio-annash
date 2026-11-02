import { Award, Medal, Trophy } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import { achievements } from "../data/content";

const spans = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

export default function Achievements() {
  return (
    <section id="achievements" className="relative z-10 px-5 py-28 md:px-10 md:py-44" aria-labelledby="ach-title">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading id="ach-title" index="06" label="Achievements & Certifications" lines={["PROOF OF", "PRACTICE."]} />

        <ul className="grid gap-4 md:grid-cols-12 md:gap-5">
          {achievements.map((a, i) => {
            const Icon = a.type === "Certification" ? Award : i === 2 || i === 3 ? Trophy : Medal;
            return (
              <li key={a.id} className={spans[i % spans.length]}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article className="liquid-glass group relative flex h-full min-h-[280px] flex-col justify-between p-7 transition-transform duration-500 hover:-translate-y-1.5 md:p-9">
                    <span
                      aria-hidden="true"
                      className="stroke-text pointer-events-none absolute -top-2 right-4 select-none font-display text-[4.5rem] font-extrabold leading-none opacity-40 transition-opacity duration-500 group-hover:opacity-90 md:text-[5.5rem]"
                    >
                      {a.year}
                    </span>
                    <div className="relative flex items-center gap-3">
                      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                      <span className="eyebrow text-accent">{a.type}</span>
                    </div>
                    <span className="sr-only">{a.year}</span>
                    <div className="relative mt-12">
                      <h3 className="display text-[clamp(1.3rem,2.2vw,2rem)] leading-[1] normal-case">{a.title}</h3>
                      <p className="mt-3 font-serif text-lg italic text-[var(--muted)]">{a.issuer}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
