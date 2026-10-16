# HuyML reference ground truth

Phase 1 capture for `https://huyml.co/` completed with Playwright/Chromium on 2026-10-16. Raw artifacts are stored under `docs/reference-data/` for each requested viewport:

- `1440x900`
- `1920x1080`
- `1024x768`
- `390x844`

Each viewport has a rendered DOM snapshot, computed-style JSON, full/viewport screenshots, and frame-sequence screenshots. The capture script is [scripts/capture.mjs](../../scripts/capture.mjs).

## Measured environment

The capture was run with Playwright Chromium after `networkidle` plus a 3-second wait. The live reference exposes a Framer-rendered full-viewport composition. At capture time, `document.documentElement.scrollHeight` equaled the viewport height at all four requested sizes, while the main Framer composition reported internal overflow content (for example, `scrollHeight: 1276` and `clientHeight: 900` at `1440x900`). `window.scrollY`, `body.scrollTop`, and `document.documentElement.scrollTop` remained `0` under Playwright wheel and keyboard input, so scroll-position frames are recorded as the browser-rendered states available to the live page rather than inferred offsets.

## Color and typography

Values below come from `docs/reference-data/1440x900.json` and matching viewport JSON files.

- Document canvas: `rgb(236, 236, 236)` (`#ececec`).
- Default document text: `rgb(0, 0, 0)` (`#000000`).
- Utility text over image/overlay layers: `rgba(255, 255, 255, 0.5)`.
- Utility face: `BT Grotesk Medium`, `10px`, `500`, `13px` line-height, `0.1px` letter-spacing.
- Display face: `BT Glyphius Regular`, `19px`, `400`, `19px` line-height, `0.19px` letter-spacing for the stacked navigation labels.
- Placeholder metrics exposed by the reference include `BT Grotesk Medium Placeholder` with `size-adjust: 107.69%`, `ascent-override: 91.84%`, `descent-override: 19.59%`, `line-gap-override: 0%` and `BT Glyphius Regular Placeholder` with `size-adjust: 95.75%`, `ascent-override: 122.71%`, `descent-override: 28.2%`, `line-gap-override: 0%`.
- The reference also exposes BT Grotesk Regular/Bold/Bold Italic, BT Glyphius Bold, F37 Bolton Trial, and Inter font-face rules. The raw JSON preserves their URLs and declarations without downloading or reusing the paid font assets.

## Measured desktop geometry

At `1440x900`:

- Utility frame padding: `20px`.
- `Scroll` text: `x=20`, `y=867`, `w=27.5625`, `h=13`; computed utility typography is `10px / 13px`.
- `Selected work` text: `x=197.5`, `y=731`, `w=69.921875`, `h=13`; computed utility typography is `10px / 13px`.
- `Menu` text: `x=197.5`, `y=20`, `w=27.5`, `h=13`; computed utility typography is `10px / 13px`.
- `For inquiries` text: `x=1272.125`, `y=20`, `w=59.9375`, `h=13`; computed utility typography is `10px / 13px`.
- `WORK` navigation label: `x=229.734375`, `y=63`, `w=60.359375`, `h=19`; computed display typography is `19px / 19px`, `0.19px` tracking.
- The main composition has no border radius on its visible text containers; computed borders are `0px none`.
- Fixed utility layers are present above the composition; the raw style JSON records their exact z-index, transform, opacity and dimensions.

## Component inventory

- Fixed utility navigation: brand lockup, Menu trigger, stacked WORK/ABOUT/PLAYGROUND/CONTACT labels, showreel label, Audio toggle, local-time/location block, inquiry copy control.
- Hero composition: large vertical/stacked name lockup, Launch/Recognition metadata, centered project image/card, Scroll marker, selected-work counter.
- Selected-work rail: repeated project cards with category, title, description, image treatment, and current/total counter.
- Project list: full-width linked rows with repeated title, slug/date, awards, team/role, category, description, and hover image treatment.
- Contact overlay: grouped email/social links and Close control.
- Credits overlay: contributor/font/copywriting groups and Close control.
- Footer: independent-designer/working-globally metadata and repeated SVG/graphic marquee.

## Motion capture

The `*-frames/` folders contain the captured initial, scroll-state, and menu-open frames. Computed transition values are preserved per visible element in the JSON `computed.transition` and `computed.transform` fields. The reference uses fixed/transform-driven Framer layers; no reliable document `scrollY` progression was exposed to the headless page during capture, so no easing or duration is invented here.

## Phase 2 constraints

- Keep the current Gather event text, event objects, API adapter, links, and images as the content source.
- Do not copy the reference’s copy, project names, images, paid font files, or audio/Rive assets.
- Use a single free-font substitution configuration with the measured placeholder metrics as the swap point for licensed fonts.
- Do not advance a section without a matching local/reference capture and diff report from `scripts/compare.mjs`.
