"use client";
/* typewriter loop; setState inside the timed loop is intentional */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Types `text` out, holds, backspaces, and loops — with a blinking caret.
 *  A hidden ghost reserves the full width so the layout never jiggles.
 *  Honors prefers-reduced-motion (shows the full text, no animation). */
export function TypingLabel({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let alive = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }
    (async () => {
      while (alive) {
        for (let i = 1; i <= text.length; i++) { if (!alive) return; setShown(text.slice(0, i)); await wait(85); }
        await wait(1700);
        for (let i = text.length - 1; i >= 0; i--) { if (!alive) return; setShown(text.slice(0, i)); await wait(38); }
        await wait(500);
      }
    })();
    return () => { alive = false; };
  }, [text]);

  return (
    <span className="type">
      <span className="type__ghost" aria-hidden="true">{text}</span>
      <span className="type__live" aria-hidden="true">{shown}<span className="type__caret" /></span>
    </span>
  );
}
