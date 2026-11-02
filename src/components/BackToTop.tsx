import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          data-cursor="Top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="liquid-glass fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full text-[var(--fg)] md:bottom-8 md:right-8"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <ArrowUp size={20} strokeWidth={1.75} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
