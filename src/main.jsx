/* main.jsx — the entry point: smooth scrolling, the page order, and mounting the app. */

import "./index.css";                  /* before the sections, so their own CSS lands after it */
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Work } from "./sections/Work";
import { Services } from "./sections/Services";
import { About } from "./sections/About";
import { Experience } from "./sections/Experience";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { createRoot } from "react-dom/client";

/* ═══ useLenis — was hooks/useLenis.js ═════════════════════════════════════ */
/* ==========================================================================
   useLenis()

   Smooth scrolling for the whole page. Mount this once, at the app root.

   Two things it has to own, or anchors break:

   1. CSS scroll-behavior must be auto. Native smooth scrolling and Lenis
      fight each other and the page stutters. index.css sets auto.
   2. Anchor clicks are intercepted and handed to lenis.scrollTo, because
      the browser's own jump bypasses Lenis entirely.

   Returns a ref to the instance so components can scroll programmatically.
   ========================================================================== */

function useLenis() {
  const lenis = useRef(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.05,
      // slight ease-out: fast to start, settles gently. Anything slower
      // than this starts to feel like the page is lagging behind you.
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // leave touch alone — native momentum on phones is better than ours
      syncTouch: false
    });
    lenis.current = instance;

    let raf = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    });

    const onClick = e => {
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      instance.scrollTo(target, { offset: -96 });   // clear the fixed header
      history.replaceState(null, "", "#" + id);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  return lenis;
}

/* ═══ App — the page, section by section ═══════════════════════════════════ */
function App() {
  useLenis();   // smooth scrolling, and it takes over anchor jumps

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/* ═══ mount ═════════════════════════════════════════════════════════════ */
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
