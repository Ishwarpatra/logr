"use client";

import { useState, useRef, useEffect } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const parseISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Mode = "days" | "months" | "years";

/** Brand-styled date picker — calendar with quick month/year selection. */
export function DatePicker({
  value,
  onChange,
  placeholder = "pick a date",
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("days");
  const [view, setView] = useState(() => (value ? parseISO(value) : new Date()));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const sel = value ? parseISO(value) : null;
  const y = view.getFullYear();
  const m = view.getMonth();
  const today = new Date();
  const setMonthYear = (yy: number, mm: number) => setView(new Date(yy, mm, 1));

  // day cells for the current month
  const startDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const same = (a: Date | null, d: number) => !!a && a.getFullYear() === y && a.getMonth() === m && a.getDate() === d;

  const yearBase = Math.floor(y / 12) * 12;
  const label = sel ? `${MONTHS_SHORT[sel.getMonth()]} ${sel.getDate()}, ${sel.getFullYear()}` : placeholder;

  return (
    <div className="dp" ref={ref}>
      <button type="button" className="dp__trigger" aria-haspopup="dialog" aria-expanded={open} onClick={() => { setMode("days"); setOpen((o) => !o); }}>
        <svg className="dp__icon" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
          <line x1="2.5" y1="6.5" x2="13.5" y2="6.5" /><line x1="5.5" y1="2" x2="5.5" y2="4" /><line x1="10.5" y1="2" x2="10.5" y2="4" />
        </svg>
        <span className={`dp__value${sel ? "" : " dp__value--ph"}`}>{label}</span>
      </button>

      {open && (
        <div className="dp__pop" role="dialog" aria-label="choose a date">
          {mode === "days" && (
            <>
              <div className="dp__head">
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y - 1, m)} aria-label="previous year">«</button>
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y, m - 1)} aria-label="previous month">‹</button>
                <button type="button" className="dp__title" onClick={() => setMode("months")}>{MONTHS[m]} {y}</button>
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y, m + 1)} aria-label="next month">›</button>
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y + 1, m)} aria-label="next year">»</button>
              </div>
              <div className="dp__wds">{WEEKDAYS.map((w, i) => <span key={i} className="dp__wd">{w}</span>)}</div>
              <div className="dp__grid">
                {cells.map((d, i) =>
                  d === null ? <span key={i} className="dp__pad" /> : (
                    <button
                      key={i}
                      type="button"
                      className={`dp__day${same(sel, d) ? " is-sel" : ""}${same(today, d) ? " is-today" : ""}`}
                      onClick={() => { onChange(toISO(new Date(y, m, d))); setOpen(false); }}
                    >
                      {d}
                    </button>
                  )
                )}
              </div>
            </>
          )}

          {mode === "months" && (
            <>
              <div className="dp__head">
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y - 1, m)} aria-label="previous year">‹</button>
                <button type="button" className="dp__title" onClick={() => setMode("years")}>{y}</button>
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y + 1, m)} aria-label="next year">›</button>
              </div>
              <div className="dp__cells">
                {MONTHS_SHORT.map((mn, i) => (
                  <button key={i} type="button" className={`dp__cell${i === m ? " is-sel" : ""}`} onClick={() => { setMonthYear(y, i); setMode("days"); }}>{mn}</button>
                ))}
              </div>
            </>
          )}

          {mode === "years" && (
            <>
              <div className="dp__head">
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y - 12, m)} aria-label="earlier years">‹</button>
                <span className="dp__title dp__title--static">{yearBase}–{yearBase + 11}</span>
                <button type="button" className="dp__nav" onClick={() => setMonthYear(y + 12, m)} aria-label="later years">›</button>
              </div>
              <div className="dp__cells">
                {Array.from({ length: 12 }, (_, i) => yearBase + i).map((yr) => (
                  <button key={yr} type="button" className={`dp__cell${yr === y ? " is-sel" : ""}`} onClick={() => { setMonthYear(yr, m); setMode("months"); }}>{yr}</button>
                ))}
              </div>
            </>
          )}

          <div className="dp__foot">
            <button type="button" onClick={() => { const t = new Date(); setMonthYear(t.getFullYear(), t.getMonth()); onChange(toISO(t)); setOpen(false); }}>today</button>
            {value && <button type="button" onClick={() => { onChange(null); setOpen(false); }}>clear</button>}
          </div>
        </div>
      )}
    </div>
  );
}
