# Security review

Assessment date: 24 October 2026.

## Scope

The KuberIQ frontend source, locked npm dependencies and local preview. Live production infrastructure, DNS, third-party assets/providers and any future backend are outside this assessment.

## Current status

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

## Areas to address before launch

- Configure and verify production response headers, including an appropriate Content Security Policy and framing restrictions.
- Use `npm ci` with the committed lockfile and review dependency advisories regularly.
- Keep development servers bound to loopback. Publish only `dist/`, not source folders, local notes or environment files.
- Review Google Fonts requests and media permissions for the intended privacy and asset policies.
- When enabling enquiry delivery, implement server-side validation, abuse controls and appropriate privacy handling; client-side validation alone is insufficient.
- Make extensionless routes consistent with the canonical `.html` routes. The preview can return page HTML while the client selects the home page; this is a functional issue, not an access-control vulnerability.

The tested local Vite responses omitted Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy. Production host behavior remains unverified. Vite development mode also serves source modules by design; it must remain a local development tool.

## Limitations

Static review cannot establish the security of a deployment that has not been tested. Missing headers in a local preview are deployment-hardening observations, not proof that an uninspected production service is vulnerable. No tool can establish that every vulnerability has been found.

Strix's final machine-readable coverage file retains one `information disclosure` classification gap, despite related artifact/exposure entries and narrative evidence. Its narrative claim of no coverage gaps is therefore not adopted here. Browser checks used one Chromium environment; live hosting, repository history, external services, customer data and load testing were excluded.

The sandbox's default test runner could not load TypeScript; its alternate loader also reported failures. A separate unmodified Windows `npm test` run after scanning passed all 15 tests. The sandbox failure is not reproduced as an application regression; runner portability remains a limitation. The sandbox production build passed, and no application source fixes were made.
