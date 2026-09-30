# SOVA motion polish

SOVA remains an independent skincare concept. This pass preserves its layout, palette, fonts, photography, content, navigation, store CTAs, and creator contacts. Motion follows the existing soft, tactile direction.

## Audit and selected changes

| Surface | Observed opportunity | Implemented response |
| --- | --- | --- |
| Homepage and page titles | Major headings entered abruptly | A readable 18 px entrance, lasting 650 ms; the homepage image settles within 900 ms. |
| Editorial and story imagery | Texture and product images appeared without a transition | Texture photography receives a simple fade; product still life gently settles from scale 1.035 inside its existing frame. |
| Product and ingredient collections | Static groups gave little sense of progression | One-time 20 px reveals with 60 ms stagger increments, capped at 120 ms. Shop filtering reveals the new collection while leaving the filters immediately usable. |
| Product gallery | Changing images replaced the image suddenly | A 450 ms crossfade between two reserved layers; inactive imagery is hidden from assistive technology. |
| Routine builder | Question changes were abrupt and did not introduce the new heading to keyboard users | A short 450 ms step entrance, heading focus after a step change, and a progress bar animated through `scaleX`. |
| Mobile menu | Opening animated `max-height` | Opacity and an 8 px transform introduce the existing menu. Focus, Escape, and navigation remain immediate. |
| Buttons and editorial links | Feedback was inconsistent; journal hover changed padding | Small SVG arrow movement, 220 ms control transitions, a restrained product-image hover, and transform-based journal feedback. Touch controls have a small press response. |

Repeated paragraphs, cart contents, newsletter fields, and the creator disclosure remain steady so their reading and interaction do not compete with the editorial moments. Scrolling remains native. There are no perpetual loops, parallax listeners, loading screens, or navigation exit delays.

## Reusable implementation

`components/scroll-reveals.tsx` observes elements marked with `data-reveal`. Supported styles are `lift`, `image`, and `texture`. The shared keyframes and timing variables live in `app/globals.css`. An optional `--reveal-delay` provides a small group stagger; `ProductCard` exposes it through `revealDelay`.

Reveals only play when an element enters the viewport. Observed targets are then unregistered. A mutation observer registers new shop and routine content; route changes clean up observers, listeners, and active animations. No animation dependency was added.

Content is visible before observation, with JavaScript disabled, and when IntersectionObserver is unavailable. Reveals start partially visible and return to the normal CSS state. Keyboard focus cancels a reveal around the focused control. Smaller screens use shorter reveal durations. Changing the system preference to reduced motion cancels active reveals and disables entrances, transitions, smooth scrolling, and hover movement; state indicators remain intact.

## Repeat the checks

After `npm run build`, run:

- `npm run test:browser` for the storefront, creator layer, accessibility, responsive widths, and Chrome motion checks.
- `npm run test:motion` for the motion suite in Edge, Android-emulated Chromium, desktop WebKit, and iPhone-emulated WebKit.

The motion suite covers progressive enhancement, one-time reveals, reduced-motion preference changes, gallery geometry, routine focus, navigation, runtime errors, and post-load layout shifts where the browser exposes that metric. Chrome screenshots are saved in `artifacts/motion/`. Full results and testing limits are recorded in `VERIFICATION.md`.
