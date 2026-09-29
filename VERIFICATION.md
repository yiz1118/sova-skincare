# Verification Record

This file records observed local checks for the SOVA concept build. It does not represent a production launch, real product validation, or real-device test.

## Commands

Run locally in the standalone SOVA folder on 2026-09-28:

| Check | Result | Evidence |
|---|---|---|
| `npm run lint` | Passed | ESLint exited 0 with no warnings after the final source changes. |
| `npm run typecheck` | Passed | TypeScript exited 0. |
| `npm test` | Passed | 3 logic tests: all 18 routine answer combinations, cart merge/quantity/subtotal, and malformed or stale stored data. |
| `npm run build` | Passed | Next.js 16 production build compiled and generated the home page, six product routes, shop, routine, ingredients, philosophy, cart, and about pages. |
| `npm run test:browser` | Passed | 14 Playwright tests against the production build. |

Browser coverage includes category filtering and price sorting with URL state, gallery controls and all six isolated secondary product images, quantity changes, persisted cart, an in-memory bag when browser storage is blocked, demo checkout, routine editing/restart/add-to-bag, unknown product handling, navigation, newsletter validation, and reduced-motion behavior. Every page was checked for horizontal overflow at 360, 390, 430, 768, 1024, and 1440 px. At 390 px, the browser suite checked mobile menu focus and Escape behavior, and ran axe checks for WCAG 2 A/AA and 2.1 A/AA rules across all eight page types. No violations were reported in that automated scan.

## Screenshot targets

The screenshots below were captured from the production build and visually inspected. The product detail image was adjusted to show the entire bottle; the routine capture was retaken from the top of the page so the offscreen keyboard skip link does not appear in the full-page capture.

| Screenshot | Dimensions |
|---|---:|
| `artifacts/screenshots/hero-desktop-1440.png` | 1440 × 900 |
| `artifacts/screenshots/products-desktop-1440.png` | 1440 × 2358 |
| `artifacts/screenshots/product-detail-desktop-1440.png` | 1440 × 2626 |
| `artifacts/screenshots/product-cutout-desktop-1440.png` | 1440 × 900 |
| `artifacts/screenshots/routine-desktop-1440.png` | 1440 × 2661 |
| `artifacts/screenshots/mobile-shop-390.png` | 390 × 2335 |
| `artifacts/screenshots/mobile-product-detail-390.png` | 390 × 844 |
| `artifacts/screenshots/mobile-routine-390.png` | 390 × 844 |

## Limits

- The brand, products, package images, and prices are fictional.
- The newsletter is a local form demonstration and stores no email.
- The bag is a local browser simulation; no order, tax, shipping, payment, or subscription service is connected.
- Ingredient references support general cosmetic roles only. No finished-product efficacy or safety testing is asserted.
- Browser checks used desktop Chrome emulation. They do not prove behavior on a physical phone or with every assistive technology.
- Parent portfolio `lint` and `typecheck` still fail in the separate Fashion and AI SaaS project folders. The parent lint task scans generated `.next` files under the Fashion project; the parent TypeScript task includes sibling-app aliases and types. The standalone SOVA checks above pass, and the parent config edits only exclude this new app as planned.

## Icon consistency follow-up — 2026-09-29

The storefront's existing Lucide React icon set now covers the remaining interface glyphs: the up-right arrow on each product benefit and the optional routine step's plus sign. All Lucide imports go through `components/icons.tsx`, which keeps each SVG decorative, unfocusable, transparent, and colored through `currentColor`. The mobile menu's labelled button has a 44 × 44 px touch area. Its icon center and the measured header layout remain unchanged.

The source audit at `artifacts/icon-consistency/source-audit.json` found no remaining Unicode symbols from the requested UI-icon list or emoji variation selectors in SOVA's source files. The only CSS `content` values are empty decorative rules. Normal punctuation, prices, and typographic dashes remain as copy, not icons.

Fresh standalone checks after the final site source change: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` all passed. The production browser suite passed 17/17 tests, including all six product pages, SVG accessibility attributes, a 44 px mobile menu target, keyboard and Escape behavior, and no horizontal overflow at 360, 375, 390, 430, 768, 1024, or 1440 px. Axe reported no WCAG 2 A/AA or 2.1 A/AA violations in the automated mobile scan of the eight page types.

The extra visual and interaction audit in `artifacts/icon-consistency/` covered 63 page-and-width combinations each in Windows Chrome, Windows Edge, and Android-emulated Chromium. All three reported zero visible Unicode UI icons and zero horizontal overflow. Chrome's before/after comparison found zero geometry changes; screenshot differences outside icon regions were limited to image decoding and rasterization, with no substantive non-icon pixel differences. Hover, gallery arrows, accordion, menu touch, cart, routine, and reduced-motion checks passed in the relevant browser runs. The saved screenshots include homepage, shop, product detail, routine, filled cart, and open mobile menu views.

Safari and physical iPhone testing remain unverified. Playwright WebKit could not be installed because its download endpoints timed out, including a retry with a longer connection timeout. Android coverage used device emulation in Chromium, not a physical Android phone. These limits do not affect the source-level finding that the UI controls are SVGs rather than platform-rendered emoji glyphs.

## Creator contact integration — 2026-09-29

The shared footer now includes an independent concept label, creator credit, role, location, freelance availability, and a distinct project enquiry CTA. The section uses SOVA's existing fonts and olive/cream footer palette. The SOVA brand links, main navigation, shopping content, and store interactions are preserved.

`config/creator.ts` is the single source for creator information. It builds correctly encoded WhatsApp and email links using `conceptProject.name`. “Start a Project” opens a native details disclosure with both contact methods. LinkedIn and GitHub use labelled external links with `target="_blank"` and `rel="noopener noreferrer"`. The portfolio URL was originally left unset; it is now configured as `https://alson-portfolio-nine.vercel.app/`, so the existing “View Portfolio” link appears. A server-rendering test confirms the CTA follows the configured URL. All six prospective analytics actions have `data-analytics-event` identifiers; no analytics package was added.

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed: 5 tests, including contact URL encoding and conditional portfolio rendering |
| `npm run build` | Passed: production pages generated |
| `npm run test:browser` | Passed: 25 tests, including the live portfolio link and click-through |
| Creator browser checks | Credit on all eight page types; contact choices, hrefs, external-link attributes, keyboard focus, 44 px contact targets, and no overflow at 375, 390, 430, 768, 1024, and 1440 px |
| Automated accessibility | No WCAG 2 A/AA or 2.1 A/AA findings in the open footer at the six requested widths; the existing eight-page scan also passed |
| Additional browser coverage | Edge and Android-emulated Chromium passed contact disclosure, SVG, target-height, and overflow checks at all six widths |

Screenshots were visually inspected and saved as `artifacts/screenshots/creator-footer-390.png`, `creator-footer-open-390.png`, `creator-footer-1440.png`, and `creator-footer-open-1440.png`. `creator-browser-qa.json` records the additional Edge/Android-emulation runs. Contact destinations and prefilled parameters were checked without completing a real enquiry. Physical devices, Safari, actual mail delivery, and WhatsApp message delivery are outside the observed test evidence.
