import { useEffect, useState } from "react";

/** Returns the id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    // Clear the indicator while the hero is on screen
    const hero = document.getElementById("top");
    const heroIo = hero
      ? new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting) setActive("");
          },
          { rootMargin: "-45% 0px -50% 0px" },
        )
      : null;
    if (hero) heroIo?.observe(hero);

    return () => {
      io.disconnect();
      heroIo?.disconnect();
    };
  }, [ids]);

  return active;
}
