# Security review

Assessment date: 24 October 2026.

## Scope

The KuberIQ frontend source, locked npm dependencies and local preview. Live production infrastructure, DNS, third-party assets/providers and any future backend are outside this assessment.

## Current status

The initial source review found no demonstrated application-level exploit. The current contact form prevents submission and shows a fixed preview notice; it does not send or store the entered data. There is no implemented authentication system, database or application API in this repository.

Strix's agent skills and local scanner are being configured separately. This document does not claim a completed Strix scan. Detailed local test evidence is deliberately excluded from the public repository.

## Areas to address before launch

- Configure and verify production response headers, including an appropriate Content Security Policy and framing restrictions.
- Use `npm ci` with the committed lockfile and review dependency advisories regularly.
- Keep development servers bound to loopback. Publish only `dist/`, not source folders, local notes or environment files.
- Review Google Fonts requests and media permissions for the intended privacy and asset policies.
- When enabling enquiry delivery, implement server-side validation, abuse controls and appropriate privacy handling; client-side validation alone is insufficient.

## Limitations

Static review cannot establish the security of a deployment that has not been tested. Missing headers in a local preview are deployment-hardening observations, not proof that an uninspected production service is vulnerable. No tool can establish that every vulnerability has been found.
