/* ══════════════════════════════════════════════════════════════════════════
   Work.jsx

   Two card fans — Shopify, then WordPress. Each is a header row (label on
   the left, controls on the right) over a stack of cards that sweeps
   sideways. Drag, arrows, or wait for the auto-advance.

   In this file, top to bottom:
     1. content (projects)
     2. injected CSS
     3. ProjectCard
     4. Fan
     5. Work section (main export)
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { Icon, Reveal, SplitHeading, Accent, injectCss } from '../shared';

/* ═══ Content ═══════════════════════════════════════════════════════════
   Keep `blurb` to one line — it sits on a 350px card. Anything longer
   wraps to three lines and pushes the tags out of the card.              */

const shopifyProjects = [
  {
    title: 'Custom Theme Design',
    blurb: 'Crafted a custom Shopify theme with personalized T-shirt designs and an integrated music system, delivering a unique brand experience.',
    result: 'Custom Shopify Experience',
    image: '/MIRΛI.png',
    type: 'SHOPIFY · CUSTOM DESIGN',
    icon: 'shopify',
    tags: ['Shopify', 'T-Shirt Design', 'Music System', 'Responsive'],
    href: 'https://mirailabstore.com',
    brief: 'Create a distinctive Shopify storefront for a T-shirt label, with a visual identity that feels personal and a music experience built into the shopping journey.',
    challenge: 'The storefront needed to make custom apparel feel expressive without making product discovery or shopping harder. The music feature also had to feel intentional rather than like a separate widget.',
    solution: 'Designed a custom storefront around the brand artwork, then brought product presentation and the integrated music experience together in a responsive layout. Kept the shopping flow clear across desktop and mobile.',
    technologies: ['Shopify', 'Liquid', 'Custom theme design', 'Responsive UI'],
  },
  {
    title: 'Prestige Theme Design',
    blurb: 'Built a luxury Shopify storefront using the Prestige theme, featuring premium product presentation and a seamless shopping experience. Developed a complex custom bundle system using Liquid code to deliver tailored bundle functionality.',
    image: '/Prestige_Theme_Design_Showcase.png',
    type: 'SHOPIFY · PREMIUM THEME',
    icon: 'shopify',
    tags: ['Prestige Theme', 'Custom Liquid', 'Bundle System', 'Subscriptions', 'Responsive Design'],
    href: 'https://riosense.com',
    brief: 'Build a premium storefront using the Prestige theme, with polished product storytelling and flexible bundles that fit the brand’s catalog.',
    challenge: 'The standard theme experience did not cover the tailored bundle behavior the store needed. The bundle flow had to work naturally with product variants and subscriptions without disrupting the premium shopping experience.',
    solution: 'Customized the Prestige theme and extended it with Liquid-based bundle functionality. Refined product presentation and responsive layouts so shoppers could understand and configure their options with less friction.',
    technologies: ['Shopify', 'Prestige theme', 'Liquid', 'Subscriptions', 'Responsive UI'],
  },
  {
    title: 'Storefronts built around the brand, not the template.',
    blurb: 'An animated entrance for a luxury weaves label — a wardrobe that opens on tap to reveal its contents only as shadows. Turns Shopify’s password page into a first-access waitlist.',
    image: '/Luxury-E-Commerce-Showcase.png',
    type: 'SHOPIFY · LUXURY',
    tags: ['Shopify Liquid', 'Motion Design', 'Email Capture', 'Luxury UX'],
    href: '#',
    brief: 'Create a memorable first-access experience for a luxury weaving label, turning a simple pre-launch page into a branded moment.',
    challenge: 'The experience needed to build anticipation and collect interest while keeping the products hidden until visitors chose to reveal them.',
    solution: 'Built an animated wardrobe-style entrance that opens on tap, revealing the collection through a shadow-led visual treatment. Used Shopify’s password page as a branded waitlist and email-capture experience.',
    technologies: ['Shopify', 'Liquid', 'Motion design', 'Email capture'],
  },
  {
    title: 'Cafe order-ahead menu',
    blurb: 'A coffee menu rebuilt as a storefront. Size, hot or iced, and nine tea add-ins chosen without leaving the grid.',
    result: 'Custom Product Add-ons',
    image: '/The_Honeypot_Coffee_Shop_Showcase.png',
    type: 'Shopify · Custom Design',
    tags: ['Shopify', 'Liquid', 'Metafields', 'Add-ons', 'Pickup'],
    href: 'https://cq3kjk-w4.myshopify.com',
    brief: 'Make a café menu work like an order-ahead storefront, so customers can customize drinks without leaving the product grid.',
    challenge: 'Drink choices such as size, temperature, and tea add-ins create a lot of options. The ordering experience needed to keep those choices easy to scan and quick to make.',
    solution: 'Reworked the menu into a product-grid experience with custom add-ons for size, hot or iced preparation, and tea extras. Used Shopify product data to keep options manageable and support pickup ordering.',
    technologies: ['Shopify', 'Liquid', 'Metafields', 'Product add-ons', 'Pickup'],
  },
];

const wordpressProjects = [
  {
    title: 'Modern business website',
    blurb: 'Custom blocks for team, case studies and testimonials, put together so the client can add a page without calling anyone.',
    result: 'First page for eight target terms',
    image: '/wordpress-business-preview.svg',
    type: 'WordPress · Business',
    tags: ['Gutenberg', 'Schema', 'SEO', 'ACF'],
    href: '#',
    brief: 'Give a business a modern website that clearly presents its team, case studies, and customer testimonials—and that the client can update independently.',
    challenge: 'The content needed to stay consistent across multiple page types while remaining simple for non-technical editors to maintain.',
    solution: 'Created reusable Gutenberg blocks and structured content fields for team profiles, case studies, and testimonials. Added schema and SEO foundations to support discoverability.',
    technologies: ['WordPress', 'Gutenberg', 'ACF', 'Schema', 'SEO'],
  },
  {
    title: 'WooCommerce store',
    blurb: 'Multi-vendor marketplace with custom payment gateways, bulk import tooling and subscription products.',
    result: '500+ products across 15k customers',
    image: '/woocommerce-store-preview.svg',
    type: 'WordPress · WooCommerce',
    tags: ['WooCommerce', 'PHP', 'Gateways', 'Subs'],
    href: '#',
    brief: 'Build a WooCommerce marketplace that can support multiple vendors, subscription products, and a large product catalog.',
    challenge: 'The store needed to handle high-volume product management and specialized payment flows without making day-to-day operations cumbersome.',
    solution: 'Extended WooCommerce with custom payment gateway integrations and bulk-import tooling, and configured subscription products to support recurring purchases.',
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'Payment gateways', 'Subscriptions'],
  },
  {
    title: 'Creative portfolio',
    blurb: 'Filterable case studies and animated galleries on a custom child theme, built to survive the client adding work to it.',
    result: 'Enquiries up 156%',
    image: '/wordpress-portfolio-preview.svg',
    type: 'WordPress · Portfolio',
    tags: ['Child theme', 'Filters', 'Motion', 'CPT'],
    href: '#',
    brief: 'Create a creative portfolio that makes case studies easy to discover and stays maintainable as the client publishes new work.',
    challenge: 'A visually rich gallery can become difficult to browse and even harder to keep consistent when every new project requires custom page work.',
    solution: 'Built a custom child theme with structured case studies, filterable project browsing, and animated galleries. Set up the content model so new work can be added without rebuilding the layout.',
    technologies: ['WordPress', 'PHP', 'Custom post types', 'Child theme', 'Motion'],
  },
  {
    title: 'Custom plugin platform',
    blurb: 'Four plugins handling team workflow, client records and automated reporting, wired to the CRM they already used.',
    result: 'Saves 20+ hours a month per client',
    image: '/wordpress-plugin-preview.svg',
    type: 'WordPress · Custom Plugin',
    tags: ['PHP', 'REST API', 'CRM', 'Cron'],
    href: '#',
    brief: 'Connect client records, team workflows, and automated reporting to the CRM the business already uses.',
    challenge: 'Several separate operational tasks needed to work together reliably, while keeping the existing CRM as the source of truth.',
    solution: 'Developed a set of custom plugins for workflow and client data, connected them to the CRM through its API, and used scheduled jobs for automated reporting.',
    technologies: ['WordPress', 'PHP', 'REST API', 'CRM integration', 'Cron'],
  },
];

/* ═══ CSS ═══════════════════════════════════════════════════════════════
   Every size the fan depends on is a custom property on the container, so
   the breakpoints at the bottom retune the whole thing without touching JS.
   Do not use backticks in these comments — they close the template literal. */

injectCss('work-fan', `
  @layer components {
    .work-block + .work-block { margin-top: clamp(56px, 7vw, 96px); }

    .work-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px 32px;
      flex-wrap: wrap;
      margin-bottom: clamp(22px, 3vw, 34px);
    }

    .work-head__desc {
      margin: 10px 0 0;
      max-width: 46ch;
      font-size: 15px;
      line-height: 1.7;
      color: var(--c-text-secondary);
    }

    .work-fan {
      --card-w: 330px;   /* fixed card footprint */
      --card-h: 450px;
      --fan-x: 175px;    /* horizontal offset per card behind the front */
      --fan-z: -35px;    /* depth offset per card */
      position: relative;
      width: calc(var(--card-w) + (var(--fan-x) * 3));
      max-width: 100%;
      height: var(--card-h);
      margin-inline: auto;
      perspective: 1200px;
    }

    .work-stage {
      cursor: grab;
      overflow-x: clip;
      overflow-y: visible;
    }
    .work-stage:active { cursor: grabbing; }

    .work-card {
      position: absolute;
      left: 0; top: 0;
      width: var(--card-w);
      max-width: 100%;
      height: var(--card-h);
      display: flex;
      flex-direction: column;
      border-radius: 24px;
      background: var(--c-paper);
      color: var(--c-paper-ink);
      padding: 12px;
      box-shadow: 0 25px 55px rgba(0, 0, 0, .28);
      transform-origin: 50% 85%;
      overflow: hidden;
      user-select: none;
      transition: transform var(--dur-4) var(--ease-out-expo),
                  opacity .65s ease,
                  filter .65s ease;
      cursor: pointer;
    }
    .work-card:focus-visible {
      outline: 3px solid var(--c-accent-soft);
      outline-offset: 5px;
    }

    /* fan positions, driven by the vars above rather than hard-coded px */
    .work-card.pos-0 { transform: translate3d(0, 0, 0) scale(1); z-index: 5; }
    .work-card.pos-1 { transform: translate3d(var(--fan-x), 0, var(--fan-z)) scale(.98); z-index: 4; filter: saturate(.9); }
    .work-card.pos-2 { transform: translate3d(calc(var(--fan-x) * 2), 0, calc(var(--fan-z) * 2)) scale(.96); z-index: 3; filter: saturate(.82); }
    .work-card.pos-3 { transform: translate3d(calc(var(--fan-x) * 3), 0, calc(var(--fan-z) * 3)) scale(.94); z-index: 2; filter: saturate(.75); }
    .work-card.pos-hidden {
      transform: translate3d(calc(var(--fan-x) * 4), 0, calc(var(--fan-z) * 4)) scale(.9);
      z-index: 1; opacity: 0; pointer-events: none;
    }

    .work-card.exit {
      z-index: 10;
      opacity: 0;
      transform: translate3d(-115%, 45px, 60px) rotate(-17deg) scale(.9);
      transition: transform var(--dur-4) var(--ease-exit), opacity var(--dur-3) ease;
    }

    /* ratio, not a fixed height — a px height flattens the crop as the
       card narrows. 350 x 220 is the desktop proportion. */
    .work-card__img {
      flex: none;
      aspect-ratio: 330 / 196;
      border-radius: 18px;
      overflow: hidden;
      position: relative;
      background: var(--c-paper-media);
    }
    .work-card__img img {
      height: 100%; width: 100%;
      object-fit: cover;
      display: block;
      transition: transform var(--dur-4);
    }
    .work-card:hover .work-card__img img { transform: scale(1.06); }
    .work-cursor {
      position: fixed;
      z-index: 90;
      top: 0;
      left: 0;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 10px 15px 10px 10px;
      border: 1px solid rgba(140, 255, 198, .42);
      border-radius: 999px;
      background: rgba(5, 25, 17, .92);
      color: #f2fff6;
      box-shadow: 0 8px 28px rgba(0, 0, 0, .3), inset 0 1px 0 rgba(255, 255, 255, .08);
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: .01em;
      white-space: nowrap;
      pointer-events: none;
      backdrop-filter: blur(12px);
      will-change: transform, opacity;
    }
    .work-cursor__mark {
      display: grid;
      width: 22px;
      height: 22px;
      place-items: center;
      border-radius: 50%;
      background: #8cffc6;
      color: #063d2d;
      font-size: 13px;
      line-height: 1;
    }
    @media (hover: hover) and (pointer: fine) {
      .work-card, .work-card a { cursor: none; }
    }

    .work-card__type {
      position: absolute;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      left: 14px; top: 14px;
      border-radius: 999px;
      padding: 8px 11px;
      background: rgba(6, 61, 45, .92);
      color: var(--c-paper-badge);
      font-size: 10px;
      letter-spacing: .12em;
      font-weight: 800;
      text-transform: uppercase;
      backdrop-filter: blur(8px);
    }

    .work-card__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 14px 12px 10px;
      min-height: 0;
    }

    .work-card__title {
      font-size: clamp(17px, 1.6vw, 22px);
      letter-spacing: -.02em;
      margin: 0;
      font-weight: 700;
      color: var(--c-paper-ink);
      line-height: 1.3;
    }

    .work-card__blurb {
      font-size: 13px;
      line-height: 1.5;
      color: var(--c-paper-ink-2);
      margin: 7px 0 0;
      /* 2-3 lines; anything longer is clipped rather than pushing the
         foot out of a fixed-height card */
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* the outcome reads as data, not prose: mono, accent, set off by a rule */
    .work-card__result {
      margin: 10px 0 0;
      padding-top: 10px;
      border-top: 1px solid rgba(6, 61, 45, .12);
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: .01em;
      line-height: 1.5;
      color: var(--c-paper-link);
    }

    /* margin-top auto pins this to the bottom whatever the copy does */
    .work-card__foot {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 10px;
      margin-top: auto;
      padding-top: 12px;
    }

    /* 3-4 keywords, sized to sit two per row on a 330px card */
    .work-card__tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .work-card__tags span {
      font-size: 11px;
      color: var(--c-paper-ink);
      background: rgba(91, 228, 155, .2);
      border-radius: 6px;
      padding: 5px 9px;
      font-weight: 600;
      white-space: nowrap;
    }

    .work-card__link {
      color: var(--c-paper-link);
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }
    .work-card__link:hover { text-decoration: underline; }

    .work-nav { display: flex; align-items: center; gap: 14px; }
    .work-nav button { transition: border-color var(--dur-2) ease, color var(--dur-2) ease, transform var(--dur-2) ease; }
    .work-nav button:hover { transform: translateY(-2px); }

    .project-dialog {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-items: center;
      padding: clamp(12px, 3vw, 36px);
      background: rgba(2, 8, 5, .78);
      backdrop-filter: blur(0);
      overflow-y: auto;
    }
    .project-dialog__panel {
      position: relative;
      transform-style: preserve-3d;
      width: min(100%, 980px);
      max-height: min(850px, calc(100dvh - 32px));
      display: grid;
      grid-template-columns: minmax(0, .88fr) minmax(0, 1.12fr);
      overflow: hidden;
      border: 1px solid var(--c-line-strong);
      border-radius: 28px;
      background: var(--c-surface-raised);
      color: var(--c-text-body);
      box-shadow: 0 32px 100px rgba(0, 0, 0, .48), 0 0 0 1px rgba(91, 228, 155, .08);
    }
    .project-dialog__visual {
      min-height: 100%;
      position: relative;
      overflow: hidden;
      background: var(--c-paper-media);
    }
    .project-dialog__visual::after {
      content: "";
      position: absolute;
      inset: 35% 0 0;
      background: linear-gradient(transparent, rgba(3, 18, 12, .76));
      pointer-events: none;
    }
    .project-dialog__visual img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .project-dialog__visual-copy {
      position: absolute;
      z-index: 1;
      inset: auto 28px 30px;
      color: #f2fff6;
    }
    .project-dialog__eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      color: #a8e7bd;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: .14em;
      text-transform: uppercase;
    }
    .project-dialog__visual h2 {
      margin: 0;
      font-size: clamp(27px, 3vw, 40px);
      line-height: 1.12;
      letter-spacing: -.04em;
    }
    .project-dialog__content {
      min-width: 0;
      overflow-y: auto;
      padding: clamp(24px, 4vw, 42px);
      scrollbar-color: var(--c-line-strong) transparent;
    }
    .project-dialog__close {
      position: absolute;
      z-index: 2;
      top: 16px;
      right: 16px;
      display: grid;
      width: 42px;
      height: 42px;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, .24);
      border-radius: 50%;
      background: rgba(5, 15, 10, .62);
      color: #fff;
      font-size: 25px;
      line-height: 1;
      cursor: pointer;
      transition: transform var(--dur-2) var(--ease-out-expo), background var(--dur-2) ease;
    }
    .project-dialog__close:hover { transform: rotate(90deg); background: rgba(5, 15, 10, .9); }
    .project-dialog__close:focus-visible,
    .project-dialog__link:focus-visible { outline: 2px solid var(--c-accent-soft); outline-offset: 4px; }
    .project-dialog__intro {
      margin: 10px 0 26px;
      color: var(--c-text-secondary);
      font-size: 14px;
      line-height: 1.75;
    }
    .project-dialog__section {
      padding: 18px 0;
      border-top: 1px solid var(--c-line);
    }
    .project-dialog__section h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 8px;
      color: var(--c-text-primary);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .02em;
    }
    .project-dialog__section h3 span {
      display: grid;
      width: 25px;
      height: 25px;
      place-items: center;
      border-radius: 8px;
      background: rgba(91, 228, 155, .12);
      color: var(--c-accent-soft);
      font-family: var(--font-mono);
      font-size: 11px;
    }
    .project-dialog__section p {
      margin: 0;
      color: var(--c-text-secondary);
      font-size: 13px;
      line-height: 1.75;
    }
    .project-dialog__stack {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 13px;
    }
    .project-dialog__stack span {
      padding: 7px 10px;
      border: 1px solid var(--c-line);
      border-radius: 999px;
      color: var(--c-text-body);
      font-family: var(--font-mono);
      font-size: 10px;
    }
    .project-dialog__link {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      margin-top: 22px;
      padding: 12px 17px;
      border: 1px solid var(--c-accent-soft);
      border-radius: 999px;
      color: var(--c-accent-hi);
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      transition: background var(--dur-2) ease, color var(--dur-2) ease, transform var(--dur-2) var(--ease-out-expo);
    }
    .project-dialog__link:hover {
      transform: translateY(-2px);
      background: var(--c-accent-soft);
      color: var(--c-text-invert);
    }
    .project-dialog__link--disabled { opacity: .55; cursor: default; }

    .work-progress {
      width: 72px;
      height: 3px;
      overflow: hidden;
      border-radius: 999px;
      background: var(--c-line);
    }
    .work-progress__fill {
      display: block;
      width: 100%;
      height: 100%;
      transform: scaleX(0);
      transform-origin: left center;
      background: var(--c-accent-soft);
      animation: work-progress var(--work-delay) linear forwards;
    }
    .work-block[data-paused="true"] .work-progress__fill { animation-play-state: paused; }
    @keyframes work-progress { to { transform: scaleX(1); } }

    /* ── responsive ────────────────────────────────────────────────── */

    @media (max-width: 1100px) {
      .work-fan { --fan-x: 130px; }
    }

    @media (max-width: 860px) {
      .work-fan { --fan-x: 64px; --fan-z: -26px; }
    }

    @media (max-width: 640px) {
      .work-fan {
        /* card + 3 fan steps must stay inside the gutter, capped so a
           640px device does not get a 520px card */
        --card-w: min(330px, calc(100% - (var(--fan-x) * 3)));
        --fan-x: 18px;
        --fan-z: -16px;
        --card-h: 444px;
      }
      .work-card { border-radius: 18px; padding: 9px; }
      .work-card__img { border-radius: 13px; }
      .work-card__type { font-size: 9px; padding: 6px 9px; left: 10px; top: 10px; }
      .work-card__body { padding: 13px 10px 10px; }
      .work-head { gap: 16px; align-items: flex-start; }
      .work-head__desc { font-size: 14px; max-width: none; }
      .project-dialog { padding: 10px; }
      .project-dialog__panel {
        grid-template-columns: 1fr;
        max-height: calc(100dvh - 20px);
        border-radius: 22px;
      }
      .project-dialog__visual { min-height: 230px; }
      .project-dialog__visual-copy { inset: auto 22px 22px; }
      .project-dialog__content { padding: 24px 22px; }
      .project-dialog__close { top: 12px; right: 12px; }
    }

    /* below 480 the blurb goes and the result stays — the number is the
       part worth reading on a 300px card */
    @media (max-width: 480px) {
      /* the card only starts shrinking below ~432px, so the height tracks
         the viewport from there down */
      .work-fan { --card-h: clamp(316px, 98vw, 376px); }
      .work-card__blurb { display: none; }
      .work-card__result { margin-top: 11px; }
      .project-dialog__visual { min-height: 190px; }
    }

    @media (max-width: 380px) {
      .work-fan { --fan-x: 13px; }
      .work-card__tags span { font-size: 11px; padding: 5px 9px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .work-card { transition: none; }
      .work-card.exit { transition: opacity var(--dur-2) ease; }
      .work-progress__fill { animation: none; transform: scaleX(1); }
    }
  }
`);

/* ═══ ProjectCard ═══════════════════════════════════════════════════════ */

const ProjectCard = ({ project, position, isExiting, onBringToFront, onCursorMove, onCursorChange }) => (
  <article
    className={`work-card pos-${position} ${isExiting ? 'exit' : ''}`}
    tabIndex={0}
    aria-label={`${project.title}. Open project details.`}
    aria-haspopup="dialog"
    onPointerEnter={(event) => {
      if (event.pointerType === 'mouse') onCursorChange(true);
    }}
    onPointerMove={(event) => {
      if (event.pointerType === 'mouse') {
        const label = event.target.closest('a') ? 'Visit' : 'Click to view';
        onCursorMove(event.clientX, event.clientY, label);
      }
    }}
    onPointerLeave={(event) => {
      if (event.pointerType === 'mouse') onCursorChange(false);
    }}
    onClick={event => {
      if (!event.target.closest('a, button')) onBringToFront();
    }}
    onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onBringToFront();
      }
    }}
  >
    <div className="work-card__img">
      <span className="work-card__type">
        {project.icon && <Icon name={project.icon} className="size-[14px] flex-none" />}
        {project.type}
      </span>
      <img
        src={project.image}
        alt=""
        loading={project.image.startsWith('/') ? 'eager' : 'lazy'}
      />
    </div>

    <div className="work-card__body">
      <h3 className="work-card__title">{project.title}</h3>
      <p className="work-card__blurb">{project.blurb}</p>

      {project.result && (
        <p className="work-card__result">{project.result}</p>
      )}

      <div className="work-card__foot">
        <div className="work-card__tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a
          className="work-card__link"
          href={project.href}
          target={project.href.startsWith('https://') ? '_blank' : undefined}
          rel={project.href.startsWith('https://') ? 'noreferrer' : undefined}
        >
          View &#8599;
        </a>
      </div>
    </div>
  </article>
);

const ProjectDialog = ({ project, onClose }) => {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!project) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose(null);
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-dialog"
          role="presentation"
          initial={reduceMotion ? false : { opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(14px)' }}
          exit={reduceMotion ? undefined : { opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose(null);
          }}
        >
          <motion.div
            ref={dialogRef}
            className="project-dialog__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            initial={reduceMotion ? false : {
              opacity: 0,
              y: 34,
              scale: 0.94,
              rotateX: 7,
              rotateY: -2,
              filter: 'blur(10px)',
            }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotateY: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? undefined : {
              opacity: 0,
              y: 18,
              scale: 0.97,
              rotateX: -3,
              filter: 'blur(5px)',
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.72,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformPerspective: 1200, transformOrigin: '50% 35%' }}
          >
            <div className="project-dialog__visual">
              <motion.img
                src={project.image}
                alt=""
                initial={reduceMotion ? false : { scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="project-dialog__visual-copy"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="project-dialog__eyebrow">
                  {project.icon && <Icon name={project.icon} className="size-[15px]" />}
                  {project.type}
                </p>
                <h2 id="project-dialog-title">{project.title}</h2>
              </motion.div>
            </div>

            <motion.div
              className="project-dialog__content"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                ref={closeButtonRef}
                className="project-dialog__close"
                type="button"
                onClick={() => onClose(null)}
                aria-label="Close project details"
              >
                &times;
              </button>
              <p className="label">Project breakdown</p>
              <p className="project-dialog__intro">{project.blurb}</p>

              <motion.div className="project-dialog__section" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.22 }}>
                <h3><span>01</span> The brief</h3>
                <p>{project.brief}</p>
              </motion.div>
              <motion.div className="project-dialog__section" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.3 }}>
                <h3><span>02</span> The challenge</h3>
                <p>{project.challenge}</p>
              </motion.div>
              <motion.div className="project-dialog__section" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.38 }}>
                <h3><span>03</span> The solution</h3>
                <p>{project.solution}</p>
              </motion.div>
              <motion.div className="project-dialog__section" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.46 }}>
                <h3><span>04</span> Tools &amp; technology</h3>
                <div className="project-dialog__stack">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </motion.div>

              {project.href.startsWith('https://') ? (
                <a
                  className="project-dialog__link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit live project <span aria-hidden="true">&#8599;</span>
                </a>
              ) : (
                <span className="project-dialog__link project-dialog__link--disabled">
                  Live project not available
                </span>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ═══ Fan ═══════════════════════════════════════════════════════════════ */

const Fan = ({ projects, label, description, delay = 3000, onOpenProject, dialogOpen, onCursorMove, onCursorChange }) => {
  const [order, setOrder] = useState(() => projects.map((_, i) => i));
  const orderRef = useRef(order);
  const [exiting, setExiting] = useState(-1);
  const [progressRun, setProgressRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const advanceTimer = useRef(null);
  const remaining = useRef(delay);
  const deadline = useRef(0);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const suppressClickTimer = useRef(null);
  const hovered = useRef(false);
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const position = (i) => {
    const slot = order.indexOf(i);
    return slot < 4 ? slot : 'hidden';
  };

  const changeOrder = (update) => {
    const nextOrder = update(orderRef.current);
    orderRef.current = nextOrder;
    setOrder(nextOrder);
  };

  const next = (onComplete) => {
    if (advanceTimer.current) return;
    setExiting(orderRef.current[0]);
    advanceTimer.current = setTimeout(() => {
      changeOrder((current) => [...current.slice(1), current[0]]);
      setExiting(-1);
      advanceTimer.current = null;
      onComplete?.();
    }, 700);
  };

  const prev = () => changeOrder((current) => [current[current.length - 1], ...current.slice(0, -1)]);

  const play = () => {
    clearTimeout(timer.current);
    if (hovered.current || drag.current !== null || reduceMotion.current || dialogOpen) return;
    setPaused(false);
    deadline.current = Date.now() + remaining.current;
    timer.current = setTimeout(() => {
      timer.current = null;
      next(() => {
        remaining.current = delay;
        setProgressRun((run) => run + 1);
        play();
      });
    }, remaining.current);
  };
  const pause = () => {
    if (timer.current !== null) {
      remaining.current = Math.max(0, deadline.current - Date.now());
    }
    clearTimeout(timer.current);
    timer.current = null;
    setPaused(true);
  };

  useEffect(() => {
    remaining.current = delay;
    if (reduceMotion.current) return;
    play();
    return () => {
      clearTimeout(timer.current);
      clearTimeout(advanceTimer.current);
      clearTimeout(suppressClickTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  useEffect(() => {
    if (dialogOpen) pause();
    else play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  /* Pointer input shares one swipe threshold across mouse and touch. */
  const DRAG_MIN = 50;
  const start = (x) => {
    clearTimeout(suppressClickTimer.current);
    suppressClick.current = false;
    drag.current = x;
    pause();
  };
  const cancelDrag = () => {
    drag.current = null;
    remaining.current = delay;
    setProgressRun((run) => run + 1);
    play();
  };
  const end = (x) => {
    if (drag.current === null) return;
    const moved = drag.current - x;
    drag.current = null;
    if (Math.abs(moved) > DRAG_MIN && moved > 0) {
      suppressClick.current = true;
      clearTimeout(suppressClickTimer.current);
      suppressClickTimer.current = setTimeout(() => { suppressClick.current = false; }, 500);
      remaining.current = delay;
      next(() => {
        setProgressRun((run) => run + 1);
        play();
      });
      return;
    }
    if (Math.abs(moved) > DRAG_MIN) {
      suppressClick.current = true;
      clearTimeout(suppressClickTimer.current);
      suppressClickTimer.current = setTimeout(() => { suppressClick.current = false; }, 500);
      prev();
    }
    remaining.current = delay;
    setProgressRun((run) => run + 1);
    play();
  };

  const stepNext = () => {
    pause();
    remaining.current = delay;
    next(() => {
      setProgressRun((run) => run + 1);
      play();
    });
  };
  const stepPrev = () => {
    pause();
    prev();
    remaining.current = delay;
    setProgressRun((run) => run + 1);
    play();
  };
  const bringToFront = (index, project) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      clearTimeout(suppressClickTimer.current);
      return;
    }
    pause();
    clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
    setExiting(-1);
    changeOrder((current) => [index, ...current.filter((item) => item !== index)]);
    remaining.current = delay;
    setProgressRun((run) => run + 1);
    onOpenProject(project);
  };
  const shown = order[0] + 1;

  return (
    <div
      className="work-block"
      data-paused={paused ? 'true' : undefined}
      style={{ '--work-delay': `${delay}ms` }}
    >
      <div className="work-head">
        <div>
          <p className="label flex items-center gap-3">
            <span style={{ width: 28, height: 1, background: 'var(--c-accent-soft)' }} />
            {label}
          </p>
          {description && <p className="work-head__desc">{description}</p>}
        </div>

        <div className="work-nav">
          <button
            type="button"
            onClick={stepPrev}
            aria-label="Previous project"
            className="grid size-10 place-items-center rounded-full border border-line text-muted"
          >
            &#8592;
          </button>
          <button
            type="button"
            onClick={stepNext}
            aria-label="Next project"
            className="grid size-10 place-items-center rounded-full border border-line text-muted"
          >
            &#8594;
          </button>

          <div className="work-progress" aria-hidden="true">
            <span key={progressRun} className="work-progress__fill" />
          </div>

          <span className="font-mono text-[12px] text-faint">
            {String(shown).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div
        className="work-stage"
        onMouseEnter={() => {
          hovered.current = true;
          pause();
        }}
        onMouseLeave={() => {
          hovered.current = false;
          play();
        }}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          start(e.clientX);
        }}
        onPointerUp={(e) => end(e.clientX)}
        onPointerCancel={cancelDrag}
        style={{ userSelect: 'none', touchAction: 'pan-y' }}
      >
        <div className="work-fan">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              position={position(i)}
              isExiting={exiting === i}
              onBringToFront={() => bringToFront(i, project)}
              onCursorMove={onCursorMove}
              onCursorChange={onCursorChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══ Work ══════════════════════════════════════════════════════════════ */

export function Work() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('Click to view');
  const cursorX = useSpring(useMotionValue(-100), { stiffness: 650, damping: 45, mass: 0.25 });
  const cursorY = useSpring(useMotionValue(-100), { stiffness: 650, damping: 45, mass: 0.25 });
  const moveCursor = (x, y, label) => {
    cursorX.set(x);
    cursorY.set(y);
    setCursorLabel(label);
  };
  const setCursorActive = (visible) => setCursorVisible(visible && !selectedProject);

  return (
    <section id="work" className="relative bg-surface py-section">
      <div className="mx-auto w-full max-w-site px-gutter">
        <Reveal className="mb-[clamp(36px,5vw,68px)]">
          <SplitHeading className="text-step-3">
            <Accent className="text-link">Shopify</Accent> &amp; WordPress work
          </SplitHeading>

          <p className="mt-6 max-w-[54ch] text-[16px] leading-[1.8] text-secondary">
            Storefronts that had to sell, and sites that had to keep working long
            after launch. Here is a selection from both platforms, with the
            problem each one was built to solve. Select any project to explore
            the brief, challenge, solution, and tools behind it.
          </p>
        </Reveal>

        <Fan
          projects={shopifyProjects}
          label="Shopify · 200+ live stores"
          description="Custom themes, speed work and private apps, built on Liquid and OS 2.0."
          onOpenProject={setSelectedProject}
          dialogOpen={Boolean(selectedProject)}
          onCursorMove={moveCursor}
          onCursorChange={setCursorActive}
        />

        <Fan
          projects={wordpressProjects}
          label="WordPress · 200+ custom sites"
          description="Bespoke plugins, WooCommerce builds and design systems a client can run themselves."
          onOpenProject={setSelectedProject}
          dialogOpen={Boolean(selectedProject)}
          onCursorMove={moveCursor}
          onCursorChange={setCursorActive}
        />
      </div>
      <motion.div
        className="work-cursor"
        aria-hidden="true"
        style={{ x: cursorX, y: cursorY, translateX: 16, translateY: 16 }}
        animate={{ opacity: cursorVisible && !selectedProject ? 1 : 0, scale: cursorVisible && !selectedProject ? 1 : 0.85 }}
        transition={{ opacity: { duration: 0.16 }, scale: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      >
        <span className="work-cursor__mark">{cursorLabel === 'Visit' ? '↗' : '+'}</span>
        {cursorLabel}
      </motion.div>
      <ProjectDialog project={selectedProject} onClose={setSelectedProject} />
    </section>
  );
}

export default Work;