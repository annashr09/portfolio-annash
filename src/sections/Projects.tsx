import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Clock, X } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import ProjectVisual from "../components/visuals/ProjectVisual";
import { projects, type ProjectItem } from "../data/content";

function ProjectCard({
  project,
  onOpen,
}: {
  project: ProjectItem;
  onOpen: (p: ProjectItem, el: HTMLElement) => void;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 160, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <button
      type="button"
      onClick={(e) => onOpen(project, e.currentTarget)}
      onPointerMove={onMove}
      onPointerLeave={reset}
      data-cursor="View"
      aria-haspopup="dialog"
      className="group block w-full text-left"
    >
      <motion.span
        className="relative block aspect-[4/3] overflow-hidden border hairline bg-[#171717]"
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      >
        <span className="block h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]">
          <ProjectVisual kind={project.visual} />
        </span>
        <span className="liquid-glass absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.16em] text-[#F5F5F0]">
          {project.index}
        </span>
        <span className="liquid-glass absolute bottom-4 right-4 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full text-[#F5F5F0] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </motion.span>

      <span className="mt-6 block">
        <span className="eyebrow mb-3 block">{project.category}</span>
        <span className="display block text-[clamp(1.5rem,3vw,2.5rem)] leading-[0.98] transition-colors group-hover:text-accent">
          {project.title}
        </span>
        <span className="mt-4 block max-w-lg text-base leading-relaxed text-[var(--muted)]">
          {project.description}
        </span>
      </span>
    </button>
  );
}

function ProjectModal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="liquid-glass lg-lens grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] md:grid-cols-2"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="aspect-[4/3] bg-[#171717] md:aspect-auto md:min-h-[420px]">
          <ProjectVisual kind={project.visual} fit="meet" />
        </div>
        <div className="relative flex flex-col p-7 md:p-10">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            data-cursor="Close"
            className="liquid-glass absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full"
          >
            <X size={18} />
          </button>
          <p className="eyebrow mb-4 pr-14 text-accent">
            {project.index} — {project.category}
          </p>
          <h3 id="project-modal-title" className="display text-[clamp(1.6rem,3vw,2.6rem)] leading-[0.98]">
            {project.title}
          </h3>
          <p className="mt-6 text-base leading-relaxed text-[var(--muted)] md:text-lg">{project.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border hairline px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em]"
              >
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            {project.link ? (
              <Button
                variant="accent"
                href={project.link}
                external
                cursor="Open"
                icon={<ArrowUpRight size={16} />}
              >
                {project.linkLabel}
              </Button>
            ) : (
              <p className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                <Clock size={15} aria-hidden="true" />
                {project.linkLabel} link coming soon
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const open = (p: ProjectItem, el: HTMLElement) => {
    trigger.current = el;
    setSelected(p);
  };
  const close = () => {
    setSelected(null);
    // return focus to the card that opened the dialog
    setTimeout(() => trigger.current?.focus(), 0);
  };

  // asymmetric 12-col placement per card
  const layout = [
    "md:col-span-7",
    "md:col-span-5 md:mt-40",
    "md:col-span-5 md:-mt-16",
    "md:col-span-7 md:mt-16",
  ];

  return (
    <section id="projects" className="relative z-10 px-5 py-28 md:px-10 md:py-44" aria-labelledby="projects-title">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading id="projects-title" index="03" label="Projects & Technical Work" lines={["SELECTED", "WORK."]} />

        <div className="grid gap-x-10 gap-y-20 md:grid-cols-12">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.1} className={layout[i % layout.length]}>
              <ProjectCard project={p} onOpen={open} />
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal key={selected.id} project={selected} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
