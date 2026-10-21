/* ══════════════════════════════════════════════════════════════════════════
   Hero.jsx

   Everything for this section: the opening screen: headline, stats, the aurora background and the two platform folders.

   In this file, top to bottom:
     1. content
     2. Hero
     3. Counter
     4. useAurora
     5. styles
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, useReducedMotion, animate, useInView } from "motion/react";
import { Icon, Reveal, SplitHeading, useMediaQuery, injectCss } from "../shared";
import { profile } from "../content";
import FolderFloat from "../vendor/FolderFloat";

/* ═══ content — the words on this section; edit them here ══════════════════ */
const stats = [
  { to: 40, suffix: "+",    label: "sites shipped" },
  { to: 6,  suffix: " yrs", label: "building for the web" },
  { to: 2,  suffix: "",     label: "platforms, in depth" }
];

/* the two platform cards in the hero */
const heroPlatforms = [
  {
    id: "shopify",
    icon: "shopify",
    name: "Shopify",
    line: "Themes, sections & apps",
    tags: ["Liquid", "OS 2.0", "Theme apps", "Dropshipping"]
  },
  {
    id: "wordpress",
    icon: "wordpress",
    name: "WordPress",
    line: "Themes, plugins & stores",
    tags: ["PHP", "Elementor", "WooCommerce", "Custom plugins"]
  }
];


/* ═══ Hero — the section  ·  was components/Hero.jsx ═══════════════════════ */
const EASE = [.16, 1, .3, 1];

/* ==========================================================================
   The two platforms, as two badges: the Shopify mark and the WordPress mark.

   They enter with a bounce, then float gently. Hover one (tap on a phone) and its
   tags float out of it as pills you can drag and throw; move away and they tuck
   back in. The mechanics are FolderFloat's; the badge replaces its folder.

   Timing is deliberately slow and soft. Opening takes ~1.1s with an 85ms stagger,
   closing ~1s, and a pill takes 380ms to fade. The pointer also has to rest on a
   badge for 90ms before it opens and leave for 320ms before it closes, so
   sweeping across them does not make them flicker. Change OPEN_MS / STAGGER /
   CLOSE_RATIO below to make it quicker or slower.

   Layout, desktop: the badges sit on a diagonal and the second is a full cloud
   below the first, so their clouds never meet. The cloud's spread keeps it inside
   the 1200px column. Phone: side by side, one open at a time.
   ========================================================================== */
const SLOTS = [
  { left: "34%", top: 54 },
  { left: "63%", top: 316 }
];
/* One unit is tab(14) + folder height + gap(14) + pill(38). Keep
   SLOTS[1].top + UNIT under the stage height minus the hint, or the second
   pill lands on the chip — which is exactly what happened when the folder
   grew from 132 to 178 and these numbers did not move with it. */
const OPEN_MS = 1150, STAGGER = 85, CLOSE_RATIO = 0.85, FADE_MS = 380;
const HOVER_IN = 90, HOVER_OUT = 320;       // ms the pointer must rest / be gone

function PlatformBadges({ reduce }) {
  const [openId, setOpenId] = useState(null);
  const timers = useRef({});
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)", true);
  const desktop = useMediaQuery("(min-width: 64rem)", true);
  const wide = useMediaQuery("(min-width: 80rem)", true);
  const phone = !useMediaQuery("(min-width: 40rem)", true);
  const compactPhone = !useMediaQuery("(min-width: 21.25rem)", true);
  const mediumPhone = useMediaQuery("(min-width: 23.4375rem)", true);
  const widePhone = useMediaQuery("(min-width: 26.25rem)", true);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  // hover opens and closes on a short delay; a tap acts at once
  const ask = (id, want) => {
    clearTimeout(timers.current[id]);
    const run = () => setOpenId(cur => (want ? id : cur === id ? null : cur));
    if (!canHover) return run();
    timers.current[id] = setTimeout(run, want ? HOVER_IN : HOVER_OUT);
  };

  // touch has no "pointer leaves": a tap outside every badge is how you close one
  useEffect(() => {
    if (canHover) return undefined;
    const away = e => { if (!e.target.closest("[data-folder]")) setOpenId(null); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [canHover]);

  const size = desktop
    /* A folder reads as a folder only if it is landscape — the square the
       badge used looked like a tile. Height comes off the width. */
    ? { badge: 238, tall: 178, radius: 20, spread: wide ? 196 : 158 }
    /* Same folder below desktop, because the sublabel is what sets the floor:
       at 176px it gets an 18-character column for a 23-character string, so it
       wrapped and the fixed-height flap clipped it. 230px gives ~26 characters
       and the line holds. Only the layout and the cloud spread differ — phone
       stacks, tablet sits side by side. */
    : phone
      ? compactPhone
        ? { badge: 124, tall: 142, radius: 15, spread: 76 }
        : !mediumPhone
          ? { badge: 136, tall: 142, radius: 15, spread: 80 }
          : widePhone
            ? { badge: 174, tall: 150, radius: 17, spread: 96 }
            : { badge: 154, tall: 146, radius: 16, spread: 88 }
      : { badge: 230, tall: 172, radius: 18, spread: 110 };

  return (
    <div className={desktop ? "relative h-[624px]" : (phone
          ? "grid grid-cols-2 justify-items-center gap-x-2 pt-2"
          : "flex flex-wrap items-start justify-center gap-x-5 gap-y-10 pt-2")}>
      {heroPlatforms.map((p, i) => (
        <motion.div
          key={p.id}
          className={"flex flex-col items-center " + (desktop ? "absolute -translate-x-1/2 " : "relative ") +
                     (openId === p.id ? "z-20" : "z-10")}
          /* explicit width: an absolutely positioned flex column is
             shrink-to-fit, so the folder and the pill under it could resolve
             to different box widths and drift off a shared centre. */
          style={desktop
            ? { left: SLOTS[i].left, top: SLOTS[i].top, width: size.badge }
            : { width: size.badge }}
          /* in with a bounce: up from below, tilted, then it settles */
          initial={reduce ? false : { opacity: 0, y: 70, scale: 0.55, rotate: i ? 9 : -9 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{
            default: { type: "spring", stiffness: 105, damping: 12, mass: 0.9, delay: 0.35 + i * 0.2 },
            opacity: { duration: 0.7, delay: 0.35 + i * 0.2 }
          }}
        >
          <span className="block w-full">
          <FolderFloat
            items={p.tags}
            label={p.name}
            sublabel={p.line}
            trigger={canHover ? "hover" : "click"}
            open={openId === p.id}
            onOpenChange={o => ask(p.id, o)}
            width={size.badge} height={size.tall} radius={size.radius} spread={size.spread}
            lift={22} tilt={7}
            openDuration={OPEN_MS} stagger={STAGGER} bounce={0.35} closeRatio={CLOSE_RATIO} fade={FADE_MS}
            /* These four were never passed, so FolderFloat used its own
               defaults — zinc #3f3f46 and #52525b — and the folder rendered
               grey no matter what the --folder-* tokens said. */
            folderColor="var(--folder-back)" frontColor="var(--folder-front)"
            paperColor="var(--folder-paper)" labelColor="var(--folder-label)"
            itemColor="var(--folder-pill)" itemTextColor="var(--folder-pill-ink)" subColor="var(--folder-sub)"
          />
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const skyRef = useRef(null);

  useAurora(skyRef);

  return (
    <section id="top"
      className="relative isolate flex min-h-svh items-center overflow-hidden
                 pt-[calc(88px+var(--spacing-section))] pb-section">

      <div ref={skyRef} className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="rig" aria-hidden="true">
          <div className="rig__rim" />
          <div className="rig__key2" />
          <div className="rig__key" />
          <div className="rig__mass" />
          <div className="rig__mass2" />
          <div className="rig__shaft" />
          <div className="rig__floor" />
        </div>
      </div>
      <div className="fx-grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-site grid-cols-1 items-center
                      gap-[clamp(28px,5vw,80px)] px-gutter lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">

        {/* ---- copy ---- */}
        <div>
          <Reveal as="p" data-copy-block
            className="inline-flex items-center gap-2.5 rounded-pill border border-line
                       bg-white/[.03] px-3.5 py-2 font-mono text-[12.5px] text-body">
            <i className="dot" />
            {profile.working}
          </Reveal>

          <Reveal as="p" delay={.06} data-copy-block
            className="mt-5 font-mono text-[11px] tracking-[.14em] text-muted sm:text-[12.5px] sm:tracking-[.22em]">
            {profile.role}
          </Reveal>

          <SplitHeading as="h1" delay={.1} data-copy-block
            className="mt-3 max-w-[14ch] text-balance text-[clamp(32px,5.2vw,66px)] leading-[1.03] tracking-[.005em]">
            Custom builds on
            <span className="text-link">Shopify &amp; WordPress</span>
          </SplitHeading>

          <Reveal as="div" delay={.2} data-copy-block className="mt-5 flex items-center gap-3 sm:gap-4">
            <span aria-hidden="true" className="h-px w-12 flex-none bg-accent-soft/60" />
            <p className="font-mono text-[12px] tracking-[.04em] text-accent-hi sm:text-[13px] sm:tracking-[.06em]">
              {profile.tagline}
            </p>
          </Reveal>

          <Reveal as="p" delay={.26} data-copy-block className="mt-4 max-w-[48ch] text-[13.5px] leading-relaxed text-muted sm:text-step-0">
            I lead web projects from first brief to launch — tailored themes and
            advanced animation on Shopify, WooCommerce and custom plugins on
            WordPress. Built for the project, not bent out of a template.
          </Reveal>

          <Reveal delay={.32} data-copy-block className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3.5">
            <a href="#contact" className="btn btn-solid group justify-center sm:justify-start">
              Get in touch
              <Icon name="arrow" className="size-3.5 transition-transform duration-500 ease-out-expo
                                             group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href={profile.resume} download className="btn btn-ghost group justify-center sm:justify-start">
              <Icon name="download" className="size-3.5 transition-transform duration-500 ease-out-expo
                                               group-hover:translate-y-0.5" />
              Download resume
            </a>
          </Reveal>

          <Reveal delay={.38} data-copy-block
            className="mt-[clamp(26px,4vw,52px)] grid grid-cols-3 gap-x-4 gap-y-5
                       border-t border-line pt-5
                       sm:flex sm:flex-wrap sm:gap-x-12 sm:gap-y-6 sm:pt-6">
            {stats.map(s => (
              <div key={s.label}>
                <Counter to={s.to} suffix={s.suffix}
                  className="block font-display text-[clamp(22px,4vw,42px)] font-bold
                             leading-none tracking-[-.01em] text-primary" />
                <span className="mt-1.5 block font-mono text-[11px] leading-tight text-secondary sm:mt-2 sm:text-[12px]">{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ---- the two platforms, as folders ---- */}
        <PlatformBadges reduce={reduce} />

      </div>
    </section>
  );
}

/* ═══ Counter — component  ·  was components/Counter.jsx ═══════════════════ */
/* ==========================================================================
   <Counter to={40} suffix="+" />

   animate() works on plain numbers, not just elements. Counting is done in
   a ref and written to the DOM directly — putting it in state would
   re-render this component sixty times a second for the whole count.

   The final value is rendered as real text on first paint, so a crawler or
   a reader with JS off still sees "40+", not "0".
   ========================================================================== */

function Counter({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  /* 0.5, not the site's REVEAL_AT: a number that counts up should be
     properly on screen before it starts, or it finishes off the bottom. */
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  /* The markup renders the final value so a crawler, or a reader with JS
     off, sees "40+" rather than "0". Once JS is confirmed running, reset to
     the start value before the browser paints — useEffect would be a frame
     too late and the number would visibly flicker down. */
  useLayoutEffect(() => {
    if (reduce || done) return;
    const el = ref.current;
    if (el) el.textContent = prefix + from.toFixed(decimals) + suffix;
  }, [reduce, done, from, decimals, prefix, suffix]);

  useEffect(() => {
    if (!inView || done) return;
    const el = ref.current;
    if (!el) return;

    if (reduce) { setDone(true); return; }

    const controls = animate(from, to, {
      duration,
      ease: [.16, 1, .3, 1],
      // round here, or forty-one decimal places flicker past
      onUpdate: v => { el.textContent = prefix + v.toFixed(decimals) + suffix; },
      onComplete: () => setDone(true)
    });
    return () => controls.stop();
  }, [inView, done, from, to, duration, decimals, prefix, suffix, reduce]);

  return (
    <span ref={ref} className={className} {...rest}>
      {prefix}{to.toFixed(decimals)}{suffix}
    </span>
  );
}

/* ═══ useAurora — behaviour  ·  was hooks/useAurora.js ═════════════════════ */
/* ==========================================================================
   useAurora(ref)

   A WebGL fragment shader painting a volumetric, lit cloud behind the hero.

   Why a shader and not more CSS:
   a gradient can only interpolate between fixed stops, so no matter how many
   layers you stack it stays smooth and even — it reads as moving blobs.
   Depth needs density that varies per pixel, and light that responds to that
   density. That is a per-pixel calculation, which is what a shader is for.

   Three things give it life:
     1  fractal brownian motion — noise summed at several scales, so the
        cloud has both large forms and fine detail, like real vapour
     2  domain warping — the noise samples itself, which makes it curl and
        fold instead of merely drifting
     3  fake normals — the density field's slope is treated as a surface
        normal and lit from one direction, so forms have bright and shadowed
        faces. This is the part that reads as three-dimensional.

   Everything is drawn at half resolution and scaled up: the content is all
   soft, so the loss is invisible and the pixel cost drops to a quarter.
   ========================================================================== */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uDeep;     // the colour where the cloud is thickest
uniform vec3  uMid;
uniform vec3  uHot;      // the lit face
uniform vec3  uBack;     // empty space
uniform float uStrength;

/* --- value noise, cheap and smooth enough once summed --- */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);          // smoothstep, not linear
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

/* --- fbm: the same noise at halving scale and amplitude --- */
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);  // rotate each octave so the
  for (int i = 0; i < 5; i++) {              // grid never lines up
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

/* --- the density field: fbm looking up fbm, twice --- */
float density(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.022)),
                fbm(p + vec2(5.2, 1.3) + t * 0.018));
  vec2 r = vec2(fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.014),
                fbm(p + 2.4 * q + vec2(8.3, 2.8) + t * 0.011));
  return fbm(p + 2.1 * r);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p  = uv;
  p.x *= uRes.x / uRes.y;                    // keep the noise square
  p *= 1.05;                                 // larger, calmer forms

  float t = uTime;
  float d = density(p, t);

  /* slope of the density field, used as a surface normal. Sampling two
     neighbours is enough — the field is smooth. */
  float e = 0.035;
  float dx = density(p + vec2(e, 0.0), t) - d;
  float dy = density(p + vec2(0.0, e), t) - d;
  vec3 n = normalize(vec3(-dx, -dy, 0.22));

  /* one key light, low and to the right, slowly swinging */
  vec3 L = normalize(vec3(0.62 + 0.14 * sin(t * 0.09), -0.55, 0.58));
  float lambert = max(dot(n, L), 0.0);
  float rim = pow(max(1.0 - n.z, 0.0), 2.4);  // brightens glancing faces

  /* Confine the cloud to the lower right. This is a background: the
     headline has to stay the brightest thing on the screen, so the top
     left is kept near-empty and the mass ramps up toward the far corner. */
  float corner = uv.x * 0.55 + (1.0 - uv.y) * 0.85;
  float bias = smoothstep(0.30, 1.15, corner);
  bias *= bias;                               // squared: a slower ramp in

  /* a high threshold keeps only the densest parts of the field, so there
     is open space between forms rather than wall-to-wall cloud */
  float mass = smoothstep(0.42, 0.90, d) * bias;

  vec3 col = uBack;
  col = mix(col, uDeep, mass);
  col = mix(col, uMid,  mass * lambert * 0.95);
  col += uHot * pow(lambert, 3.6) * mass * 0.80;   // the lit faces
  col += uHot * rim * mass * 0.14;

  /* a soft floor bounce, so the section sits on something */
  col += uMid * pow(1.0 - uv.y, 4.0) * 0.34;

  /* dither: 8-bit gradients band badly on dark colours, and a touch of
     noise is cheaper and better looking than more colour depth */
  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.012;

  gl_FragColor = vec4(col * uStrength, 1.0);
}
`;

const read = (cs, name, fallback) => {
  const v = cs.getPropertyValue(name).trim();
  if (!v) return fallback;
  const n = v.split(/[\s,]+/).map(Number).filter(x => !Number.isNaN(x));
  return n.length === 3 ? n.map(x => x / 255) : fallback;
};

function useAurora(ref) {
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "aurora";
    canvas.setAttribute("aria-hidden", "true");
    host.prepend(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: false, antialias: false, depth: false, powerPreference: "low-power"
    });
    // no WebGL: leave the CSS rig underneath doing its job
    if (!gl) { canvas.remove(); return; }

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.remove(); return; }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(prog);

    // one full-screen triangle; a quad would need two and an extra vertex
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      deep: gl.getUniformLocation(prog, "uDeep"),
      mid: gl.getUniformLocation(prog, "uMid"),
      hot: gl.getUniformLocation(prog, "uHot"),
      back: gl.getUniformLocation(prog, "uBack"),
      strength: gl.getUniformLocation(prog, "uStrength")
    };

    const applyTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      gl.uniform3fv(U.deep, read(cs, "--sky-deep", [0.02, 0.09, 0.07]));
      gl.uniform3fv(U.mid,  read(cs, "--sky-mid",  [0.00, 0.42, 0.30]));
      gl.uniform3fv(U.hot,  read(cs, "--sky-hot",  [0.55, 1.00, 0.80]));
      gl.uniform3fv(U.back, read(cs, "--sky-back", [0.02, 0.035, 0.028]));
      gl.uniform1f(U.strength, parseFloat(cs.getPropertyValue("--sky-strength")) || 1);
    };

    /* Half resolution, and never wider than 900px of actual pixels. The
       content is soft, so the loss is invisible, but a 4K hero would
       otherwise ask the fragment shader for eight times the work. */
    const SCALE = 0.5;
    const MAXW = 900;
    const resize = () => {
      const r = host.getBoundingClientRect();
      const scale = Math.min(SCALE, MAXW / Math.max(1, r.width));
      const w = Math.max(1, Math.round(r.width * scale));
      const h = Math.max(1, Math.round(r.height * scale));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.res, w, h);
    };

    /* 30fps, not 60. The cloud evolves over tens of seconds, so half the
       frames are indistinguishable — and it leaves the main thread free for
       everything else on the page. A heavy fragment shader running flat out
       will delay IntersectionObserver callbacks and scroll handlers. */
    const MIN_DT = 1000 / 30;
    let raf = null, t0 = performance.now(), last = 0, paused = false;

    const frame = now => {
      raf = requestAnimationFrame(frame);
      if (paused || now - last < MIN_DT) return;
      last = now;
      gl.uniform1f(U.time, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const io = new IntersectionObserver(([e]) => { paused = !e.isIntersecting; },
      { threshold: 0 });

    const themeWatcher = new MutationObserver(applyTheme);
    themeWatcher.observe(document.documentElement, {
      attributes: true, attributeFilter: ["data-theme"]
    });

    applyTheme();
    resize();
    io.observe(host);
    addEventListener("resize", resize, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      themeWatcher.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [ref]);
}

/* ═══ styles — this section's own CSS; the shared look lives in index.css ═══ */
injectCss("hero", `
@layer components {
  /* ---- the hero's 3D light rig ------------------------------------------
     Four stacked layers, no canvas and no pointer tracking. Depth comes
     from the arrangement, not from motion:

       1  a warm key light low and to the right
       2  a cool rim light top left, so the scene is lit from two sides
       3  a soft dark mass across the middle that occludes both — light
          that is partly blocked reads as volume; an even wash reads flat
       4  a floor bounce at the bottom edge

     Sizes are in px, not percentages. A percentage ellipse stretches with
     the viewport and the same values that look lit at 1440 wash out at
     1920.
     --------------------------------------------------------------------- */
  /* One knob for the whole rig. Turn it down to .6 if it ever feels loud,
     up to 1.4 on a dim screen — nothing else needs touching. */
  /* the shader canvas sits above the CSS rig, which stays as the fallback
     for browsers without WebGL */
  .aurora {
    position: absolute; inset: 0; z-index: 1;
    width: 100%; height: 100%;
    pointer-events: none;
    opacity: var(--sky-opacity, 1);
    /* fades out toward the top left, so the cloud never reaches the
       headline. The shader biases toward that corner too; the mask is the
       belt to its braces. */
    -webkit-mask-image: radial-gradient(150% 135% at 84% 96%, #000 18%, rgba(0,0,0,.72) 52%, transparent 88%);
    mask-image: radial-gradient(150% 135% at 84% 96%, #000 18%, rgba(0,0,0,.72) 52%, transparent 88%);
  }

  .rig {
    position: absolute; inset: 0; z-index: 0;
    pointer-events: none; overflow: hidden;
    opacity: var(--rig-strength, 1);
  }

  /* Each layer drifts on its own clock. Durations are deliberately
     unrelated — 19s, 23s, 27s, 31s — so they never resync into a loop the
     eye can catch. Only transform and opacity animate, so everything stays
     on the compositor and costs nothing during scroll.

     No will-change here. An animated transform is promoted automatically,
     and forcing seven large blurred layers onto their own compositor
     layers makes Chromium tile them — the tile boundaries then show as
     faint straight seams across the gradient. */
  .rig > * { backface-visibility: hidden; }

  /* 1 — the key light, low and right. Tight and bright: a visible source,
         not an even wash. */
  .rig__key {
    position: absolute; inset: -20%;
    background:
      radial-gradient(420px 300px at 72% 84%, var(--rig-core) 0%, transparent 62%),
      radial-gradient(760px 520px at 76% 88%, var(--rig-key)  0%, transparent 70%);
    animation: rig-key 19s ease-in-out infinite alternate;
  }

  /* 2 — the wide bounce it sits inside */
  .rig__key2 {
    position: absolute; inset: -24%;
    background: radial-gradient(1200px 820px at 92% 104%, var(--rig-key2) 0%, transparent 72%);
    animation: rig-key2 27s ease-in-out infinite alternate;
  }

  /* 3 — a cool rim from the opposite corner, so the scene is lit from two
         sides. One light source always looks flat. */
  .rig__rim {
    position: absolute; inset: -20%;
    background: radial-gradient(700px 540px at 10% 4%, var(--rig-rim) 0%, transparent 68%);
    animation: rig-rim 23s ease-in-out infinite alternate;
  }

  /* 4 — the occluding mass. This is the layer that makes it read as volume:
         light partly blocked by a shape is depth, light spread evenly is a
         gradient. It drifts and turns, so the lit edge keeps moving. */
  /* No filter: blur() anywhere in the rig. A large blurred layer is split
     into tiles by the compositor, and the tile seams show as faint straight
     lines across a dark gradient. A radial-gradient is soft by nature,
     needs no filter, and cannot tile. */
  .rig__mass {
    position: absolute; left: 10%; top: -60%; width: 130%; height: 190%;
    background: radial-gradient(closest-side at 52% 46%,
      var(--rig-mass) 0%, var(--rig-mass) 34%, transparent 78%);
    animation: rig-mass 31s ease-in-out infinite alternate;
  }

  /* 5 — a second, smaller mass crossing the other way. Two overlapping
         occluders give the scene an interior rather than a silhouette. */
  .rig__mass2 {
    position: absolute; left: -40%; top: 0%; width: 120%; height: 140%;
    background: radial-gradient(closest-side at 54% 50%,
      var(--rig-mass) 0%, var(--rig-mass) 28%, transparent 74%);
    opacity: .8;
    animation: rig-mass2 37s ease-in-out infinite alternate;
  }

  /* 6 — the shaft. A hard-edged band of light raking diagonally across the
         scene, the way a gap in something casts across a floor. This is the
         single strongest depth cue in the reference: a soft blob reads as
         fog, but a directional streak reads as light with a source. */
  .rig__shaft {
    /* Deliberately far larger than the viewport. A blurred element's box is
       cut square at its own edges, and the drift animation can slide that
       cut into frame as a hard straight seam — the box has to stay well
       outside the visible area at every point in the cycle. */
    position: absolute; left: -75%; top: -75%; width: 250%; height: 250%;
    /* wider, softer stops instead of a blur filter */
    background: linear-gradient(104deg,
      transparent 38%,
      var(--rig-shaft) 46%,
      var(--rig-shaft-hot) 50%,
      var(--rig-shaft) 54%,
      transparent 62%);
    /* and the band itself fades out along its length, so neither end can
       ever terminate in a visible line */
    -webkit-mask-image: radial-gradient(60% 55% at 50% 50%, #000 25%, transparent 78%);
    mask-image: radial-gradient(60% 55% at 50% 50%, #000 25%, transparent 78%);
    animation: rig-shaft 24s ease-in-out infinite alternate;
  }

  .rig__floor {
    /* Wider than the viewport on both sides. It translates horizontally,
       and a box pinned to inset:0 would drag its own straight edge into
       frame — which is exactly the rectangular seam that showed up on the
       left of the hero. */
    position: absolute; inset: auto -25% 0; height: 46%;
    background: linear-gradient(to top, var(--rig-floor) 0%, transparent 84%);
    animation: rig-floor 21s ease-in-out infinite alternate;
  }

  @keyframes rig-key {
    0%   { transform: translate3d(-9%, 5%, 0) scale(.92); opacity: .75; }
    100% { transform: translate3d(8%, -7%, 0) scale(1.22); opacity: 1; }
  }
  @keyframes rig-key2 {
    0%   { transform: translate3d(6%, 4%, 0) scale(1); }
    100% { transform: translate3d(-10%, -8%, 0) scale(1.28); }
  }
  @keyframes rig-rim {
    0%   { transform: translate3d(-6%, -4%, 0) scale(.95); opacity: .7; }
    100% { transform: translate3d(9%, 7%, 0) scale(1.25); opacity: 1; }
  }
  @keyframes rig-mass {
    0%   { transform: rotate(-24deg) translate3d(-7%, 4%, 0) scale(.95); }
    100% { transform: rotate(-4deg)  translate3d(8%, -5%, 0) scale(1.14); }
  }
  @keyframes rig-mass2 {
    0%   { transform: rotate(12deg) translate3d(5%, -6%, 0) scale(1.05); }
    100% { transform: rotate(-8deg) translate3d(-8%, 7%, 0) scale(.9); }
  }
  @keyframes rig-shaft {
    0%   { transform: translate3d(-5%, -3%, 0) rotate(-5deg); opacity: .55; }
    50%  { transform: translate3d(1%, 1%, 0)   rotate(1deg);  opacity: 1; }
    100% { transform: translate3d(5%, 3%, 0)   rotate(4deg);  opacity: .7; }
  }
  @keyframes rig-floor {
    0%   { opacity: .6; transform: translate3d(-5%, 0, 0); }
    100% { opacity: 1;  transform: translate3d(6%, 0, 0); }
  }
}

@layer components {
  /* The badge override is gone — the hero shows the real folder again, so
     the .pb* tile styles that replaced it have been removed with it. */

  }
}

@media (prefers-reduced-motion: reduce) {
  .rig > * { animation: none; }
}
`);