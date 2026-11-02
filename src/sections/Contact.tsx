import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, MapPin } from "lucide-react";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import Magnetic from "../components/ui/Magnetic";
import { contact, profile } from "../data/content";

/** Lucide dropped brand icons, so LinkedIn's mark is inlined. */
function LinkedinMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13c0-1.7 1-2.6 2.3-2.6S16.5 11.3 16.5 13v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback for insecure contexts / older browsers
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function Contact() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(profile.email);
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <section id="contact" className="relative z-10 overflow-hidden px-5 pt-28 md:px-10 md:pt-44" aria-labelledby="contact-title">
      {/* rotating badge */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-24 hidden h-40 w-40 md:block"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 160 160" className="h-full w-full">
          <defs>
            <path id="circ" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
          </defs>
          <text fill="var(--fg)" fontFamily="JetBrains Mono, monospace" fontSize="11">
            <textPath href="#circ" textLength="380" lengthAdjust="spacing">
              OPEN TO COLLABORATION · DATA · TECH ·
            </textPath>
          </text>
          <circle cx="80" cy="80" r="5" fill="#FFF700" />
        </svg>
      </motion.div>

      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center gap-4">
          <span className="eyebrow text-accent">07</span>
          <span className="h-px w-12 bg-[var(--line)]" aria-hidden="true" />
          <span className="eyebrow">Contact</span>
        </div>

        <h2
          id="contact-title"
          className="display text-[clamp(2.8rem,10.5vw,10.5rem)]"
          aria-label={contact.heading.join(" ")}
        >
          {contact.heading.map((l, i) => (
            <span key={l} aria-hidden="true" className="-mb-[0.08em] block overflow-hidden pb-[0.1em]">
              <motion.span
                className={`block ${i === contact.heading.length - 1 ? "text-accent" : i === 1 ? "stroke-text" : ""}`}
                initial={reduce ? false : { y: "105%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h2>

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="serif-italic text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.25]">{contact.text}</p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-[var(--line)] border-y hairline">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="Email"
                  className="group flex items-center justify-between gap-4 py-6"
                >
                  <span className="flex items-center gap-5">
                    <Mail size={20} strokeWidth={1.5} aria-hidden="true" />
                    <span>
                      <span className="eyebrow block">Email</span>
                      <span className="mt-1 block break-all text-[clamp(1.1rem,2.2vw,1.7rem)] font-medium tracking-tight transition-colors group-hover:text-accent">
                        {profile.email}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Open"
                  className="group flex items-center justify-between gap-4 py-6"
                >
                  <span className="flex items-center gap-5">
                    <LinkedinMark />
                    <span>
                      <span className="eyebrow block">LinkedIn</span>
                      <span className="mt-1 block text-[clamp(1.1rem,2.2vw,1.7rem)] font-medium tracking-tight transition-colors group-hover:text-accent">
                        annash-ragil-putra-supartono
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li className="flex items-center gap-5 py-6">
                <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
                <span>
                  <span className="eyebrow block">Location</span>
                  <span className="mt-1 block text-[clamp(1.1rem,2.2vw,1.7rem)] font-medium tracking-tight">
                    {profile.location}
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                variant="accent"
                href={`mailto:${profile.email}`}
                cursor="Write"
                icon={<ArrowUpRight size={16} strokeWidth={2} />}
              >
                Say hello
              </Button>
              <Magnetic>
                <button
                  type="button"
                  onClick={onCopy}
                  data-cursor="Copy"
                  className="liquid-glass inline-flex min-w-[190px] items-center justify-center gap-3 rounded-full px-7 py-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-transform active:scale-95"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={state}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {state === "copied" ? (
                        <>
                          <Check size={15} /> Copied
                        </>
                      ) : state === "failed" ? (
                        <>Copy failed</>
                      ) : (
                        <>
                          <Copy size={15} /> Copy email
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </Magnetic>
              <span className="sr-only" role="status" aria-live="polite">
                {state === "copied" ? "Email address copied to clipboard" : state === "failed" ? "Could not copy" : ""}
              </span>
            </div>
          </Reveal>
        </div>

        <footer className="mt-28 flex flex-col gap-4 border-t hairline py-8 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted)] md:mt-40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {profile.fullName}</p>
          <p>Mathematics · Data · Code</p>
          <a href="#top" data-cursor="Top" className="w-fit transition-colors hover:text-[var(--fg)]">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
