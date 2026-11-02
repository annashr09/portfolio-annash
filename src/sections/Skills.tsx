import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import SkillTree from "../components/visuals/SkillTree";

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 px-5 py-28 md:px-10 md:py-44" aria-labelledby="skills-title">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading id="skills-title" index="05" label="Skills & Expertise" lines={["TOOLS OF", "THOUGHT."]} />
        <Reveal>
          <p className="eyebrow mb-10 max-w-md leading-relaxed">
            Hover or focus a branch to trace it. Grouped by theme — not scored.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <SkillTree />
        </Reveal>
      </div>
    </section>
  );
}
