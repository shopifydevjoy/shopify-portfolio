/* ══════════════════════════════════════════════════════════════════════════
   About.jsx

   Everything for this section: the story, the Maktech panel and the 3D lanyard card.

   In this file, top to bottom:
     1. About
   ══════════════════════════════════════════════════════════════════════════ */

import { Icon, Reveal, RevealItem, SplitHeading, useMediaQuery } from "../shared";
import { motion, useReducedMotion } from "motion/react";
import Lanyard from "../vendor/Lanyard";

/* ═══ About — the section  ·  was components/About.jsx ═════════════════════ */
/* Move this into data/site.js if you like. */
const company = {
  name: "Maktech",
  url: "https://www.maktechgroup.com",
  duration: "2 years",
  summary: "Web, mobile, SaaS and e-commerce projects."
};

const skills = [
  { mark: "SH", label: "Shopify Development", level: "Expert", score: 94 },
  { mark: "WP", label: "WordPress & Woo", level: "Expert", score: 90 },
  { mark: "LI", label: "Liquid & Theme Dev", level: "Strong", score: 88 },
  { mark: "JS", label: "JavaScript & React", level: "Strong", score: 78 },
  { mark: "UI", label: "Responsive UI / UX", level: "Strong", score: 88 },
  { mark: "AN", label: "Motion & Animation", level: "Strong", score: 82 }
];

export function About() {
  /* Not a visibility switch — the card needs different framing on a phone.
     It hangs from the right and overlaps the copy on desktop; on a narrow
     screen it sits centred below the text at a smaller size. */
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative overflow-hidden bg-surface py-section">
      <div className="mx-auto grid w-full max-w-site grid-cols-1 items-center gap-[clamp(8px,2vw,32px)]
                      px-gutter lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)]">

        {/* ---------------- left: the copy ----------------
             The employer is the loudest thing in this column on purpose.
             A spine runs down the left edge and the Maktech panel sits on
             it as a lit node, so it reads as a current, stated position
             rather than a line buried in a bio. */}
        <div>
          <Reveal as="p" className="label">About</Reveal>

          <SplitHeading
            delay={.06}
            className="mt-3 max-w-[22ch] font-display text-[clamp(30px,5vw,64px)] font-semibold
                       leading-[1.05] tracking-[-0.03em] text-primary">
            Shopify and WordPress, built properly.
          </SplitHeading>

          <Reveal as="p" delay={.16}
            className="mt-5 max-w-[42ch] text-[13.5px] leading-[1.7] text-muted sm:text-[14.5px] sm:leading-[1.75]">
            I lead web projects and build custom Shopify themes, WordPress
            sites, WooCommerce stores, and plugins.
          </Reveal>

          {/* the spine */}
          <div className="relative mt-7 pl-5 sm:pl-7">
            <span aria-hidden="true"
              className="absolute left-0 top-2 bottom-2 w-px
                         bg-linear-to-b from-accent/70 via-line-strong to-transparent" />

            {/* ---- node 1: the employer ---- */}
            <Reveal delay={.24} className="relative">
              <span aria-hidden="true"
                className="absolute -left-5 top-5 size-[11px] -translate-x-[5px] rounded-full sm:-left-7 sm:top-6
                           border-2 border-accent bg-surface
                           shadow-[0_0_0_4px_var(--color-surface-sunken),0_0_18px_2px] shadow-accent/40" />

              <article className="overflow-hidden rounded-2xl border border-line-strong bg-surface-raised">
                {/* status strip */}
                <div className="flex flex-wrap items-center justify-between gap-3
                                border-b border-line bg-accent/[.07] px-3.5 py-2 sm:px-4 sm:py-2.5">
                  <p className="flex items-center gap-2 font-mono text-[10px]
                                uppercase tracking-[.18em] text-accent-hi">
                    <i className="dot" />Currently · Full-time
                  </p>
                  <p className="font-mono text-[10px] tracking-[.14em] text-muted">
                    {company.duration.toUpperCase()}
                  </p>
                </div>

                <div className="px-3.5 py-3 sm:px-4 sm:py-3.5">
                  <a href={company.url} target="_blank" rel="noreferrer"
                     className="group inline-flex items-baseline gap-2.5 font-display
                                text-[clamp(21px,2.5vw,30px)] font-semibold leading-none
                                tracking-[-0.03em] text-primary transition-colors duration-300
                                hover:text-accent-hi">
                    {company.name}
                    <Icon name="arrow"
                      className="size-3.5 text-link transition-transform duration-500 ease-out-expo
                                 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>

                  <p className="mt-2 text-[12px] font-medium leading-snug text-body sm:text-[13px]">
                    Team Leader &amp; Project Coordinator
                    <span className="text-muted"> — Web Development</span>
                  </p>

                  <p className="mt-1.5 max-w-[46ch] text-[11.5px] leading-relaxed text-muted sm:text-[12.5px]">
                    {company.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Brief to launch", "Leading the web team", "Client-facing"].map(t => (
                      <span key={t}
                        className="rounded-pill border border-line px-2 py-0.5 font-mono
                                   text-[10px] tracking-[.05em] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>

            {/* ---- node 2: core skills ---- */}
            <div className="relative mt-5 sm:mt-6">
              <span aria-hidden="true"
                className="absolute -left-5 top-3 size-[7px] -translate-x-[3px] rounded-full bg-line-strong sm:-left-7 sm:top-4" />
              <Reveal delay={.32} className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent-hi">
                    What I work with
                  </p>
                  <h3 className="mt-1 font-display text-[20px] font-semibold leading-tight tracking-[-.025em] text-primary sm:text-[23px]">
                    Core skills<span className="text-link">.</span>
                  </h3>
                </div>
                <p className="pb-1 font-mono text-[9px] tracking-[.13em] text-muted sm:text-[10px]">
                  01 — 06 / TOOLKIT
                </p>
              </Reveal>

              <Reveal stagger delay={.08} className="grid gap-2 sm:grid-cols-2 sm:gap-2.5">
                {skills.map(skill => (
                  <RevealItem key={skill.label} y={16}
                    className={`group relative isolate overflow-hidden rounded-xl border border-line-strong
                      bg-surface-raised/70 p-3 sm:p-3.5 ${
                        reduceMotion ? "" : "hover:border-accent/45 hover:bg-surface-raised"
                      }`}
                    style={{ transformPerspective: 850 }}
                    whileHover={reduceMotion ? undefined : {
                      y: -3,
                      rotateX: 2.5,
                      rotateY: -2.5,
                      scale: 1.015,
                      transition: { duration: .28, ease: [.16, 1, .3, 1] }
                    }}
                    whileTap={reduceMotion ? undefined : { scale: .99 }}>
                    {!reduceMotion && (
                      <span aria-hidden="true"
                        className="pointer-events-none absolute -inset-y-8 -left-1/2 z-0 w-1/2 skew-x-[-18deg]
                                   bg-linear-to-r from-transparent via-white/[.06] to-transparent
                                   transition-transform duration-700 ease-out group-hover:translate-x-[300%]" />
                    )}
                    <div className="relative z-10 flex min-w-0 items-center gap-2.5">
                      <motion.span aria-hidden="true"
                        className={`grid size-7 flex-none place-items-center rounded-lg border border-accent/25
                          bg-accent/[.08] font-mono text-[9px] font-semibold text-accent-hi ${
                            reduceMotion ? "" : "transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-110"
                          }`}>
                        {skill.mark}
                      </motion.span>
                      <p className="min-w-0 flex-1 truncate font-display text-[12px] font-semibold leading-tight text-primary sm:text-[13px]">
                        {skill.label}
                      </p>
                      <span className="flex-none font-mono text-[9px] text-muted sm:text-[10px]">
                        {skill.level}
                      </span>
                    </div>
                    <div className="relative z-10 mt-2.5 h-[3px] overflow-hidden rounded-full bg-line-strong">
                      <motion.span
                        aria-hidden="true"
                        className={`block h-full origin-left rounded-full bg-linear-to-r from-accent to-accent-hi ${
                          reduceMotion ? "" : "transition-[filter] duration-500 group-hover:brightness-125"
                        }`}
                        style={{ width: `${skill.score}%` }}
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={reduceMotion ? { scaleX: skill.score / 100 } : undefined}
                        whileInView={!reduceMotion ? { scaleX: skill.score / 100 } : undefined}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: .9, delay: .12, ease: [.16, 1, .3, 1] }}
                      />
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </div>
        </div>

        {/* ---------------- right: the card on a lanyard ----------------
             The canvas is the clipping box, so on desktop it is pulled wide
             of its column to let the card swing over the copy. On a phone
             there is nothing to overlap, so it simply fills its own row. */}
        <div className="relative mt-8 h-[330px] w-full self-center sm:mt-10 sm:h-[420px] lg:mt-0 lg:h-[700px]">
          <div className="absolute inset-0 z-20
                          lg:-left-[140px] lg:-right-[40px] lg:top-1/2 lg:h-[700px] lg:-translate-y-1/2">
            <Lanyard
              frontImage="/card-front.png"
              backImage="/card-back.png"
              strapImage="/band.svg"
              cardColor="var(--n-850)"
              finish="metallic"
              metal="graphite"
              /* a phone has no room for the overlap, so the card is smaller
                 and hangs from the middle */
              size={wide ? 0.71 : 0.8}
              anchor={wide ? "right" : "center"}
              strapLength={wide ? 0.2 : 0.08}
              strapWidth={0.8}
              cornerRadius={0.34}
              gravity={0.9}
              damping={0.55}
              elasticity={0.45}
              breeze={0.35}
              intro={wide}
            />
          </div>
        </div>

      </div>
    </section>
  );
}