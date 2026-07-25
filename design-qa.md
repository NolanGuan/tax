# Calculator UX Design QA

Date: 2026-07-25

## Comparison target

- Source visual truth: `/Users/nolan_lopez/.codex/visualizations/2026/07/24/019f9386-107a-7931-929d-3adb23bfbe9e/gaintax-calculator-ux-audit/02-purchase-date-picker.png`
- Primary implementation screenshot: `/Users/nolan_lopez/.codex/visualizations/2026/07/25/gaintax-calculator-p0-qa/03-local-desktop-dates.jpg`
- Final result screenshot: `/Users/nolan_lopez/.codex/visualizations/2026/07/25/gaintax-calculator-p0-qa/09-final-desktop-result.jpg`
- Final privacy notice screenshot: `/Users/nolan_lopez/.codex/visualizations/2026/07/25/gaintax-calculator-p0-qa/08-local-desktop-final-banner.jpg`
- Final mobile screenshot: `/Users/nolan_lopez/.codex/visualizations/2026/07/25/gaintax-calculator-p0-qa/10-final-mobile-dates.jpg`
- Full-view comparison: `/Users/nolan_lopez/.codex/visualizations/2026/07/25/gaintax-calculator-p0-qa/06-source-implementation-comparison.jpg`
- Focused date-field comparison: `/Users/nolan_lopez/.codex/visualizations/2026/07/25/gaintax-calculator-p0-qa/07-date-field-focused-comparison.jpg`

The desktop source and implementation captures are both 1280 × 720 pixels at a 1280 × 720 CSS viewport and device pixel ratio 1. The mobile capture is 390 × 844 pixels at a 390 × 844 CSS viewport and device pixel ratio 1. No density normalization was required.

The source shows the original empty form with browser-localized native date controls. The implementation comparison uses completed date fields so the deterministic English labels and holding-period feedback are visible. This state difference is intentional and does not affect the comparison of typography, tokens, control styling, or layout.

## Full-view comparison evidence

The implementation preserves the existing system font, grayscale page shell, blue action color, white calculator surface, rounded corners, borders, and subtle shadows. The form is intentionally taller because transaction and tax-profile fields are now grouped and the dates are split into labeled Month, Day, and Year controls. This added height improves comprehension and removes browser-locale ambiguity without changing the site’s established visual language.

## Focused comparison evidence

The focused comparison shows the original Chinese-localized date placeholder beside the replacement English segmented fields. Purchase and sale dates now use consistent labels, spacing, border treatment, focus styling, helper text, required indicators, and deterministic numeric values. The long-term eligibility message uses the existing blue informational surface and does not introduce a conflicting component style.

## Required fidelity surfaces

- Fonts and typography: passed. The existing system font stack, weights, sizes, line heights, and heading hierarchy are preserved. Labels and helper text remain readable at desktop and mobile widths.
- Spacing and layout rhythm: passed. Desktop two-column relationships remain intact; mobile collapses to one column without horizontal overflow. Grouping, padding, radii, borders, and shadows match existing site patterns.
- Colors and visual tokens: passed. Existing blue, gray, red error, and white surface tokens are reused with sufficient visible distinction for focus, information, disabled, and error states.
- Image quality and asset fidelity: passed. The calculator flow contains no product imagery or decorative image assets. Existing brand assets were not changed or replaced.
- Copy and content: passed. All visible calculator labels, helpers, errors, results, and status messages are English. The result hierarchy now leads with total tax, after-tax gain, effective rate, and holding period.
- Icons: passed. No new custom SVG, CSS-drawn, or placeholder icon assets were introduced.
- States and interactions: passed. Empty, disabled, valid, invalid, result, reset, expanded details, copy status, and comparison-link states were exercised.
- Accessibility and responsiveness: passed for the tested scope. Fieldsets, legends, explicit labels, `aria-describedby`, `aria-invalid`, live regions, result focus, practical tap targets, and keyboard-oriented inputs are present. Desktop and 390 px layouts have no horizontal overflow.

## Comparison history

### Iteration 1

- [P0] Browser-localized native date controls displayed Chinese text and could emit localized browser validation.
  - Fix: replaced every native date input with the shared `EnglishDateField`, added strict parsing and English validation, and kept ISO values for calculator logic.
  - Post-fix evidence: focused comparison and all four calculator-route checks show zero native date inputs and no Han text.
- [P1] The quick calculator silently defaulted to California and did not explain disabled submission requirements.
  - Fix: made state selection explicit and added a visible completion message.
  - Post-fix evidence: the empty form shows “Select a state” and the calculation remains disabled until required inputs are complete.
- [P1] The result hierarchy required users to interpret a flat list of values.
  - Fix: added primary result cards, tax breakdown, holding-period explanation, assumptions, sale-timing comparison, and copy action.
  - Post-fix evidence: the final desktop result screenshot shows the full revised hierarchy.
- [P2] The first privacy-notice implementation placed the third action on a second row at desktop width.
  - Fix: widened the notice container and kept desktop actions on one row.
  - Post-fix evidence: the final privacy notice screenshot shows all three actions aligned without covering page content.

### Final pass

No actionable P0, P1, or P2 differences remain. The segmented date control intentionally uses more vertical space than the native control; this is an accepted product trade-off for deterministic English rendering, clear labeling, and accessible manual entry.

## Browser verification

- Tested local production build at 1280 × 720 and 390 × 844.
- Completed a representative calculation: $10,000 purchase, $25,000 sale, February 28, 2025 purchase, March 1, 2026 sale, $60,000 taxable income, California.
- Verified $4,245 total tax, $10,755 after-tax gain, 28.3% effective rate, long-term classification, and 366-day holding period.
- Verified result focus after calculation and an English inline error for an impossible date.
- Verified capital gains, scenario planner, real estate, and crypto routes have no native date inputs, no Han text, and no horizontal overflow at 390 px.
- Browser console warnings and errors: none.

final result: passed
