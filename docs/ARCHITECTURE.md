# KuberIQ — Architecture

## Application structure

KuberIQ is a client-rendered React and TypeScript site built with Vite. Four HTML entry points share the application bundle. `App.tsx` selects the page from the pathname; there is no client-side routing dependency or application server in this project.

| Area | Source | Responsibility |
| --- | --- | --- |
| Entry and styles | `src/main.tsx` | Mount React, load the stylesheet layers and initialize optional motion diagnostics |
| Shared application | `src/App.tsx` | Header, navigation, page selection, service sections, contact preview and footer |
| Home introduction | `src/OpeningSequence.tsx` | Introductory composition and primary call to action |
| Reusable page sections | `src/ServicePages.tsx` | Page heroes, home supporting sections, working approach, scope and next steps |
| Content data | `src/content.ts` | Capabilities, delivery stages and FAQ copy |
| Booking configuration | `src/booking.ts` | Destination readiness and URL; currently inactive |
| Scene renderer | `src/ScrollScene.tsx` | Preview loading, detail cache, canvas painting, fallback media and lifecycle cleanup |
| Scroll coordination | `src/useSmoothScroll.ts`, `src/scrollClock.ts` | Shared frame loop and anchor navigation |
| Motion helpers | `src/motion.ts`, `src/sequence.ts` | Progress, image sizing, frame blending, progressive ordering and cache behavior |
| Content entrances | `src/useReveal.ts` | Intersection and focus-driven entrance state |
| Final visual overrides | `src/brand.css` | Current palette, reading surfaces, responsive adjustments and motion preferences |

The dependency set includes React, React DOM, Lenis and Lucide icons. Vite uses the React and Tailwind plugins; the interface's current styling is primarily expressed in the repository's CSS files. The lockfile is the reproducible dependency record for packages whose manifest ranges are `latest`.

## Rendering and style layers

`main.tsx` loads `styles.css`, `refinements.css`, `cinema.css`, `services.css` and then `brand.css`. Later rules refine the earlier visual treatments. The final pale blue-grey and dark teal declarations near the end of `brand.css` determine the current panel, text, action and field colors.

The decorative scene is fixed behind the document, ignores pointer input and is hidden from assistive technology. Ordinary content remains in document flow above it. The header is fixed; the cinematic home introduction and capability section use viewport-based minimum heights, with an 80vh spacer between them.

The final reading panels are opaque. They do not use backdrop blur, and main content avoids soft text shadows. This gives forms and paragraphs a consistent surface independent of the frame behind them.

## One scroll position, one animation loop

`useSmoothScroll` creates Lenis with `smoothWheel: true` and `lerp: .1`. Touch synchronization is disabled, leaving touch scrolling native. Lenis respects reduced-motion preferences and does not intercept scrolling inside textarea or select controls.

Each animation frame first updates Lenis, then publishes `window.scrollY` through the shared scroll clock. The scene maps that position to:

```text
progress = clamp(scrollY / (documentHeight - viewportHeight), 0, 1)
```

Short documents resolve to zero progress. There is no additional scene easing. Scrolling backward therefore moves the same timeline backward rather than starting a separate animation. `ResizeObserver` updates the scroll range and canvas dimensions when the content or viewport changes.

Same-page hash navigation cancels the browser's immediate jump and uses Lenis scrolling. After arrival, the target receives focus without another scroll jump.

## Progressive preview sequence

The main path uses 90 pre-exported WebP frames:

- `public/frames-scroll/`: desktop preview frames, 960px wide.
- `public/frames-scroll-mobile/`: mobile preview frames, 480px wide, selected below 768px when loading starts.

Four asynchronous workers fetch and decode frames with `createImageBitmap`. Before selecting each request, loading order considers the current page position. It prioritizes nearby frames, both timeline endpoints and a coarse spread across the timeline before filling the remaining gaps.

Decoded images become usable immediately. `availableFrameBlend` finds available frames around the requested position and interpolates between them. If only one useful endpoint is available, it holds that frame. A failed individual request does not discard successfully decoded images.

All successfully loaded preview frames remain cached until cleanup. Once complete, forward and reverse movement can use the same images without requesting them again. A partially loaded cache may interpolate across larger frame gaps, so its appearance can be less precise than the complete sequence.

## Native-detail refinement

The source also includes a 241-frame, 1920×1080 detail sequence in `public/frames-hd/`. It is not all decoded at startup.

After the page has stopped moving for 160ms and the preview requests have settled, the renderer requests the lower and upper detail frames for the current position. The detail cache retains at most four images, evicts the least recently used image and permits at most two active loads. Existing in-flight requests may finish if movement resumes; new detail requests follow the settled target.

The renderer uses detail only when the required pair is ready. Otherwise, it draws the available preview. During movement, it uses the preview sequence. This trades a possible resolution change at rest for less detail decoding during interaction; it does not synthesize resolution beyond the source.

`FrameCache` coalesces duplicate requests, releases evicted images and closes images that finish loading after disposal. The component also aborts pending fetches during cleanup and when motion preferences change.

## Canvas and media recovery

The canvas uses a non-alpha 2D context. It draws a centrally cropped cover image and alpha-blends the second frame when needed. Canvas dimensions follow device pixel ratio only within the source-resolution bounds calculated by `canvasResolution`; high-density displays do not trigger unlimited enlargement.

The renderer skips painting when progress, dimensions and resource readiness are unchanged. Hidden documents skip scene ticks. Visibility and page lifecycle events mark the scene for refresh.

`hero-poster.jpg` is the initial image. Normal sequence loading does not download the fallback video. If canvas decoding is unavailable or no preview frames load, the component loads `hero.mp4` on demand and seeks it according to scroll progress. If that fails, the poster remains. The video is muted and inline, with no autoplay or loop. Media layers use a 500ms opacity transition.

## Content motion and accessibility

The entrance system observes content at a 0.05 intersection threshold with a 64px bottom margin. Elements move from 12px below their final position over 350ms; their opacity remains 1. Content is therefore readable before the entrance finishes. Entrances run once, and keyboard focus reveals containing content immediately.

Reduced motion prevents scene loading, retains the poster and removes entrance transitions. Preference changes release animation resources. Other implemented access features include a skip link, semantic navigation, current-page indication, visible focus outlines, an expandable mobile menu with Escape handling, native FAQ disclosure elements, labeled fields and an `aria-live` form status message.

These features describe implementation, not a comprehensive accessibility certification. Keyboard, assistive-technology, zoom and device testing remain separate acceptance activities.

## Contact preview and data boundary

There is no enquiry endpoint, database, authentication flow or operational CRM connection in this frontend. `booking.ts` currently has an empty destination and `ready: false`; booking actions fall back to the contact section.

The form uses browser validation. Its submit handler prevents navigation and sets a message explaining that the preview does not send enquiries. It does not save or transmit the entered form values. Any future live integration needs its own delivery states, data handling and approved legal content.

## Build and tests

```sh
npm ci
npm run dev
npm test
npm run build
```

The build runs TypeScript project checking before Vite generates the four-page static output in `dist/`. The test command uses Node's built-in test runner. Test files exercise progress clamping, forward/reverse mapping, cover and canvas sizing, frame interpolation, progressive loading order, partial sequences, seek completion and cache lifecycle behavior.

Run tests and browser acceptance checks against the same revision. Unit tests verify deterministic calculations and resource rules; they do not measure frame rate, network behavior or visual quality. Review cold loading, rapid scroll reversal, expanded content, reduced motion, fallback media and mobile navigation separately in the browser.

## Maintenance considerations

- Changing page length changes the whole-document timing of the scene; review both the content and transformation after major copy changes.
- Preview resolution is chosen when loading starts. Resizing changes canvas dimensions but does not automatically replace that preview set.
- Higher-resolution exports increase transfer and decoded-memory costs; retain bounded detail loading unless measurements justify a different approach.
- A cache hit and a downloaded asset are different from a smooth rendered frame. Evaluate performance on representative devices and network conditions.
- Keep new styling aligned with the final override layer, or consolidate the stylesheet history deliberately to avoid conflicting declarations.
- Keep illustrative workflows, marketing claims and verified integration behavior distinct when extending the site.
