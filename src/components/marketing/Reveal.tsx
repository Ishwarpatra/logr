"use client";

import { useEffect } from "react";

/** Reveals any `[data-reveal]` element inside .mkt as it scrolls into view
 *  (adds .is-revealed). No DOM wrappers; CSS does the fade/rise. Honors
 *  prefers-reduced-motion by revealing everything immediately. */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".mkt [data-reveal]"));
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
