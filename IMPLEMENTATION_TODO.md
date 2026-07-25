# Gain Tax Calculator — Launch To-Do

Updated: 2026-07-25

## Calculator UX and English date closeout

- [x] Replace every native date input with one shared Month / Day / Year field that is independent of browser and operating-system locale.
- [x] Support keyboard entry, full-date paste, strict calendar validation, English helper text, English inline errors, and ISO date values.
- [x] Add a preflight gate that rejects future native date inputs.
- [x] Make state selection explicit in the quick calculator instead of silently defaulting to California.
- [x] Add currency formatting, optional buying and selling costs, and an immediate long-term eligibility date.
- [x] Reorganize the quick calculator into Transaction details and Tax profile sections.
- [x] Prioritize total tax, after-tax gain, effective rate, and holding period in the result.
- [x] Add tax breakdown, result explanation, assumptions, sale-timing comparison, copy, focus management, and live status feedback.
- [x] Move the first-visit privacy notice into document flow so it cannot cover calculator fields or actions.
- [x] Add regression tests for strict English date parsing, formatting, invalid dates, and long-term eligibility.
- [x] Pass preflight, automated tests, lint, type checking, production build, and production dependency audit.
- [x] Pass local desktop and 390 px browser regression for all calculator routes, English-only rendering, validation, result focus, responsive overflow, and console output.
- [x] Complete design QA with no remaining P0, P1, or P2 issue.
- [x] Deploy verified calculator build commit `3025bf1` to Vercel production.
- [x] Verify the canonical production calculator and all date-enabled calculator routes at desktop and 390 px.

## English-only repository closeout

- [x] Scan repository text and all 21 production sitemap pages for Han characters.
- [x] Translate the remaining non-English project documentation and remove the localized absolute repository path.
- [x] Add a preflight gate that rejects Han characters in project text files.
- [x] Run preflight, automated tests, the production build, the dependency audit, and local browser regression.
- [x] Deploy `main` at commit `9f6a8ba` and verify the English-only production site.

## Final SEO post-fix closeout

- [x] Remove the `/blog?tag=*` redirect loop.
- [x] Permanently redirect legacy `/blog/tag/*` and `/blog/category/*` paths to `/blog`.
- [x] Suppress empty Reviewer fields and link the Editorial Team to the public editorial method.
- [x] Add the organization author URL to Article JSON-LD and remove unsupported “Expert” wording.
- [x] Separate the Organization logo from the 1200×630 social-preview image and align file extensions, MIME types, and file contents.
- [x] Use the date after the one-year anniversary for long-term classification, including leap-year boundaries.
- [x] Add automated regression coverage and preflight gates for the rules above.
- [x] Run preflight, tests, the production build, the dependency security audit, and local production regression.
- [x] Push `main` and complete the Vercel production deployment for commit `dab07e1`.
- [x] Verify redirects, all 21 sitemap URLs, canonicals, JSON-LD, image MIME types, desktop/mobile layouts, and the calculator in production.

## P0: Launch blockers

- [x] Update federal ordinary-income and long-term capital-gains brackets to 2026 and validate them against IRS Rev. Proc. 2025-32.
- [x] Update supported-state 2026 simplified rates, sources, scope, and limitations.
- [x] Remove unsupported CPA/CFP/CFA, manual-review, and “always accurate” claims.
- [x] Use one Gain Tax Calculator brand, contact email, and publisher identity across structured data.
- [x] Rewrite Privacy and Terms to disclose analytics, future Google advertising data use, and user choices.
- [x] Add a Contact page and link Blog, About, Contact, Privacy, and Terms from the global footer.
- [x] Load analytics only after explicit permission and provide persistent, reversible Privacy choices.
- [x] Keep advertising disabled by default; load it only after configuration and compliance gates pass.

## P1: SEO, crawlability, and trust

- [x] Remove the public `/_next` resource block from `robots.txt`.
- [x] Replace deployment-time sitemap `lastmod` values with stable content dates.
- [x] Remove broken GitHub/X `sameAs` links and use a dedicated logo.
- [x] Add clickable official sources and current update/review dates to guides and articles.
- [x] Correct current-state 2025 copy and label retained historical content clearly.
- [x] Add internal links to legal pages and content hubs to remove orphan pages.
- [x] Configure `www` DNS and permanently redirect it to the bare domain through Cloudflare DNS and Vercel.

## P1: Quality and security

- [x] Correct short-term/long-term capital-loss netting and add boundary tests.
- [x] Remove the unimplemented automatic NIIT promise and disclose estimator limitations.
- [x] Upgrade Next.js and production dependencies affected by Critical/High advisories.
- [x] Extend preflight coverage for stale branding, years, legal links, robots, sitemap, and the advertising gate.
- [x] Add tests for Privacy choices, navigation, metadata, sitemap, and tax-rate data.

## Acceptance and deployment

- [x] `npm run preflight` completes without blocking errors.
- [x] `npm test` passes.
- [x] `npm run build` passes type checking and the production build.
- [x] `npm audit --omit=dev --audit-level=high` reports no unaccepted Critical/High findings.
- [x] Local production mode passes desktop/mobile browser regression for navigation, calculators, legal pages, 404 behavior, console output, and network requests.
- [x] The release branch is pushed and deployed to Vercel production at commit `2624e00`.
- [x] The canonical domain passes HTTPS, status, canonical, robots, sitemap, `ads.txt`, internal-link, mobile, and calculator regression.
- [x] Search Console accepts `https://gaintaxcalculator.com/sitemap.xml` with Success status and 21 discovered pages.
- [ ] Complete the AdSense account-level gate for account uniqueness, applicant eligibility, site ownership, Sites status, Policy Center, and publisher ID.
  - [x] The current AdSense account is active, Content ads are available, and publisher ID `pub-8638451866433811` matches the live `ads.txt`.
  - [x] Cloudflare, Vercel, and Search Console domain-control evidence is verified.
  - [x] Policy Center currently reports no issues.
  - [ ] The account owner must still confirm account uniqueness and applicant eligibility.
  - [ ] `gaintaxcalculator.com` has not been added to AdSense Sites; adding or submitting it requires explicit owner authorization.
- [ ] Enable a Google-certified CMP in AdSense/Google Privacy & Messaging and test consent, rejection, management, and withdrawal for the EEA, UK, and Switzerland.
  - [ ] The account has European and US messages for other sites, but none currently covers `gaintaxcalculator.com`.
  - [ ] Creating and publishing a message for this domain is an external AdSense configuration change that requires explicit owner authorization.
- [x] Configure `www.gaintaxcalculator.com` in DNS/hosting and confirm a single HTTPS `308` redirect to the bare domain.
