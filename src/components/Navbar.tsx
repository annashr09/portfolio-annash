import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { navItems } from "../data/content";
import { useTheme } from "../hooks/useTheme";

interface Props {
  active: string;
}

export default function Navbar({ active }: Props) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const themeBtn = (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      data-cursor="Theme"
      className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--glass-bg-strong)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {theme === "dark" ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-4 z-[100] flex justify-center px-4 md:top-6"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Primary"
          className="liquid-glass lg-lens flex w-full max-w-[1100px] items-center justify-between gap-2 rounded-full py-2 pl-2 pr-2"
        >
          <a
            href="#top"
            aria-label="Annash Ragil Putra Supartono — back to top"
            data-cursor="Home"
            className="flex h-10 items-center gap-2 rounded-full bg-[#FFF700] px-4 font-mono text-[0.78rem] font-medium tracking-[0.08em] text-[#090909]"
          >
            AR
            <span className="hidden h-1.5 w-1.5 rounded-full bg-[#090909] sm:block" aria-hidden="true" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative z-10 block rounded-full px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${
                      isActive ? "text-[#090909]" : "text-[var(--muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {item.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 z-0 rounded-full bg-[#FFF700]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            {themeBtn}
            <button
              ref={menuBtn}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] hover:bg-[var(--glass-bg-strong)] lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="liquid-glass fixed inset-0 z-[99] flex flex-col justify-center rounded-none bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? "location" : undefined}
                    className="display flex items-baseline gap-4 py-2 text-[clamp(2.2rem,11vw,4rem)]"
                  >
                    <span className="font-mono text-xs font-normal tracking-widest text-[var(--muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={active === item.id ? "text-accent" : ""}>{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
