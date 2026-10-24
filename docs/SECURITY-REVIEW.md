# Security review

Assessment date: 24 October 2026.

## Scope

The KuberIQ frontend source, locked npm dependencies and local preview. Live production infrastructure, DNS, third-party assets/providers and any future backend are outside this assessment.

## Hardening follow-up

The three initial hardening observations were addressed in commit `039c493` without changing styles, animation code, media or service copy:

| Observation | Change | Local verification |
| --- | --- | --- |
| Missing preview response headers | Shared CSP, framing, MIME, referrer and permissions policies for Vite development and production preview; build emits a matching `_headers` manifest | Actual HTTP regression passes; browser renders and scrolls with no CSP warnings |
| Inconsistent extensionless routes | Exact public route matching accepts canonical, extensionless and trailing-slash forms; unrelated suffixes no longer select service pages | Two routing regressions pass; browser confirms voice, automation and contact aliases |
| Floating direct dependency versions | All 11 declarations pinned to the already-audited lockfile versions | `npm ci --ignore-scripts` succeeds with zero audit findings; no resolved package versions changed |

Local validation: **17 unit tests pass**, including all 15 existing motion/cache tests; production build and HTTP-header test pass. Homepage screenshots before and after are byte-identical at the tested desktop viewport. Forward/reverse scroll, fonts, service pages, inert enquiry submission and malformed service queries were also checked in the browser. No application source/style/animation changes beyond route selection were made.

**Focused Strix retest `security-review_3b9c` completed at 17:50 IST on 24 October 2026 with zero confirmed exploitable vulnerabilities.** It verified all three improvements within the local boundary using `chatgpt/gpt-6.1-sol` subscription access, with no API-key billing. Native TypeScript-capable Node 24.22.1 passed the unchanged 17 unit tests and one HTTP-header test in the sandbox too. Chromium checks covered 32 route navigations, seven query cases, CSP rejection of inline script, inert forms, advancing animation frames and reduced-motion fallback.

The final machine-readable record contains 11 coverage entries and six gaps: five explicit follow-ups (production deployment, protected-file exposure beyond the isolated artifact, unavailable Windows Git history in Docker, unavailable offline advisory database, and a concurrent documentation edit), plus an unrecorded business-logic category label. These are retained rather than presenting zero findings as exhaustive coverage. The host-side review independently verified commit `039c4938df4dbef584eb8b081de354909d3c0ff7`, unchanged resolved dependencies and unchanged visual sources. A fresh host `npm audit --json` returned zero findings for 108 packages; this does not replace the unrun fresh Trivy/OSV checks. The concurrent edit was this report, made by the integrating agent; application source remained unchanged throughout the scan.

The original scan below remains historical evidence, not a statement about the new response headers. The Docker scanner blocked external fonts by scope; the separate host-browser comparison verified actual typography and byte-identical homepage screenshots.

Production hosting is still unassessed. `_headers` only takes effect on a host that supports that manifest; other hosts require equivalent configuration. Production CSP permits same-origin scripts, existing inline animation styles and Google Fonts. Development alone adds Vite inline bootstrap and loopback WebSocket allowances. Form submission remains blocked pending an implemented backend. See the [deployment notes](../README.md#security-configuration).

## Initial assessment

The initial source review found no demonstrated application-level exploit. The current contact form prevents submission and shows a fixed preview notice; it does not send or store the entered data. There is no implemented authentication system, database or application API in this repository.

**Strix 1.7.0 completed its bounded assessment on 24 October 2026 at 16:43 IST with zero confirmed exploitable vulnerabilities.** Run `security-review_6132` assessed commit `ea3ddb6b678a1e9e4bdf76d4e00a9bf5f00fb96e` using `chatgpt/gpt-6.1-sol` through separately authorized ChatGPT subscription access. No API-key billing was used. Detailed local evidence is excluded from the public repository.

The run recorded 26 coverage entries: 12 no-issue results, 10 ruled-out candidates and four inapplicable areas. This is a scoped assessment result, not a security certification.

## Checks completed

| Check | Observed result |
| --- | --- |
| npm dependency advisory audit | Zero reported known vulnerabilities on the assessment date |
| Application tests | 15 passing |
| Type checking / production build | Passed |
| Source review | No demonstrated executable DOM injection sink, backend query or authentication surface |
| Malformed service query | Falls back to an allowed service label; tested markup was not injected |
| Markup submitted in preview fields | Remains field text; fixed preview notice displayed; no injected executable element observed |
| Local Git configuration request | Blocked with HTTP 403 |
| Local environment-file request | Returned HTML app shell, not environment-file contents |
| Cross-origin request from an untrusted origin | No permissive Access-Control-Allow-Origin response |
| Strix static analysis | 228 rules across 32 files; no findings; two partial HTML parsing warnings |
| Strix dependency checks | npm audit, OSV and Trivy found no known advisories for 108 locked packages |
| Strix redacted secrets screening | No detections in 29 selected source/configuration files |
| Strix browser testing | 31 bounded input/workflow checks; no demonstrated script execution or enquiry delivery |
| Strix routing and build exposure checks | 42 route/exposure cases and 603 generated files examined; no restricted file disclosure demonstrated |

These are bounded observations, not a claim of exhaustive exploit testing.

## Remaining launch checks

- Configure and verify production response headers, including an appropriate Content Security Policy and framing restrictions.
- Use `npm ci` with the now-pinned manifest and committed lockfile; review dependency advisories regularly.
- Keep development servers bound to loopback. Publish only `dist/`, not source folders, local notes or environment files.
- Review Google Fonts requests and media permissions for the intended privacy and asset policies.
- When enabling enquiry delivery, implement server-side validation, abuse controls and appropriate privacy handling; client-side validation alone is insufficient.
- Configure the chosen host to serve or redirect public aliases to their canonical `.html` pages; client page selection is fixed, but host routing and metadata behavior must also be verified at deployment.

At the initial scan, local Vite responses omitted Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy. The follow-up adds those headers locally. Production host behavior remains unverified. Vite development mode also serves source modules by design; it must remain a local development tool.

## Limitations

Static review cannot establish the security of a deployment that has not been tested. Missing headers in a local preview are deployment-hardening observations, not proof that an uninspected production service is vulnerable. No tool can establish that every vulnerability has been found.

Strix's final machine-readable coverage file retains one `information disclosure` classification gap, despite related artifact/exposure entries and narrative evidence. Its narrative claim of no coverage gaps is therefore not adopted here. Browser checks used one Chromium environment; live hosting, repository history, external services, customer data and load testing were excluded.

The sandbox's default test runner could not load TypeScript; its alternate loader also reported failures. A separate unmodified Windows `npm test` run after scanning passed all 15 tests. The sandbox failure is not reproduced as an application regression; runner portability remains a limitation. The sandbox production build passed, and no application source fixes were made.

## Hosting verification — 25 October 2026

Before this release, the existing Wix production URL returned HTTPS 200 with `X-Content-Type-Options: nosniff`, but did not send the application's CSP, X-Frame-Options, or Referrer-Policy headers. Vite development/preview enforce `security-headers.ts`; the generated `_headers` file is a deployment manifest for hosts that support it and is not evidence of enforcement on Wix. No supported custom static response-header configuration was found in the targeted Wix Headless documentation search or installed CLI config/schema search. This is an observed hosting gap, not a passing production security-header check. The release does not disable existing host protections or alter authentication, DNS, or email.

The source CSP now permits only the approved Calendly frame origin. The iframe is click-to-load, with no automatic third-party calendar load. Inactive enquiry fields are removed; direct email links replace the form, and form submissions remain blocked by the source policy.
