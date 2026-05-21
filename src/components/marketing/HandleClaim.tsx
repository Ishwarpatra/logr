"use client";

import { useState } from "react";

/** Cosmetic handle-claim field (signup isn't wired yet) — mirrors the
 *  landing prototype: type a handle, "claim" reserves it visually. */
export function HandleClaim({ id, autoFocus }: { id: string; autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const [claimed, setClaimed] = useState(false);

  function claim() {
    const v = value.trim().toLowerCase().replace(/[^a-z0-9\-_]/g, "");
    if (!v) return;
    setValue(v);
    setClaimed(true);
  }

  return (
    <>
      <label className="handle-input" htmlFor={id}>
        <span className="handle-input__prefix">logr.life<span className="accent">/</span></span>
        <input
          id={id}
          type="text"
          placeholder="yourname"
          spellCheck={false}
          autoComplete="off"
          maxLength={24}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => { setValue(e.target.value); setClaimed(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); claim(); } }}
        />
      </label>
      <button type="button" className="hero__claim" onClick={claim} disabled={claimed}>
        {claimed ? `logr.life/${value} reserved →` : "claim →"}
      </button>
    </>
  );
}
