"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaItem } from "@/lib/profile";

const withAutoplay = (url: string) => `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;

const imgVariants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -28 : 28 }),
};

/** Full-screen viewer for one event's media (photos + videos), with prev/next
 *  navigation (buttons + arrow keys) and Escape/backdrop to close. */
export function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: MediaItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const count = items.length;
  const [[index, dir], setState] = useState<[number, number]>([startIndex, 0]);

  const go = useCallback(
    (d: number) => setState(([i]) => [(i + d + count) % count, d]),
    [count]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence initial={false} custom={dir} mode="wait">
        {items[index].kind === "video" ? (
          <motion.div
            key={index}
            className="lightbox__video"
            custom={dir}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <iframe
              src={withAutoplay(items[index].url)}
              title="video"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
            />
          </motion.div>
        ) : (
          <motion.img
            key={index}
            src={items[index].url}
            alt=""
            className="lightbox__img"
            custom={dir}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            className="lightbox__btn lightbox__nav lightbox__nav--prev"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="lightbox__btn lightbox__nav lightbox__nav--next"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="lightbox__count">
            {index + 1} / {count}
          </div>
        </>
      )}
    </motion.div>,
    document.body
  );
}
