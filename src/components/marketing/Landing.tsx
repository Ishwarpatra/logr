import Link from "next/link";
import { HandleClaim } from "./HandleClaim";
import { Mark } from "@/components/Mark";

// The logr marketing landing. Static brand copy; koshik is the example logr.
export function Landing() {
  return (
    <div className="mkt">
      <div className="page">
        {/* bar */}
        <header className="bar">
          <Link className="bar__brand" href="/" aria-label="logr"><Mark />logr</Link>
          <nav className="bar__util" aria-label="utilities">
            <Link href="/koshik">see one</Link>
            <Link href="/admin">dashboard</Link>
            <a className="cta" href="#claim">claim a handle</a>
          </nav>
        </header>

        {/* hello */}
        <section className="hello" aria-label="a note from the maker">
          <Link className="hello__avatar" href="/koshik" aria-label="koshik's logr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/koshik-avatar.webp" alt="koshik" width="96" height="96" />
          </Link>
          <p className="hello__copy">
            <span className="hi">hi, i&apos;m <Link href="/koshik">koshik</Link>.</span>{" "}
            i made logr because the resume i had didn&apos;t fit the life i was living. this is a notebook for the rest of it — mine, yours, the next ten years.
          </p>
        </section>

        {/* hero */}
        <section className="hero">
          <h1 className="hero__wordmark" aria-label="logr">logr<span className="hero__caret" aria-hidden="true" /></h1>
          <p className="hero__lede">log your life. read by humans, ingested by machines.</p>
          <p className="hero__sub">
            write events from your life — work, moves, mundane tuesdays — once. it becomes a readable timeline for visitors and an exportable{" "}
            <span style={{ color: "var(--user-accent)" }}>llm.txt</span> any ai tool can ingest. one timeline. two readers.
          </p>
          <div className="hero__cta">
            <HandleClaim id="handle-hero" />
            <span className="hero__or">or</span>
            <Link className="hero__see" href="/koshik">see one in motion · logr.life/koshik →</Link>
          </div>
        </section>

        {/* 01 dual reader */}
        <section className="section">
          <div className="section__head">
            <div className="section__num">01 — the duality</div>
            <div>
              <h2 className="section__title">one entry<span className="colon">.</span> two readings<span className="colon">.</span></h2>
              <p className="section__sub">you write it once. it lives as prose for the people who know you, and as structured context for the agents who don&apos;t.</p>
            </div>
          </div>
          <div className="dual">
            <div className="dual__col">
              <div className="dual__head"><span>the human voice</span><span className="accent">serif</span></div>
              <div className="dual__entry">
                <div className="dual__entry__date">2026.02</div>
                <h3 className="dual__entry__title">built zhentan. won the bnb openclaw hackathon.</h3>
                <p className="dual__entry__body">top project out of 600 builders. the community spun up a token within hours; it hit a $250k market cap and crossed 150 users in week one. felt good.</p>
              </div>
              <div className="dual__legend"><div>read at the speed of a sentence.</div><div>noticed by a person who knows you.</div></div>
            </div>
            <div className="dual__col">
              <div className="dual__head"><span>the machine voice</span><span className="accent">llm.txt</span></div>
              <pre className="dual__ai"><span className="hash">## 2026.02 · milestone</span>{"\n"}
<span className="k">event:</span>       <span className="v">won bnb openclaw hackathon</span>{"\n"}
<span className="k">project:</span>     <span className="v">zhentan</span>{"\n"}
<span className="k">role:</span>        <span className="v">builder</span>{"\n"}
<span className="k">competitors:</span> <span className="v">600</span>{"\n"}
<span className="k">outcome:</span>     <span className="accent">top project</span>{"\n"}
<span className="k">traction:</span>    <span className="v">$250k market cap; 150 users wk one</span>{"\n"}
<span className="k">url:</span>         <span className="v">zhentan.me</span>{"\n"}
<span className="k">tags:</span>        <span className="v">crypto, hackathon, bnb</span></pre>
              <div className="dual__legend"><div>read at the speed of a token.</div><div>ingested as context by an agent.</div></div>
            </div>
          </div>
        </section>

        {/* 02 flow */}
        <section className="section">
          <div className="section__head">
            <div className="section__num">02 — how it works</div>
            <div>
              <h2 className="section__title">four steps<span className="colon">.</span> the fourth never ends<span className="colon">.</span></h2>
              <p className="section__sub">no wizard. write a sentence, hit save, walk away.</p>
            </div>
          </div>
          <div className="flow">
            <div className="step">
              <div className="step__num">01</div>
              <div className="step__copy">
                <h3 className="step__title">claim a handle.</h3>
                <p className="step__body">your handle is your address. <span style={{ color: "var(--user-accent)" }}>logr.life/koshik</span> — the page, the llm.txt, eventually the chat endpoint. one handle, one life.</p>
              </div>
              <div className="step__demo">
                <div className="preview-window">
                  <div className="preview-window__bar"><span className="preview-window__dots"><span /><span /><span /></span><span className="url">logr.life<span className="accent">/</span>claim</span></div>
                  <div className="preview-window__body">
                    <div className="pw-handle"><span className="prefix">logr.life<span className="accent">/</span></span><span className="name">koshik</span></div>
                    <div className="pw-row"><span className="pill">available</span><span>· <span className="accent">free</span> forever</span></div>
                    <div className="pw-cta"><span className="pw-cta__btn">claim →</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step__num">02</div>
              <div className="step__copy">
                <h3 className="step__title">add an entry.</h3>
                <p className="step__body">a date and a sentence. that&apos;s the whole format. add a link or a photo if you want. don&apos;t if you don&apos;t.</p>
              </div>
              <div className="step__demo">
                <div className="preview-window">
                  <div className="preview-window__bar"><span className="preview-window__dots"><span /><span /><span /></span><span className="url">logr.life<span className="accent">/</span>koshik<span className="accent">/</span>new</span></div>
                  <div className="preview-window__body">
                    <div className="pw-compose">
                      <div className="pw-compose__line"><span className="pw-compose__date">2026.05.21</span><span className="pw-compose__colon">:</span><span className="pw-compose__text">started logr<span className="pw-compose__caret" /></span></div>
                      <div className="pw-compose__meta"><span>tag · <span className="accent">milestone</span></span><span>1 link · 0 photos</span></div>
                      <div className="pw-compose__hint"><span><kbd>⌘</kbd> <kbd>↵</kbd> save</span><span><kbd>esc</kbd> close</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step__num">03</div>
              <div className="step__copy">
                <h3 className="step__title">it becomes three things.</h3>
                <p className="step__body">your timeline updates. your llm.txt regenerates. and one day, your chat endpoint learns the new entry.</p>
              </div>
              <div className="step__demo">
                <div className="pw-triplet">
                  <div className="pw-mini pw-mini--timeline">
                    <div className="pw-mini__bar"><span className="accent">/</span>koshik</div>
                    <div className="pw-mini__body">
                      <div className="pw-mini-entry pw-mini-entry--now"><span className="pw-mini-entry__date">2026.05</span>started logr.</div>
                      <div className="pw-mini-entry"><span className="pw-mini-entry__date">2026.04</span>built sage.</div>
                      <div className="pw-mini-entry"><span className="pw-mini-entry__date">2026.02</span>zhentan.</div>
                    </div>
                  </div>
                  <div className="pw-mini pw-mini--llm">
                    <div className="pw-mini__bar"><span className="accent">/</span>koshik<span className="accent">/</span>llm.txt</div>
                    <div className="pw-mini__body">
                      <pre><span className="k">now:</span> <span className="accent">building sage</span>{"\n"}<span className="k">2026.05</span> started logr{"\n"}<span className="k">2026.04</span> sage on solana{"\n"}<span className="k">2026.02</span> won zhentan</pre>
                    </div>
                  </div>
                  <div className="pw-mini pw-mini--ask">
                    <div className="pw-mini__bar"><span className="accent">/</span>koshik<span className="accent">/</span>ask</div>
                    <div className="pw-mini__body">
                      <div className="q">what&apos;s koshik working on?</div>
                      <div className="a">sage. an ai co-signer for solana. live on mainnet.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step__num">04</div>
              <div className="step__copy">
                <h3 className="step__title">keep going.</h3>
                <p className="step__body">one entry a year. one a week. one on a tuesday because the bread was good. a life is never done. logr is never sealed.</p>
              </div>
              <div className="step__demo">
                <div className="preview-window">
                  <div className="preview-window__bar"><span className="preview-window__dots"><span /><span /><span /></span><span className="url">logr.life<span className="accent">/</span>koshik</span></div>
                  <div className="preview-window__body">
                    <div className="pw-timeline">
                      <div className="pw-timeline-entry pw-timeline-entry--now"><div className="pw-timeline-entry__date">2026.05</div><div className="pw-timeline-entry__title">started logr.</div></div>
                      <div className="pw-timeline-entry pw-timeline-entry--recent"><div className="pw-timeline-entry__date">2026.04</div><div className="pw-timeline-entry__title">built sage on solana.</div></div>
                      <div className="pw-timeline-entry"><div className="pw-timeline-entry__date">2019.01</div><div className="pw-timeline-entry__title">founded consenso labs.</div></div>
                      <div className="pw-timeline-more">— ⋯ all the way back to 2014 ⋯ —</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 preview */}
        <section className="section">
          <div className="section__head">
            <div className="section__num">03 — see one</div>
            <div>
              <h2 className="section__title">a logr in motion<span className="colon">.</span></h2>
              <p className="section__sub">koshik&apos;s been keeping his since 2014, retroactively. start today, go back as far as you remember.</p>
            </div>
          </div>
          <Link className="preview" href="/koshik" aria-label="visit koshik's logr">
            <div className="preview__copy">
              <span className="preview__handle">logr.life<span className="accent">/</span>koshik</span>
              <span className="preview__name">koshik raj<span className="colon">:</span></span>
              <p className="preview__bio">a builder. in crypto since 2018, in security since before that. mostly: a quiet bet that this would matter.</p>
              <span className="preview__link">read the full log →</span>
            </div>
            <div className="preview__feed">
              {[
                ["now", "2026.05", "started logr."],
                ["recent", "2026.04", "built sage on solana."],
                ["recent", "2025.11", "devconnect argentina."],
                ["past", "2019.01", "founded consenso labs."],
                ["past", "2014", "mtech, manipal."],
              ].map(([k, d, t]) => (
                <div key={d} className={`preview-entry preview-entry--${k}`}>
                  <span className="preview-entry__dot" aria-hidden="true" />
                  <div className="preview-entry__date">{d}</div>
                  <div className="preview-entry__title">{t}</div>
                </div>
              ))}
            </div>
          </Link>
        </section>

        {/* closing */}
        <section className="closing" id="claim">
          <h2 className="closing__h">log your life<span className="colon">.</span></h2>
          <p className="closing__sub">it takes about ninety seconds to write the first one. the next one waits until you have something to say.</p>
          <div className="closing__form">
            <HandleClaim id="handle-claim" />
          </div>
          <p className="closing__note">free forever for personal logs · early access · no email yet, just your handle</p>
        </section>

        {/* footer */}
        <footer className="foot">
          <div className="foot__grid">
            <div className="foot__brand">
              <span className="foot__wm"><Mark />logr</span>
              <span className="foot__tag">a personal life-log, built for humans and the machines they raise.</span>
            </div>
            <nav className="foot__col" aria-label="product">
              <h4>product</h4>
              <a href="#claim">claim a handle</a>
              <Link href="/koshik">see an example</Link>
              <Link href="/admin">dashboard</Link>
            </nav>
            <nav className="foot__col" aria-label="brand">
              <h4>brand</h4>
              <a href="/koshik/llm.txt">llm.txt format</a>
              <Link href="/koshik#colophon">colophon</Link>
            </nav>
            <nav className="foot__col" aria-label="elsewhere">
              <h4>elsewhere</h4>
              <a href="https://x.com/rajkoshik" target="_blank" rel="noopener noreferrer">x</a>
              <a href="https://github.com/koshikraj" target="_blank" rel="noopener noreferrer">github</a>
              <a href="mailto:hi@logr.life">contact</a>
            </nav>
          </div>
          <div className="foot__bottom">
            <span className="brand"><Mark />logr &nbsp;— log your life.</span>
            <span>built in bengaluru <span className="accent">·</span> 2026</span>
            <span><Link href="/koshik">→ view koshik&apos;s logr</Link></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
