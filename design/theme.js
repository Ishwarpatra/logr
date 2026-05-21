// =====================================================================
// logr — shared theme runtime
// drop-in <script src="theme.js" defer></script>
// reads one localStorage key (logr-palette), applies a full palette,
// renders a small floating picker.
// =====================================================================

(function () {
  'use strict';

  // ------------------------------ palettes ------------------------------
  // each palette is a full token set — paper/ink/accent/muted/faint/rule.
  // muted = ink lightened toward paper; rule = ink alpha. derived for consistency.
  const PALETTES = {
    paper:    { name: 'paper',    note: 'brand default',  paper: '#FAF8F3', ink: '#1A1A1A', accent: '#D85A30', muted: '#6B6862', faint: '#95918A', dark: false },
    sepia:    { name: 'sepia',    note: 'warmer paper',   paper: '#F4EBD9', ink: '#2A1F12', accent: '#C24A20', muted: '#7A6A52', faint: '#A89A82', dark: false },
    arctic:   { name: 'arctic',   note: 'cool white',     paper: '#FAFAFA', ink: '#111111', accent: '#2D4CF5', muted: '#6F6F6F', faint: '#A5A5A5', dark: false },
    mono:     { name: 'mono',     note: 'no colour',      paper: '#FAFAF9', ink: '#0D0D0C', accent: '#0D0D0C', muted: '#7A7A76', faint: '#A8A8A4', dark: false },
    citrus:   { name: 'citrus',   note: 'warm bright',    paper: '#FEF9EC', ink: '#1C1A12', accent: '#D8631F', muted: '#7A755E', faint: '#A8A48A', dark: false },
    forest:   { name: 'forest',   note: 'sage',           paper: '#EEF1EA', ink: '#15201A', accent: '#3E6B4A', muted: '#5A6957', faint: '#8B9787', dark: false },
    ocean:    { name: 'ocean',    note: 'deep blue',      paper: '#EEF4F7', ink: '#0E1D2A', accent: '#1A73C4', muted: '#5B7286', faint: '#8FA2B3', dark: false },
    lavender: { name: 'lavender', note: 'iris',           paper: '#F5F2FB', ink: '#1F1530', accent: '#7A4EE0', muted: '#7A6E95', faint: '#A89DC0', dark: false },
    ink:      { name: 'ink',      note: 'dark',           paper: '#1A1814', ink: '#F2EFE8', accent: '#D85A30', muted: '#8E8A82', faint: '#5F5C56', dark: true  },
  };

  // ------------------------------ layouts -----------------------------
  // each layout reshapes the timeline without changing the brand system.
  const LAYOUTS = {
    timeline: { name: 'timeline', note: 'rail + dots (default)' },
    journal:  { name: 'journal',  note: 'date in the margin' },
    magazine: { name: 'magazine', note: 'editorial, image-led' },
    terminal: { name: 'terminal', note: 'mono, ascii rail' },
  };

  const DEFAULT = 'paper';
  const DEFAULT_LAYOUT = 'timeline';
  const LS_KEY    = 'logr-palette';
  const LS_LAYOUT = 'logr-layout';
  const LEGACY_THEME_KEY = 'logr-theme';
  const LEGACY_MODE_KEY  = 'logr-mode';

  const root = document.documentElement;

  // ------------------------------ apply -------------------------------
  function readLS(key, fallback) {
    try { return localStorage.getItem(key) || fallback; }
    catch (e) { return fallback; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, val); }
    catch (e) {}
  }

  function hexAlpha(hex, alpha) {
    const m = hex.replace('#','').match(/.{2}/g);
    if (!m) return hex;
    const [r,g,b] = m.map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function applyPalette(name) {
    const p = PALETTES[name] || PALETTES[DEFAULT];
    root.style.setProperty('--paper',         p.paper);
    root.style.setProperty('--ink',           p.ink);
    root.style.setProperty('--accent',        p.accent);
    root.style.setProperty('--user-accent',   p.accent);
    root.style.setProperty('--muted',         p.muted);
    root.style.setProperty('--faint',         p.faint);
    root.style.setProperty('--rule',          hexAlpha(p.ink, 0.12));
    root.style.setProperty('--rule-strong',   hexAlpha(p.ink, 0.28));
    root.dataset.palette = p.name;
    root.dataset.mode    = p.dark ? 'dark' : 'light';
    writeLS(LS_KEY, p.name);
    syncPicker();
  }

  function applyLayout(name) {
    if (!LAYOUTS[name]) name = DEFAULT_LAYOUT;
    root.dataset.layout = name;
    writeLS(LS_LAYOUT, name);
    syncPicker();
  }

  // ------------------------------ layout icons -----------------------
  function layoutIconSvg(name) {
    const c = 'currentColor';
    switch (name) {
      case 'timeline':
        return '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="'+c+'" stroke-width="1">'
             + '<line x1="5" y1="3" x2="5" y2="17"/>'
             + '<circle cx="5" cy="6" r="1.8" fill="'+c+'"/>'
             + '<circle cx="5" cy="11" r="1.3" fill="'+c+'"/>'
             + '<circle cx="5" cy="15" r="0.9" fill="'+c+'"/>'
             + '<line x1="9" y1="6" x2="17" y2="6"/>'
             + '<line x1="9" y1="11" x2="15" y2="11"/>'
             + '<line x1="9" y1="15" x2="14" y2="15"/>'
             + '</svg>';
      case 'journal':
        return '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="'+c+'" stroke-width="1">'
             + '<line x1="2" y1="5" x2="5" y2="5"/>'
             + '<line x1="7" y1="5" x2="17" y2="5"/>'
             + '<line x1="7" y1="7.5" x2="15" y2="7.5"/>'
             + '<line x1="2" y1="11" x2="5" y2="11"/>'
             + '<line x1="7" y1="11" x2="17" y2="11"/>'
             + '<line x1="7" y1="13.5" x2="14" y2="13.5"/>'
             + '<line x1="2" y1="17" x2="5" y2="17"/>'
             + '<line x1="7" y1="17" x2="16" y2="17"/>'
             + '</svg>';
      case 'magazine':
        return '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="'+c+'" stroke-width="1">'
             + '<rect x="3" y="3" width="14" height="7" fill="'+c+'" stroke="none"/>'
             + '<line x1="3" y1="12.5" x2="17" y2="12.5" stroke-width="1.5"/>'
             + '<line x1="3" y1="15" x2="15" y2="15"/>'
             + '<line x1="3" y1="17" x2="13" y2="17"/>'
             + '</svg>';
      case 'terminal':
        return '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="'+c+'" stroke-width="1">'
             + '<rect x="2.5" y="3.5" width="15" height="13" stroke-dasharray="1 1"/>'
             + '<text x="5" y="9" font-family="monospace" font-size="4" fill="'+c+'" stroke="none">&gt;_</text>'
             + '<line x1="5" y1="12" x2="15" y2="12"/>'
             + '<line x1="5" y1="14" x2="12" y2="14"/>'
             + '</svg>';
      default: return '';
    }
  }

  // ------------------------------ picker ------------------------------
  let picker = null;
  let panelOpen = false;

  function buildPicker() {
    picker = document.createElement('div');
    picker.className = 'logr-theme-picker';
    picker.innerHTML = `
      <button type="button" class="lt-trigger" aria-label="theme" aria-expanded="false" title="palette & layout">
        <span class="lt-trigger__d-top"></span>
        <span class="lt-trigger__d-bot"></span>
      </button>
      <div class="lt-panel" role="dialog" aria-label="choose a palette" hidden>
        <div class="lt-section-label">
          <span>palette</span>
          <span class="lt-current" id="lt-current">paper</span>
        </div>
        <div class="lt-swatches">
          ${Object.values(PALETTES).map(p => `
            <button type="button" class="lt-sw" data-palette="${p.name}" aria-label="${p.name}" title="${p.name} — ${p.note}">
              <span class="lt-sw__chip" style="background:${p.paper}">
                <span class="lt-sw__chip__ink"  style="background:${p.ink}"></span>
                <span class="lt-sw__chip__acc"  style="background:${p.accent}"></span>
              </span>
              <span class="lt-sw__name">${p.name}</span>
            </button>
          `).join('')}
        </div>
        <div class="lt-section-label lt-section-label--top">
          <span>layout</span>
          <span class="lt-current" id="lt-current-layout">timeline</span>
        </div>
        <div class="lt-layouts">
          ${Object.values(LAYOUTS).map(l => `
            <button type="button" class="lt-lo" data-layout="${l.name}" title="${l.note}">
              <span class="lt-lo__icon" data-icon="${l.name}" aria-hidden="true">${layoutIconSvg(l.name)}</span>
              <span class="lt-lo__name">${l.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(picker);

    const css = document.createElement('style');
    css.textContent = `
      .logr-theme-picker {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 100;
        font-family: "JetBrains Mono", ui-monospace, monospace;
      }
      .lt-trigger {
        width: 40px; height: 40px;
        background: var(--paper);
        color: var(--ink);
        border: 0.5px solid var(--rule-strong, var(--rule));
        border-radius: 50%;
        cursor: pointer;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        transition: transform 200ms ease, background-color 200ms ease, border-color 200ms ease;
      }
      .lt-trigger:hover { transform: translateY(-1px); border-color: var(--ink); }
      .lt-trigger__d-top, .lt-trigger__d-bot {
        display: block; border-radius: 50%;
      }
      .lt-trigger__d-top { width: 10px; height: 10px; background: var(--user-accent); }
      .lt-trigger__d-bot { width: 5px;  height: 5px;  background: var(--ink); }

      .lt-panel {
        position: absolute;
        bottom: calc(100% + 10px);
        right: 0;
        width: 296px;
        background: var(--paper);
        border: 0.5px solid var(--rule-strong, var(--rule));
        padding: 14px 14px 10px;
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 11px;
        color: var(--ink);
        animation: lt-in 160ms ease;
      }
      @keyframes lt-in {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .lt-section-label {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 10px;
        letter-spacing: 0.1em;
        color: var(--muted);
        padding-bottom: 10px;
        border-bottom: 0.5px solid var(--rule);
        margin-bottom: 10px;
      }
      .lt-section-label--top { margin-top: 14px; padding-top: 12px; border-top: 0.5px solid var(--rule); border-bottom: 0.5px solid var(--rule); margin-bottom: 10px; padding-bottom: 10px; }
      .lt-current { color: var(--user-accent); font-size: 10px; letter-spacing: 0.06em; }
      .lt-swatches {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
      }
      .lt-sw {
        background: transparent;
        border: 0;
        padding: 8px 4px 6px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        font-family: inherit;
        font-size: 10px;
        color: var(--muted);
        letter-spacing: 0.04em;
        transition: color 140ms ease;
      }
      .lt-sw:hover { color: var(--ink); }
      .lt-sw[aria-current="true"] { color: var(--ink); }
      .lt-sw__chip {
        position: relative;
        width: 30px; height: 30px;
        border-radius: 50%;
        display: block;
        border: 0.5px solid rgba(0,0,0,0.2);
        overflow: hidden;
        transition: transform 140ms ease;
      }
      .lt-sw__chip__ink {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 50%;
      }
      .lt-sw__chip__acc {
        position: absolute;
        right: 5px; top: 50%;
        transform: translateY(-50%);
        width: 8px; height: 8px;
        border-radius: 50%;
        border: 0.5px solid rgba(255,255,255,0.4);
      }
      .lt-sw[aria-current="true"] .lt-sw__chip {
        box-shadow: 0 0 0 1.5px var(--paper), 0 0 0 2.5px var(--ink);
      }
      .lt-sw:hover .lt-sw__chip { transform: scale(1.06); }

      .lt-layouts {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 4px;
      }
      .lt-lo {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 7px 8px;
        background: transparent;
        border: 0.5px solid var(--rule);
        cursor: pointer;
        font-family: inherit;
        font-size: 11px;
        letter-spacing: 0.04em;
        color: var(--muted);
        transition: border-color 140ms ease, color 140ms ease;
      }
      .lt-lo:hover { color: var(--ink); border-color: var(--ink); }
      .lt-lo[aria-current="true"] {
        color: var(--user-accent);
        border-color: var(--user-accent);
      }
      .lt-lo__icon {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px;
        opacity: 0.78;
      }
      .lt-lo[aria-current="true"] .lt-lo__icon { opacity: 1; }
      .lt-lo__name { font-size: 11px; }

      @media (max-width: 540px) {
        .logr-theme-picker { right: 12px; bottom: 12px; }
        .lt-panel { right: 0; width: min(296px, calc(100vw - 24px)); }
      }
    `;
    document.head.appendChild(css);

    // events
    const trig = picker.querySelector('.lt-trigger');
    trig.addEventListener('click', () => togglePanel());

    document.addEventListener('click', e => {
      if (!panelOpen) return;
      if (picker.contains(e.target)) return;
      togglePanel(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panelOpen) togglePanel(false);
    });

    picker.querySelectorAll('.lt-sw').forEach(b => {
      b.addEventListener('click', () => applyPalette(b.dataset.palette));
    });
    picker.querySelectorAll('.lt-lo').forEach(b => {
      b.addEventListener('click', () => applyLayout(b.dataset.layout));
    });
  }

  function togglePanel(force) {
    panelOpen = force === undefined ? !panelOpen : force;
    const pnl = picker.querySelector('.lt-panel');
    const trig = picker.querySelector('.lt-trigger');
    pnl.hidden = !panelOpen;
    trig.setAttribute('aria-expanded', panelOpen ? 'true' : 'false');
  }

  function syncPicker() {
    if (!picker) return;
    const cur = root.dataset.palette || DEFAULT;
    const curLo = root.dataset.layout || DEFAULT_LAYOUT;
    picker.querySelectorAll('.lt-sw').forEach(b => {
      b.setAttribute('aria-current', b.dataset.palette === cur ? 'true' : 'false');
    });
    picker.querySelectorAll('.lt-lo').forEach(b => {
      b.setAttribute('aria-current', b.dataset.layout === curLo ? 'true' : 'false');
    });
    const lab = picker.querySelector('#lt-current');
    if (lab) lab.textContent = cur;
    const labLo = picker.querySelector('#lt-current-layout');
    if (labLo) labLo.textContent = curLo;
  }

  // ----------------------------- bootstrap -----------------------------
  function init() {
    // hydrate from storage. accept legacy keys: logr-theme (accent name) -> map to palette.
    let saved = readLS(LS_KEY, '');
    if (!saved) {
      const legacyTheme = readLS(LEGACY_THEME_KEY, '');
      const legacyMode  = readLS(LEGACY_MODE_KEY,  '');
      if (legacyMode === 'dark') saved = 'ink';
      else if (PALETTES[legacyTheme]) saved = legacyTheme;
      else saved = DEFAULT;
    }
    if (!PALETTES[saved]) saved = DEFAULT;

    let savedLo = readLS(LS_LAYOUT, DEFAULT_LAYOUT);
    if (!LAYOUTS[savedLo]) savedLo = DEFAULT_LAYOUT;

    applyPalette(saved);
    applyLayout(savedLo);
    buildPicker();
    syncPicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.logrTheme = { PALETTES, LAYOUTS, apply: applyPalette, layout: applyLayout };
})();
