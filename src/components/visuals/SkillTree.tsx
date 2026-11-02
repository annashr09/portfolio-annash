import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { skillGroups } from "../../data/content";

const ROW = 46;
const GAP = 44;
const VW = 1000;
const ROOT_X = 70;
const HUB_X = 390;
const LEAF_X = 700;

/**
 * Left-to-right tree: root → skill groups → individual skills.
 * Purely categorical — no proficiency scores are implied.
 */
export default function SkillTree() {
  const reduce = useReducedMotion();
  const [focus, setFocus] = useState<string | null>(null);

  const layout = useMemo(() => {
    let y = ROW / 2;
    const groups = skillGroups.map((g) => {
      const leaves = g.items.map((label, i) => ({ label, y: y + i * ROW }));
      const hubY = (leaves[0].y + leaves[leaves.length - 1].y) / 2;
      y += g.items.length * ROW + GAP;
      return { ...g, leaves, hubY };
    });
    const height = y - GAP + ROW / 2;
    const rootY = (groups[0].hubY + groups[groups.length - 1].hubY) / 2;
    return { groups, height, rootY };
  }, []);

  const dim = (id: string) => (focus && focus !== id ? 0.22 : 1);
  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  };

  return (
    <>
      {/* Desktop / tablet: interactive tree */}
      <div
        className="relative hidden md:block"
        style={{ height: layout.height }}
        onMouseLeave={() => setFocus(null)}
      >
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${VW} ${layout.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {layout.groups.map((g, gi) => (
            <g key={g.id} style={{ opacity: dim(g.id), transition: "opacity .3s" }}>
              <motion.path
                d={curve(ROOT_X, layout.rootY, HUB_X, g.hubY)}
                fill="none"
                stroke={focus === g.id ? "#FFF700" : "var(--fg)"}
                strokeOpacity={focus === g.id ? 1 : 0.3}
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: gi * 0.15 }}
              />
              {g.leaves.map((l, li) => (
                <motion.path
                  key={l.label}
                  d={curve(HUB_X, g.hubY, LEAF_X, l.y)}
                  fill="none"
                  stroke={focus === g.id ? "#FFF700" : "var(--fg)"}
                  strokeOpacity={focus === g.id ? 0.9 : 0.25}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, delay: 0.4 + gi * 0.15 + li * 0.05 }}
                />
              ))}
            </g>
          ))}
        </svg>

        {/* root */}
        <div
          className="liquid-glass absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-serif text-2xl italic text-accent"
          style={{ left: `${(ROOT_X / VW) * 100}%`, top: layout.rootY }}
          aria-hidden="true"
        >
          Σ
        </div>

        {layout.groups.map((g) => (
          <div key={g.id}>
            <button
              type="button"
              onMouseEnter={() => setFocus(g.id)}
              onFocus={() => setFocus(g.id)}
              onBlur={() => setFocus(null)}
              onClick={() => setFocus((f) => (f === g.id ? null : g.id))}
              aria-pressed={focus === g.id}
              data-cursor="Focus"
              className={`liquid-glass absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-5 py-3 text-left transition-opacity duration-300 ${
                focus === g.id ? "ring-1 ring-[#FFF700]" : ""
              }`}
              style={{ left: `${(HUB_X / VW) * 100}%`, top: g.hubY, opacity: dim(g.id) }}
            >
              <span className="block font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em]">
                {g.label}
              </span>
              <span className="mt-0.5 block font-serif text-sm italic text-[var(--muted)]">{g.caption}</span>
            </button>

            <ul style={{ opacity: dim(g.id), transition: "opacity .3s" }}>
              {g.leaves.map((l) => (
                <li
                  key={l.label}
                  onMouseEnter={() => setFocus(g.id)}
                  className="absolute flex -translate-y-1/2 items-center gap-4"
                  style={{ left: `${(LEAF_X / VW) * 100}%`, top: l.y }}
                >
                  <span
                    className={`-ml-1.5 h-3 w-3 shrink-0 rounded-full border transition-colors ${
                      focus === g.id ? "border-[#FFF700] bg-[#FFF700]" : "border-[var(--fg)] bg-[var(--bg)]"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-lg font-medium tracking-tight md:text-xl">{l.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile: grouped lists */}
      <div className="space-y-10 md:hidden">
        {skillGroups.map((g) => (
          <div key={g.id}>
            <p className="eyebrow mb-1 text-accent">{g.label}</p>
            <p className="mb-4 font-serif text-lg italic text-[var(--muted)]">{g.caption}</p>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <li
                  key={it}
                  className="liquid-glass rounded-full px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.12em]"
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
