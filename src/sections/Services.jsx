/* ══════════════════════════════════════════════════════════════════════════
   Services.jsx

   Everything for this section: the two forest scenes with their fans of cards (desktop) / slider (phone).

   In this file, top to bottom:
     1. content
     2. Services
     3. useCardFan
     4. styles
   ══════════════════════════════════════════════════════════════════════════ */

import { useRef, useLayoutEffect } from "react";
import { Icon, Reveal, SplitHeading, Accent, useMediaQuery, injectCss } from "../shared";

/* ═══ content — the words on this section; edit them here ══════════════════ */
const servicesIntro = {
  label: "My services",
  sub: "Modern sites. Powerful features. Built to grow."
};

/* Two scenes, four cards each. Copy is kept short on purpose: on desktop the
   cards overlap, so only the left strip of each is visible at rest, and every
   word has to earn its place there. Titles are one or two words, the line is
   under eight, and each list item fits in about 20 characters. */
const serviceScenes = [
  {
    id: "shopify", icon: "shopify", label: "Shopify",
    title: ["Custom stores,", "built to sell."],
    lede: "Setup, custom features and dropshipping.",
    cards: [
      { icon: "store", title: "Full Store Setup", line: "Live and selling, start to finish.",
        items: ["Domain & theme", "Product catalog", "Payments & shipping"] },
      { icon: "brush", title: "Custom Design", line: "Built in Liquid, tailored to you.",
        items: ["Theme design", "Advanced animation", "Sections & features"] },
      { icon: "code", title: "Theme Fixes", line: "Bugs found and fixed, fast.",
        items: ["Liquid & CSS fixes", "JavaScript fixes", "Responsive fixes"] },
      { icon: "box", title: "Dropshipping", line: "Set up to sell with less effort.",
        items: ["Product sourcing", "App integrations", "Order automation"] }
    ]
  },
  {
    id: "wordpress", icon: "wordpress", label: "WordPress",
    title: ["Flexible sites,", "built your way."],
    lede: "Custom design, Elementor, WooCommerce and plugins.",
    cards: [
      { icon: "theme", title: "Custom Design", line: "Modern, responsive, on-brand.",
        items: ["Business websites", "Landing pages", "Portfolios & blogs"] },
      { icon: "gear", title: "Custom Plugins", line: "When none fits, I write one.",
        items: ["Plugin development", "API integrations", "Forms & CRM"] },
      { icon: "elementor", title: "Elementor Pro", line: "Fast layouts your team can edit.",
        items: ["Drag & drop design", "Section templates", "Advanced widgets"] },
      { icon: "cart", title: "WooCommerce", line: "Stores with a smooth checkout.",
        items: ["Store setup", "Payments & shipping", "Product management"] }
    ]
  }
];


/* ═══ Services — the section  ·  was components/Services.jsx ═══════════════ */
/* The resting pose of a hand of cards: each leans a different way and sits at a
   slightly different height, so it reads as dealt rather than ruled. The same
   two arrays drive the CSS baseline and the JS motion, so they cannot drift. */
const TILT = [-2.6, -1, 1, 2.6];
const RISE = [-6, 4, -2, 8];

function Scene({ scene, fan }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  useCardFan(stageRef, { fan, tilt: TILT, rise: RISE });
  const titleId = `${scene.id}-title`;

  const onPointerDown = e => {
    if (fan || e.pointerType !== "mouse" || e.button !== 0) return;
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startScroll: stageRef.current.scrollLeft,
      moved: false
    };
  };
  const onPointerMove = e => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const distance = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) < 8) return;
    if (!drag.moved) {
      drag.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    e.preventDefault();
    stageRef.current.scrollLeft = drag.startScroll - distance;
  };
  const onPointerUp = e => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
  };

  return (
    <Reveal y={30}>
      {/* data-fan-scope: the hook writes data-active here, and the pips read it */}
      <section aria-labelledby={titleId} data-fan-scope className="scene">
        <div className="scene__grid">

          <div>
            <div className="scene__top">
              <p className="scene__label">
                <span className="scene__medal" aria-hidden="true">
                  <Icon name={scene.icon} className="size-6" />
                </span>
                {scene.label}
              </p>
              {/* slider controls: phones and tablets only. The hook wires them (data-rail-go) */}
              <div className="scene__ctrl">
                <span className="scene__count" aria-hidden="true"><b /> / 0{scene.cards.length}</span>
                <button type="button" className="scene__btn" data-rail-go="prev"
                  aria-label={`Previous ${scene.label} service`}>
                  <Icon name="chevron" className="size-4 rotate-180" />
                </button>
                <button type="button" className="scene__btn" data-rail-go="next"
                  aria-label={`Next ${scene.label} service`}>
                  <Icon name="chevron" className="size-4" />
                </button>
              </div>
            </div>
            <h3 id={titleId} className="scene__title">
              {scene.title[0]} <em>{scene.title[1]}</em>
            </h3>
            <p className="scene__lede">{scene.lede}</p>
            <div className="scene__pips" aria-hidden="true">
              {scene.cards.map(c => <i key={c.title} />)}
            </div>
          </div>

          <div ref={stageRef} className="fan" role="group" aria-roledescription="carousel"
               aria-label={`${scene.label} services`}
               onPointerDown={onPointerDown} onPointerMove={onPointerMove}
                   onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                   style={!fan ? { cursor: "grab", userSelect: "none" } : undefined}>
            <span className="fan__glow" aria-hidden="true" />
            {scene.cards.map((c, i) => (
              <article key={c.title} data-fan-card tabIndex={0} className="fan-card"
                style={{ "--tilt": `${TILT[i]}deg`, "--rise": `${RISE[i]}px` }}>
                <span className="fan-card__sheen" aria-hidden="true" />
                <div className="flex items-start justify-between">
                  <span className="fan-card__medal" aria-hidden="true">
                    <Icon name={c.icon} className="size-[21px]" />
                  </span>
                  <span className="fan-card__no" aria-hidden="true">0{i + 1}</span>
                </div>
                <h4 className="fan-card__title">{c.title}</h4>
                <p className="fan-card__line">{c.line}</p>
                <ul className="fan-card__list">
                  {c.items.map(t => (
                    <li key={t}><Icon name="check" className="fan-card__tick" />{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

        </div>
      </section>
    </Reveal>
  );
}

export function Services() {
  /* Only configures behaviour — the layout switch itself is CSS, so the first
     paint is right either way. `true` reads the real answer on the first
     render instead of starting false and flipping. */
  const fan = useMediaQuery("(min-width: 64rem)", true);

  return (
    <section id="services" className="well relative py-section">
      <div className="mx-auto w-full max-w-site px-gutter">

        <div className="mx-auto mb-7 max-w-[980px] text-center sm:mb-10">
          <Reveal className="flex items-center justify-center gap-3.5 sm:gap-4">
            <span aria-hidden="true"
              className="h-px w-10 bg-linear-to-r from-transparent to-line-strong sm:w-16" />
            <p className="label">{servicesIntro.label}</p>
            <span aria-hidden="true"
              className="h-px w-10 bg-linear-to-l from-transparent to-line-strong sm:w-16" />
          </Reveal>

          <SplitHeading delay={0.06}
            className="mt-4 text-[clamp(26px,3.6vw,46px)] leading-[1.1] tracking-[-0.015em]">
            <Accent className="text-link">Shopify</Accent> &amp; WordPress Development
          </SplitHeading>

          <Reveal as="p" delay={0.14}
            className="mx-auto mt-3 max-w-[66ch] text-[14px] text-muted sm:text-step-0">
            {servicesIntro.sub}
          </Reveal>
        </div>

        <div className="grid gap-2.5 sm:gap-3">
          {serviceScenes.map(s => <Scene key={s.id} scene={s} fan={fan} />)}
        </div>

      </div>
    </section>
  );
}

/* ═══ useCardFan — behaviour  ·  was hooks/useCardFan.js ═══════════════════ */
/* ==========================================================================
   useCardFan(ref, options)

   Motion for a hand of overlapping cards, in the spirit of React Bits'
   <BounceCards> but for real content.

     ENTRANCE  the cards start in a pile at the middle of the stage and are
               DEALT out into the fan with a bounce — they overshoot their
               place and settle. Staggered, and only when the stage scrolls
               into view.
     HOVER     the hovered card straightens, lifts and comes to the front.
               Its neighbours step aside, the nearest furthest, and they do
               it one after another (a ripple), not all at once.
     RAIL      below the fan breakpoint the cards are a slider. Scrolling is
               NATIVE (the browser's own momentum and snapping are better than
               anything rebuilt in JS on a phone); this hook only reads the
               scroll position and writes two numbers onto each card, --d (how
               far it is from centre, signed) and --a (the same, unsigned).
               CSS turns those into scale, lean and lift, so the centred card
               stands straight and the neighbours recede like the desktop fan.
               It also keeps the counter, the pips and the arrows honest.

   Mark each card  data-fan-card,  give the stage  position: relative, and put
   data-fan-scope on an ancestor if something outside the stage (the pips)
   should know which card is active. Pass  fan: false  for rail mode.

   ---------------------------------------------------------------------------
   Why it is calm, on purpose

   The reference file this replaces used a 520ms CSS ease that measured 245ms
   to cover 90% of its movement, and moved its neighbours by 4–10px — fast,
   and barely visible. Here the hover is a critically-damped spring, ~700ms to
   90% with no overshoot, plus a 70ms "intent" pause so dragging the pointer
   across the fan does not make every card jump in turn.

   The entrance is different: it is meant to bounce, so it uses an
   underdamped spring (the same damping formula BounceCards uses).

   Other decisions worth keeping:

   * One rAF loop writes straight to the DOM. Pointer movement through React
     state would re-render the section on every frame. The loop sleeps when
     nothing is moving.

   * Hover is decided against each card's REST rectangle (offsetLeft), never
     the transformed one — a card that lifts and scales moves under the
     cursor, and hit-testing the moved box makes it flicker at its edges. In
     the overlap, the card whose CENTRE is nearest the pointer wins, so the
     result does not depend on stacking order.

   * Neighbours are clamped so no card ends further than `bleed` px outside
     the stage. The fan is only slightly narrower than its stage; an
     unclamped push would send the outer cards past the 1200px content edge.

   * will-change is held only while a card is moving. Resting, it is
     released so the browser re-rasterises the text crisp.
   ========================================================================== */

const DEFAULTS = {
  fan: true,
  tilt: [-2.6, -1, 1, 2.6],      // degrees, resting
  rise: [-6, 4, -2, 8],          // px, resting — a loose hand, not a ruler-straight row
  delay: 0.12,                   // s before the first card is dealt
  stagger: 0.1,                  // s between cards
  bounciness: 0.55,              // 0..1, how far the entrance overshoots
  lift: 16,                      // px the hovered card rises
  hoverScale: 1.04,
  shrink: 0.985,                 // neighbours recede very slightly
  push: [44, 24, 10],            // px the 1st, 2nd, 3rd neighbour steps aside
  lean: 1.4,                     // degrees the neighbours lean away
  bleed: 14,                     // px a card may end outside the stage (the intro sits just left of it)
  hoverDelay: 70,                // ms of intent before a card counts as hovered
  leaveDelay: 110,               // ms before the fan relaxes after the pointer leaves
  ripple: 55                     // ms between each neighbour reacting
};

// calm hover: critically damped, ~700 ms to 90%
const MOVE_K = 28, MOVE_Z = 0.95;
// the deal: underdamped on purpose, cards swing past their place
const DEAL_K = 64, DEAL_Z = 0.6;
const POP_K = 120;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// one damped-spring step: semi-implicit Euler, stable at the small h used below
const step = (value, velocity, target, k, c, h) => {
  const v = velocity + ((target - value) * k - velocity * c) * h;
  return [value + v * h, v];
};

function useCardFan(ref, options = {}) {
  const key = JSON.stringify(options);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cfg = { ...DEFAULTS, ...JSON.parse(key) };
    // reduced motion: the fan gets a plain CSS hover instead. The slider has no CSS fallback for
    // its counter and arrows, so it keeps running — minus the entrance and the lean.
    if (reduce && cfg.fan) return undefined;
    const cards = [...root.querySelectorAll(":scope > [data-fan-card]")];
    if (!cards.length) return undefined;
    const n = cards.length;
    const scope = root.closest("[data-fan-scope]") || root;

    const rest = i => cfg.fan
      ? { x: 0, y: cfg.rise[i % cfg.rise.length], r: cfg.tilt[i % cfg.tilt.length] }
      : { x: 0, y: 0, r: 0 };
    const startS = cfg.fan ? 0.45 : 0.7;
    const startR = i => cfg.fan ? rest(i).r * 2.4 : (i % 2 ? 3 : -3);

    let rects = [], piles = [], stageW = 0;
    const bodies = [];
    const state = { hovered: -1, pending: -1, time: 0, startAt: reduce ? -1e9 : null, layer: -2, dirty: false, changeAt: 0, rail: -1 };
    let raf = 0, last = performance.now(), alive = true, pointer = null, timer = 0;

    const css = b =>
      `translate3d(${b.x.toFixed(2)}px, ${b.y.toFixed(2)}px, 0) ` +
      `rotate(${b.r.toFixed(3)}deg) scale(${Math.max(0, b.s).toFixed(4)})`;

    /* ---- where everything is, and where the pile is ---- */
    const measure = () => {
      rects = cards.map(el => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }));
      stageW = root.clientWidth;
      piles = rects.map(q => ({
        x: cfg.fan ? stageW / 2 - (q.x + q.w / 2) : 0,     // the pile sits at the middle of the stage
        y: cfg.fan ? 36 : 28
      }));
      // not dealt yet: keep the pile glued to the (possibly resized) layout
      if (state.startAt === null) {
        bodies.forEach((b, i) => { b.x = piles[i].x; b.y = piles[i].y; });
        cards.forEach((el, i) => { if (bodies[i]) el.style.transform = css(bodies[i]); });
      }
    };

    cards.forEach((_, i) => bodies.push({
      x: 0, y: 0, r: reduce ? 0 : startR(i), s: reduce ? 1 : startS, vx: 0, vy: 0, vr: 0, vs: 0,
      target: null, entering: !reduce
    }));
    measure();
    // hidden before the first paint — no flash of a finished fan (reduced motion: simply there)
    if (!reduce) cards.forEach((el, i) => {
      el.style.transform = css(bodies[i]);
      el.style.opacity = "0";
      el.style.willChange = "transform";
    });

    /* ---- the loop ---- */
    const frame = now => {
      raf = 0;
      if (!alive) return;
      const dt = clamp((now - last) / 1000, 1 / 240, 1 / 30);
      last = now;
      state.time += dt;

      const popC = 2 * (1 - 0.85 * cfg.bounciness) * Math.sqrt(POP_K);
      const moveC = 2 * MOVE_Z * Math.sqrt(MOVE_K);
      const dealC = 2 * DEAL_Z * Math.sqrt(DEAL_K);
      const sub = Math.ceil(dt / (1 / 240));
      const h = dt / sub;

      if (state.dirty) { state.dirty = false; state.changeAt = state.time; }
      const hov = cfg.fan ? state.hovered : -1;
      let moving = 0;

      for (let i = 0; i < n; i++) {
        const b = bodies[i], el = cards[i], r0 = rest(i);
        const appeared = state.startAt !== null &&
          state.time - state.startAt >= cfg.delay + i * cfg.stagger;

        let want;
        if (!appeared) {
          want = { x: piles[i].x, y: piles[i].y, r: startR(i), s: startS };
        } else if (hov < 0) {
          want = { x: 0, y: r0.y, r: r0.r, s: 1 };
        } else if (i === hov) {
          want = { x: 0, y: r0.y - cfg.lift, r: 0, s: cfg.hoverScale };
        } else {
          const d = i - hov, a = Math.abs(d), sgn = Math.sign(d);
          let dx = a <= cfg.push.length ? sgn * cfg.push[a - 1] : 0;
          const q = rects[i];
          if (q) dx = clamp(dx, -(q.x + cfg.bleed), stageW + cfg.bleed - (q.x + q.w));
          want = { x: dx, y: r0.y + 6, r: r0.r + sgn * cfg.lean, s: cfg.shrink };
        }

        // ripple: the further a card is from the hovered one, the later it reacts
        const gate = state.changeAt + (hov >= 0 ? Math.abs(i - hov) * cfg.ripple / 1000 : 0);
        if (!b.target || !appeared || state.time >= gate) b.target = want;
        const t = b.target;

        const k = b.entering ? DEAL_K : MOVE_K, c = b.entering ? dealC : moveC;
        const ks = b.entering ? POP_K : MOVE_K, cs = b.entering ? popC : moveC;
        for (let s = 0; s < sub; s++) {
          [b.x, b.vx] = step(b.x, b.vx, t.x, k, c, h);
          [b.y, b.vy] = step(b.y, b.vy, t.y, k, c, h);
          [b.r, b.vr] = step(b.r, b.vr, t.r, k, c, h);
          [b.s, b.vs] = step(b.s, b.vs, t.s, ks, cs, h);
        }

        const dist = Math.abs(t.x - b.x) + Math.abs(t.y - b.y) + Math.abs(t.r - b.r) + Math.abs(t.s - b.s) * 100;
        const speed = Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.vr) + Math.abs(b.vs) * 100;
        moving += dist + speed + (state.startAt !== null && !appeared ? 1 : 0);
        const quiet = appeared && dist < 0.05 && speed < 0.05;
        if (quiet && b.entering) b.entering = false;

        if (quiet && !cfg.fan && hov < 0) {
          el.style.transform = "none";                       // rail: at rest there is no transform at all
        } else {
          el.style.transform = css(b);
        }
        el.style.opacity = b.entering ? String(clamp(((b.s - startS) / (1 - startS)) * 1.6, 0, 1)) : "1";
        el.style.willChange = quiet ? "auto" : "transform";
      }

      if (cfg.fan && state.layer !== hov) {
        state.layer = hov;
        cards.forEach((el, i) => {
          el.style.zIndex = String(i === hov ? n + 1 : i + 1);
          el.toggleAttribute("data-active", i === hov);
        });
        if (hov >= 0 && rects[hov]) {
          scope.setAttribute("data-active", String(hov + 1));
          root.style.setProperty("--glow-dx", (rects[hov].x + rects[hov].w / 2 - stageW / 2).toFixed(1) + "px");
        } else {
          scope.removeAttribute("data-active");
          root.style.setProperty("--glow-dx", "0px");
        }
      }

      if (moving > 0.02) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    /* ---- hover, decided against rest positions ---- */
    const pick = () => {
      if (!pointer || !cfg.fan) return -1;
      const r = root.getBoundingClientRect();
      const px = pointer.x - r.left, py = pointer.y - r.top;
      let best = -1, bd = Infinity;
      rects.forEach((q, i) => {
        const inside = px >= q.x - 6 && px <= q.x + q.w + 6 && py >= q.y - 30 && py <= q.y + q.h + 30;
        if (!inside) return;
        const d = Math.abs(px - (q.x + q.w / 2));          // nearest centre wins in the overlap
        if (d < bd) { bd = d; best = i; }
      });
      const cur = state.pending;                            // hysteresis: do not swap on a hair's difference
      if (cur >= 0 && best !== cur && rects[cur]) {
        const q = rects[cur];
        if (px >= q.x - 6 && px <= q.x + q.w + 6 && Math.abs(px - (q.x + q.w / 2)) - bd < 10) return cur;
      }
      return best;
    };

    const commit = v => { state.hovered = v; state.dirty = true; wake(); };
    const update = () => {
      const next = pick();
      if (next === state.pending) return;
      state.pending = next;
      clearTimeout(timer);
      timer = setTimeout(() => commit(next), next < 0 ? cfg.leaveDelay : cfg.hoverDelay);
    };

    const onMove = e => {
      if (e.pointerType === "touch") return;                // no hover on touch
      pointer = { x: e.clientX, y: e.clientY };
      update();
    };
    const onLeave = () => { pointer = null; update(); };
    const onScroll = () => { if (pointer) update(); };      // content scrolls under a still cursor
    const onFocusIn = e => {
      const i = cards.indexOf(e.target.closest("[data-fan-card]"));
      if (i < 0 || !cfg.fan) return;
      clearTimeout(timer); state.pending = i; commit(i);
    };
    const onFocusOut = e => {
      if (!cfg.fan || root.contains(e.relatedTarget)) return;
      clearTimeout(timer); state.pending = -1; commit(-1);
    };

    if (cfg.fan) {
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("focusin", onFocusIn);
      root.addEventListener("focusout", onFocusOut);
      addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---- rail: a coverflow-style slider on native scrolling ---- */
    const prevBtn = scope.querySelector('[data-rail-go="prev"]');
    const nextBtn = scope.querySelector('[data-rail-go="next"]');
    let railTick = false;
    let aim = -1;                      // where a button/key press is already taking us, until we arrive
    const paintRail = () => {
      railTick = false;
      if (!rects.length) return;
      const pitch = rects[1] ? rects[1].x - rects[0].x : rects[0].w;
      const mid = root.scrollLeft + root.clientWidth / 2;
      let nearest = 0, best = Infinity;
      for (let i = 0; i < n; i++) {
        const d = (rects[i].x + rects[i].w / 2 - mid) / (pitch || 1);   // 0 = centred, -1 = one card to the left
        const dd = reduce ? 0 : clamp(d, -1.6, 1.6);
        cards[i].style.setProperty("--d", dd.toFixed(3));
        cards[i].style.setProperty("--a", Math.abs(dd).toFixed(3));
        if (Math.abs(d) < best) { best = Math.abs(d); nearest = i; }
      }
      // the end cards can never reach dead centre of a short track: pin them
      if (root.scrollLeft >= root.scrollWidth - root.clientWidth - 2) nearest = n - 1;
      if (root.scrollLeft <= 2) nearest = 0;
      if (aim === nearest) aim = -1;
      if (nearest !== state.rail) {
        state.rail = nearest;
        scope.setAttribute("data-active", String(nearest + 1));
        scope.style.setProperty("--n", String(nearest + 1));
        cards.forEach((el, i) => el.toggleAttribute("data-active", i === nearest));
        prevBtn?.setAttribute("aria-disabled", String(nearest === 0));
        nextBtn?.setAttribute("aria-disabled", String(nearest === n - 1));
      }
    };
    const onRail = () => { if (!railTick) { railTick = true; requestAnimationFrame(paintRail); } };
    const goTo = i => {
      aim = clamp(i, 0, n - 1);
      const q = rects[aim];
      if (q) root.scrollTo({ left: q.x + q.w / 2 - root.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
    };
    // a second press while the first is still scrolling continues from where we are heading
    const here = () => (aim >= 0 ? aim : state.rail < 0 ? 0 : state.rail);
    const release = () => { aim = -1; };          // a finger or wheel takes over: forget the aim
    const onCtrl = e => {
      const btn = e.target.closest("[data-rail-go]");
      if (!btn || !scope.contains(btn) || btn.getAttribute("aria-disabled") === "true") return;
      goTo(here() + (btn.dataset.railGo === "next" ? 1 : -1));
    };
    const onRailKey = e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      goTo(here() + (e.key === "ArrowRight" ? 1 : -1));
    };
    if (!cfg.fan) {
      root.addEventListener("scroll", onRail, { passive: true });
      root.addEventListener("keydown", onRailKey);
      root.addEventListener("touchstart", release, { passive: true });
      root.addEventListener("wheel", release, { passive: true });
      scope.addEventListener("click", onCtrl);
      paintRail();
    }

    /* ---- measure now, and whenever the layout can have changed ---- */
    const ro = new ResizeObserver(() => { measure(); wake(); if (!cfg.fan) onRail(); });
    ro.observe(root);
    document.fonts?.ready.then(() => { if (alive) { measure(); if (!cfg.fan) onRail(); } });

    /* ---- deal when the stage is actually on screen ---- */
    const begin = () => {
      if (state.startAt !== null) return;
      state.startAt = state.time;
      wake();
    };
    let io = null;
    if (reduce) {
      wake();                                               // already 'dealt': just settle the pose
    } else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) begin(); },
        { threshold: 0.22, rootMargin: "0px 0px -6% 0px" });
      io.observe(root);
    } else {
      begin();                                              // no IO: never leave cards hidden
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      io?.disconnect();
      ro.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("scroll", onRail);
      root.removeEventListener("keydown", onRailKey);
      root.removeEventListener("touchstart", release);
      root.removeEventListener("wheel", release);
      scope.removeEventListener("click", onCtrl);
      removeEventListener("scroll", onScroll);
      cards.forEach(el => {
        el.style.transform = ""; el.style.opacity = ""; el.style.willChange = ""; el.style.zIndex = "";
        el.removeAttribute("data-active");
        el.style.removeProperty("--d"); el.style.removeProperty("--a");
      });
      scope.removeAttribute("data-active");
      scope.style.removeProperty("--n");
      root.style.removeProperty("--glow-dx");
    };
  }, [ref, key]);
}

/* ═══ styles — this section's own CSS; the shared look lives in index.css ═══ */
injectCss("services", `
@layer components {
  /* ---- services: two forest scenes, each a hand of paper cards ----------------
     useCardFan owns the movement; this is what everything looks like.

     Three layouts, all decided here in CSS so the first paint is already right:
       < 64rem   a swipeable row of cards (no overlap, no tilt)
       >= 64rem  the fan, with the intro stacked above it
       >= 80rem  the fan, with the intro beside it
     Every breakpoint is in rem — Tailwind cannot order a px query against
     its rem ones. */
  .scene {
    --scene-pad: clamp(14px, 2vw, 24px);
    position: relative; overflow: hidden;
    padding: var(--scene-pad);
    border-radius: clamp(20px, 2.4vw, 28px);
    border: 1px solid transparent;
    background: transparent;
  }
  .scene::before { content: none; }
  .scene__grid { position: relative; z-index: 1; display: grid; gap: clamp(14px, 2.4vw, 28px); }
  @media (min-width: 80rem) {
    .scene__grid { grid-template-columns: minmax(0, .7fr) minmax(0, 2.3fr); align-items: center; }
  }

  .scene__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .scene__ctrl { display: flex; align-items: center; gap: 8px; }
  .scene__count { margin-right: 4px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; color: var(--stage-label); }
  .scene__count b { font-weight: 700; color: var(--stage-title); }
  /* the hook writes --n on the scene; a CSS counter turns it into "01", "02"… */
  .scene__count b::before { counter-reset: n var(--n, 1); content: counter(n, decimal-leading-zero); }
  .scene__btn {
    display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
    color: var(--stage-title); background: var(--stage-medal-bg); border: 1px solid var(--stage-medal-line);
    -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
    -webkit-tap-highlight-color: transparent; cursor: pointer;
    transition: transform var(--dur-3) var(--ease-out-expo), opacity var(--dur-2) ease, background-color var(--dur-2) ease;
  }
  .scene__btn:active { transform: scale(.9); }
  .scene__btn:focus-visible { outline: 2px solid var(--stage-mint); outline-offset: 3px; }
  .scene__btn[aria-disabled="true"] { opacity: .32; pointer-events: none; }
  @media (min-width: 64rem) { .scene__ctrl { display: none; } }

  .scene__label {
    display: flex; align-items: center; gap: 12px;
    font-family: var(--font-mono); font-size: 12px; font-weight: 700;
    letter-spacing: .18em; text-transform: uppercase; color: var(--stage-label);
  }
  .scene__medal {
    display: grid; place-items: center; width: 44px; height: 44px; flex: none;
    border-radius: 14px; color: var(--stage-label);
    background: var(--stage-medal-bg); border: 1px solid var(--stage-medal-line);
  }
  .scene__title {
    margin-top: 12px; max-width: 16ch;
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(25px, 2.5vw, 32px); line-height: 1.1; letter-spacing: -.02em;
    color: var(--stage-title);
  }
  .scene__title em { font-style: normal; color: var(--stage-mint); }
  .scene__lede { display: none; margin-top: 10px; max-width: 32ch; font-size: 14px; line-height: 1.6; color: var(--stage-text); }
  /* on a phone the cards say it already, and the paragraph costs ~55px a scene */
  @media (min-width: 40rem) { .scene__title { margin-top: 16px; } .scene__lede { display: block; } }

  /* four pips: they show which card the pointer is on (fan) or the swipe is on (rail) */
  .scene__pips { display: flex; gap: 6px; margin-top: 14px; }
  @media (min-width: 40rem) { .scene__pips { margin-top: 20px; } }
  .scene__pips i {
    display: block; height: 3px; width: 18px; border-radius: 3px;
    background: var(--stage-pip);
    transition: width var(--dur-4) var(--ease-out-expo), background-color var(--dur-4) ease;
  }
  .scene[data-active="1"] .scene__pips i:nth-child(1),
  .scene[data-active="2"] .scene__pips i:nth-child(2),
  .scene[data-active="3"] .scene__pips i:nth-child(3),
  .scene[data-active="4"] .scene__pips i:nth-child(4) { width: 42px; background: var(--stage-mint); }

  /* ---- the stage the cards sit on ---- */
  .fan {
    position: relative; display: flex; gap: 12px;
    margin-inline: calc(var(--scene-pad) * -1);
    padding: 10px var(--scene-pad) 14px; scroll-padding-inline: var(--scene-pad);
    overflow-x: auto; overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory; scrollbar-width: none;
    -webkit-tap-highlight-color: transparent;
  }
  .fan::-webkit-scrollbar { display: none; }
  .fan__glow { display: none; }

  .fan-card {
    position: relative; display: flex; flex-direction: column;
    flex: 0 0 min(78%, 290px); scroll-snap-align: start;
    padding: 18px 20px 18px; border-radius: 19px;
    color: var(--paper-ink);
    background: linear-gradient(150deg, var(--paper-1), var(--paper-2));
    border: 1px solid var(--paper-edge);
    box-shadow: var(--paper-shadow);
    transform-origin: 50% 82%;
    transition: box-shadow var(--dur-4) var(--ease-out-expo);
    outline: none;
  }
  .fan-card:focus-visible { outline: 2px solid var(--stage-mint); outline-offset: 5px; }
  .fan-card[data-active] { box-shadow: var(--paper-shadow-active); }

  /* a slow mint sweep across the card that is active */
  .fan-card__sheen { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; }
  .fan-card__sheen::before {
    content: ""; position: absolute; inset: -20% -60%; opacity: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(19, 121, 74, .16) 50%, transparent 60%);
    transform: translateX(-70%);
  }
  .fan-card[data-active] .fan-card__sheen::before {
    opacity: 1; transform: translateX(70%);
    transition: transform var(--dur-5) var(--ease-out-expo), opacity var(--dur-3) ease;
  }

  .fan-card__medal {
    display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%;
    color: var(--g-050); background: linear-gradient(145deg, var(--g-800), var(--g-950));
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12);
    transition: transform var(--dur-4) var(--ease-out-expo);
  }
  .fan-card[data-active] .fan-card__medal { transform: rotate(-8deg) scale(1.1); }
  /* big outlined numeral: decoration only, so the fill is transparent */
  .fan-card__no {
    font-family: var(--font-display); font-weight: 700; font-size: 38px; line-height: .9;
    color: transparent; -webkit-text-stroke: 1.2px rgba(6, 61, 45, .30);
  }
  .fan-card__title {
    margin-top: 16px; font-family: var(--font-display); font-weight: 600;
    font-size: 19px; line-height: 1.12; letter-spacing: -.01em; color: var(--paper-ink);
  }
  .fan-card__line { margin-top: 7px; font-size: 12.5px; line-height: 1.5; color: var(--paper-muted); }
  .fan-card__list { margin-top: auto; padding-top: 14px; display: grid; gap: 7px; }
  .fan-card__list li { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; line-height: 1.3; color: var(--paper-ink-2); }
  .fan-card__tick { flex: none; width: 13px; height: 13px; margin-top: 2px; color: var(--paper-accent); }

  /* ---- the slider: < 64rem ----
     Native scroll-snap does the touch physics. One card is centred, the next
     ones peek at either edge. --d and --a come from the hook (see useCardFan)
     and drive the individual transform properties, which compose with the
     \`transform\` the hook uses for the entrance — so the two never fight.
     Dimming is capped at 7%: the peeking cards still carry readable text. */
  @media (max-width: 63.99rem) {
    .fan {
      --cw: min(66vw, 290px);        /* narrow enough that ~23px of each neighbour shows: the swipe cue */
      gap: 12px;
      cursor: grab;
      /* centre the first and last card: half the leftover width on each side.
         100% is the grid cell, which the full-bleed margin makes narrower than .fan itself */
      padding: 20px calc((100% - var(--cw)) / 2 + var(--scene-pad)) 26px;
      /* NOT the same expression as the padding above. Percentages in padding resolve against the grid
         cell; in scroll-padding they resolve against the scroll container, which is 2x --scene-pad
         wider (the full-bleed margin). Reusing the padding value put every snap point 14px off-centre. */
      scroll-padding-inline: calc((100% - var(--cw)) / 2);
    }
    .fan-card {
      --d: 0; --a: 0;
      flex: 0 0 var(--cw);
      scroll-snap-align: center; scroll-snap-stop: always;   /* a hard flick moves one card, never skips */
      transform-origin: 50% 88%;
      scale: calc(1 - var(--a) * .075);
      rotate: calc(var(--d) * 2.4deg);
      translate: 0 calc(var(--a) * 12px);
      filter: brightness(calc(1 - var(--a) * .07));
    }
    .fan:active { cursor: grabbing; }
  }

  /* ---- the fan: >= 64rem ---- */
  @media (min-width: 64rem) {
    .fan {
      container-type: inline-size;               /* the cards size themselves from the stage, in cqw */
      --w: min(244px, 28cqw);
      --o: min(46px, 5.6cqw);                    /* how much each card hides of the one before */
      justify-content: center; align-items: stretch; gap: 0;   /* stretch: every card the same height */
      margin-inline: 0; padding: 30px 0 34px; scroll-padding-inline: 0;
      overflow: visible; scroll-snap-type: none;
    }
    .fan__glow {
      display: block; position: absolute; left: 50%; top: 50%; z-index: 0;
      width: 62%; aspect-ratio: 1; border-radius: 50%; pointer-events: none;
      background: radial-gradient(closest-side, var(--stage-spot), transparent 72%);
      transform: translate(calc(-50% + var(--glow-dx, 0px)), -50%);
      transition: transform var(--dur-5) var(--ease-out-expo);   /* the light follows the card you hover */
    }
    .fan-card {
      flex: 0 0 var(--w); width: var(--w); min-height: 268px;   /* the fan wants a little more air than the rail */
      margin-left: calc(var(--o) * -1);
      /* the next card covers the right-hand strip, so the text keeps clear of it */
      padding-right: calc(var(--o) + 12px);
      /* the resting pose, before and without JS */
      transform: rotate(var(--tilt, 0deg)) translateY(var(--rise, 0px));
      scroll-snap-align: none;
    }
    .fan__glow + .fan-card { margin-left: 0; }
    .fan-card:last-child { padding-right: 20px; }
  }

  /* reduced motion: the JS does not run, so give a plain hover instead */
  @media (prefers-reduced-motion: reduce) and (hover: hover) and (min-width: 64rem) {
    .fan-card { transition: transform var(--dur-4) var(--ease-out-expo), box-shadow var(--dur-4) var(--ease-out-expo); }
    .fan-card:hover, .fan-card:focus-visible {
      z-index: 20; box-shadow: var(--paper-shadow-active);
      transform: rotate(0deg) translateY(calc(var(--rise, 0px) - 12px));
    }
  }
}
`);