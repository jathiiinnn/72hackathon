# Reference design spec

Reference: `https://huyml.co/`, inspected in the browser runtime on 2026-10-16.

## Visual system

- Canvas: `rgb(236, 236, 236)` (`#ececec`), no page margin.
- Primary text: `rgb(0, 0, 0)` (`#000000`).
- Muted utility text: `rgba(255, 255, 255, 0.5)` over image layers; the page uses black text on the light canvas in the project list.
- Body fallback: `sans-serif`, `12px`.
- Display face: BT Glyphius Regular, measured at `19px / 19px`, `400`, `0.19px` tracking for the large nav wordmark.
- Utility face: BT Grotesk Medium, measured at `10px / 13px`, `500`, `0.1px` tracking.
- The implementation uses a single swappable font configuration with free fallbacks; licensed BT fonts are intentionally not downloaded.

## Layout measurements

Measurements below were taken from the reference’s initial desktop view (`1280 × 720` browser viewport; the runtime exposes this viewport directly).

- Fixed utility frame: inset `20px`; top utility row height `40px`.
- Left vertical brand lockup: approximately `157px` wide, beginning at `x=152px` in the main hero composition.
- Navigation links are stacked at approximately `19px` display size with tight `19px` line height.
- Scroll indicator is fixed near `x=20px`, `y=688px`; utility size `10px / 13px`.
- Selected-work label appears near `x=176px`, `y=552px`; utility size `10px / 13px`.
- Project feature image in the initial viewport is approximately `300px × 235px` at `x=464px`, `y=241px`.
- The project-list links are full-width rows with an image/hover treatment and metadata columns; content uses generous vertical spacing rather than card borders.
- Fixed inquiry block sits in the top-right utility row; local-time block sits near the top-right center.

## Interaction notes

- The reference is scroll-led: the hero, selected-work rail, and project rows occupy one continuous canvas.
- The selected-work area uses an image/card rail with an oversized current index (`01`) and a total counter.
- Hovered project rows elevate/preview imagery while neighboring rows visually recede.
- Menu is a fixed overlay with a stacked navigation list; contact and credits are separate overlay panels with a visible close control.
- Audio is a binary UI state only; no source is assumed here.
- Inquiry email uses a copy interaction with a temporary copied state.
- Scroll indicator and utility controls remain fixed above the scrolling composition.
- Animations should use transform/opacity, with reduced-motion fallbacks. Avoid layout-driven marquee animation.

## Responsive intent

- Desktop: fixed utility frame, layered hero composition, large display typography, wide project rows.
- Tablet: reduce the hero type and image scale while retaining the same fixed utility hierarchy.
- Mobile: stack navigation and metadata, keep the index/counter visible, convert project rows to readable vertical cards, and avoid horizontal overflow.

## Intentional deviations

- Existing Gather event titles, descriptions, dates, locations, categories, API adapter, and fallback data remain the content source.
- Reference copy, project names, project images, commercial fonts, and audio assets are not copied.
- Gather’s event data is mapped into the reference’s selected-work and project-list presentation.
