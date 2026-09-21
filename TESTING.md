# Testing

## Running the suite

```bash
npm run test           # all tests, once
npm run test:watch     # watch mode while developing
npm run test:coverage  # with a coverage report
```

Stack: **Vitest** (test runner, jsdom environment) + **React Testing Library** +
**@testing-library/user-event** for realistic interaction simulation.

## What's covered (32 tests, all passing)

### Unit tests -- pure calculation logic
`features/valuation/services/valuationService.test.ts`

- **Three pinned regression totals**, hand-verified against the original vanilla-JS
  app before this migration began:
  - Plot + multi-road boundary bonus = ₹21,45,000
  - Agricultural land with stacked segment + ring-road bonuses = ₹1,56,25,000
  - Combined plot + construction + trees + assets = ₹27,95,000
- Boundary-bonus resolution (none / multi-road / park / both -- confirms "both" is a
  flat +15%, not +10%+10%)
- Flat/apartment valuation with auto-estimated super area
- Partial floor/roof transfer fraction math
- Industrial rate = 60% of residential
- Segment-rate override taking priority over the village's own rate
- The aabadi-proximity bonus correctly *not* applying to "general agricultural land"
- Construction add-on correctly *not* applying to agricultural land

### Unit tests -- number-to-words
`features/valuation/utils/numberToWords.test.ts`

- Includes a named regression test for a real bug caught during the original
  vanilla-JS build: Hindi has a unique word for every number 1-99 (e.g. 34 is
  "चौंतीस"), not a tens+ones composition like English. This test exists specifically
  so that bug can never silently return.
- English Indian-numbering (Lakh/Crore, not Million/Billion) is verified separately.

### Unit tests -- i18n integrity
`i18n/i18n.test.ts`

- Confirms `hi.ts` and `en.ts` have exactly the same set of translation keys (this is
  also enforced at compile time via `satisfies TranslationDict`, but the test keeps the
  guarantee visible in CI output).
- Confirms no translation value is an empty string.

### Unit tests -- presentation layer
`features/valuation/utils/breakdownPresenter.test.ts`

- Confirms the *same* `CalculationSection[]` produces the *same total* regardless of
  which language's `t()` function is used to present it -- i.e. language can never
  affect the math.
- Confirms no untranslated key (a raw `"section.key"` string) ever leaks into a
  rendered label or value.

### Component / end-to-end tests
`app/App.test.tsx` -- these render the real `<App />` and drive it exactly as a user
would (typing, clicking, keyboard), not by calling internal functions directly:

1. **Full happy path**: type "aharak" in Hinglish -> select from the real dropdown ->
   change road width -> enter area -> click Calculate -> assert the exact rendered total.
2. **Validation path**: select a village, leave area empty, click Calculate -> assert an
   `alert`-role error appears with the correct *translated* message, and no result renders.
3. **Language toggle**: switch to English, repeat the same calculation, assert both the
   total and the English result labels/words render correctly.
4. **Reset**: calculate a result, click reset (confirmed via a stubbed `window.confirm`),
   assert both the village selection and the result are cleared.

Two real bugs were caught by test #2 and by the type-checker while building these tests
(not before) -- see the project's development history / commit messages for details:
- `en.ts`'s `satisfies TranslationDict` was silently requiring literal Hindi text instead
  of just matching key structure, due to an `as const` that widened too aggressively.
- Validation error messages were displaying raw translation keys (e.g.
  `"error.areaRequired"`) instead of translated text, because nothing was calling `t()`
  on them between the form hook and the display component.

## What is intentionally lighter-touch

In the interest of giving you an honest picture rather than padding the count:

- **Coverage is deep on the calculation/i18n core and the primary user flow, not
  exhaustive across every property type's UI.** Commercial, industrial, and the
  construction/tree/asset add-ons are covered by their calculation-layer unit tests
  (which exercise the real logic) but do not each have a dedicated component-level
  `App.test.tsx` scenario the way the residential plot flow does.
- **No dedicated Playwright/browser-based E2E suite.** The React Testing Library tests
  in `App.test.tsx` already drive real DOM events through a real React render tree in
  jsdom, which catches the overwhelming majority of integration bugs (and did, twice,
  during this build) -- but they run in jsdom, not an actual browser engine, so true
  cross-browser rendering issues, real CSS layout, and real accessibility-tree behavior
  are not exercised.
- **No automated visual/responsive regression testing** at the specified breakpoints
  (320/375/414/768/1024/1280px). The CSS uses relative units and a single responsive
  breakpoint (640px) for the form grids, but this has not been visually verified in an
  actual browser as part of this build.
- **No formal WCAG audit tool** (e.g. axe) was run. Accessibility was addressed
  structurally (semantic labels, `aria-required`/`aria-invalid`, `role="alert"` on
  errors, `role="combobox"`/`listbox` with keyboard nav on the village search,
  `:focus-visible` styles throughout) but not verified against a full WCAG checklist.

If you need any of the above filled in, the existing test files are a reasonable
template to extend from -- particularly `App.test.tsx` for adding scenarios covering
the commercial/industrial/agricultural flows end-to-end.
