import { motion, useReducedMotion } from "framer-motion";

interface Props {
  index: string;
  label: string;
  lines: readonly string[];
  /** Render the last line in the accent colour. */
  accentLast?: boolean;
  id?: string;
}

export default function SectionHeading({ index, label, lines, accentLast = true, id }: Props) {
  const reduce = useReducedMotion();
  return (
    <header className="mb-14 md:mb-24">
      <div className="mb-8 flex items-center gap-4">
        <span className="eyebrow text-accent">{index}</span>
        <span className="h-px w-12 bg-[var(--line)]" aria-hidden="true" />
        <span className="eyebrow">{label}</span>
      </div>
      <h2
        id={id}
        className="display text-[clamp(2.8rem,9.5vw,9rem)]"
        aria-label={lines.join(" ")}
      >
        {lines.map((line, i) => (
          <span
            key={line}
            aria-hidden="true"
            className="-mb-[0.08em] block overflow-hidden pb-[0.1em]"
          >
            <motion.span
              className={`block ${accentLast && i === lines.length - 1 ? "text-accent" : ""}`}
              initial={reduce ? false : { y: "105%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
    </header>
  );
}
