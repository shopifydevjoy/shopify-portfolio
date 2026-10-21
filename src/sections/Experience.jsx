/* ══════════════════════════════════════════════════════════════════════════
   Experience.jsx

   Two timelines side by side — work on the left, study on the right. Each
   runs its own ring down its own dashed rail; a milestone pops the instant
   the ring reaches it and the rail burns in behind.

   Motion taken from vertical_start_up_timeline.svg. See the TIMING block
   for what was measured and what was changed on purpose.

   In this file, top to bottom:
     1. content (work, study)
     2. timing
     3. injected CSS
     4. Timeline
     5. Experience section (main export)
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Reveal, SplitHeading, Accent, injectCss } from "../shared";

/* ═══ Content ═══════════════════════════════════════════════════════════
   Newest first in both columns. `current: true` adds the pill and fills
   the ring centre. `description` is optional — the study column omits it. */

const work = [
  {
    title: "Team Leader & Project Coordinator",
    org: "Maktech",
    orgUrl: "https://www.maktechgroup.com",
    period: "Jan 2026 — Present",
    current: true,
    description:
      "Lead the Shopify and WordPress build team, owning scoping, code review and launch from first call through post-launch support.",
  },
  {
    title: "Shopify & WordPress Developer",
    org: "Maktech",
    orgUrl: "https://www.maktechgroup.com",
    period: "Sep 2025 — Dec 2025",
    description:
      "Joined the permanent team building custom themes and WooCommerce stores, taking client work from brief to live site.",
  },
  {
    title: "Intern",
    org: "Maktech",
    orgUrl: "https://www.maktechgroup.com",
    period: "Jun 2025 — Aug 2025",
    description:
      "Started on theme fixes and small client tickets, shipping to production inside the first month.",
  },
];

const study = [
  {
    title: "BSc in Computer Science & Engineering",
    org: "Uttara University",
    period: "Present",
    current: true,
  },
  {
    title: "Diploma in Computer Engineering",
    org: "Shariatpur Polytechnic Institute",
    period: "2022",
  },
  {
    title: "Secondary School Certificate, Science",
    org: "Chetamari S.M. Govt. High School",
    period: "2018",
  },
];

/* ═══ Timing ════════════════════════════════════════════════════════════
   Measured from the source SVG:
     rail      static dashed, full height from frame 0 (it is NOT drawn)
     traveller one ring, y 138 -> 833, LINEAR, constant 152 px/s
     nodes     y 138 / 249.6 / 366.3 / 483 / 599.6 / 711.2
     pops at   0 / 0.732 / 1.498 / 2.265 / 3.032 / 3.765 s
     check     (249.6-138)/152 = 0.734s vs pop 0.732s — the ring ARRIVING
               is what fires each pop, not a fixed stagger
     pop       scale 0 -> 1, 400ms, cubic-bezier(.333, 0, 0, 1)
     text      discrete display none -> inline at the same instant

   Changed on purpose:
     SPEED     300 px/s, not 152. The SVG was a 375px mobile canvas; at
               152 px/s a desktop column takes far too long.
     TEXT_MS   240ms fade instead of a hard cut. The cut is fine on glyph
               outlines, but on real prose it reads as a glitch.

   Each column observes itself, so side by side they start together and
   stacked on a phone each starts as it is scrolled to.                   */

const SPEED = 300; // px per second the ring travels
const POP_MS = 400;
const TEXT_MS = 240;

/* ═══ CSS ═══════════════════════════════════════════════════════════════
   No backticks in these comments — they would close the template literal. */

injectCss("experience-timeline", `
  @layer components {
    .xp-cols {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: clamp(34px, 5vw, 76px);
      align-items: start;
    }

    @media (max-width: 860px) {
      .xp-cols { grid-template-columns: minmax(0, 1fr); gap: clamp(44px, 8vw, 64px); }
    }

    .xp {
      --xp-ring: 22px;
      --xp-band: 5px;
      position: relative;
    }

    .xp-col-label {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 clamp(20px, 2.6vw, 30px);
    }
    .xp-col-label i {
      width: 22px; height: 1px;
      background: var(--c-accent-soft);
      flex: none;
    }

    .xp-rail,
    .xp-rail-lit {
      position: absolute;
      left: 0;
      top: calc(var(--xp-ring) / 2);
      width: 1.5px;
      margin-left: -.75px;
      background-image: linear-gradient(
        180deg,
        var(--c-accent-soft) 0 4px,
        transparent 4px 8px
      );
      background-size: 1.5px 8px;
      background-repeat: repeat-y;
    }

    /* the path ahead: present from the first frame, barely lit */
    .xp-rail { bottom: 0; opacity: .22; }

    /* the stretch already covered. Height, not scaleY — scaling would
       stretch the dashes out of their 4/4 rhythm. */
    .xp-rail-lit { height: 0; opacity: .95; }
    .xp-rail-lit.is-running { transition: height var(--xp-travel) linear; }

    .xp-rail-lit::after {
      content: "";
      position: absolute;
      left: 50%; bottom: -24px;
      width: 1.5px; height: 48px;
      transform: translateX(-50%);
      background: linear-gradient(180deg, transparent, var(--c-accent-soft));
      filter: blur(1.5px);
      opacity: .7;
    }
    .xp-rail-lit.is-done::after { opacity: 0; transition: opacity var(--dur-2) ease; }

    /* ring, shared by the traveller and every milestone.
       SVG: 24px outer, 13.1px hole, 5.45px band, 3-stop horizontal gradient. */
    .xp-ring {
      position: absolute;
      left: 0; top: 0;
      width: var(--xp-ring); height: var(--xp-ring);
      margin-left: calc(var(--xp-ring) / -2);
      border-radius: 50%;
      background: linear-gradient(
        90deg,
        var(--c-accent-soft) 8.3%,
        var(--c-accent) 54.2%,
        var(--c-accent-hi) 100%
      );
      -webkit-mask: radial-gradient(circle at 50% 50%,
        transparent calc(var(--xp-ring) / 2 - var(--xp-band) - .5px),
        #000 calc(var(--xp-ring) / 2 - var(--xp-band)));
              mask: radial-gradient(circle at 50% 50%,
        transparent calc(var(--xp-ring) / 2 - var(--xp-band) - .5px),
        #000 calc(var(--xp-ring) / 2 - var(--xp-band)));
    }

    .xp-traveller {
      opacity: 0;
      z-index: 2;
      filter: drop-shadow(0 0 6px color-mix(in srgb, var(--c-accent-soft) 45%, transparent));
      will-change: transform;
    }
    .xp-traveller.is-running {
      opacity: 1;
      /* LINEAR — the SVG keySplines are 0 0 1 1 across all 139 frames */
      transition: transform var(--xp-travel) linear, opacity var(--dur-1) ease;
    }
    .xp-traveller.is-done { opacity: 0; transition: opacity var(--dur-2) ease; }

    .xp-node { transform: scale(0); transform-origin: 50% 50%; }
    .xp-node.is-in {
      transform: scale(1);
      transition: transform ${POP_MS}ms var(--ease-pop);
    }

    /* filled centre marks the entry still running */
    .xp-dot {
      position: absolute;
      left: 0; top: 0;
      width: var(--xp-ring); height: var(--xp-ring);
      margin-left: calc(var(--xp-ring) / -2);
      display: grid; place-items: center;
      transform: scale(0);
      z-index: 1;
    }
    .xp-dot.is-in {
      transform: scale(1);
      transition: transform ${POP_MS}ms var(--ease-pop);
    }
    .xp-dot::after {
      content: "";
      width: calc(var(--xp-ring) / 2 - var(--xp-band) - 2px);
      height: calc(var(--xp-ring) / 2 - var(--xp-band) - 2px);
      border-radius: 50%;
      background: var(--c-accent-soft);
    }

    .xp-body { opacity: 0; }
    .xp-body.is-in { opacity: 1; transition: opacity ${TEXT_MS}ms ease-out; }

    .xp-item {
      position: relative;
      padding-left: clamp(32px, 3vw, 42px);
      padding-bottom: clamp(30px, 3.4vw, 46px);
    }
    .xp-item:last-child { padding-bottom: 0; }

    .xp-pill {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 999px;
      background: var(--c-accent-soft);
      color: var(--c-text-invert);
      font-family: var(--font-display);
      font-size: 10px; font-weight: 700;
      letter-spacing: .14em; text-transform: uppercase;
      white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce) {
      .xp-traveller { display: none; }
      .xp-rail-lit { height: 100%; transition: none; }
      .xp-rail-lit::after { display: none; }
      .xp-node, .xp-dot { transform: scale(1); transition: none; }
      .xp-body { opacity: 1; transition: none; }
    }
  }
`);

/* ═══ Timeline ══════════════════════════════════════════════════════════ */

function Timeline({ label, items }) {
  const wrapRef = useRef(null);
  const travellerRef = useRef(null);
  const litRef = useRef(null);
  const itemRefs = useRef([]);
  const timers = useRef([]);
  const ran = useRef(false);

  const [lit, setLit] = useState(() => items.map(() => false));

  /* park the ring on the first milestone before anything is painted */
  useLayoutEffect(() => {
    const first = itemRefs.current[0];
    const wrap = wrapRef.current;
    if (!first || !wrap || !travellerRef.current) return;
    const top =
      first.getBoundingClientRect().top - wrap.getBoundingClientRect().top;
    travellerRef.current.style.transform = `translateY(${top}px)`;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(items.map(() => true));
      return;
    }

    const run = () => {
      if (ran.current) return;
      ran.current = true;

      const base = wrap.getBoundingClientRect();
      const ring = parseFloat(
        getComputedStyle(wrap).getPropertyValue("--xp-ring")
      );

      // each milestone's centre, measured from the top of this column
      const tops = itemRefs.current.map(
        (el) => el.getBoundingClientRect().top - base.top + ring / 2
      );
      const start = tops[0];
      const end = base.height;
      const travelMs = ((end - start) / SPEED) * 1000;

      [travellerRef.current, litRef.current].forEach((el) => {
        if (!el) return;
        el.style.setProperty("--xp-travel", `${travelMs}ms`);
        el.classList.add("is-running");
      });

      requestAnimationFrame(() => {
        if (travellerRef.current) {
          travellerRef.current.style.transform = `translateY(${end - ring / 2}px)`;
        }
        if (litRef.current) litRef.current.style.height = `${end - start}px`;
      });

      // a milestone fires the moment the ring reaches it
      tops.forEach((top, i) => {
        const at = ((top - start) / SPEED) * 1000;
        timers.current.push(
          setTimeout(() => {
            setLit((prev) => {
              const nextState = [...prev];
              nextState[i] = true;
              return nextState;
            });
          }, at)
        );
      });

      timers.current.push(
        setTimeout(() => {
          travellerRef.current?.classList.add("is-done");
          litRef.current?.classList.add("is-done");
        }, travelMs)
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.22 }
    );
    io.observe(wrap);

    const pending = timers.current;
    return () => {
      io.disconnect();
      pending.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p className="label xp-col-label">
        <i aria-hidden="true" />
        {label}
      </p>

      <div ref={wrapRef} className="xp">
        <span className="xp-rail" aria-hidden="true" />
        <span ref={litRef} className="xp-rail-lit" aria-hidden="true" />
        <span ref={travellerRef} className="xp-ring xp-traveller" aria-hidden="true" />

        <ol className="relative m-0 list-none p-0">
          {items.map((item, i) => (
            <li
              key={`${item.org}-${item.period}`}
              ref={(el) => (itemRefs.current[i] = el)}
              className="xp-item"
            >
              <span
                className={`xp-ring xp-node ${lit[i] ? "is-in" : ""}`}
                aria-hidden="true"
              />
              {item.current && (
                <span className={`xp-dot ${lit[i] ? "is-in" : ""}`} aria-hidden="true" />
              )}

              <div className={`xp-body ${lit[i] ? "is-in" : ""}`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-step-1 font-semibold leading-tight text-primary">
                    {item.title}
                  </h3>
                  {item.current && <span className="xp-pill">Current</span>}
                </div>

                <p className="mt-2 font-mono text-[13px] tracking-[.03em] text-link">
                  {item.orgUrl ? (
                    <a href={item.orgUrl} target="_blank" rel="noreferrer" className="link-sweep">
                      {item.org}
                    </a>
                  ) : item.org}
                </p>

                <p className="mt-1 font-mono text-[12.5px] tracking-[.04em] text-faint">
                  {item.period}
                </p>

                {item.description && (
                  <p className="mt-3 max-w-[56ch] leading-[1.75] text-secondary">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ═══ Experience ════════════════════════════════════════════════════════ */

export function Experience() {
  return (
    <section id="experience" className="well relative py-section">
      <div className="mx-auto w-full max-w-site px-gutter">
        <Reveal className="mb-[clamp(34px,4.5vw,62px)]">
          <div className="flex items-center gap-7">
            <SplitHeading className="text-step-3">
              Where I&rsquo;ve <Accent className="text-link">worked</Accent> &amp; studied
            </SplitHeading>
            <span className="hidden h-px flex-1 bg-line md:block" aria-hidden="true" />
          </div>
        </Reveal>

        <div className="xp-cols">
          <Timeline label="Experience" items={work} />
          <Timeline label="Education" items={study} />
        </div>
      </div>
    </section>
  );
}

export default Experience;