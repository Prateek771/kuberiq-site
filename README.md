# KuberIQ

### Your working day should have an end.

A cinematic, responsive website for an AI voice-agent and CRM service. Built with React, TypeScript and Vite, with a reversible scroll-driven animation and clear, practical service information.

![KuberIQ cinematic homepage](docs/screenshots/hero.png)

**[Project brief](docs/PROJECT-BRIEF.md) · [Architecture](docs/ARCHITECTURE.md) · [Security review](docs/SECURITY-REVIEW.md)**

## The project

Service businesses spend time chasing callbacks, checking bookings and transferring updates between tools. KuberIQ explains how voice agents and connected workflows could help, while making human handover and project scope clear.

This repository contains the website experience. It does not contain an operational voice-agent platform, CRM backend or customer database.

## Experience highlights

- **Scroll-directed storytelling.** A fixed cinematic scene follows progress through the document and reverses when scrolling back.
- **Progressive image quality.** A lightweight frame sequence supports motion, with native 1080p detail applied when scrolling settles.
- **Readable surfaces.** Pale blue-grey panels, dark teal copy and clear form controls separate content from the moving artwork.
- **Responsive navigation.** Dedicated service pages and layouts for desktop and mobile.
- **Accessible fallbacks.** Keyboard navigation, focus styles, semantic content and a static poster for reduced-motion preferences.
- **Honest preview states.** Booking and enquiry delivery are explicitly marked as not connected.

<details>
<summary>Mobile contact experience</summary>

<img src="docs/screenshots/mobile.png" alt="Mobile KuberIQ contact form with pale blue-grey panels and dark teal labels" width="390">

</details>

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Introduce the offer, illustrate use cases and guide visitors to a service |
| `/voice-agents.html` | Explain conversations, bookings, follow-up and CRM handover |
| `/automations.html` | Explain workflow automation and connected website services |
| `/contact.html` | Explain the engagement process and collect an enquiry once delivery is connected |

## Run locally

Use Node.js 24 and npm. No API key is required to run the website.

```sh
npm ci
npm run dev -- --port 5200
```

Open **http://127.0.0.1:5200/**.

```sh
npm test          # Motion, interpolation and cache behaviour
npm run build    # Type checking and production bundle
npm run preview  # Local preview of the built files
```

`npm run preview` is for local validation, not a production server. Deploy only the generated `dist/` directory to a suitable static host after configuring its security headers and live integrations.

## Stack and structure

| Layer | Implementation |
| --- | --- |
| UI | React + TypeScript |
| Build | Vite, multi-page HTML entries |
| Styling | CSS with shared brand tokens |
| Motion | Lenis, Canvas 2D, WebP frame sequences |
| Icons | Lucide React |
| Tests | Node.js test runner |

```text
src/                 Page components, styling and animation renderer
public/              Poster, video, frame sequences and attribution
tests/              Motion and frame-cache regression tests
docs/               Public project brief, architecture and screenshots
```

## Status and boundaries

This is a working frontend preview. The booking calendar, enquiry delivery, business-specific legal documents and production hosting acceptance remain separate launch tasks. Example workflows are illustrative; there are no claimed client results or guaranteed business outcomes.

Security coverage and limitations are recorded in [the review notes](docs/SECURITY-REVIEW.md). A passing build or an empty scanner report does not certify an application as vulnerability-free.

## Attribution

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for component and dependency attribution. Visual references guided the design; the implementation retains KuberIQ's identity and service copy. Brand and media assets are not offered under a blanket open-source licence. Review their permissions before reusing them.

