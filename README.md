# पिण्डरा मूल्यांकन कैलकुलेटर — Pindra Valuation Calculator (React)

A production React/TypeScript rewrite of the Pindra tehsil (Varanasi district) property
valuation calculator, originally built as a single-file vanilla-JS PWA. This version
preserves 100% of the original's business logic and data while giving it a proper
component architecture, type safety, automated tests, and a maintainable i18n system.

## Features

- **442 villages / 255 road-segment overrides** from the office's 2026 Part-2 rate list,
  fully typed and separated from UI code
- **Four property types** — residential (plot / flat-apartment / partial floor-roof
  transfer), commercial (single shop / other), industrial, agricultural
- **Village search** in Hindi *or* Hinglish/English ("अहरक" or "aharak" both work), with
  full keyboard navigation (up/down/Enter/Esc) and ARIA combobox semantics
- **Segment-road overrides** — a village fronting one of 34 named roads gets that road's
  rate instead of its general village rate
- **Boundary, agricultural, and construction bonuses** carried forward from the 2019
  general instructions document (multi-road/park +10-15%, segment/ring-road agri +25%,
  aabadi-proximity +15%, industrial = 60% of residential, floor-share fractions, tree and
  borewell/well valuation) -- every provision sourced this way is visibly labeled in the UI
- **Hindi <-> English toggle** covering every label, option, error message, and the
  calculation breakdown itself (including a proper Indian-numbering amount-in-words
  converter in both languages), persisted across visits
- **Installable PWA** with offline support (via `vite-plugin-pwa`)
- **Inline, accessible validation** -- the "Calculate" button never silently does nothing;
  it scrolls to and focuses the first missing required field with a translated message

## Installation

```bash
npm install
```

## Development

```bash
npm run dev        # start the Vite dev server
npm run test       # run the unit + component test suite once
npm run test:watch
npm run lint        # ESLint, zero warnings required
npm run format      # Prettier, writes changes
```

## Production build

```bash
npm run build       # type-checks, then builds to dist/
npm run preview     # serve the production build locally
```

## PWA behavior

The app is installable ("Add to Home Screen" / desktop install prompt) and works fully
offline after the first load -- `vite-plugin-pwa` precaches the app shell and all bundled
data at build time, since the calculator never makes a runtime network request (every
village/rate/segment record is bundled, not fetched).

## What this migration deliberately preserves vs. changes

**Preserved exactly (functional parity is the whole point):**
- Every rate, village, and segment record (see `src/data/villages/`)
- Every calculation rule and its numeric result (see the regression tests in
  `src/features/valuation/services/valuationService.test.ts`, which pin the exact totals
  verified against the original vanilla-JS app)
- The Hindi/English bilingual behavior and the "2019 Rule" provenance labeling

**Changed (architecture and UX, not business logic):**
- Monolithic `index.html` -> typed React components, hooks, and services
- Ad-hoc DOM string-building -> a proper `t()`-based i18n system with compile-time key
  parity between `hi.ts` and `en.ts`
- Silent-disabled submit button -> inline, focus-managed validation errors
- One long form -> the least-used sections (construction/trees/other assets) collapsed
  by default behind a single disclosure

See `ARCHITECTURE.md` for how the codebase is organized, `DEVELOPMENT.md` for day-to-day
workflow, and `TESTING.md` for what is and isn't covered by the test suite.

## Known data caveats (carried over from the source)

- English/Hinglish village names come from the office's official LGD village-code file
  where they matched (308/442); the rest are auto-transliterated and may not match the
  exact official spelling.
- ~11% of segment-table village names have a slightly different spelling than the main
  village list within the *source spreadsheet itself* -- this doesn't affect correctness
  (segments are matched by exact name against their own row), it just means a few
  segments' English label comes from transliteration rather than the LGD cross-check.
- Every provision tagged "2019 नियम / 2019 Rule" in the UI comes from the 2019 general
  instructions document, not the 2026 rate list, and has not been explicitly reconfirmed
  by the source office for 2026.
