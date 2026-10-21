# Towker Ahmmed Joy — portfolio

React 18 + Vite, with Tailwind CSS and section-specific styles colocated with
the React components. Shared profile/navigation data lives in `src/content.js`.
See [STRUCTURE.md](./STRUCTURE.md) for the complete verified repository tree,
file roles, and import relationships.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the build
```

Deploy `dist/` to any static host. `base: "./"` in `vite.config.js` means the
build also works from a subfolder.

## Animation architecture

Animation is kept out of React's per-frame rendering path where practical.
Canvas, WebGL, physics, requestAnimationFrame loops, CSS custom properties,
and Motion values drive continuous effects; React manages the rendered
elements and discrete UI state. Lenis runs once at the app root for smooth
scrolling and is disabled when reduced motion is preferred.

The main animation integrations are Motion (`motion/react`), Matter.js for
the Hero folder, Three.js for the About lanyard, and Lenis for page scrolling.
Section styles are injected by the shared `injectCss` helper where used;
global tokens and base styling are in `src/index.css`.

## Editing content

- Shared name, contact details, profile links, resume path, and navigation:
  `src/content.js`.
- Section-specific copy and project/service data: at the top of the
  corresponding file in `src/sections/`.
- Global theme tokens and base styles: `src/index.css`.
- Shared UI and utilities: `src/shared.jsx`.
- Page order, application mounting, and smooth-scroll setup: `src/main.jsx`.
- Static images and other site-root assets: `public/`.

## Notes carried over from the static build

- The wordmark is measured and scaled at runtime; a fixed `clamp()` is only
  ever right for one string length.
- Its reveal watches the footer, not itself — the resting `clip-path` would
  otherwise stop it ever reporting as intersecting.
- `overflow-x: clip` sits on both `html` and `body`; on body alone the root
  still scrolls sideways.
- On phones the capsule drops `backdrop-filter`, because a filtered element
  becomes the containing block for any fixed descendant and would trap the
  menu panel inside the bar.
