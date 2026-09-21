# Architecture

## Folder structure

```text
src/
├── app/                      Application shell
│   ├── App.tsx                Top-level component: orchestrates the multi-step form
│   ├── App.module.css
│   ├── App.test.tsx            End-to-end component tests (real user interactions)
│   └── HtmlLangSync.tsx        Keeps <html lang> in sync with the language context
│
├── components/
│   ├── common/                Generic, feature-agnostic UI primitives
│   │   (Button, Card, Checkline, ErrorBoundary, FormField, Note, Select,
│   │    TextInput, ToggleGroup -- each with a co-located .module.css)
│   └── layout/                 App-shell chrome (AppHeader, AppFooter, LanguageSwitcher)
│
├── features/valuation/         Everything specific to the valuation domain
│   ├── types/index.ts           All domain types (Village, ValuationInput,
│   │                             CalculationSection, etc.) -- the single source of
│   │                             truth for the shape of the domain
│   ├── services/
│   │   └── valuationService.ts  Pure calculation engine (see "Calculation architecture")
│   ├── hooks/
│   │   ├── useValuationForm.ts  Owns all form state, validation, and triggers calculation
│   │   └── useVillageSearch.ts  Search/filter/keyboard-nav state for the village combobox
│   ├── utils/
│   │   ├── numberToWords.ts     Hindi + English amount-in-words (Indian numbering)
│   │   ├── unitConversion.ts    Agricultural area-unit conversions
│   │   ├── validation.ts        Which fields are required, given the current step
│   │   └── breakdownPresenter.ts  Translates a calculation result into display rows
│   └── components/               One component per form section (VillageSearch,
│                                  SegmentPicker, PropertyTypeSelector, BoundaryConditions,
│                                  ResidentialDetails, CommercialDetails,
│                                  IndustrialDetails, AgriculturalDetails,
│                                  ConstructionDetails, TreeValuation, OtherAssets,
│                                  AdvancedOptions, ValuationResultView)
│
├── data/
│   ├── villages/                villages.json + segments.json (extracted from the
│   │                             original index.html's embedded APP_DATA) plus a typed
│   │                             loader (index.ts) with record-count integrity guards
│   └── rates/                    Numeric constants that aren't per-village: construction
│                                  rates, tree/asset rates, and the 2019-sourced bonus
│                                  percentages -- each constant documents which rule it
│                                  came from
│
├── i18n/
│   ├── hi.ts / en.ts             Translation dictionaries. `en.ts` uses
│   │                             `satisfies TranslationDict` so a missing or extra key
│   │                             is a compile-time error, not a runtime surprise.
│   └── index.tsx                 React context + `useLanguage()` hook + the `t()`
│                                  translate function (with `{placeholder}` interpolation)
│
├── services/storageService.ts    Thin localStorage wrapper (fails silently if unavailable)
├── utils/format.ts                Generic currency/number formatting (language-independent)
└── main.tsx                       Entry point: providers + error boundary
```

## Calculation architecture

The calculation engine (`valuationService.ts`) is deliberately kept **pure and
presentation-free**:

```text
ValuationInput  ->  calculateValuation()  ->  ValuationResult { sections, total }
```

- `ValuationInput` is a fully-resolved snapshot of everything the form knows (which
  village, which property type, all the area/bonus/construction/tree/asset fields).
- `CalculationSection` (a discriminated union, one variant per property type plus
  construction/trees/assets) carries **only structured data** -- numbers, enum-like
  string literals, and a reference to the `Village`/`SegmentRate` involved. It never
  contains a display string.
- A separate function, `presentValuation()` in `breakdownPresenter.ts`, is the *only*
  place that turns a `CalculationSection` into translated `{label, value}` rows, using
  the `t()` function passed in from whichever language is currently active.

This separation means:
1. The calculation logic has zero dependency on React or the i18n context, so it can be
   unit-tested in complete isolation (see `valuationService.test.ts`).
2. The exact same `CalculationSection[]` produces correct output in either language --
   there's no risk of the *math* accidentally depending on which language happens to be
   selected, because the language never enters the calculation at all.

## State architecture

`useValuationForm` is the single hook that owns all form state (village, segment,
property type, and every property-type-specific sub-state) plus validation errors and
the last calculation result. `App.tsx` is a thin consumer: it reads `form.state` to
decide which section components to render, and passes each section's own slice of state
and setters down as props. No calculation or validation logic lives in `App.tsx` or in
any of the section components themselves.

Language state is a separate, app-wide React Context (`i18n/index.tsx`) rather than part
of the valuation form, since it's a cross-cutting UI preference, not domain data. It's
persisted to `localStorage` via `storageService`.

## PWA architecture

`vite-plugin-pwa` replaces the original hand-written `sw.js`. Because the entire app
(including all 442 villages' rate data) is bundled at build time and the calculator
never makes a runtime network request, a simple "precache everything, serve from cache"
strategy (Workbox's `generateSW` mode) is sufficient and far more robust than a
hand-maintained cache-list, which is what the original `sw.js` had to do manually.

## Why not Redux / a routing library for this app

The app is a single continuous form/result flow with no distinct pages, so React Router
was not introduced (adding it would mean inventing routes that don't correspond to any
real navigation need). Similarly, all state is either (a) local to one hook
(`useValuationForm`) or (b) a small, infrequently-changing app-wide preference
(language) -- neither justifies a global state-management library.
