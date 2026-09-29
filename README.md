# SOVA concept storefront

This is an original **Concept Project** for a fictional skincare brand. The six products, formulations, packaging, prices, and checkout are demonstrations. No purchase, subscription, or payment is possible.

## Run locally

Use Node.js 20.9 or later. From this folder:

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. The app does not require environment variables.

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:browser
```

Browser tests use local Chrome and a production build, starting a temporary server on port 3115. They write screenshots to `artifacts/screenshots/`. The browser suite checks the shop, product details, cart, routine, widths from 360 to 1440 px, keyboard navigation, and automated accessibility rules.

## Structure

- `app/` contains the eight page routes and global styles.
- `data/` contains typed product and ingredient content.
- `lib/` contains pure cart and routine logic.
- `components/` contains the storefront and interactive flows.
- `public/images/` contains original generated concept imagery.
- `tests/` contains logic and browser checks.

Cart data stays in the visitor's browser under the versioned `sova-cart-v1` key. The newsletter preview does not store or transmit email addresses. The app does not include real reviews or testimonials.

See [CASE-STUDY.md](CASE-STUDY.md), [ASSET-MANIFEST.md](ASSET-MANIFEST.md), and [VERIFICATION.md](VERIFICATION.md).

## Creator and freelance contact

`config/creator.ts` is the single source for creator details, professional profile URLs, the WhatsApp number, and the future portfolio URL. `conceptProject.name` in that file supplies the project context for the prefilled WhatsApp message and email subject/body.

The creator credit appears in the shared footer on every page, below the SOVA brand links. “Start a Project” opens a native, keyboard-accessible disclosure with WhatsApp and email choices. LinkedIn and GitHub are visible professional profile links. These real contact options are separate from the fictional store's product, bag, checkout, and newsletter interactions.

The live portfolio CTA reads `portfolioUrl` from `config/creator.ts`. To change its destination later, update that URL, then rebuild and restart the app. “View Portfolio” appears automatically whenever a URL is configured; no component change is needed.

Future analytics can use the `data-analytics-event` attributes: `creator_start_project`, `creator_email`, `creator_whatsapp`, `creator_linkedin`, `creator_github`, and `creator_portfolio`. The section's `data-project` attribute identifies SOVA. No analytics package or tracking service is installed by this integration.
