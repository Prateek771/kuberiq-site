# KuberIQ — Project Brief

## Overview

KuberIQ is a responsive service website for a business offering AI voice agents, connected CRM workflows and custom automations. The project turns a supplied cinematic visual direction into a working React interface with dedicated service pages, readable content panels and a reversible scroll animation.

The central message is simple: routine enquiries and follow-up work should not keep extending the working day. The website explains which tasks could be automated, where a person remains involved and how a potential customer can explore a suitable project.

This repository presents the frontend implementation. It does not contain a voice-agent platform, customer CRM, payment processor or operational enquiry service.

## Audience and problem

The intended audience is appointment-based service businesses handling repeated enquiries, callbacks, booking changes and follow-up work. A visitor may already use a CRM, rely on spreadsheets or need a system included in a future solution.

The communication challenge is to explain a connected service without reducing it to a list of AI features. Answering a call is only one step: a useful workflow also needs a recorded outcome, a booking or callback, and a clear handover when a person is needed. The content therefore follows the work around a conversation as well as the conversation itself.

Examples throughout the site are illustrative workflows. They are not client results, measured time savings or evidence of deployed integrations.

## Project goals

- Make AI voice agents and CRM the primary offer, with automations and website design as supporting services.
- Help visitors identify a specific workflow worth discussing rather than promise that every process can be automated.
- Use motion to give the site a distinctive identity while keeping navigation and service information usable.
- Support desktop and mobile layouts, keyboard navigation and reduced-motion preferences.
- Keep the implementation suitable for static hosting, with explicit scheduling and email contact boundaries.

## Service hierarchy and routes

| Route | Purpose | Main content |
| --- | --- | --- |
| `/` | Introduce the offer and direct visitors to a relevant service | Cinematic introduction, sample conversation and record, three core jobs, delivery, CRM fit, vision, questions, and booking |
| `/voice-agents.html` | Explain the primary service | Enquiries, qualification, bookings, CRM options, follow-up, optional deposits, delivery steps and FAQs |
| `/automations.html` | Explain work beyond the call | Routing, reminders, onboarding, reporting, scope and approvals; website design as a secondary offer |
| `/contact.html` | Explain the engagement and enquiry process | Vision, delivery process, 30-minute meeting agenda, directly visible Calendly calendar, and direct email links |

The main journey moves from understanding the problem, through a concrete workflow, to a discovery-call or enquiry action. Service-specific contact links land at the booking and email section. Privacy and website/service terms have dedicated routes at `/privacy.html` and `/terms.html`.

## Visual direction

The final interface pairs pale blue-grey reading surfaces with dark teal typography and actions. Opaque panels give paragraphs, examples and capability summaries a stable background while the animation remains visible around them. Content panels and navigation do not rely on backdrop blur.

| Role | Color |
| --- | --- |
| Main text | `#183f47` |
| Supporting text | `#4c6269` |
| Action / accent | `#195461` |
| Reading panels, header and footer | `#dce7ec` |
| Strong surfaces | `#e5edf1` |
| Separators | `#c5d4da` |

Inter provides a consistent display and reading hierarchy. Large editorial headings, compact service labels and restrained rounded panels support a spacious layout. The home page begins with a viewport-height introduction, an open 80vh spacer and an illustrative conversation and handover, followed by the delivery process and supporting content.

The supplied animation retains its blue-grey atmosphere, white forms and warm gold/orange highlights. Its colors are not replaced by a filter. The frontend work covers layout, responsive treatment, content presentation and the scroll renderer around that supplied visual material.

## Motion concept and implementation

The animation follows progress through the complete document and reverses when the visitor scrolls back. Lenis eases wheel scrolling once; the scene uses the resulting page position in the same animation loop, avoiding a second easing layer that would make the artwork trail the content.

The renderer progressively loads a 90-frame WebP preview sequence. It prioritizes the current position and spreads early frames across the timeline, so available images can be used before the full download finishes. Desktop and mobile use different preview resolutions. Once loaded, the preview frames remain available for forward and reverse movement.

After preview loading finishes, the renderer requests the current pair and nearby frames from the 241-frame native-detail sequence. Native detail can now appear during movement, with direction-aware prefetch and at most two concurrent requests. A bounded cache holds up to 12 desktop or 8 mobile detail images, resized to the device pixels needed on screen. The original preview stays immediately available when detail is missing. A poster and on-demand video fallback provide recovery paths.

Short entrance transitions move content by 12px over 350ms while keeping it opaque. Reduced-motion preferences replace the animated background with a static poster and remove entrance movement. See [Architecture](ARCHITECTURE.md) for the implementation details and tradeoffs.

## Screenshots

The screenshots document the interface at captured viewport sizes. They do not establish animation timing or physical-device performance.

### Desktop

![KuberIQ desktop interface](screenshots/desktop.png)

### Mobile

![KuberIQ mobile interface](screenshots/mobile.png)

## Scope and boundaries

The working frontend includes six routes, responsive navigation, service content, expandable FAQs, contact and booking options, motion preferences and the animation renderer.

All booking buttons use the owner-approved Calendly destination. A directly visible iframe offers inline scheduling with a direct-link fallback. Native lazy loading defers Calendly until visitors approach the booking section. The inactive enquiry form has been replaced with both owner-approved email addresses. Email links open the visitor's email application and do not send a message from this website. Dedicated privacy and terms pages describe the implemented flows and project scope boundaries.

Claims about service capabilities describe a proposed business offering. This marketing site does not demonstrate that an integration is available for every CRM, that calls are being made, or that bookings and payments are being processed. Actual delivery requires an agreed scope and verification of the selected systems.

## Acceptance and evaluation

The implementation can be evaluated through the build, unit tests and browser review. Acceptance criteria are:

1. All six routes load directly, with working navigation and no unintended horizontal overflow at reviewed viewport sizes.
2. Booking actions lead to the approved calendar, contact anchors land below the header, and email links use the approved recipients.
3. The scene follows the page in both directions, partial loading remains usable, and unavailable detail frames retain the preview path.
4. A reduced-motion preference leaves all content readable with a static background.
5. Keyboard users can reach navigation, FAQs, booking controls and email links, with visible focus and a working skip link.
6. The TypeScript/Vite build and motion/cache tests pass for the revision being reviewed.

Screenshots, unit tests and source review answer different questions. A static image cannot prove scroll performance; a passing calculation test cannot establish device responsiveness. This brief makes no conversion, client-result or universal frame-rate claim.

## Roadmap

- Verify production hosting, security headers, canonical URLs, and sharing metadata at launch.
- If a server-backed enquiry form is added later, verify its destination, success/failure behavior, and data policy before enabling it.
- Add genuine demos and approved evidence when available, keeping illustrative workflows clearly labeled.
- Extend physical-device, slow-network and accessibility testing, including keyboard and screen-reader review.
- Continue measuring the balance between preview resolution, decoded memory, native detail and delivery size before changing the renderer.

## What the project demonstrates

The project combines service-focused information architecture with a custom media renderer and practical frontend boundaries. Its main engineering tradeoff is to separate movement from detail: keep a progressively available sequence ready for interaction, and use native detail whenever the current pair is available. Its main design tradeoff is to keep the cinematic background while giving important content a dependable reading surface.

## Latest presentation update — 25 October 2026

The homepage now includes a clearly labelled sample conversation and handover, three core jobs, project delivery and cost clarity, CRM fit, customer controls, the vision, and common questions. All booking buttons use the approved Calendly meeting; an inline calendar is directly visible and loads near the booking section. Both owner-approved email addresses replace the inactive form. Privacy and website/service terms describe the implemented contact flow. Metadata, social artwork, sitemap, anchor navigation and desktop/mobile screenshots are updated. The automation introduction panel uses 88% of the existing blue-grey surface color with slightly tighter padding; other approved colors and scene artwork are preserved.

Published to the existing Wix site at https://www.kuberiq.si/ on 25 October 2026. The booking section now pairs clearer introductory copy on the left with the directly visible calendar on the right, stacking vertically on mobile. The redundant “Find a time that works” block is removed. The palette, animation implementation, and original media are unchanged.

Verification passed: 26 unit/regression tests, one HTTP preview security test, TypeScript/Vite build, all six public page routes and their security headers, current JS/CSS, animation assets, and Calendly date-to-time selection on the Wix preview. Desktop and mobile browser views were inspected. The source artwork remains 1920x1080; no 4K detail or universal no-lag claim is made. The production header gap is resolved through a small Wix-hosted HTML worker; details and limits are recorded in the security review. The six-page sitemap returns 200 at `/sitemap-index.xml`; Wix's public crawler directive points to it and propagation is verified.
