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
- Keep the implementation suitable for static hosting, with clearly separated future booking and enquiry integrations.

## Service hierarchy and routes

| Route | Purpose | Main content |
| --- | --- | --- |
| `/` | Introduce the offer and direct visitors to a relevant service | Cinematic introduction, capability summaries, illustrative workflows, service links and project-fit guidance |
| `/voice-agents.html` | Explain the primary service | Enquiries, qualification, bookings, CRM options, follow-up, optional deposits, delivery steps and FAQs |
| `/automations.html` | Explain work beyond the call | Routing, reminders, onboarding, reporting, scope and approvals; website design as a secondary offer |
| `/contact.html` | Explain the engagement and enquiry process | Working approach, free 30-minute discovery-call agenda, booking status and an enquiry form preview |

The main journey moves from understanding the problem, through a concrete workflow, to a discovery-call or enquiry action. Service-specific links can preselect the enquiry topic.

## Visual direction

The final interface pairs pale blue-grey reading surfaces with dark teal typography and actions. Opaque panels give paragraphs, forms and capability summaries a stable background while the animation remains visible around them. Content panels and navigation do not rely on backdrop blur.

| Role | Color |
| --- | --- |
| Main text | `#183f47` |
| Supporting text | `#4c6269` |
| Action / accent | `#195461` |
| Reading panels, header and footer | `#dce7ec` |
| Form surfaces | `#e5edf1` |
| Separators | `#c5d4da` |

Inter provides a consistent display and reading hierarchy. Large editorial headings, compact service labels and restrained rounded panels support a spacious layout. The home page begins with a viewport-height introduction, an open 80vh spacer and a second cinematic capability section, followed by supporting content.

The supplied animation retains its blue-grey atmosphere, white forms and warm gold/orange highlights. Its colors are not replaced by a filter. The frontend work covers layout, responsive treatment, content presentation and the scroll renderer around that supplied visual material.

## Motion concept and implementation

The animation follows progress through the complete document and reverses when the visitor scrolls back. Lenis eases wheel scrolling once; the scene uses the resulting page position in the same animation loop, avoiding a second easing layer that would make the artwork trail the content.

The renderer progressively loads a 90-frame WebP preview sequence. It prioritizes the current position and spreads early frames across the timeline, so available images can be used before the full download finishes. Desktop and mobile use different preview resolutions. Once loaded, the preview frames remain available for forward and reverse movement.

After scrolling has settled for 160ms and preview loading has finished, the renderer requests the relevant pair from a 241-frame native-detail sequence. A four-frame cache and at most two concurrent detail requests limit decoding work. The preview handles movement; native detail improves a settled view. A poster and on-demand video fallback provide recovery paths.

Short entrance transitions move content by 12px over 350ms while keeping it opaque. Reduced-motion preferences replace the animated background with a static poster and remove entrance movement. See [Architecture](ARCHITECTURE.md) for the implementation details and tradeoffs.

## Screenshots

The screenshots document the interface at captured viewport sizes. They do not establish animation timing or physical-device performance.

### Desktop

![KuberIQ desktop interface](screenshots/desktop.png)

### Mobile

![KuberIQ mobile interface](screenshots/mobile.png)

## Scope and boundaries

The working frontend includes four routes, responsive navigation, service content, expandable FAQs, form validation, motion preferences and the animation renderer.

Booking is not connected to a verified calendar in the source configuration. Booking actions lead to contact information explaining the pending connection. The enquiry form validates fields and displays a preview notice; submitting it does not send or persist an enquiry. Privacy and terms content are preview placeholders.

Claims about service capabilities describe a proposed business offering. This marketing site does not demonstrate that an integration is available for every CRM, that calls are being made, or that bookings and payments are being processed. Actual delivery requires an agreed scope and verification of the selected systems.

## Acceptance and evaluation

The implementation can be evaluated through the build, unit tests and browser review. Acceptance criteria are:

1. All four routes load directly, with working navigation and no unintended horizontal overflow at reviewed viewport sizes.
2. Primary actions lead to the intended contact section, and the form reports its inactive preview state accurately.
3. The scene follows the page in both directions, partial loading remains usable, and unavailable detail frames retain the preview path.
4. A reduced-motion preference leaves all content readable with a static background.
5. Keyboard users can reach navigation, FAQs and form controls, with visible focus and a working skip link.
6. The TypeScript/Vite build and motion/cache tests pass for the revision being reviewed.

Screenshots, unit tests and source review answer different questions. A static image cannot prove scroll performance; a passing calculation test cannot establish device responsiveness. This brief makes no conversion, client-result or universal frame-rate claim.

## Roadmap

- Connect and verify a booking destination and enquiry delivery service, including real success and failure states.
- Replace preview legal content with approved business-specific information before enabling data collection.
- Add genuine demos and approved evidence when available, keeping illustrative workflows clearly labeled.
- Extend physical-device, slow-network and accessibility testing, including keyboard and screen-reader review.
- Continue measuring the balance between preview resolution, decoded memory, native detail and delivery size before changing the renderer.

## What the project demonstrates

The project combines service-focused information architecture with a custom media renderer and practical frontend boundaries. Its main engineering tradeoff is to separate movement from detail: use a progressively available sequence during interaction, then add higher-resolution frames when the page settles. Its main design tradeoff is to keep the cinematic background while giving important content a dependable reading surface.
