"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Human Voice: animated timeline with images and tweet cards ─────────

interface HVEntry {
  date: string;
  recency: "now" | "recent" | "mid";
  title: string;
  body: string;
  tweet?: { handle: string; text: string };
  hasImg?: boolean;
}

const HV_ENTRIES: HVEntry[] = [
  {
    date: "2026.05",
    recency: "now",
    title: "launched logr. quiet, then not.",
    body: "shipped to the first 50. front page by the next morning.",
    tweet: {
      handle: "@rajkoshik",
      text: "logr is live. your whole story — for the humans who know you and the agents that don't. logr.life",
    },
  },
  {
    date: "2026.02",
    recency: "recent",
    title: "built zhentan. won the bnb openclaw hackathon.",
    body: "top project out of 600 builders. community spun up a token within hours.",
    hasImg: true,
  },
  {
    date: "2025.11",
    recency: "mid",
    title: "devconnect, buenos aires.",
    body: "spoke on on-chain identity. one person in the room later joined.",
    tweet: {
      handle: "@rajkoshik",
      text: "just spoke on on-chain identity at devconnect BA. slides: zhentan.me/devconnect",
    },
  },
];

export function HumanVoiceDemo() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let alive = true;
    if (reduced()) { setCount(HV_ENTRIES.length); return; }
    (async () => {
      while (alive) {
        for (let n = 2; n <= HV_ENTRIES.length; n++) {
          if (!alive) return;
          await wait(2000);
          setCount(n);
        }
        await wait(2800);
        if (!alive) return;
        setCount(1);
        await wait(700);
      }
    })();
    return () => { alive = false; };
  }, []);

  const shown = HV_ENTRIES.slice(0, count);

  return (
    <div className="hv-timeline">
      {shown.map((e) => (
        <div key={e.date} className={`hv-entry hv-entry--${e.recency}`}>
          <div className="hv-entry__date">{e.date}</div>
          <div className="hv-entry__title">{e.title}</div>
          <p className="hv-entry__body">{e.body}</p>
          {e.hasImg && <div className="hv-entry__img" aria-hidden="true" />}
          {e.tweet && (
            <div className="hv-tweet">
              <span className="hv-tweet__user">
                <span className="accent">{e.tweet.handle}</span>
                {" · x.com"}
              </span>
              <span className="hv-tweet__text">{e.tweet.text}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Machine Voice: live chat interface ────────────────────────────────

type Msg = { role: "user" | "ai"; text: string };

const MV_QA = [
  {
    q: "what's koshik working on?",
    a: "logr — a personal life-log for humans and AI agents. launched may 2026.",
  },
  {
    q: "has he won any hackathons?",
    a: "yes. the bnb openclaw hackathon with zhentan. 600 competitors, feb 2026.",
  },
  {
    q: "where is he based?",
    a: "bengaluru. building in crypto since 2018, security before that.",
  },
];

export function MachineVoiceChat() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"typing" | "thinking" | "idle">("idle");

  useEffect(() => {
    let alive = true;
    if (reduced()) {
      setHistory([
        { role: "user", text: MV_QA[0].q },
        { role: "ai", text: MV_QA[0].a },
      ]);
      return;
    }
    (async () => {
      let i = 0;
      while (alive) {
        const { q, a } = MV_QA[i % MV_QA.length];
        setPhase("typing"); setInput("");
        for (let c = 0; c <= q.length; c++) {
          if (!alive) return;
          setInput(q.slice(0, c));
          await wait(46);
        }
        await wait(320);
        if (!alive) return;
        setPhase("thinking"); setInput("");
        await wait(1100);
        if (!alive) return;
        setHistory((h) => [
          ...h.slice(-2),
          { role: "user", text: q },
          { role: "ai", text: a },
        ]);
        setPhase("idle");
        await wait(2600);
        i++;
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="mv-chat">
      <div className="mv-chat__messages">
        {history.map((m, i) => (
          <div key={i} className={`mv-msg mv-msg--${m.role}`}>
            <span className="mv-msg__label">{m.role === "user" ? "you" : "logr.ai"}</span>
            <div className="mv-msg__bubble">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mv-chat__input">
        <div className="mv-chat__input-box">
          {phase === "typing" && (
            <>{input}<span className="pw-compose__caret" /></>
          )}
          {phase === "thinking" && (
            <div className="pw-dots" aria-label="thinking"><span /><span /><span /></div>
          )}
        </div>
        <span className="mv-chat__send">ask →</span>
      </div>
    </div>
  );
}
