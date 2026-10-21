/* ══════════════════════════════════════════════════════════════════════════
   Footer.jsx

   Everything for this section: links, the live clock, the liquid-glyph field and the big wordmark.

   In this file, top to bottom:
     1. Footer
     2. useClock
     3. useCopy
     4. useCursorGlow
     5. useLiquidField
     6. useWordmarkFit
     7. useWordmarkReveal
     8. styles
   ══════════════════════════════════════════════════════════════════════════ */

import { useRef, useEffect, useState, useCallback } from "react";
import { Icon, Monogram, injectCss } from "../shared";
import { nav, profile } from "../content";

/* ═══ Footer — the section  ·  was components/Footer.jsx ═══════════════════ */
export function Footer() {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const labelRef = useRef(null);

  const time = useClock(profile.timeZone);
  const [copied, copy] = useCopy();

  useCursorGlow(footerRef);
  useLiquidField(footerRef, {
    radius: 155, heat: .5, growth: 4,
    mask: "[data-copy-block]",
    maskSoft: "[data-wordmark]"
  });
  useWordmarkFit(wordmarkRef, labelRef);
  useWordmarkReveal(wordmarkRef, footerRef);

  const name = profile.name.toUpperCase();

  return (
    <footer ref={footerRef}
      className="footer-surface relative isolate overflow-hidden rounded-t-[26px] px-gutter
                 pt-[clamp(48px,7vw,86px)] pb-6.5 max-[860px]:rounded-t-[20px]">

      {/* the warm hairline across the top */}
      <span aria-hidden="true"
        className="absolute inset-x-0 top-0 z-[5] h-px
                   bg-[linear-gradient(90deg,transparent,rgba(91,228,155,.55)_26%,rgba(0,168,120,.55)_58%,transparent)]" />

      <div className="haze haze--footer absolute -inset-[12%] z-0" aria-hidden="true" />
      <div className="fx-grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-content">
        <div className="grid items-start gap-[clamp(32px,5vw,64px)]
                        lg:grid-cols-[minmax(0,1.5fr)_minmax(0,.9fr)_minmax(0,1fr)]">

          <div data-copy-block>
            <div className="flex items-center gap-3.5">
              <Monogram id="footer"
                className="size-[52px] flex-none drop-shadow-[0_0_16px_rgba(0,168,120,.45)]" />
              <h2 className="font-display text-2xl font-semibold tracking-[.015em]">{profile.name}</h2>
            </div>

            <p className="mt-5.5 max-w-[44ch] text-sm text-secondary">
              {profile.bio}<br />
              Currently open to new work —{" "}
              <a className="link-sweep text-link" href="#work">see recent builds</a>
            </p>

            <div className="mt-6.5 flex gap-3">
              {profile.socials.map(s => (
                <a key={s.icon} href={s.href} aria-label={s.label}
                   className="grid size-10 place-items-center rounded-[11px] border border-line
                              bg-white/[.015] text-muted transition-all duration-500 ease-out-expo
                              hover:-translate-y-1 hover:border-accent-soft/55 hover:text-accent-hi
                              hover:shadow-[0_10px_26px_-12px_rgba(0,168,120,.8)]">
                  <Icon name={s.icon} className="size-[17px]" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" data-copy-block>
            <p className="label mb-5">Navigate</p>
            <ul className="grid justify-items-start gap-4">
              {nav.filter(n => n.id !== "experience").map(n => (
                <li key={n.id}>
                  <a href={`#${n.id}`}
                     className="link-sweep text-[14.5px] text-body transition-colors
                                duration-500 hover:text-accent-hi">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-copy-block>
            <p className="label mb-5">Get in touch</p>
            <div className="grid justify-items-start gap-3.5">

              <div className="group flex items-center gap-2.5">
                <a href={`mailto:${profile.email}`}
                   className="link-sweep inline-flex items-center gap-1.5 font-mono text-[15px] text-primary">
                  {profile.email}
                  <Icon name="arrow" className="size-[11px] transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <button type="button" onClick={() => copy(profile.email)}
                  aria-label="Copy email address"
                  className={"relative grid size-7 flex-none place-items-center rounded-lg border "
                    + "transition-all duration-500 ease-out-expo "
                    + (copied
                      ? "border-line text-link opacity-100 translate-x-0"
                      : "border-transparent text-muted opacity-0 -translate-x-1 "
                        + "group-hover:translate-x-0 group-hover:opacity-100 "
                        + "focus-visible:translate-x-0 focus-visible:opacity-100 hover:border-line hover:text-link")}>
                  <Icon name="copy" className="size-[15px]" />
                  <span aria-hidden="true"
                    className={"pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 "
                      + "whitespace-nowrap font-mono text-[11.5px] tracking-[.08em] text-link "
                      + "transition-opacity duration-300 " + (copied ? "opacity-100" : "opacity-0")}>
                    Copied
                  </span>
                </button>
              </div>

              <a href={profile.statusUrl} target="_blank" rel="noreferrer"
                className="link-sweep inline-flex items-center gap-2.5 text-[13px] text-secondary">
                <i className="dot" />{profile.status}
              </a>
              <p className="flex items-center gap-2 font-mono text-[12.5px] text-muted">
                {profile.location} · <b className="font-medium text-body">{time}</b> local
              </p>
            </div>
          </div>
        </div>

        {/* the oversized name, broken out of the column */}
        <div ref={wordmarkRef} data-wordmark
             className="wordmark relative mt-[clamp(42px,7vw,86px)] ml-[50%] w-[min(1200px,100vw)]
                        select-none overflow-hidden text-center leading-none">
          {/* the extrusion: an opaque copy behind the lit face */}
          <span aria-hidden="true" className="wordmark-face wordmark-depth">{name}</span>
          <span ref={labelRef} className="wordmark-face">{name}</span>
          <span aria-hidden="true" className="wordmark-face wordmark-lit">{name}</span>
        </div>

        <div className="mt-[clamp(30px,4vw,52px)] h-px
                        bg-[linear-gradient(90deg,transparent,var(--color-line)_20%,var(--color-line)_80%,transparent)]" />

        <p data-copy-block
           className="mt-7 text-center font-display text-[clamp(15px,1.9vw,18px)] tracking-[.045em] text-muted">
          &ldquo;{profile.quote}&rdquo;
        </p>
        <p data-copy-block
           className="mt-4.5 text-center font-mono text-[12px] tracking-[.06em] text-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}

/* ═══ useClock — behaviour  ·  was hooks/useClock.js ═══════════════════════ */
/* ==========================================================================
   useClock(timeZone) — live local time, updated every 20 seconds
   ========================================================================== */

function useClock(timeZone = "Asia/Dhaka") {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone, hour: "2-digit", minute: "2-digit", hour12: true
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}

/* ═══ useCopy — behaviour  ·  was hooks/useCopy.js ═════════════════════════ */
/* ==========================================================================
   useCopy()

   Returns [copied, copy]. Falls back to a hidden textarea on browsers
   without the async clipboard API, then to mailto: if both fail.
   The timer is cleared on unmount so it cannot set state on a dead
   component.
   ========================================================================== */

function useCopy(resetAfter = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async value => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const t = document.createElement("textarea");
        t.value = value;
        t.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetAfter);
    } catch {
      location.href = "mailto:" + value;
    }
  }, [resetAfter]);

  return [copied, copy];
}

/* ═══ useCursorGlow — behaviour  ·  was hooks/useCursorGlow.js ═════════════ */
/* ==========================================================================
   useCursorGlow(ref)

   A soft halo that follows the pointer inside the given element. Unlike the
   Liquid field it is never masked, so it crosses text freely — it sits
   behind the copy and lights it from underneath.

   Position is written to CSS custom properties rather than React state. At
   pointer-move frequency, state would re-render the whole subtree.
   ========================================================================== */

function useCursorGlow(ref) {
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");
    layer.className = "fx-glow";
    layer.setAttribute("aria-hidden", "true");
    host.prepend(layer);

    let rect = host.getBoundingClientRect();
    let queued = false, x = 0, y = 0;

    const paint = () => {
      layer.style.setProperty("--mx", x + "px");
      layer.style.setProperty("--my", y + "px");
      queued = false;
    };

    const onMove = e => {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    };
    const onEnter = e => { rect = host.getBoundingClientRect(); onMove(e); layer.classList.add("is-on"); };
    const onLeave = () => layer.classList.remove("is-on");
    const remeasure = () => { rect = host.getBoundingClientRect(); };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onEnter, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    addEventListener("scroll", remeasure, { passive: true });
    addEventListener("resize", remeasure, { passive: true });

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      removeEventListener("scroll", remeasure);
      removeEventListener("resize", remeasure);
      layer.remove();
    };
  }, [ref]);
}

/* ═══ useLiquidField — behaviour  ·  was hooks/useLiquidField.js ═══════════ */
/* ==========================================================================
   useLiquidField(ref, options)

   Paints a field of Shopify Liquid syntax into a canvas inside the given
   element. Rests quietly, ignites under the cursor.

   All of the drawing lives outside React: the canvas is written to directly
   at 60fps, and putting any of that in state would re-render the tree every
   frame. React owns the element; the effect owns the pixels.
   ========================================================================== */

const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';

const SHORT = ["{{", "}}", "{%", "%}", "|", ".", ":", "/", "=", "~", "·"];
const LONG = ["assign", "for", "if", "endif", "endfor", "money", "img_url",
  "section", "snippet", "schema", "cart", "product", "variant", "handle",
  "metafield", "unless", "capture", "render"];

const DEFAULTS = {
  gap: 42,
  radius: 155,
  falloff: 1.8,
  rest: 0.085,
  heat: 0.5,
  growth: 4,
  bloom: 0.62,
  mask: "",
  maskPad: 30,
  maskSoft: "",
  maskSoftFloor: 0.4,
  maskSoftPad: 22
};

function useLiquidField(ref, options = {}) {
  // serialised so a fresh options object each render does not re-run the effect
  const key = JSON.stringify(options);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cfg = { ...DEFAULTS, ...JSON.parse(key) };

    const canvas = document.createElement("canvas");
    canvas.className = "fx-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.prepend(canvas);
    const ctx = canvas.getContext("2d");

    /* The canvas cannot use CSS colours directly, so the theme's values are
       read once per theme change and cached. Reading them per glyph would
       mean thousands of getComputedStyle calls a second. */
    let cold = [120, 225, 180], hot = [255, 255, 240], bloom = "rgba(91,228,155,.14)";

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      const triple = name => {
        const raw = cs.getPropertyValue(name).trim();
        const parts = raw.split(/[\s,]+/).map(Number).filter(n => !Number.isNaN(n));
        return parts.length === 3 ? parts : null;
      };
      cold = triple("--fx-glyph-cold") || cold;
      hot = triple("--fx-glyph-hot") || hot;
      bloom = cs.getPropertyValue("--fx-bloom").trim() || bloom;
    };

    let W = 0, H = 0, DPR = 1, rect = null, raf = null;
    let mx = -9999, my = -9999, px = -9999, py = -9999, inside = false;
    let cells = [], restLayer = null, lastFont = "";

    const boxesOf = (selector, pad, floor) => {
      if (!selector) return [];
      const base = host.getBoundingClientRect();
      return [...host.querySelectorAll(selector)].map(el => {
        const r = el.getBoundingClientRect();
        return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, pad, floor };
      });
    };

    const visibility = (x, y, boxes) => {
      let m = 1;
      for (const b of boxes) {
        const dx = Math.max(b.x - x, 0, x - (b.x + b.w));
        const dy = Math.max(b.y - y, 0, y - (b.y + b.h));
        const d = Math.hypot(dx, dy);
        if (d >= b.pad) continue;
        const f = b.floor + (1 - b.floor) * (d / b.pad);
        if (f < m) m = f;
      }
      return m;
    };

    const build = () => {
      const boxes = [
        ...boxesOf(cfg.mask, cfg.maskPad, 0),
        ...boxesOf(cfg.maskSoft, cfg.maskSoftPad, cfg.maskSoftFloor)
      ];

      cells = [];
      const w = W / DPR, h = H / DPR, gap = cfg.gap;
      for (let y = gap * 0.7; y < h; y += gap) {
        for (let x = gap * 0.7; x < w; x += gap) {
          const pool = Math.random() < 0.14 ? LONG : SHORT;
          cells.push({
            x, y,
            ch: pool[(Math.random() * pool.length) | 0],
            m: visibility(x, y, boxes),   // consulted only when lit
            g: 0, s: 0
          });
        }
      }

      /* The resting state is baked once and blitted each frame, so only the
         forty-odd lit glyphs are ever re-typeset. Every cell bakes at the
         same opacity — masking the baked layer leaves visible holes. */
      restLayer = document.createElement("canvas");
      restLayer.width = W;
      restLayer.height = H;
      const s = restLayer.getContext("2d");
      s.setTransform(DPR, 0, 0, DPR, 0, 0);
      s.font = `400 11px ${MONO}`;
      s.textAlign = "center";
      s.textBaseline = "middle";
      s.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--fx-field-rest").trim() || `rgba(126,205,170,${cfg.rest})`;
      for (const c of cells) s.fillText(c.ch, c.x, c.y);
    };

    const resize = () => {
      rect = host.getBoundingClientRect();
      DPR = Math.min(devicePixelRatio || 1, 1.6);
      W = Math.round(rect.width * DPR);
      H = Math.round(rect.height * DPR);
      if (!W || !H) return;
      canvas.width = W;
      canvas.height = H;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    };

    const onMove = e => {
      if (!rect) return;
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      inside = true;
    };
    const onLeave = () => { inside = false; };
    const onScroll = () => { rect = host.getBoundingClientRect(); };

    const setFont = f => { if (f !== lastFont) { ctx.font = f; lastFont = f; } };

    const frame = () => {
      if (px < -5000) { px = mx; py = my; }
      px += (mx - px) * 0.16;
      py += (my - py) * 0.16;

      ctx.clearRect(0, 0, W / DPR, H / DPR);
      ctx.globalCompositeOperation = "source-over";
      lastFont = "";
      if (restLayer) ctx.drawImage(restLayer, 0, 0, W / DPR, H / DPR);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalCompositeOperation = "lighter";

      const R = cfg.radius;
      let blooming = false;

      for (const c of cells) {
        let t = 0;
        if (inside) {
          const d = Math.hypot(c.x - mx, c.y - my);
          if (d < R) t = (1 - d / R) ** cfg.falloff;
        }
        c.g += (t - c.g) * 0.18;
        c.s += (t - c.s) * 0.13;

        const a = c.g * c.m;
        if (a < 0.02) continue;

        // the hot zone churns a little, as if recompiling
        if (t > 0.45 && Math.random() < 0.03) c.ch = SHORT[(Math.random() * SHORT.length) | 0];

        const g = c.g;
        const want = g > cfg.bloom;
        if (want !== blooming) {
          ctx.shadowBlur = want ? 3 : 0;
          ctx.shadowColor = want ? bloom : "transparent";
          blooming = want;
        }

        const size = Math.round((11 + c.s * cfg.growth) * 2) / 2;
        setFont(`${g > 0.55 ? 500 : 400} ${size}px ${MONO}`);
        // cold at rest, hot at the centre of the cursor
        const r = (cold[0] + (hot[0] - cold[0]) * g) | 0;
        const gr = (cold[1] + (hot[1] - cold[1]) * g) | 0;
        const bl = (cold[2] + (hot[2] - cold[2]) * g) | 0;
        ctx.fillStyle = `rgba(${r},${gr},${bl},${Math.min(1, a * cfg.heat)})`;
        ctx.fillText(c.ch, c.x, c.y);
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      raf = requestAnimationFrame(frame);
    };

    // only burn frames while the host is on screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        rect = host.getBoundingClientRect();
        if (!raf) raf = requestAnimationFrame(frame);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }, { threshold: 0 });

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    addEventListener("resize", resize, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });

    /* repaint when the theme flips: the baked resting layer holds colour,
       so it has to be rebuilt, not just recoloured */
    const themeWatcher = new MutationObserver(() => { readTheme(); resize(); });
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    readTheme();
    resize();
    io.observe(host);
    document.fonts?.ready.then(resize);   // clearance boxes move when fonts land

    return () => {
      themeWatcher.disconnect();
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("scroll", onScroll);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onMove);
      host.removeEventListener("pointerleave", onLeave);
      canvas.remove();
    };
  }, [ref, key]);
}

/* ═══ useWordmarkFit — behaviour  ·  was hooks/useWordmarkFit.js ═══════════ */
/* ==========================================================================
   useWordmarkFit(wrapRef, labelRef)

   Scales the oversized name so it spans its container, whatever word sits
   in it. A fixed clamp() can only ever be right for one string length.

   The measurement trick matters: the label is display:block, so its box is
   the container width, not the width of the text. Measuring it as-is always
   returns the container and the fit silently becomes a no-op. Flipping it
   to inline-block for the read makes the box hug the glyphs.
   ========================================================================== */

function useWordmarkFit(wrapRef, labelRef) {
  useEffect(() => {
    const wrap = wrapRef.current, label = labelRef.current;
    if (!wrap || !label) return;

    const fit = () => {
      const avail = wrap.clientWidth;
      if (!avail) return;
      wrap.style.setProperty("--wm-size", "100px");

      label.style.display = "inline-block";
      const w = label.getBoundingClientRect().width;
      label.style.display = "";

      if (!w) return;
      const fitRatio = Math.min(0.995, 0.85 + Math.max(0, window.innerWidth - 390) * 0.00058);
      wrap.style.setProperty("--wm-size", (100 * (avail * fitRatio) / w).toFixed(1) + "px");
    };

    fit();
    addEventListener("resize", fit, { passive: true });
    document.fonts?.ready.then(fit);
    return () => removeEventListener("resize", fit);
  }, [wrapRef, labelRef]);
}

/* ═══ useWordmarkReveal — behaviour  ·  was hooks/useWordmarkReveal.js ═════ */
/* ==========================================================================
   useWordmarkReveal(wordmarkRef, watchRef)

   Wipes the name in downward when the footer arrives.

   It watches an ancestor, not the wordmark. The resting state clips the
   wordmark to zero height, and Chromium folds a target's own clip into the
   intersection rect — observing it directly deadlocks: it never intersects,
   so the class never lands, so the clip never opens.
   ========================================================================== */

function useWordmarkReveal(wordmarkRef, watchRef) {
  useEffect(() => {
    const el = wordmarkRef.current;
    const watched = watchRef.current || el?.parentElement;
    if (!el || !watched) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      el.classList.add("is-in");
      io.disconnect();
    }, { threshold: 0.22 });

    io.observe(watched);
    return () => io.disconnect();
  }, [wordmarkRef, watchRef]);
}

/* ═══ styles — this section's own CSS; the shared look lives in index.css ═══ */
injectCss("footer", `
@layer components {
  /* ---- effect layers: injected by hooks, so they need real classes ---- */
  .fx-canvas {
    position: absolute; inset: 0; z-index: 1;
    width: 100%; height: 100%;
    pointer-events: none;
    mix-blend-mode: var(--fx-blend, screen);
  }
  .fx-glow {
    position: absolute; inset: 0; z-index: 1;
    pointer-events: none; opacity: 0;
    transition: opacity var(--dur-3) var(--ease-out-expo);
    background: radial-gradient(240px 240px at var(--mx, -999px) var(--my, -999px),
                var(--fx-glow), transparent 72%);
  }
  .fx-glow.is-on { opacity: 1; }

  /* ---- drifting ambient haze ---- */
  .haze {
    pointer-events: none;
    filter: blur(46px);
    animation: drift 42s ease-in-out infinite alternate;
    background:
      radial-gradient(38% 42% at 24% 30%, var(--fx-haze-a), transparent 70%),
      radial-gradient(42% 46% at 72% 72%, var(--fx-haze-b), transparent 70%);
  }
  .haze--footer {
    background:
      radial-gradient(38% 42% at 24% 28%, var(--fx-haze-a), transparent 70%),
      radial-gradient(42% 46% at 68% 76%, var(--fx-haze-b), transparent 70%);
  }
  @keyframes drift {
    0%   { transform: translate3d(-2%, 1%, 0) scale(1.05); }
    100% { transform: translate3d(2%, -2%, 0) scale(1.12); }
  }

  .footer-surface {
    background: radial-gradient(120% 95% at 50% 0%,
      var(--c-surface-top) 0%, var(--c-surface) 46%, var(--c-surface-sunken) 100%);
  }

  /* ---- the wordmark ----
     background-clip: text needs several properties in concert and a vendor
     prefix, and the box must extend past the baseline or a descender like
     the J is simply never painted. Utilities would only hide that. */
  .wordmark {
    transform: translateX(-50%) translateY(-.16em);
    clip-path: inset(0 0 100% 0);
    opacity: 0;
    transition: transform var(--dur-5) var(--ease-out-expo),
                clip-path var(--dur-5) var(--ease-out-expo),
                opacity .8s ease;
  }
  .wordmark.is-in {
    transform: translateX(-50%) translateY(0);
    clip-path: inset(0 0 -10% 0);
    opacity: .24;
  }
  /* The three layers share one set of type metrics. Order, back to front:

       .wordmark-depth   a solid, dark copy pushed down and slightly right by
                         a stack of hard text-shadows — that is the extrusion
       .wordmark-face    the lit surface: a colour band that travels the
                         whole word, over a light-from-above bevel
       .wordmark-lit     the pointer spotlight, unchanged

     Why the extrusion is its own layer: text-shadow on text whose colour is
     transparent (needed for background-clip: text) shows straight through
     the letters. A separate opaque copy has no such problem. */
  .wordmark-face {
    position: relative; z-index: 1;
    display: block;
    font-family: var(--font-display); font-weight: 700;
    font-size: var(--wm-size, 86px);
    letter-spacing: .02em; white-space: nowrap;
    padding-bottom: .12em;

    background-image:
      /* 1 — bevel: light catches the top edge, the foot falls into shade */
      linear-gradient(180deg,
        var(--wm-shine) 0%, transparent 34%, transparent 58%, var(--wm-shade) 100%),
      /* 2 — the travelling colour. One full cycle fits the word exactly. */
      linear-gradient(90deg,
        var(--wm-1) 0%,
        var(--wm-2) 11%,
        var(--wm-3) 20%,
        var(--wm-4) 29%,
        var(--wm-2) 39%,
        var(--wm-1) 50%,
        var(--wm-2) 61%,
        var(--wm-3) 70%,
        var(--wm-4) 79%,
        var(--wm-2) 89%,
        var(--wm-1) 100%);
    background-size: 100% 100%, 200% 100%;
    background-repeat: no-repeat, repeat-x;
    background-position: 0 0, 100% 0;
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }

  /* Travel starts when the footer reveals, not on page load. A paint-bound
     animation running somewhere you cannot see is wasted work. */
  .wordmark.is-in .wordmark-face {
    animation: wm-travel 8s linear infinite;
  }

  /* Background-position percentages are relative to (box - image). With a
     200% image, 100% means "shifted left by exactly one box width" and 0%
     means "not shifted" — and because the pattern repeats every box width,
     those two frames are identical. That is what makes the loop seamless.
     Layer 1 (the bevel) stays put; only layer 2 moves. */
  @keyframes wm-travel {
    from { background-position: 0 0, 100% 0; }
    to   { background-position: 0 0, 0% 0; }
  }

  .wordmark-depth {
    position: absolute; inset: 0; z-index: 0;
    background: none; color: var(--wm-ext-1);
    animation: none !important;
    -webkit-background-clip: border-box; background-clip: border-box;
    /* eight hard steps do the extrusion; offsets are in em so the depth
       scales with the type at every width. Mostly downward, barely right —
       the box clips at its sides, so sideways depth is kept small. */
    text-shadow:
      .003em .008em 0 var(--wm-ext-1),
      .006em .016em 0 var(--wm-ext-1),
      .009em .024em 0 var(--wm-ext-1),
      .012em .032em 0 var(--wm-ext-1),
      .015em .040em 0 var(--wm-ext-2),
      .018em .048em 0 var(--wm-ext-2),
      .021em .056em 0 var(--wm-ext-2),
      .024em .064em 0 var(--wm-ext-2),
      0 .09em .06em var(--wm-cast);
  }

  .wordmark-lit {
    position: absolute; inset: 0; z-index: 2; opacity: .8;
    animation: none !important;
    background: radial-gradient(210px 210px at var(--wx, 50%) var(--wy, 50%),
      var(--fx-wordmark-lit), transparent 72%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fx-canvas, .fx-glow { display: none; }
  .haze { animation: none; }
  .wordmark { transform: translateX(-50%); clip-path: none; opacity: .24; }
  .wordmark.is-in .wordmark-face { animation: none; }
}
`);