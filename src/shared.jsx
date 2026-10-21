/* ══════════════════════════════════════════════════════════════════════════
   shared.jsx — small pieces used by more than one section

   Icon, Reveal (scroll-in animation), SplitHeading (letter-by-letter headings), useMediaQuery, injectCss.

   In this file, top to bottom:
     0. injectCss (how a section carries its own CSS)
     1. Icon
     2. Reveal
     3. SplitHeading
     4. useMediaQuery
   ══════════════════════════════════════════════════════════════════════════ */

import { motion, useReducedMotion } from "motion/react";
import { Children, isValidElement, useState, useEffect } from "react";

/* ═══ injectCss — how a section carries its own CSS ═════════════════ */
/* Appends (or updates) one <style> in <head>. Sections call it once at the top, so a section's styles live in
   the same file as its markup. The rules are wrapped in @layer components, the same layer they were in before,
   so Tailwind utilities still win over them exactly as they used to. */
export function injectCss(id, text) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector(`style[data-css="${id}"]`);
  if (!el) { el = document.createElement("style"); el.dataset.css = id; document.head.appendChild(el); }
  el.textContent = text;
}

/* ═══ Icon — component  ·  was components/Icon.jsx ═════════════════════════ */
/* Every icon in one place, so no SVG path is ever pasted twice. */

const paths = {
  linkedin: <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.4 8.75 21 11 21 14v7h-4v-6.2c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21H9z" />,
  github: <path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />,
  mail: <g fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 7 9 6 9-6" /></g>,
  arrow: <g fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9 9 3M4.2 3H9v4.8" /></g>,
  copy: <g fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5.5" y="5.5" width="8" height="8" rx="2" /><path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" /></g>,
  /* Simplified marks, drawn in currentColor so they take the theme. Not the
     official brand lockups — recognisable silhouettes only. */
  shopify: <path fill="currentColor" d="M15.34 4.6c-.1-.08-.23-.1-.3-.1l-.98.07-.73-.72c-.08-.08-.23-.06-.29-.04l-.5.15c-.3-.86-.83-1.65-1.76-1.65h-.08c-.26-.34-.59-.49-.87-.49-2.17.01-3.2 2.72-3.53 4.1l-1.52.47c-.47.15-.48.16-.54.6-.5.33-1.28 10.3-1.28 10.3L12.6 21.5l5.62-1.21S15.44 4.78 15.34 4.6zM11.2 3.4l-1.3.4c0-.9-.1-1.5-.26-1.95.56.08.93.72 1.13 1.4.14.05.28.1.43.15zM9.2 1.93c.18.43.29 1.05.29 1.9v.12l-2.1.65c.4-1.55 1.17-2.3 1.81-2.67zm-.85-.8c.12 0 .24.04.35.12-.85.4-1.76 1.4-2.14 3.4l-1.66.51C5.27 3.47 6.2 1.13 8.35 1.13z"/>,
  wordpress: <g fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.2a8.8 8.8 0 0 1 3.96.94h-.3c-.72 0-1.23.63-1.23 1.3 0 .6.35 1.12.72 1.72.28.49.6 1.12.6 2.02 0 .63-.24 1.35-.56 2.37l-.73 2.45-2.66-7.9c.44-.03.84-.07.84-.07.4-.5.35-.63-.04-.6 0 0-1.19.09-1.96.09-.72 0-1.93-.1-1.93-.1-.4-.02-.44.58-.5.6 0 0 .37.05.77.08l1.15 3.15-1.61 4.84-2.69-8c.44-.2.84-.6.84-.6.4-.5.35-.63-.04-.6 0 0-1.19.08-1.96.08h-.47A8.8 8.8 0 0 1 12 3.2zM3.2 12c0-1.27.27-2.48.76-3.57l4.18 11.44A8.8 8.8 0 0 1 3.2 12zm8.8 8.8c-.86 0-1.69-.13-2.47-.36l2.63-7.63 2.69 7.37.6.12c-.9.33-1.87.5-2.85.5zm4.07-1.16 2.68-7.76c.5-1.25.67-2.25.67-3.14 0-.32-.02-.62-.06-.9A8.76 8.76 0 0 1 20.8 12a8.8 8.8 0 0 1-4.73 7.64z"/></g>,
  /* service icons — drawn to the same 24px grid */
  brush: <g fill="currentColor"><path d="M20.3 3.7a2.4 2.4 0 0 0-3.4 0l-7.5 7.5 3.4 3.4 7.5-7.5a2.4 2.4 0 0 0 0-3.4z"/><path d="M8.3 12.5c-2.5 0-4 1.6-4 3.8 0 1.3-.8 2.2-2 2.7 1.1 1.5 2.7 2.3 4.5 2.3 2.6 0 4.5-2 4.5-4.4z"/></g>,
  gear: <path fill="currentColor" fillRule="evenodd" d="M10.03 4.66 L10.32 1.94 L13.68 1.94 L13.97 4.66 L15.80 5.42 L17.92 3.70 L20.30 6.08 L18.58 8.20 L19.34 10.03 L22.06 10.32 L22.06 13.68 L19.34 13.97 L18.58 15.80 L20.30 17.92 L17.92 20.30 L15.80 18.58 L13.97 19.34 L13.68 22.06 L10.32 22.06 L10.03 19.34 L8.20 18.58 L6.08 20.30 L3.70 17.92 L5.42 15.80 L4.66 13.97 L1.94 13.68 L1.94 10.32 L4.66 10.03 L5.42 8.20 L3.70 6.08 L6.08 3.70 L8.20 5.42Z M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z"/>,
  elementor: <path fill="currentColor" fillRule="evenodd" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 7v10h2V7zM12.5 7v2H17V7zM12.5 11v2H17v-2zM12.5 15v2H17v-2z"/>,
  cart: <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h2.3l2.1 10.1a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1L20.4 8H6.2"/><circle cx="9.7" cy="19.4" r="1.3"/><circle cx="17" cy="19.4" r="1.3"/></g>,
  store: <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5V20h16v-9.5M3 10l2-5.5h14L21 10c0 1.4-1.1 2.4-2.5 2.4S16 11.4 16 10c0 1.4-1.1 2.4-2.5 2.4S11 11.4 11 10c0 1.4-1.1 2.4-2.5 2.4S6 11.4 6 10M9.5 20v-4.5h5V20"/></g>,
  chevron: <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M9.5 5.5 16 12l-6.5 6.5"/>,
  check: <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M5 12.6l4.3 4.2L19 7.2"/>,
  theme: <g fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2.5" y="3.5" width="19" height="17" rx="3"/><path d="M2.5 9h19M8 9v11.5"/></g>,
  code: <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></g>,
  bolt: <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M13 2 4 13.5h6L11 22l9-11.5h-6z"/></g>,
  box: <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z"/><path d="M3.5 7 12 11.3 20.5 7M12 11.3v9.9"/></g>,
  download: <g fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 2v8m0 0 3-3m-3 3L5 7" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 11.5v1a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-1" strokeLinecap="round" /></g>
};

const boxes = { linkedin: 24, github: 24, mail: 24, arrow: 12, copy: 16, download: 16,
                theme: 24, code: 24, bolt: 24, box: 24,
                shopify: 24, wordpress: 24,
                brush: 24, gear: 24, elementor: 24, cart: 24, check: 24, store: 24, chevron: 24 };

export function Icon({ name, ...rest }) {
  const size = boxes[name] || 24;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true" {...rest}>
      {paths[name]}
    </svg>
  );
}

export function Monogram({ id = "mark", className }) {
  // the gradient needs a unique id per instance, or the second one inherits
  const grad = `${id}-grad`;
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5be49b" />
          <stop offset="1" stopColor="#016a4e" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="16" fill="none" stroke={`url(#${grad})`} strokeWidth="2.5" />
      <path d="M16 19h21" fill="none" stroke={`url(#${grad})`} strokeWidth="4" strokeLinecap="round" />
      <path d="M26.5 19v26" fill="none" stroke={`url(#${grad})`} strokeWidth="4" strokeLinecap="round" />
      <path d="M46 19v18.5c0 5-3.3 7.8-8 7.8-3.4 0-6-1.4-7.6-3.8" fill="none" stroke="#8cffc6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══ Reveal — component  ·  was components/Reveal.jsx ═════════════════════ */
/* ==========================================================================
   <Reveal> — one wrapper for every entrance on the site.

     <Reveal as="h2" className="text-step-3">Heading</Reveal>
     <Reveal delay={.08}>…</Reveal>
     <Reveal stagger>…children each animate in turn…</Reveal>

   whileInView handles the observing, so there is no IntersectionObserver to
   write. viewport={{ once: true }} means it never replays — content that
   re-animates every time you scroll past gets annoying fast.

   amount: REVEAL_AT waits until a third of the element is visible. Firing at one
   pixel looks accidental rather than deliberate.
   ========================================================================== */

const EASE = [.16, 1, .3, 1];

/* How far into view a thing must be before it reveals. ONE number for the
   whole site — Reveal, SplitHeading, and the hand-rolled IntersectionObservers
   in Experience, Services and Footer all use it.

   It used to be four different numbers (amount .35 and .5, threshold 0, .1,
   .18, .2), so sections fired at different scroll positions and the page felt
   like it was animating at random rather than responding to you.

   0.22 is early enough that nothing has to be fully on screen before it moves,
   late enough that a tall section is not already animating off the bottom. */
export const REVEAL_AT = 0.22;

export function Reveal({
  as = "div",
  delay = 0,
  y = 22,
  blur = false,
  stagger = false,
  amount = REVEAL_AT,
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;

  // reduced motion: render it, do not move it
  if (reduce) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  if (stagger) {
    return (
      <Tag
        {...rest}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: .1, delayChildren: delay } }
        }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      {...rest}
      initial={{ opacity: 0, y, ...(blur ? { filter: "blur(6px)" } : null) }}
      whileInView={{ opacity: 1, y: 0, ...(blur ? { filter: "blur(0px)" } : null) }}
      viewport={{ once: true, amount }}
      transition={{ duration: .75, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* A child of <Reveal stagger>. It inherits the parent's timing, so the
   rhythm is written once on the parent rather than as a delay per item. */
export function RevealItem({ as = "div", y = 24, children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduce) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  return (
    <Tag
      {...rest}
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0, transition: { duration: .7, ease: EASE } }
      }}
    >
      {children}
    </Tag>
  );
}

/* ═══ SplitHeading — component  ·  was components/SplitHeading.jsx ═════════ */
/* ==========================================================================
   <SplitHeading> — headings whose letters arrive one at a time.

     <SplitHeading as="h2" className="text-step-3">What I take on.</SplitHeading>

     <SplitHeading as="h1" delay={.1}>
       Shopify storefronts
       <span className="text-link">that stay fast</span>
     </SplitHeading>

   A nested element becomes its own line and keeps its className — that is
   how the hero's accent clause works.

   To colour part of a line, use <Accent>. It stays inline with its
   neighbours instead of starting a new line:

     <SplitHeading>
       <Accent className="text-link">Shopify</Accent> &amp; WordPress Development
     </SplitHeading>

   ---------------------------------------------------------------------------
   Why each letter carries its own delay rather than using staggerChildren:

   staggerChildren only schedules direct motion children, and the letters sit
   three levels down (line → word → letter). Making every level a motion
   element with its own stagger looks like it should work, and does while you
   scroll normally — but if the heading enters the viewport in a single jump
   (an anchor landing, scrollIntoView, a restored scroll position) the nested
   schedule misfires and most letters stay at opacity 0 permanently. An
   invisible heading is a far worse failure than a missing animation.

   A flat index with an explicit delay is immune to that: every letter is an
   independent animation that cannot be left unscheduled.
   ---------------------------------------------------------------------------

   Accessibility: the sentence is set as aria-label and every fragment is
   aria-hidden, so a screen reader announces one heading instead of spelling
   it out. Characters are grouped into words and the word is the
   inline-block, so a line break can never fall mid-word.
   ========================================================================== */


/* Letters drift in from the left and settle into place, in reading order.
   The small negative x plus a blur reads as the letter sliding in from
   off-frame; a larger offset would have letters crossing over their
   neighbours, which looks like a glitch rather than an entrance.

   No clipping window here. Clipping works for a vertical rise because the
   line box is a natural edge, but a horizontal slide inside a word box
   would cut each letter against its neighbour. */
const HIDDEN = { x: "-0.55em", opacity: 0, filter: "blur(6px)" };
const SHOWN  = { x: "0em",     opacity: 1, filter: "blur(0px)" };

/* named wordStyle, not word: the map below binds `word` to the string it is
   splitting, which would shadow this and hand React a string for style */
const wordStyle = {
  display: "inline-block",
  whiteSpace: "nowrap"
};

/* Marks a coloured run inside a line. SplitHeading reads its props and never
   renders it, so what it returns only matters on the reduced-motion path,
   where the children are rendered as they were written. */
export function Accent({ className, children }) {
  return <span className={className}>{children}</span>;
}

export function SplitHeading({
  as = "h2",
  delay = 0,
  stagger = 0.02,
  amount = REVEAL_AT,
  className = "",
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);
  const Tag = motion[as] || motion.h2;
  const Plain = as;

  /* A line is a list of segments; a segment is text plus the className it
     should carry. Plain strings and block elements start a new line, an
     <Accent> continues the current one — and so does text that follows an
     <Accent>, so "Shopify & WordPress" stays one line. */
  const lines = [];
  let afterAccent = false;

  Children.forEach(children, child => {
    if (typeof child === "string" || typeof child === "number") {
      const text = String(child);
      if (!text.trim()) return;
      if (afterAccent && lines.length) lines[lines.length - 1].segs.push({ text });
      else lines.push({ segs: [{ text }] });
      afterAccent = false;
    } else if (isValidElement(child)) {
      const text = String(child.props.children);
      if (child.type === Accent) {
        const seg = { text, className: child.props.className };
        if (lines.length && (afterAccent || !lines[lines.length - 1].block)) lines[lines.length - 1].segs.push(seg);
        else lines.push({ segs: [seg] });
        afterAccent = true;
      } else {
        lines.push({ segs: [{ text }], className: child.props.className, block: true });
        afterAccent = false;
      }
    }
  });

  // flatten each line to words of styled characters, collapsing stray spaces
  const model = lines.map(line => {
    const chars = [];
    line.segs.forEach(seg => [...seg.text.replace(/\s+/g, " ")].forEach(ch => chars.push({ ch, className: seg.className })));
    while (chars.length && chars[0].ch === " ") chars.shift();
    while (chars.length && chars[chars.length - 1].ch === " ") chars.pop();
    const words = [[]];
    chars.forEach(c => (c.ch === " " ? words.push([]) : words[words.length - 1].push(c)));
    return { className: line.className, words: words.filter(w => w.length) };
  });
  const label = model.map(l => l.words.map(w => w.map(c => c.ch).join("")).join(" ")).join(" ");

  if (reduce) {
    return <Plain className={className} {...rest}>{children}</Plain>;
  }

  let index = 0;   // runs across the whole heading, not per line

  const Char = ({ ch, className: cls }) => {
    const i = index++;
    return (
      <motion.span
        initial={HIDDEN}
        animate={shown ? SHOWN : HIDDEN}
        transition={{
          duration: .42,
          ease: EASE,
          delay: delay + i * stagger,
          opacity: { duration: .24, delay: delay + i * stagger }
        }}
        className={cls}
        style={{ display: "inline-block", willChange: "transform, opacity" }}
      >
        {ch}
      </motion.span>
    );
  };

  return (
    <Tag
      className={className}
      aria-label={label}
      onViewportEnter={() => setShown(true)}
      viewport={{ once: true, amount }}
      {...rest}
    >
      <span aria-hidden="true">
        {model.map((line, li) => (
          <span key={li} className={line.className} style={{ display: "block" }}>
            {line.words.map((word, wi) => (
              <span key={wi} style={wordStyle}>
                {word.map((c, ci) => <Char key={ci} ch={c.ch} className={c.className} />)}
                {wi < line.words.length - 1 && <Char ch={"\u00A0"} />}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* ═══ useMediaQuery — behaviour  ·  was hooks/useMediaQuery.js ═════════════ */
/* ==========================================================================
   useMediaQuery("(min-width: 1024px)")

   For things that must not merely be hidden but genuinely not exist. CSS
   `hidden` still mounts the component — the Lanyard would spin up a WebGL
   context, load textures and run a physics loop on a phone where nobody
   can see it.

   Starts false on the server and on first paint, so the heavy branch never
   renders before we know the viewport.

   useMediaQuery(query, true) reads the real answer on the very first render
   instead. Use it when the result only configures behaviour and the layout
   itself is already handled in CSS — starting false would make the first
   render configure for the wrong width and then flip.
   ========================================================================== */

export function useMediaQuery(query, eager = false) {
  const [matches, setMatches] = useState(
    () => eager && typeof matchMedia === "function" && matchMedia(query).matches
  );

  useEffect(() => {
    const mq = matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}