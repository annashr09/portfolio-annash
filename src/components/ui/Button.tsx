import type { ReactNode } from "react";
import Magnetic from "./Magnetic";

interface Props {
  children: ReactNode;
  variant?: "accent" | "glass";
  href?: string;
  onClick?: () => void;
  download?: boolean;
  external?: boolean;
  icon?: ReactNode;
  cursor?: string;
  magnetic?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Liquid-glass pill button. Renders <a> when `href` is given, otherwise <button>. */
export default function Button({
  children,
  variant = "glass",
  href,
  onClick,
  download,
  external,
  icon,
  cursor,
  magnetic = true,
  className = "",
  ariaLabel,
}: Props) {
  const cls = `liquid-glass ${variant === "accent" ? "liquid-glass-accent" : "text-[var(--fg)]"} group inline-flex items-center gap-3 rounded-full px-7 py-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-transform duration-300 active:scale-95 ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </>
  );

  const el = href ? (
    <a
      href={href}
      className={cls}
      data-cursor={cursor}
      aria-label={ariaLabel}
      download={download ? true : undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={cls}
      data-cursor={cursor}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
