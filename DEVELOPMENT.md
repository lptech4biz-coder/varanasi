# Development Guide

## Prerequisites

- Node.js 18+ and npm

## Setup

```bash
npm install
npm run dev
```

The dev server prints a local URL (typically `http://localhost:5173`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-checks (`tsc -b`) then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` locally, close to production behavior |
| `npm run test` | Runs the full Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with a coverage report |
| `npm run lint` | ESLint across the whole project, zero warnings allowed |
| `npm run format` | Prettier, writes formatting fixes in place |

## Environment variables

None. The app has no backend and makes no runtime API calls -- all data is bundled at
build time from `src/data/villages/*.json`.

## Adding or correcting a village/rate record

1. Edit `src/data/villages/villages.json` or `segments.json` directly (they're plain
   JSON, not generated).
2. `src/data/villages/index.ts` logs a `console.warn` in dev mode if the record count
   drifts from the expected 442/255 -- if you're intentionally adding or removing a
   record, update `EXPECTED_VILLAGE_COUNT` / `EXPECTED_SEGMENT_COUNT` in that file too.
3. Run `npm test` -- the regression suite calculates against a real village (`अहरक`) by
   name, so if you renamed or removed that specific village, update the test fixtures in
   `valuationService.test.ts` and `breakdownPresenter.test.ts` accordingly.

## Adding a new translation key

1. Add the key (with Hindi text) to `src/i18n/hi.ts`.
2. Add the same key (with English text) to `src/i18n/en.ts`.
3. Run `npm run build` or `npx tsc -b --noEmit` -- if the key is missing from `en.ts`,
   `satisfies TranslationDict` will fail the build with a clear "missing property" error
   pointing at the exact key.
4. Use it in a component via `t('section.keyName')`, or with interpolation via
   `t('section.keyName', { placeholder: someValue })` if the string contains `{placeholder}`.

## Adding a new form field or property type

Business logic and UI are intentionally decoupled -- when adding something new:

1. Add any new input fields to `ValuationInput` in `features/valuation/types/index.ts`.
2. Add the calculation logic as a new (or extended) branch in
   `features/valuation/services/valuationService.ts`, returning a new or extended
   `CalculationSection` variant.
3. Add a regression test in `valuationService.test.ts` with a hand-checked expected total
   *before* wiring up any UI -- this is the fastest way to catch a calculation mistake.
4. Add the corresponding translated labels to `hi.ts`/`en.ts`.
5. Add the presentation mapping in `breakdownPresenter.ts`.
6. Build or extend the form component in `features/valuation/components/`.
7. Wire the new state into `useValuationForm.ts` and render the component from `App.tsx`.

## Code style

- TypeScript strict mode is on; avoid `any` (ESLint will flag it as an error, not just a
  warning).
- Each common UI component owns its own `.module.css` file -- don't add component-specific
  styles to `styles/global.css`, which is reserved for resets and truly global rules.
- Calculation code (`services/`, `utils/` under `features/valuation/`) must not import
  React or touch the DOM -- if you find yourself needing `document` or a hook inside one
  of those files, the logic belongs in a component or hook instead.
