import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
const { Bodies, Body, Composite, Engine } = Matter;

/* ==========================================================================
   FolderFloat — from React Bits (matter-js). A folder that opens on hover and
   floats a cloud of pills out of it; once they land, a zero-gravity world takes
   over and they can be dragged and thrown.

   The physics and layout are the original, untouched. What differs, and why:

   1  `open` is controllable. Left undefined it behaves exactly as before. The
      hero passes it so only one folder is open at a time — on a phone the two
      clouds would otherwise sit on top of each other.
   2  `icon` and `index` slots on the flap, so the folder can carry the platform
      mark and its number, as the cards it replaces did.
   3  The sublabel is a solid colour (`subColor`), not 55% opacity. Opacity made
      it look fine to the eye and invisible to a contrast check: the real colour
      was a blend nobody had measured.
   4  Flap type uses the site's display face and is sized for reading.
   5  Pills are touch-action: none while the physics is live, so dragging one on
      a phone moves it instead of scrolling the page out from under your finger.
   6  data-folder on the root, so the page can tell a tap outside from a tap in.
   7  A bug fix: the reduced-motion flag. See the comment on reduceRef below.
   8  A visible keyboard focus ring on the folder (the original removed the outline and drew none).
   9  `badge`: pass any element and it replaces the folder (back panel, paper, flap). The hero uses this to turn
      the folders into the Shopify and WordPress marks. The pills emerge from the top of it, in front of it.
  10  `closeRatio` and `fade`: how long closing takes relative to opening, and how long a pill takes to fade.
      Defaults are the original's (0.6 and 160ms); the hero slows both so open and close read as motion.

   Colours come in as props, and a prop can be a var(--token), which is how the
   folder follows the light/dark theme.
   ========================================================================== */

const DEFAULT_ITEMS = ['Try a warmer palette', 'Tighten the spacing', 'Logo feels small', 'Love the new hero'];
const PAD = 28;
const CHAR = 6.8;
const GAP = 12;
const ROW = 52;
const DRAG_MIN = 4;
const ZONE_PAD = 8;

const jitter = i => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

const layout = (list, spread, lift, tilt, sizes) => {
  const rows = [];
  let row = [];
  let width = 0;
  list.forEach((item, i) => {
    const pw = sizes[i]?.w ?? PAD + item.label.length * CHAR;
    if (row.length && width + GAP + pw > spread * 2) {
      rows.push({ items: row, width });
      row = [];
      width = 0;
    }
    row.push({ i, pw });
    width += (row.length > 1 ? GAP : 0) + pw;
  });
  if (row.length) rows.push({ items: row, width });
  const pos = [];
  rows.forEach((r, ri) => {
    let x = -r.width / 2;
    /* Rows alternate a small horizontal shift so the cloud is not a rigid
       stack. Was 16px, which pulled the whole cloud ~16px off the folder's
       centre line — halved so it still reads loose but lands centred. */
    const shift = (ri % 2 ? 1 : -1) * Math.min(8, spread * 0.05);
    r.items.forEach(({ i, pw }) => {
      const j = jitter(i);
      pos[i] = { x: x + pw / 2 + shift + (j - 0.5) * 6, y: -lift - ri * ROW - j * 6, r: tilt * (j * 2 - 1) };
      x += pw + GAP;
    });
  });
  return pos;
};

const STYLE = `
@keyframes folder-float-drift { 0%, 100% { translate: 0 0; } 50% { translate: 0 -3px; } }
@keyframes folder-float-pop { 30% { scale: 1.1; } 100% { scale: 1; } }
/* The idle peek. A closed folder that sits perfectly still gives nobody a
   reason to reach for it, so the top sheet edges up and settles back on a
   slow loop — something in there is not quite put away. It stops the moment
   the folder opens, so it never competes with the real interaction. */
@keyframes ff-peek {
  0%, 68%, 100% { transform: translateY(4px); }
  34%           { transform: translateY(-3px); }
}
@media (prefers-reduced-motion: reduce) {
  [class*="ff-peek"] { animation: none !important; }
}
`;

export default function FolderFloat({
  items = DEFAULT_ITEMS,
  label = 'Design feedback',
  sublabel = '',
  icon = null,
  index = '',
  trigger = 'hover',
  defaultOpen = false,
  open: openProp,
  closeOnSelect = true,
  physics = true,
  drift = 0.5,
  onSelect,
  onOpenChange,
  folderColor = '#3f3f46',
  frontColor = '#52525b',
  paperColor = '#f5f5f5',
  itemColor = '#f5f5f5',
  itemTextColor = '#18181b',
  labelColor = '#f5f5f5',
  subColor = 'rgba(245,245,245,0.72)',
  width = 200,
  height = 148,
  radius = 14,
  spread = 180,
  lift = 26,
  tilt = 8,
  flapAngle = 34,
  restAngle = 16,
  openDuration = 520,
  stagger = 45,
  bounce = 0.3,
  badge = null,
  closeRatio = 0.6,
  fade = 160,
  className = ''
}) {
  const [openState, setOpenState] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? !!openProp : openState;
  const openRef = useRef(open);
  openRef.current = open;
  const [popped, setPopped] = useState(-1);
  const [live, setLive] = useState(false);
  const [sizes, setSizes] = useState([]);
  const anchorRef = useRef(null);
  const pillRefs = useRef([]);
  const world = useRef({
    engine: null,
    bodies: [],
    sizes: [],
    raf: 0,
    last: 0,
    t0: 0,
    drag: null,
    zone: null,
    live: false
  });
  const latest = useRef({});
  latest.current = { onSelect, onOpenChange, drift };
  // Kept in its own ref. The original stored this flag on `latest`, which is rebuilt on every render, so
  // it was set once at mount and reset to false by the first re-render — opening a folder is a re-render.
  // Reduced motion therefore never actually stopped the physics. Read synchronously so even the very
  // first open is right.
  const reduceRef = useRef(typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const popTimer = useRef(undefined);
  const liveTimer = useRef(undefined);
  const list = items.map(item => (typeof item === 'string' ? { label: item, value: item } : item));
  const n = list.length;
  const sub = sublabel || `${n} ${n === 1 ? 'note' : 'notes'}`;
  const pos = layout(list, spread, lift, tilt, sizes);

  const labelsKey = list.map(item => item.label).join('|');
  useLayoutEffect(() => {
    const measure = () => {
      const next = pillRefs.current.slice(0, n).map(el => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
      if (next.some(s => !s)) return;
      setSizes(prev =>
        prev.length === next.length && prev.every((s, i) => s.w === next[i].w && s.h === next[i].h) ? prev : next
      );
    };
    measure();
    document.fonts?.ready.then(measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, labelsKey]);

  const stopPhysics = useCallback(() => {
    const w = world.current;
    clearTimeout(liveTimer.current);
    cancelAnimationFrame(w.raf);
    w.raf = 0;
    if (w.engine) {
      w.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - w.sizes[i].h / 2).toFixed(1)}px`);
      });
      Composite.clear(w.engine.world, false, true);
      Engine.clear(w.engine);
      w.engine = null;
    }
    w.bodies = [];
    w.drag = null;
    w.live = false;
    setLive(false);
  }, []);

  const startPhysics = useCallback(() => {
    const w = world.current;
    if (w.engine) return;
    const els = pillRefs.current.slice(0, n);
    if (els.some(el => !el)) return;
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engine.enableSleeping = false;
    w.engine = engine;
    w.sizes = els.map(el => ({ w: el.offsetWidth, h: el.offsetHeight }));
    const ys = pos.map(p => p.y);
    const zone = {
      left: -spread - ZONE_PAD,
      right: spread + ZONE_PAD,
      top: Math.min(...ys) - ZONE_PAD,
      bottom: -lift + Math.max(...w.sizes.map(s => s.h))
    };
    w.zone = zone;
    w.bodies = els.map((el, i) => {
      const { w: bw, h: bh } = w.sizes[i];
      const b = Bodies.rectangle(pos[i].x, pos[i].y + bh / 2, bw, bh, {
        chamfer: { radius: Math.min(bh / 2 - 1, 16) },
        restitution: 0.55,
        friction: 0,
        frictionAir: 0.08,
        inertia: Infinity
      });
      b.plugin = { phase: jitter(i) * Math.PI * 2 };
      return b;
    });
    const T = 80;
    const walls = [
      Bodies.rectangle((zone.left + zone.right) / 2, zone.top - T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle((zone.left + zone.right) / 2, zone.bottom + T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.left - T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.right + T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      })
    ];
    Composite.add(engine.world, [...w.bodies, ...walls]);
    w.live = true;
    w.last = 0;
    w.t0 = performance.now();
    setLive(true);
    const tick = now => {
      const s = world.current;
      if (!s.engine) return;
      const dt = s.last ? Math.min(32, now - s.last) : 16;
      s.last = now;
      const t = (now - s.t0) / 1000;
      const k = latest.current.drift * 0.00005 * Math.min(1, t / 2);
      s.bodies.forEach((b, i) => {
        if (s.drag && s.drag.i === i) return;
        const ph = b.plugin.phase;
        Body.applyForce(b, b.position, {
          x: Math.sin(t * 0.9 + ph) * k * b.mass,
          y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass
        });
      });
      Engine.update(s.engine, dt);
      s.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - s.sizes[i].h / 2).toFixed(1)}px`);
      });
      s.raf = requestAnimationFrame(tick);
    };
    w.raf = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, spread, lift, pos.map(p => `${p.x},${p.y}`).join('|')]);

  const set = useCallback(
    next => {
      if (!next) stopPhysics();
      if (controlled) {
        if (next !== openRef.current) latest.current.onOpenChange?.(next);
        return;
      }
      setOpenState(prev => {
        if (prev === next) return prev;
        latest.current.onOpenChange?.(next);
        return next;
      });
    },
    [stopPhysics, controlled]
  );

  useEffect(() => {
    clearTimeout(liveTimer.current);
    if (!open || !physics || reduceRef.current) {
      if (!open) stopPhysics();
      else if (!physics) stopPhysics();
      return undefined;
    }
    liveTimer.current = setTimeout(startPhysics, openDuration + (n - 1) * stagger + 80);
    return () => clearTimeout(liveTimer.current);
  }, [open, physics, openDuration, stagger, n, startPhysics, stopPhysics]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reduceRef.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(popTimer.current);
      stopPhysics();
    },
    [stopPhysics]
  );

  const pick = (item, i) => {
    latest.current.onSelect?.(item.value, i);
    clearTimeout(popTimer.current);
    setPopped(i);
    popTimer.current = setTimeout(() => setPopped(-1), 320);
    if (closeOnSelect) set(false);
  };

  const pointerAt = e => {
    const r = anchorRef.current?.getBoundingClientRect();
    return r ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: 0, y: 0 };
  };
  const down = (e, i) => {
    const w = world.current;
    if (!w.live || e.button !== 0) return;
    const b = w.bodies[i];
    if (!b) return;
    const p = pointerAt(e);
    w.drag = {
      i,
      id: e.pointerId,
      dx: b.position.x - p.x,
      dy: b.position.y - p.y,
      sx: e.clientX,
      sy: e.clientY,
      moved: false
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };
  const move = (e, i) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
      d.moved = true;
      e.currentTarget.setAttribute('data-drag', '');
    }
    if (!d.moved) return;
    const b = w.bodies[i];
    const { w: bw, h: bh } = w.sizes[i];
    const z = w.zone;
    const p = pointerAt(e);
    const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
    const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
    Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
    Body.setPosition(b, { x, y });
  };
  const up = (e, i, item) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    w.drag = null;
    e.currentTarget.removeAttribute('data-drag');
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (!d.moved && e.type === 'pointerup') pick(item, i);
  };

  const hover = trigger === 'hover';

  return (
    <div
      className={`group relative inline-block text-[13px] leading-none font-medium [padding-top:var(--ff-tab)] [font-family:inherit]${className ? ` ${className}` : ''}`}
      data-folder=""
      data-open={open ? '' : undefined}
      data-live={live ? '' : undefined}
      data-physics={physics ? '' : undefined}
      data-trigger={trigger}
      onPointerEnter={hover ? () => set(true) : undefined}
      onPointerLeave={
        hover
          ? () => {
              if (!world.current.drag) set(false);
            }
          : undefined
      }
      onKeyDown={e => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          set(false);
        }
      }}
      style={{
        width: `${width}px`,
        '--ff-w': `${width}px`,
        '--ff-h': `${height}px`,
        '--ff-r': `${radius}px`,
        '--ff-back': folderColor,
        '--ff-front': frontColor,
        '--ff-paper': paperColor,
        '--ff-item': itemColor,
        '--ff-item-ink': itemTextColor,
        '--ff-label': labelColor,
        '--ff-sub': subColor,
        '--ff-spread': `${spread}px`,
        '--ff-lift': `${lift}px`,
        '--ff-angle': `${flapAngle}deg`,
        '--ff-rest': `${restAngle}deg`,
        '--ff-open': `${openDuration}ms`,
        '--ff-close': `${Math.round(openDuration * closeRatio)}ms`,
        '--ff-fade': `${fade}ms`,
        '--ff-stagger': `${stagger}ms`,
        '--ff-n': n,
        '--ff-pad': width <= 140 ? '10px' : width <= 160 ? '12px' : '18px',
        '--ff-title-size': width <= 140 ? '16px' : width <= 160 ? '18px' : 'clamp(20px, 1.7vw, 25px)',
        '--ff-sub-size': width <= 140 ? '11px' : width <= 160 ? '11.5px' : '12.5px',
        '--ff-tab': '14px',
        '--ff-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        '--ff-spring': `cubic-bezier(0.34, ${(1 + bounce * 1.9).toFixed(2)}, 0.64, 1)`
      }}
    >
      <style>{STYLE}</style>
      <div className="relative [width:var(--ff-w)] [height:var(--ff-h)]">
      <div
        ref={anchorRef}
        className="absolute top-0 left-1/2 z-[1] h-0 w-0 group-data-[open]:z-[4] group-data-[open]:before:absolute group-data-[open]:before:top-[calc(-1*(var(--ff-lift)+120px))] group-data-[open]:before:left-[calc(-1*(var(--ff-spread)+100px))] group-data-[open]:before:h-[calc(var(--ff-lift)+120px)] group-data-[open]:before:w-[calc(2*var(--ff-spread)+200px)] group-data-[open]:before:content-['']"
      >
        {list.map((item, i) => {
          const p = pos[i];
          return (
            <button
              key={`${item.value}-${i}`}
              ref={el => {
                pillRefs.current[i] = el;
              }}
              type="button"
              className="pointer-events-none absolute top-0 left-1/2 m-0 h-[34px] cursor-pointer rounded-[17px] border-0 px-3.5 whitespace-nowrap opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.14)] outline-none [background:var(--ff-item)] [color:var(--ff-item-ink)] [font:inherit] [transform:translate(-50%,44px)_scale(0.6)] [transform-origin:50%_50%] [-webkit-tap-highlight-color:transparent] [transition:transform_var(--ff-close)_var(--ff-ease-out)_calc((var(--ff-n)-1-var(--i))*var(--ff-stagger)*0.5),opacity_var(--ff-fade)_ease_calc((var(--ff-n)-1-var(--i))*var(--ff-stagger)*0.5+var(--ff-close)*0.45),scale_160ms_var(--ff-ease-out)] group-data-[open]:pointer-events-auto group-data-[open]:opacity-100 group-data-[open]:[transform:translate(calc(-50%+var(--x)),var(--y))_rotate(var(--r))_scale(1)] group-data-[open]:[transition:transform_var(--ff-open)_var(--ff-spring)_calc(var(--i)*var(--ff-stagger)),opacity_var(--ff-fade)_ease_calc(var(--i)*var(--ff-stagger)),scale_160ms_var(--ff-ease-out)] group-data-[live]:cursor-grab group-data-[live]:touch-none group-data-[live]:[transition:scale_160ms_var(--ff-ease-out)] data-[drag]:cursor-grabbing! group-data-[open]:hover:[scale:1.05] group-data-[open]:active:[scale:0.97] data-[pop]:[animation:folder-float-pop_320ms_var(--ff-ease-out)] motion-reduce:[transition:opacity_200ms_ease] motion-reduce:group-data-[open]:[transition:opacity_200ms_ease_calc(var(--i)*var(--ff-stagger))]"
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              data-pop={popped === i ? '' : undefined}
              style={{
                '--i': i,
                '--x': `${p.x.toFixed(1)}px`,
                '--y': `${p.y.toFixed(1)}px`,
                '--r': `${p.r.toFixed(2)}deg`
              }}
              onPointerDown={e => down(e, i)}
              onPointerMove={e => move(e, i)}
              onPointerUp={e => up(e, i, item)}
              onPointerCancel={e => up(e, i, item)}
              onClick={e => {
                if (!world.current.live || e.detail === 0) pick(item, i);
              }}
            >
              <span className="block [animation:folder-float-drift_3.2s_ease-in-out_infinite] [animation-delay:calc(var(--i)*-0.7s)] [animation-play-state:paused] group-data-[open]:[animation-play-state:running] group-data-[physics]:[animation:none] group-data-[live]:[animation:none] motion-reduce:[animation:none]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
        {badge ? (
          /* a badge instead of a folder: BEHIND the pills (z-0 under their z-1). A folder's flap can cover the
             bottom of a pill and still look right; a solid tile that scales up on hover just buries them. */
          <span className="absolute inset-0 z-0" aria-hidden="true">
            {badge}
          </span>
        ) : (
          <>
        <span
          className="absolute inset-0 z-0 [border-radius:var(--ff-r)] [background:var(--ff-back)] [transform:perspective(600px)_rotateX(8deg)] [transform-origin:50%_100%] before:absolute before:top-[calc(-1*var(--ff-tab))] before:left-0 before:h-[calc(var(--ff-tab)+var(--ff-r))] before:w-[42%] before:[border-radius:var(--ff-r)_var(--ff-r)_0_0] before:[background:inherit] before:content-['']"
          aria-hidden="true"
        />
        {/* The contents. Three sheets, fanned, and visible even when the folder
            is SHUT — a closed folder with nothing showing reads as a coloured
            box, so there has to be something sticking out of it to look full.
            On open they straighten and rise out of the flap. */}
        <span
          className="absolute top-[16%] right-[14%] left-[14%] z-[1] h-1/2 rounded-md opacity-70 [background:color-mix(in_srgb,var(--ff-paper)_62%,transparent)] [transform:translateY(8px)_rotate(-4.5deg)] [transition:transform_var(--ff-close)_var(--ff-ease-out),opacity_var(--ff-close)_ease] group-data-[open]:opacity-100 group-data-[open]:[transform:translateY(-10px)_rotate(-7deg)] group-data-[open]:[transition:transform_var(--ff-open)_var(--ff-ease-out),opacity_200ms_ease] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
          aria-hidden="true"
        />
        <span
          className="absolute top-[13%] right-[11%] left-[11%] z-[1] h-1/2 rounded-md opacity-80 [background:color-mix(in_srgb,var(--ff-paper)_80%,transparent)] [transform:translateY(6px)_rotate(3deg)] [transition:transform_var(--ff-close)_var(--ff-ease-out),opacity_var(--ff-close)_ease] group-data-[open]:opacity-100 group-data-[open]:[transform:translateY(-6px)_rotate(5deg)] group-data-[open]:[transition:transform_var(--ff-open)_var(--ff-ease-out),opacity_200ms_ease] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
          aria-hidden="true"
        />
        <span
          className="absolute top-[9%] right-[8%] left-[8%] z-[1] h-1/2 rounded-md opacity-100 [background:linear-gradient(var(--ff-paper),var(--ff-paper)),repeating-linear-gradient(180deg,transparent_0_7px,color-mix(in_srgb,var(--ff-front)_22%,transparent)_7px_8px)] [background-blend-mode:multiply] [transform:translateY(4px)] [animation:ff-peek_4.2s_ease-in-out_infinite] group-data-[open]:[animation:none] [transition:transform_var(--ff-close)_var(--ff-ease-out),opacity_var(--ff-close)_ease] group-data-[open]:[transform:translateY(-14px)] group-data-[open]:[transition:transform_var(--ff-open)_var(--ff-ease-out),opacity_200ms_ease] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
          aria-hidden="true"
        />
        <span
          className="absolute right-0 bottom-0 left-0 z-[2] box-border flex h-[76%] flex-col justify-between px-[var(--ff-pad)] pt-3 pb-[14px] [border-radius:var(--ff-r)] [background:linear-gradient(176deg,color-mix(in_srgb,var(--ff-front)_86%,var(--ff-sub))_0%,var(--ff-front)_38%,color-mix(in_srgb,var(--ff-front)_80%,var(--ff-back))_100%)] [color:var(--ff-label)] shadow-[0_-10px_24px_rgba(0,0,0,0.28)] [transform:perspective(600px)_rotateX(calc(-1*var(--ff-rest)))] [transform-origin:50%_100%] [transition:transform_var(--ff-open)_var(--ff-ease-out)] group-data-[open]:[transform:perspective(600px)_rotateX(calc(-1*var(--ff-angle)))] motion-reduce:group-data-[open]:[transform:perspective(600px)_rotateX(calc(-1*var(--ff-rest)))] motion-reduce:[transition:opacity_200ms_ease]"
          aria-hidden="true"
        >
          <span className="flex items-start justify-between">
            {icon}
            <span className="font-mono text-[12px] leading-none [color:var(--ff-sub)]">{index}</span>
          </span>
          <span className="flex flex-col gap-[7px]">
            <span className="font-display text-[length:var(--ff-title-size)] leading-[1.05] font-semibold tracking-[-.015em]">{label}</span>
            {/* leading-none made a two-line sublabel collide with itself. */}
            <span className="text-[length:var(--ff-sub-size)] leading-[1.35] [color:var(--ff-sub)]">{sub}</span>
          </span>
        </span>
          </>
        )}
        <button
          type="button"
          className={`absolute right-0 bottom-0 left-0 z-[3] m-0 ${badge ? "h-full" : "h-[76%]"} cursor-pointer border-0 bg-transparent p-0 outline-none [border-radius:var(--ff-r)] [-webkit-tap-highlight-color:transparent] focus-visible:[outline:2px_solid_var(--ff-sub)] focus-visible:[outline-offset:3px]`}
          aria-expanded={open}
          aria-label={`${label}, ${sub}`}
          onClick={() => set(!open)}
        />
      </div>
    </div>
  );
}