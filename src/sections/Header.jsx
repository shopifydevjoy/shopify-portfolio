/* ══════════════════════════════════════════════════════════════════════════
   Header.jsx

   Everything for this section: the capsule nav, theme toggle, mobile menu and scroll progress.

   In this file, top to bottom:
     1. Header
     2. ThemeToggle
     3. useTheme
     4. useActiveSection
     5. useBodyScrollLock
     6. styles
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from "motion/react";
import { Icon, Monogram, injectCss } from "../shared";
import { nav, profile } from "../content";

/* ═══ Header — the section  ·  was components/Header.jsx ═══════════════════ */
/* Long class strings pulled out as constants. Inline they bury the markup,
   and a shared constant is the Tailwind way to reuse without @apply. */
const linkBase =
  "relative z-10 inline-flex items-center rounded-pill px-4 py-2.5 " +
  "text-[13.5px] font-normal whitespace-nowrap transition-colors duration-300";

const resumeBase =
  "inline-flex flex-none items-center gap-2 rounded-pill border px-5 " +
  "font-display text-[12.5px] font-semibold uppercase tracking-[.08em] " +
  "transition-all duration-500 ease-out-expo";

const resumeLook =
  "h-[42px] border-accent-soft/40 bg-linear-to-b from-accent-soft/15 to-accent/10 text-accent-hi " +
  "hover:-translate-y-px hover:border-accent-soft hover:from-accent-soft hover:to-[var(--g-500)] " +
  "hover:text-invert hover:shadow-[0_12px_28px_-14px_rgba(0,200,140,.9)]";

const panelVariants = {
  closed: { opacity: 0, transition: { duration: .25, ease: [.4, 0, 1, 1] } },
  open:   { opacity: 1, transition: { duration: .35, ease: [.16, 1, .3, 1],
                                      staggerChildren: .055, delayChildren: .08 } }
};
const itemVariants = {
  closed: { opacity: 0, y: 16, transition: { duration: .2 } },
  open:   { opacity: 1, y: 0, transition: { duration: .55, ease: [.16, 1, .3, 1] } }
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [stuck, setStuck] = useState(false);
  const active = useActiveSection(nav.map(n => n.id));
  const reduce = useReducedMotion();

  useBodyScrollLock(open);

  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: .35 });
  useMotionValueEvent(scrollY, "change", y => setStuck(y > 24));

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    const mq = matchMedia("(min-width: 921px)");
    const onWide = e => { if (e.matches) setOpen(false); };
    addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => { removeEventListener("keydown", onKey); mq.removeEventListener("change", onWide); };
  }, []);

  const lastFocus = useRef(null);
  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      requestAnimationFrame(() => document.querySelector("[data-panel] a")?.focus());
    } else if (lastFocus.current) {
      lastFocus.current.focus?.();
      lastFocus.current = null;
    }
  }, [open]);

  const lit = hovered || active;

  return (
    <header className="header-safe fixed inset-x-0 top-0 z-50 pt-[calc(16px+env(safe-area-inset-top,0px))]">

      {/* reading progress */}
      <div className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top,0px)] z-60 h-0.5 bg-accent-hi/7">
        <motion.i
          className="block h-full bg-linear-to-r from-accent via-accent-soft to-[var(--g-100)] shadow-[0_0_12px_rgba(91,228,155,.55)]"
          style={{ scaleX: progress, transformOrigin: "0 50%" }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-site justify-center px-gutter">
        <motion.div
          className={
            "relative flex h-[62px] items-center gap-[clamp(14px,2vw,30px)] rounded-pill " +
            "border py-0 pr-2.5 pl-[18px] max-[920px]:w-full max-[920px]:pr-2 " +
            "shadow-[inset_0_1px_0_rgba(190,255,225,.10),0_18px_40px_-22px_rgba(0,0,0,.9)] " +
            "transition-[background-color,border-color,box-shadow] duration-500 ease-out-expo " +
            // backdrop-filter makes an element the containing block for fixed
            // descendants, so it is dropped below the breakpoint where the
            // panel needs the viewport
            "backdrop-blur-[18px] backdrop-saturate-150 max-[920px]:backdrop-blur-none " +
            (stuck
              ? "border-line-strong bg-glass-stuck"
              : "border-line bg-glass max-[920px]:bg-glass-stuck")
          }
          initial={reduce ? false : { y: -26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: .7, ease: [.16, 1, .3, 1], delay: .15 }}
        >

          <a href="#top" aria-label={`${profile.name} — home`}
             className="group relative z-20 flex flex-none items-center gap-2.5 font-mono text-[13.5px] text-primary">
            <Monogram id="header"
              className="size-[26px] transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-107" />
            <span>{profile.short}</span>
          </a>

          <div className="ml-auto hidden items-center gap-2 max-[920px]:flex">
            <ThemeToggle />

          <button
            type="button"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label="Menu"
            onClick={() => setOpen(o => !o)}
            className="group relative z-20 hidden size-[42px] place-items-center max-[920px]:grid"
          >
            <span className="relative block h-[11px] w-5">
              <i className={"absolute left-0 top-0 h-[1.5px] w-full rounded-sm bg-body transition-transform duration-500 ease-out-expo "
                + (open ? "translate-y-[4.75px] rotate-45" : "")} />
              <i className={"absolute bottom-0 left-0 h-[1.5px] rounded-sm bg-body transition-all duration-500 ease-out-expo "
                + (open ? "w-full -translate-y-[4.75px] -rotate-45" : "w-[62%] group-hover:w-full")} />
            </span>
          </button>
          </div>

          {/* desktop nav */}
          <nav aria-label="Primary"
               onPointerLeave={() => setHovered(null)}
               className="relative flex items-center gap-0.5 max-[920px]:hidden">
            {nav.map(item => (
              <a key={item.id} href={`#${item.id}`}
                 onPointerEnter={() => setHovered(item.id)}
                 className={linkBase + (active === item.id || hovered === item.id
                   ? " text-accent-hi" : " text-muted")}>
                {lit === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-pill border border-accent-soft/30 bg-accent-soft/14"
                    transition={{ type: "spring", stiffness: 420, damping: 36, mass: .7 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </nav>

          <ThemeToggle className="max-[920px]:hidden" />

          <a href={profile.resume} download
             className={`${resumeBase} ${resumeLook} group max-[920px]:hidden`}>
            <Icon name="download" className="size-[15px] transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" />
            Resume
          </a>

        </motion.div>
      </div>

      {/* mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="primary-nav"
            data-panel
            aria-label="Primary"
            variants={panelVariants}
            initial="closed" animate="open" exit="closed"
            onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
            className="fixed inset-0 -z-10 flex flex-col items-start justify-center gap-0.5 bg-overlay
                       pt-[calc(96px+env(safe-area-inset-top,0px))] pr-gutter pl-gutter
                       pb-[calc(32px+env(safe-area-inset-bottom,0px))]"
          >
            {nav.map(item => (
              <motion.a key={item.id} href={`#${item.id}`} variants={itemVariants}
                onClick={() => setOpen(false)}
                className={"py-2.5 font-display text-[clamp(28px,9vw,40px)] font-light transition-colors "
                  + (active === item.id ? "text-accent-hi" : "text-body")}>
                {item.label}
              </motion.a>
            ))}

            <motion.div variants={itemVariants} className="mt-auto grid justify-items-start pt-[34px]">
              <a href={profile.resume} download className={`${resumeBase} ${resumeLook} mb-6 h-12`}>
                <Icon name="download" className="size-[15px]" />Resume
              </a>
              <a href={`mailto:${profile.email}`} className="font-mono text-sm text-body">{profile.email}</a>
              <a href={profile.statusUrl} target="_blank" rel="noreferrer"
                className="link-sweep mt-2.5 inline-flex items-center gap-2.5 text-[13px] text-muted">
                <i className="dot" />{profile.status}
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══ ThemeToggle — component  ·  was components/ThemeToggle.jsx ═══════════ */
/* A single track with a knob that slides. One control, two states, no icon
   swap mid-animation — the icons are both present and cross-fade. */
function ThemeToggle({ className = "" }) {
  const [theme, toggle] = useTheme();
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={light}
      aria-label={`Switch to ${light ? "dark" : "light"} theme`}
      title={`Switch to ${light ? "dark" : "light"} theme`}
      className={"relative grid h-8 w-[58px] flex-none items-center rounded-pill border "
        + "border-line bg-white/[.03] px-1 transition-colors duration-500 "
        + "hover:border-line-strong " + className}
    >
      <motion.span
        aria-hidden="true"
        className="absolute left-1 size-6 rounded-full bg-accent-soft/20 ring-1 ring-accent-soft/40"
        animate={{ x: light ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 34, mass: .6 }}
      />
      <span className="pointer-events-none relative flex w-full justify-between px-[5px]">
        {/* moon */}
        <svg viewBox="0 0 16 16" className={"size-3.5 transition-opacity duration-300 "
          + (light ? "opacity-35" : "opacity-100")} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z" strokeLinejoin="round" />
        </svg>
        {/* sun */}
        <svg viewBox="0 0 16 16" className={"size-3.5 transition-opacity duration-300 "
          + (light ? "opacity-100" : "opacity-35")} fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1 1M11.8 11.8l1 1M12.8 3.2l-1 1M4.2 11.8l-1 1" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}

/* ═══ useTheme — behaviour  ·  was hooks/useTheme.js ═══════════════════════ */
/* ==========================================================================
   useTheme()

   Returns [theme, toggle]. The initial value is read from the DOM, not
   computed here — the inline script in index.html has already decided it
   before React mounted, and recomputing risks disagreeing with it.

   Following the system preference is the default. Once the visitor picks a
   theme that choice is stored and the OS no longer overrides it.
   ========================================================================== */

const KEY = "theme";

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark"
  );

  // enable colour transitions only after mount, so the first paint is instant
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      document.documentElement.setAttribute("data-theme-ready", "");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(KEY, theme); } catch { /* private mode */ }
  }, [theme]);

  /* The header renders a toggle for desktop and another for the panel, and
     each call of this hook has its own state. Without this they drift: one
     flips, the other still shows the old position. The DOM attribute is the
     single source of truth, so every instance watches it. */
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setTheme(el.dataset.theme || "dark");
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    sync();
    return () => mo.disconnect();
  }, []);

  // follow the OS until the visitor makes a choice of their own
  useEffect(() => {
    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (stored) return;

    const mq = matchMedia("(prefers-color-scheme: light)");
    const onChange = e => setTheme(e.matches ? "light" : "dark");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}

/* ═══ useActiveSection — behaviour  ·  was hooks/useActiveSection.js ═══════ */
/* ==========================================================================
   useActiveSection(ids)

   Returns the id of the section currently under the reader's eye line, or
   "" when none is — the hero has no nav entry, so nothing should be marked
   active while you are reading it.

   The -45% insets leave a thin band across the middle of the viewport: a
   section counts as current when it reaches the middle, not the moment it
   peeks in at the bottom.

   The observer tracks which sections are in the band rather than only
   reacting to entries. An earlier version set the active id on intersect
   and never cleared it, so once any section had matched, the nav kept
   pointing at it forever — including back at the top of the page.

   State is right here: this changes a few times per page, not per frame,
   and the value decides what renders.
   ========================================================================== */

function useActiveSection(ids) {
  const [active, setActive] = useState("");
  const key = ids.join("|");

  useEffect(() => {
    const order = key.split("|");
    const targets = order.map(id => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;

    const inBand = new Set();

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) inBand.add(e.target.id);
        else inBand.delete(e.target.id);
      }
      // keep document order, so overlapping sections resolve predictably
      const next = order.find(id => inBand.has(id)) || "";
      setActive(prev => (prev === next ? prev : next));
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [key]);

  return active;
}

/* ═══ useBodyScrollLock — behaviour  ·  was hooks/useBodyScrollLock.js ═════ */
/* ==========================================================================
   useBodyScrollLock(locked) — holds the page still behind an open overlay
   ========================================================================== */

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [locked]);
}

/* ═══ styles — this section's own CSS; the shared look lives in index.css ═══ */
injectCss("header", `
@layer components {
  /* ---- the safe-area strip behind a phone's status bar ---- */
  .header-safe::before {
    content: ""; position: fixed; inset: 0 0 auto;
    height: env(safe-area-inset-top, 0px); z-index: -1;
    background: inherit;
  }
}
`);