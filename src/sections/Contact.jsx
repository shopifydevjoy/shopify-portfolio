/* ══════════════════════════════════════════════════════════════════════════
   Contact.jsx

   No form. Copy and the facts on the left, a rail of contact rows on the
   right. Behind the rail, an exploded view of a theme — layout grid,
   content blocks, outer frame — in CSS 3D transforms, no library.

   In this file, top to bottom:
     1. content (facts, channels)
     2. injected CSS
     3. Contact section (main export)
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { profile } from "../content";
import { Icon, Reveal, SplitHeading, Accent, injectCss } from "../shared";

/* ═══ Content ═══════════════════════════════════════════════════════════ */

const facts = [
  { label: "Status", value: "Taking work", live: true },
  { label: "Based in", value: `${profile.location} · UTC+6` },
  { label: "Replies in", value: "Under 24 hours" },
  { label: "Best for", value: "Shopify themes, WordPress builds" },
];

const WhatsAppMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.23 8.23-8.23 2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24z"
    />
  </svg>
);

const channels = [
  {
    id: "email",
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <Icon name="mail" />,
    primary: true,
  },
  {
    id: "phone-whatsapp",
    label: "Phone & WhatsApp",
    value: profile.phone,
    href: profile.whatsappHref,
    icon: <WhatsAppMark />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "/in/towker-ahmmed-joy",
    href: profile.linkedin,
    icon: <Icon name="linkedin" />,
  },
  {
    id: "github",
    label: "GitHub",
    value: "/shopifydevjoy",
    href: profile.github,
    icon: <Icon name="github" />,
  },
  {
    id: "resume",
    label: "Resume",
    value: "PDF, one page",
    href: profile.resume,
    icon: <Icon name="download" />,
    go: "\u2193",
  },
];

/* ═══ CSS ═══════════════════════════════════════════════════════════════
   No backticks in these comments — they would close the template literal. */

injectCss("contact-3d", `
  @layer components {
    .ct { position: relative; overflow: hidden; isolation: isolate; }

    /* ── 3D stage ──────────────────────────────────────────────────── */

    .ct-stage {
      position: absolute;
      inset: -14% -20% -14% 34%;
      z-index: 0;
      perspective: 1050px;
      perspective-origin: 50% 42%;
      pointer-events: none;
    }

    .ct-deck {
      position: absolute; inset: 0;
      transform-style: preserve-3d;
      transform:
        rotateX(calc(60deg + (var(--ct-my, 0) * 5deg)))
        rotateZ(calc(-36deg + (var(--ct-mx, 0) * 7deg)));
      animation: ct-drift 36s ease-in-out infinite alternate;
    }
    @keyframes ct-drift { from { translate: 0 0; } to { translate: 4% -5%; } }

    .ct-plane {
      position: absolute;
      left: 50%; top: 50%;
      width: 76%; height: 80%;
      margin: -40% 0 0 -38%;
      border: 1px solid color-mix(in srgb, var(--c-accent-soft) 32%, transparent);
      border-radius: 10px;
      transform-style: preserve-3d;
    }

    .ct-plane--grid {
      transform: translateZ(-175px);
      background-image:
        linear-gradient(to right, color-mix(in srgb, var(--c-accent-soft) 15%, transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in srgb, var(--c-accent-soft) 15%, transparent) 1px, transparent 1px);
      background-size: 7.5% 9%;
      opacity: .5;
    }

    .ct-plane--blocks { transform: translateZ(-62px); border-color: transparent; }
    .ct-plane--blocks i {
      position: absolute; display: block; border-radius: 5px;
      background: color-mix(in srgb, var(--c-accent-soft) 9%, transparent);
      border: 1px solid color-mix(in srgb, var(--c-accent-soft) 24%, transparent);
    }
    .ct-plane--blocks i:nth-child(1) { left: 8%;  top: 9%;  width: 54%; height: 15%; }
    .ct-plane--blocks i:nth-child(2) { left: 8%;  top: 30%; width: 25%; height: 27%; }
    .ct-plane--blocks i:nth-child(3) { left: 37%; top: 30%; width: 25%; height: 27%; }
    .ct-plane--blocks i:nth-child(4) { left: 66%; top: 30%; width: 25%; height: 27%; }
    .ct-plane--blocks i:nth-child(5) { left: 8%;  top: 64%; width: 83%; height: 20%; }

    .ct-plane--frame {
      transform: translateZ(72px);
      border-color: color-mix(in srgb, var(--c-accent-soft) 50%, transparent);
      box-shadow: 0 0 48px -12px color-mix(in srgb, var(--c-accent-soft) 28%, transparent);
    }
    .ct-plane--frame::before {
      content: "";
      position: absolute; inset: 5%;
      border: 1px dashed color-mix(in srgb, var(--c-accent-soft) 20%, transparent);
      border-radius: 6px;
    }

    .ct-spark {
      position: absolute; left: 50%; top: 50%;
      width: 10px; height: 10px; margin: -5px 0 0 -5px;
      border-radius: 50%;
      background: var(--c-accent-soft);
      box-shadow: 0 0 16px 3px color-mix(in srgb, var(--c-accent-soft) 50%, transparent);
      animation: ct-rise 7.4s cubic-bezier(.45, 0, .2, 1) infinite;
    }
    .ct-spark:nth-of-type(2) { margin-left: -25%; animation-delay: 2.5s; }
    .ct-spark:nth-of-type(3) { margin-left: 20%;  animation-delay: 5s; }
    @keyframes ct-rise {
      0%   { transform: translateZ(-185px); opacity: 0; }
      14%  { opacity: 1; }
      82%  { opacity: 1; }
      100% { transform: translateZ(112px); opacity: 0; }
    }

    /* keeps the left column legible over the animation */
    .ct-veil {
      position: absolute; inset: 0; z-index: 1; pointer-events: none;
      background: radial-gradient(112% 94% at 10% 46%,
        var(--c-surface) 0 30%,
        color-mix(in srgb, var(--c-surface) 80%, transparent) 50%,
        transparent 76%);
    }

    /* ── layout ────────────────────────────────────────────────────── */

    .ct-grid {
      position: relative; z-index: 2;
      display: grid;
      grid-template-columns: minmax(0, 1.04fr) minmax(0, .96fr);
      gap: clamp(40px, 6vw, 84px);
      align-items: center;
    }

    .ct-facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px 28px;
      max-width: 420px;
    }

    .ct-live i {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--c-accent-soft);
      animation: ct-beat 2.6s ease-out infinite;
      flex: none;
    }
    @keyframes ct-beat {
      0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--c-accent-soft) 55%, transparent); }
      70%  { box-shadow: 0 0 0 7px transparent; }
      100% { box-shadow: 0 0 0 0 transparent; }
    }

    /* ── rail: icon left, text middle, arrow right ─────────────────── */

    .ct-rail {
      border: 1px solid var(--c-line);
      border-radius: 20px;
      background: color-mix(in srgb, var(--c-surface-raised) 78%, transparent);
      backdrop-filter: blur(14px);
      padding: clamp(8px, 1vw, 12px);
    }

    .ct-chan {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: clamp(13px, 1.6vw, 18px);
      padding: clamp(15px, 1.8vw, 19px) clamp(13px, 1.6vw, 18px);
      border-radius: 14px;
      text-decoration: none;
      color: inherit;
      transition: background var(--dur-2) ease, transform var(--dur-2) var(--ease-out-expo);
    }
    .ct-chan + .ct-chan { box-shadow: 0 -1px 0 var(--c-line); }
    .ct-chan:hover {
      background: color-mix(in srgb, var(--c-accent-soft) 7%, transparent);
      transform: translateX(3px);
    }
    .ct-chan:focus-visible { outline: 2px solid var(--c-accent-soft); outline-offset: -2px; }

    .ct-chan__icon {
      display: grid; place-items: center;
      width: clamp(40px, 4vw, 46px); height: clamp(40px, 4vw, 46px);
      border: 1px solid var(--c-line-strong);
      border-radius: 13px;
      color: var(--c-text-secondary);
      transition: border-color var(--dur-2) ease, color var(--dur-2) ease, background var(--dur-2) ease;
    }
    .ct-chan__icon svg { width: 19px; height: 19px; display: block; }
    .ct-chan:hover .ct-chan__icon {
      border-color: var(--c-accent-soft);
      color: var(--c-accent-soft);
      background: color-mix(in srgb, var(--c-accent-soft) 9%, transparent);
    }

    .ct-chan__label {
      display: block;
      font-family: var(--font-display);
      font-size: 11px; font-weight: 600;
      letter-spacing: .18em; text-transform: uppercase;
      color: var(--c-text-faint);
    }
    .ct-chan__value {
      display: block;
      margin-top: 4px;
      font-family: var(--font-mono);
      font-size: clamp(13px, 1.35vw, 14.5px);
      color: var(--c-text-primary);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .ct-chan__go {
      font-size: 15px;
      color: var(--c-text-faint);
      transition: color var(--dur-2) ease, transform var(--dur-2) var(--ease-out-expo);
    }
    .ct-chan:hover .ct-chan__go { color: var(--c-accent-soft); transform: translate(3px, -3px); }

    /* the email row carries the weight */
    .ct-chan--primary .ct-chan__value {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: clamp(17px, 1.9vw, 22px);
      letter-spacing: -.01em;
    }
    .ct-chan--primary .ct-chan__icon {
      border-color: var(--c-accent-soft);
      color: var(--c-accent-soft);
      background: color-mix(in srgb, var(--c-accent-soft) 10%, transparent);
    }

    /* ── responsive ────────────────────────────────────────────────── */

    @media (max-width: 920px) {
      .ct-grid { grid-template-columns: minmax(0, 1fr); gap: clamp(38px, 7vw, 54px); }
      .ct-stage { inset: -10% -24% 42% 10%; opacity: .72; }
      .ct-veil {
        background: radial-gradient(132% 68% at 20% 26%,
          var(--c-surface) 0 34%,
          color-mix(in srgb, var(--c-surface) 78%, transparent) 56%,
          transparent 82%);
      }
      .ct-facts { max-width: none; }
    }

    @media (max-width: 560px) {
      .ct-facts { grid-template-columns: minmax(0, 1fr); gap: 18px; }
      .ct-rail { border-radius: 16px; padding: 6px; }
      .ct-chan { gap: 12px; padding: 14px 12px; border-radius: 12px; }
      .ct-chan__icon { width: 38px; height: 38px; border-radius: 11px; }
      .ct-chan__icon svg { width: 17px; height: 17px; }
      .ct-chan__value { font-size: 12.5px; }
      .ct-chan--primary .ct-chan__value { font-size: 16px; }
      /* the stage would sit under the rail on a phone, so it goes */
      .ct-stage { display: none; }
      .ct-veil { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .ct-deck { animation: none; }
      .ct-spark { display: none; }
      .ct-live i { animation: none; }
      .ct-chan, .ct-chan__icon, .ct-chan__go { transition: none; }
    }
  }
`);

/* ═══ Contact ═══════════════════════════════════════════════════════════ */

export function Contact() {
  const sectionRef = useRef(null);

  /* pointer parallax, written straight to the node — no re-render */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 561px)").matches) return;

    let frame = null;

    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--ct-mx", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
        node.style.setProperty("--ct-my", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
        frame = null;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="ct relative bg-surface py-section">
      <div className="ct-stage" aria-hidden="true">
        <div className="ct-deck">
          <div className="ct-plane ct-plane--grid" />
          <div className="ct-plane ct-plane--blocks">
            <i /><i /><i /><i /><i />
          </div>
          <div className="ct-plane ct-plane--frame" />
          <span className="ct-spark" />
          <span className="ct-spark" />
          <span className="ct-spark" />
        </div>
      </div>
      <div className="ct-veil" aria-hidden="true" />

      <div className="mx-auto w-full max-w-site px-gutter">
        <div className="ct-grid">

          {/* ── left: copy and facts ── */}
          <Reveal>
            <SplitHeading className="max-w-[14ch] text-step-3">
              Tell me what you&rsquo;re <Accent className="text-link">building</Accent>.
            </SplitHeading>

            <p className="mt-6 max-w-[46ch] leading-[1.8] text-secondary">
              Send the store URL and what is going wrong, or what you want it to
              do. I reply with what I would fix first, whether or not we end up
              working together.
            </p>

            <dl className="ct-facts mt-[clamp(30px,4vw,44px)] border-t border-line pt-[clamp(26px,3vw,34px)]">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-display text-[11px] font-semibold uppercase tracking-[.2em] text-faint">
                    {fact.label}
                  </dt>
                  <dd
                    className={`mt-2 font-mono text-[13px] leading-[1.55] text-primary ${
                      fact.live ? "ct-live flex items-center gap-2" : ""
                    }`}
                  >
                    {fact.live && <i aria-hidden="true" />}
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* ── right: contact rail ── */}
          <Reveal delay={0.12}>
            <div className="ct-rail">
              {channels.map((chan) => (
                <a
                  key={chan.id}
                  href={chan.href}
                  className={`ct-chan ${chan.primary ? "ct-chan--primary" : ""}`}
                >
                  <span className="ct-chan__icon">{chan.icon}</span>
                  <span>
                    <span className="ct-chan__label">{chan.label}</span>
                    <span className="ct-chan__value">{chan.value}</span>
                  </span>
                  <span className="ct-chan__go" aria-hidden="true">
                    {chan.go || "\u2197"}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

export default Contact;