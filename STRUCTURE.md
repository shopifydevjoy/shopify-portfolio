# Project structure

This tree lists the repository's project files and excludes Git's internal
`.git/` metadata. `node_modules/` and `dist/` currently exist locally, but
they are generated/ignored and are not tracked source files.

## Repository tree

```text
.
├── .gitignore
├── README.md
├── STRUCTURE.md
├── index.html
├── package.json
├── package-lock.json
├── robots.txt
├── vite.config.js
├── public/
│   ├── card-back.png
│   ├── card-front.png
│   ├── favicon.svg
│   ├── Luxury-E-Commerce-Showcase.png
│   ├── MIRΛI.png
│   ├── Prestige_Theme_Design_Showcase.png
│   ├── resume.pdf
│   ├── shopify-os-theme-preview.svg
│   ├── shopify-performance-preview.svg
│   ├── site.webmanifest
│   ├── The_Honeypot_Coffee_Shop_Showcase.png
│   ├── woocommerce-store-preview.svg
│   ├── wordpress-business-preview.svg
│   ├── wordpress-plugin-preview.svg
│   └── wordpress-portfolio-preview.svg
└── src/
    ├── content.js
    ├── index.css
    ├── main.jsx
    ├── shared.jsx
    ├── sections/
    │   ├── About.jsx
    │   ├── Contact.jsx
    │   ├── Experience.jsx
    │   ├── Footer.jsx
    │   ├── Header.jsx
    │   ├── Hero.jsx
    │   ├── Services.jsx
    │   └── Work.jsx
    └── vendor/
        ├── FolderFloat.jsx
        └── Lanyard.jsx
```

## Important files and import relationships

- `index.html` is Vite's HTML entry. It provides the `#root` mount element,
  loads `/src/main.jsx`, sets page metadata, and links the favicon and web
  manifest.
- `src/main.jsx` imports `index.css`, initializes React, configures Lenis
  smooth scrolling, and composes the page in this order: Header, Hero, About,
  Services, Work, Experience, Contact, Footer.
- `src/content.js` exports the shared `profile` and `nav` data. Header and
  Footer use both; Hero uses `profile`; Contact uses `profile`. Copy specific
  to a section, such as project or service cards, is kept in that section's
  file.
- `src/shared.jsx` exports shared UI and utilities: `Icon`, `Monogram`,
  `Reveal`, `RevealItem`, `Accent`, `SplitHeading`, `useMediaQuery`, and
  `injectCss`. Sections import the pieces they use from here.
- `src/index.css` imports Tailwind CSS and defines global styles, theme and
  design tokens, and shared base styles. It is imported once by `main.jsx`
  before the section components render.
- `src/sections/` contains the page sections. Each file owns its markup and
  section-specific content and styles; styles are injected at runtime with
  the shared `injectCss` helper where used.
  - `Header.jsx` — navigation, theme control, scroll progress, and mobile
    menu; reads `nav` and `profile`.
  - `Hero.jsx` — hero content and animated folder interaction; reads
    `profile` and uses `vendor/FolderFloat.jsx`.
  - `About.jsx` — about content and motion effects; uses `vendor/Lanyard.jsx`.
  - `Services.jsx` — service cards and their interactive fan.
  - `Work.jsx` — Shopify and WordPress project cards.
  - `Experience.jsx` — experience timeline.
  - `Contact.jsx` — contact section and its visual effects; reads `profile`.
  - `Footer.jsx` — footer, shared profile/navigation links, and footer
    interactions.
- `src/vendor/FolderFloat.jsx` uses Matter.js for the interactive physics
  folder used by Hero. `src/vendor/Lanyard.jsx` uses Three.js for the 3D
  lanyard used by About.
- `public/` contains static files served from the site root. Project-card
  images are referenced by `Work.jsx`; `card-front.png` and `card-back.png`
  are used by About; `resume.pdf` is referenced by the shared profile data.
  `favicon.svg` and `site.webmanifest` are linked by `index.html`.
- `vite.config.js` configures the React and Tailwind Vite plugins, relative
  build paths, and `dist/` as the build output directory.
- `package.json` and `package-lock.json` define and lock the dependencies and
  npm scripts. `robots.txt` is a static crawler policy file.

## Animation and styling architecture

- React renders the page and manages discrete UI state. Continuous animation
  is generally driven by browser animation frames, canvas/Three.js/Matter.js,
  CSS custom properties, or Motion values rather than updating React state
  on every frame.
- Lenis is initialized once in `main.jsx` for smooth page scrolling and
  intercepted in-page anchor navigation. It is skipped when the user prefers
  reduced motion.
- Motion-based transitions and reduced-motion handling use `motion/react`.
  The Hero folder uses Matter.js; the About lanyard uses Three.js.
- Global tokens and base styles belong in `index.css`. Section-specific
  styles are colocated in section files and passed to `injectCss` where
  applicable.

## Setup and scripts

```bash
npm install
npm run dev        # start the Vite development server
npm run build      # build the site into dist/
npm run preview    # serve the production build locally
```

Deploy the generated `dist/` directory to a static host. `base: "./"` in
`vite.config.js` allows the build to work from a subfolder.

## Editing guide

| To change | Edit |
|---|---|
| Name, contact details, profile links, resume path, shared navigation | `src/content.js` |
| Global colors, theme tokens, base styles | `src/index.css` |
| Hero, services, projects, about, experience, or contact section content | The corresponding file in `src/sections/` |
| Shared icons, reveal components, heading helpers, media query hook, or CSS injection | `src/shared.jsx` |
| Page order, app mounting, or Lenis setup | `src/main.jsx` |
| Static images, favicon, manifest, or resume | `public/` |
| Vite plugins and build settings | `vite.config.js` |

## Asset references to review

The files above list assets that actually exist in the repository. Two current
references point to files that are not present in `public/`: About passes
`/band.svg` to the Lanyard component, and `site.webmanifest` declares three
icons under `/assets/img/`. These are noted here rather than listed as
existing files.
