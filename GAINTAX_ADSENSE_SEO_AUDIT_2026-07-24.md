# Gain Tax Calculator — AdSense and SEO Audit

Audit date: 2026-07-24 (Asia/Shanghai)
Target: `https://gaintaxcalculator.com`
Repository: `/Users/nolan_lopez/Desktop/2026年开发/tax`
Stage: post-remediation, pre-application readiness; no rejection text supplied
Evidence mode: live + repository
SEO modes: existing-site technical + content
Mutation log: the original findings below describe the pre-change baseline; see the implementation update for completed repository changes

## 0. Post-remediation implementation update

Repository remediation was completed on 2026-07-24 and is tracked in `IMPLEMENTATION_TODO.md`.

- **Code and content readiness: pass.** The site now uses source-linked 2026 federal tables, simplified and labeled state assumptions, consistent publisher identity, updated legal/contact surfaces, stable sitemap dates, crawlable Next.js assets, expanded articles, and no unsupported professional-review claim.
- **Privacy default: pass for the current no-ad state.** Optional analytics remain off until consent. Users can accept, reject, manage, and later change analytics/advertising storage choices. No AdSense loader or ad request is present.
- **Calculator integrity: pass within the disclosed scope.** The engine rejects unsupported tax years, nets opposite-signed short-term and long-term results, applies the primary-residence exclusion before tax, and labels NIIT/state/property/crypto limitations.
- **Local verification: pass.** Preflight reported no concerns; 20 automated tests passed; the Next.js production build passed; all dependency vulnerabilities were reduced to zero; 21 sitemap routes returned `200`; the invalid-route check returned `404`; desktop and 390 px mobile browser checks passed without horizontal overflow.
- **AdSense application readiness: externally blocked.** Account uniqueness/eligibility, domain/account ownership evidence, AdSense Sites and Policy Center state, publisher-ID match, and a Google-certified CMP configuration still require the owner’s authenticated AdSense/DNS/Vercel access. Advertising must remain disabled until those gates pass.
- **Canonical fallback: externally blocked.** `www.gaintaxcalculator.com` still requires DNS/domain configuration and a verified permanent redirect to the bare canonical domain.

## 1. Original pre-change decision

- **AdSense: Not ready.** The current privacy disclosure is not AdSense-ready, no certified consent flow is implemented, publisher identity is inconsistent across live pages, and the site presents stale 2025 tax data as current in July 2026. Approval cannot be guaranteed after remediation.
- **Existing-site SEO: At risk.** The site is crawlable and technically coherent at its canonical host, but financial-content freshness, unsupported expertise claims, orphaned legal pages, blocked Next.js resources, dead entity links, and unreliable sitemap modification dates create material trust and rendering risk.
- **Traffic change: Unknown.** No dated Search Console or comparable performance export was available, so this report does not attribute traffic movement or claim keyword/cannibalization losses.
- **New-site SEO audit: Blocked before audit.** The mandatory user-supplied keyword dataset with named source, market, and language is absent. Since the domain is already live, the existing-site technical/content path is the appropriate completed scope.
- **Sitemap: Origin and URL inventory pass; Google processing is inconclusive.** The XML is public, parseable, declared in `robots.txt`, and lists 21 direct canonical `200` URLs. Search Console was not checked, and the generated `lastmod` dates are deployment timestamps rather than meaningful content updates.

Official basis: [AdSense eligibility](https://support.google.com/adsense/answer/9724?hl=en), [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en), [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en), [CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en), and [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en).

## 2. Scope and evidence

### Live evidence

- Checked the homepage, About, Privacy, Terms, blog hub and article, calculator hub and calculator detail, guide hub and guide detail, invalid URL, `robots.txt`, `sitemap.xml`, `sitemap.txt`, `ads.txt`, HTTP-to-HTTPS behavior, canonical host, `www` host, mobile navigation, rendered metadata, JSON-LD, console errors, and representative crawler user agents.
- Crawled every URL in the live sitemap and reconciled internal links.
- Live sitemap inventory: 21 total, 21 unique, 0 redirects, 0 blocked, 0 `noindex`, 0 non-`200`, 0 canonical mismatches, 0 missing routes. Privacy and Terms are the two sitemap URLs with no internal link from any sitemap page.
- `https://www.gaintaxcalculator.com/` did not resolve; the bare canonical host returned `200`.
- `ads.txt` returned a direct `200` with `google.com, pub-8638451866433811, DIRECT, f08c47fec0942fa0`. The public publisher ID could not be matched to private account evidence.
- `Mediapartners-Google`, `Google-Display-Ads-Bot`, and `Googlebot` requests to the homepage returned the same public `200`.
- No site-origin console errors were observed during the sampled live browser checks.

### Repository evidence

- Next.js 15 App Router with centralized metadata, robots, sitemap, JSON-LD, calculators, Markdown content, Vercel Analytics, and optional Google Analytics.
- `npm run preflight`: pass, with a warning that federal tax data is still 2025.
- `npm test`: 4 files and 10 calculator tests passed.
- `npm run build`: production build and type checks passed; 27 static/SSG pages generated.
- `npm audit --omit=dev --audit-level=high`: failed with 1 critical and 3 high production-package vulnerability groups (`next`, transitive `postcss`, `sharp`, and `js-yaml`).
- No Search Console, analytics, AdSense dashboard, Policy Center, CMP dashboard, traffic-source records, asset licenses, or owner/account attestations were available.

## 3. Blockers

### B1. Privacy policy is not compatible with an AdSense launch

- IDs: `ADS-PRIV-01`, `ADS-PRIV-02`, `ADS-PRIV-04`, `ADS-CX-08`, `ADS-CX-09`
- Evidence: `https://gaintaxcalculator.com/privacy` and `src/content/privacy-content.ts` do not disclose Google advertising data use, third-party cookies, web beacons, IP addresses, personalized/non-personalized ads, consent choices, or withdrawal. The page instead says “Capital Gains Navigator does not … embed ad-tech trackers.” No certified CMP or advertising-consent control exists in source or the sampled live DOM.
- Basis: Google requires a privacy policy covering data collection and technologies caused by Google products. A Google-certified TCF CMP is required for personalized ads in the EEA, UK, and Switzerland.
- Exact fix: rewrite the policy for Gain Tax Calculator; disclose Vercel Analytics and any enabled GA/AdSense processing; link Google’s partner-data explanation; implement a certified CMP; block applicable ad requests until consent; provide persistent “privacy choices” and revocation.
- Acceptance: clean EEA/UK/Swiss sessions expose accept, reject, and manage options; no disallowed personalized request precedes consent; withdrawal changes subsequent requests; the footer links the updated policy on every page.

### B2. Publisher identity and expertise representations are inconsistent

- IDs: `ADS-PUB-05`, `ADS-PUB-09`, `ADS-CX-03`
- Evidence:
  - Privacy and Terms repeatedly name the retired “Capital Gains Navigator” brand and `support@capitalgainsnavigator.com`.
  - The footer links `feedback@capitalgainsnavigator.com`.
  - The Organization JSON-LD links a GitHub organization and X/Twitter account that both returned `404` during the audit.
  - The homepage says “CPA-reviewed formulas,” “vetted by a network of credentialed tax professionals,” and “current IRS publications”; About says CPAs review every release. The repository provides names and credential suffixes but no biographies, license jurisdiction/number, profile URLs, review records, or dated approvals.
- Exact fix: use one legal/publisher identity and working contact set everywhere; remove dead `sameAs` values; publish verifiable author/reviewer bios and review records, or remove/qualify the credential and review claims.
- Acceptance: every page, structured-data entity, account declaration, contact endpoint, and public profile agrees; each material professional-review claim has retained evidence and a reachable public explanation.

### B3. “Current” financial guidance is demonstrably stale

- IDs: `ADS-CONTENT-03`, `ADS-PUB-05`, `ADS-CX-03`
- Evidence: the live homepage says “Accurate 2025 rates,” “current IRS publications,” and “CPA-reviewed” in July 2026. Calculator logic imports `federal-2025.ts` and `state-2025.ts`; the preflight check warns that the federal data year is stale. All four guide review deadlines expired in 2025, and two of four blog review deadlines expired in 2025.
- Exact fix: validate and implement the current tax year from authoritative IRS/state sources; update dates, examples, explanatory copy, metadata, tests, and source links; retain historical pages only when clearly labeled historical.
- Acceptance: current-year data is source-linked and independently reviewed; all automated tests pass; live pages state the exact tax year without claiming broader currency; each review date is future-facing and supportable.

### B4. Required owner/account evidence is unavailable

- IDs: `ADS-ELIG-01`, `ADS-ELIG-02`, `ADS-OWN-02`, `ADS-SITE-01`, `ADS-CX-11`
- Evidence gap: applicant age/entity, duplicate-account status, domain control, AdSense Sites state, account standing, Policy Center, payments profile, sanctions/location, and public `ads.txt` publisher-ID match cannot be established from the live site or repository.
- Exact fix: assemble dated private screenshots/exports or an owner attestation covering each item before applying.
- Acceptance: one eligible applicant/entity controls the domain and HTML; the correct site is added and verified; account/Sites/Policy Center states are clear; publisher ID exactly matches `ads.txt`.

## 4. High risks

### H1. Thin and overdue content weakens whole-site value

- IDs: `ADS-CONTENT-03`, `ADS-CONTENT-04`
- Evidence: the blog has four articles of approximately 229–314 body words, displayed as two-minute reads. All principal guides use 2025 data, and the source labels are plain text rather than links to the cited materials.
- Action: update or consolidate pages around distinct user outcomes; add worked examples, limitations, authoritative source links, current review dates, and verifiable authorship.
- Acceptance: every indexable article/guide has a distinct purpose, current facts, linked evidence, useful original analysis, and a completed editorial review.

### H2. Legal/trust pages are orphaned and there is no Contact route

- IDs: `ADS-UX-02`, `ADS-UX-05`
- Evidence: `/privacy` and `/terms` are in the sitemap but absent from header, footer, and internal page links. `/contact` returns `404`. The blog hub is also absent from primary navigation.
- Action: add persistent footer links to Privacy, Terms, About, Contact, and Blog; create a real Contact page or make About the clearly labeled contact surface.
- Acceptance: a fresh crawl reaches each trust surface from every template without relying on the sitemap.

### H3. Robots blocks all `/_next` resources

- IDs: `ADS-CRAWL-02` (caveat), SEO technical
- Evidence: `src/config/seo.ts` emits `Disallow: /_next` for `User-agent: *`. The raw HTML contains the main text, but calculators and layout behavior depend on these scripts. Google advises against blocking resources when their absence makes a page harder to understand.
- Action: remove the blanket `/_next` disallow; block only genuinely private/unnecessary paths.
- Acceptance: `robots.txt` allows public Next.js CSS/JS assets; Google’s rendered test and a clean browser show the same essential content and interactions.

### H4. Canonical host fallback is incomplete

- ID: `ADS-CX-01`
- Evidence: HTTP bare-domain traffic redirects once to HTTPS, but `www.gaintaxcalculator.com` has no DNS resolution and therefore cannot redirect to the canonical host.
- Action: add `www` DNS and a single permanent redirect to `https://gaintaxcalculator.com`.
- Acceptance: HTTP/HTTPS and `www`/bare variants converge in one hop to the canonical URL with no loop.

### H5. No default-deny advertising eligibility or placement QA

- IDs: `ADS-CX-07`, `ADS-CX-13`
- Evidence: `ads.txt` exists, but no AdSense loader, page eligibility allowlist, route gate, placement inventory, or preview QA evidence exists. Legal, error, utility, and thin routes would have no explicit protection if a global loader were added.
- Action: implement ads only after policy fixes, with an allowlist for substantial reviewed content and explicit denial for legal, error, low-value, unreviewed, and utility-only states.
- Acceptance: desktop/mobile AdSense preview confirms allowed templates only, clear ad distinction, no overlap, safe content-to-ad ratio, and no accidental-click risk.

### H6. Production dependencies have current critical/high advisories

- Evidence: `npm audit --omit=dev --audit-level=high` reports one critical and three high vulnerability groups, including the installed Next.js 15.5.4.
- Action: plan a compatible framework/dependency upgrade, review current advisories, rerun all tests/build, and regression-test redirects, metadata, image handling, and Server Components.
- Acceptance: production audit has no unresolved critical/high finding or each exception is formally risk-accepted with applicability evidence.

## 5. Medium risks

### M1. Sitemap modification dates are deployment dates

- Evidence: `app/sitemap.ts` assigns `new Date()` to all static, calculator, and guide entries. The live file consequently gives 17 pages the same `2026-01-09T07:54:15.003Z` value, unrelated to their visible 2025 update/review dates.
- Action: use a stable content/config revision date or omit `lastmod` when no meaningful source exists. `priority` and `changefreq` may also be omitted because Google ignores them.
- Acceptance: repeat builds without content changes leave `lastmod` unchanged; an actual material update changes only affected URLs.

### M2. Entity links and copyright are stale

- Evidence: both public social URLs return `404`, yet they are emitted as Organization `sameAs`; the footer copyright remains 2025.
- Action: remove unauthenticated/dead profiles, retain only real equivalents, and update the copyright behavior.
- Acceptance: all `sameAs` and footer links return the intended public identity without redirecting to an unrelated account.

### M3. Metadata is mostly sound but some snippets are overlong

- Evidence: every sitemap page has one title, description, canonical, and H1; JSON-LD parsed successfully. The homepage, calculator hub, real-estate calculator, crypto calculator, and tax-rate descriptions are roughly 165–186 characters.
- Action: rewrite for clarity and likely display truncation only after current-year content and intent are resolved.
- Acceptance: page titles/descriptions are distinct, truthful, concise, and match visible content.

## 6. Upstream AdSense checklist — 73 IDs

Status values are exactly `Pass`, `Fail`, `Unknown`, or `N/A`.

| ID | Status | Evidence | Next action / acceptance |
|---|---|---|---|
| ADS-ELIG-01 | Unknown | Applicant age/account holder not available. | Confirm eligible adult/entity; accept dated owner attestation. |
| ADS-ELIG-02 | Unknown | Existing or duplicate AdSense accounts not available. | Confirm one publisher account or documented separate legal entity. |
| ADS-ELIG-03 | Fail | Privacy, identity, freshness, and consent failures below. | Resolve every Blocker and retest all 73 IDs. |
| ADS-ELIG-04 | N/A | Normal independently hosted Next.js site, not Blogger/YouTube/host partner. | None. |
| ADS-OWN-01 | Pass | Repository controls `app/layout.tsx` and can inject `<head>` code. | Preserve controlled deployment path. |
| ADS-OWN-02 | Unknown | Repo/live match suggests control but domain ownership was not proven. | Provide registrar/DNS/deployment control evidence. |
| ADS-OWN-03 | Pass | Public Next.js pages render and JavaScript UI loads. | Retest after ad/CMP integration. |
| ADS-SITE-01 | Unknown | AdSense Sites status and review state unavailable. | Add/verify site only after fixes; accept dated dashboard evidence. |
| ADS-SITE-02 | Pass | Root `ads.txt` is deployable and repository head injection is available. | Use the exact account-provided verification method. |
| ADS-TXT-01 | Unknown | Valid public Google seller row exists; private account-ID match unavailable. | Match `pub-8638451866433811` to the active account. |
| ADS-TXT-02 | Pass | `/ads.txt` returns direct `200 text/plain; charset=utf-8`. | Keep root delivery stable. |
| ADS-CONTENT-01 | Pass | Original calculators, guides, and articles provide visitor value. | Keep evidence and update the tax year. |
| ADS-CONTENT-02 | Pass | No scraped/embedded/affiliate-feed inventory observed; calculators add original utility. | Retain content provenance/editorial records. |
| ADS-CONTENT-03 | Fail | Four 229–314-word posts; all principal guides overdue and 2025-based. | Expand/update or consolidate; accept completed editorial review. |
| ADS-CONTENT-04 | Pass | Site is live, complete-looking, and not built around visible ads. | Keep broken/placeholder states out of the index. |
| ADS-CONTENT-05 | Pass | No ads, affiliate blocks, or sponsored listings observed. | Recheck after placements exist. |
| ADS-CONTENT-06 | Pass | Primary language is supported English. | Maintain `lang="en"` and English content. |
| ADS-CONTENT-07 | N/A | No comments or UGC surface exists. | Reevaluate if UGC is added. |
| ADS-CONTENT-08 | Pass | No doorway/location-scaled pages or material keyword stuffing observed. | Avoid near-duplicate calculator variants. |
| ADS-UX-01 | Pass | Desktop navigation is clear; mobile menu opened correctly with no horizontal overflow. | Retest all breakpoints after fixes. |
| ADS-UX-02 | Fail | Privacy/Terms are orphaned; Blog is absent from primary navigation. | Link trust/content hubs globally; accept crawl reachability. |
| ADS-UX-03 | Pass | No fake controls, irrelevant redirect, or nonexistent linked content observed. | Keep redirect tests. |
| ADS-UX-04 | Pass | No malware, forced download, popunder, or unexpected redirect observed. | Recheck third-party ad/CMP scripts. |
| ADS-UX-05 | Fail | Legal pages use old brand/email; no Contact route; trust claims unsupported. | Replace copy, add trust navigation and contact surface. |
| ADS-UX-06 | Pass | No ad-like placeholders or confusing ad/content separation observed. | Recheck with preview placements. |
| ADS-CRAWL-01 | Pass | Homepage and all 21 sitemap URLs returned direct public `200`; invalid URL returned `404`. | Monitor uptime after releases. |
| ADS-CRAWL-02 | Pass | Pages are public; crawler-like UAs returned `200`; no login/WAF block observed. `/_next` block remains a high rendering caveat. | Allow public resources and retest crawler rendering. |
| ADS-CRAWL-03 | Pass | Key content is GET-accessible; calculators do not require POST to render their pages. | Keep ad-bearing content reachable without submitted state. |
| ADS-CRAWL-04 | Pass | Canonical pages are direct; HTTP uses one HTTPS redirect. | Add one-hop `www` redirect. |
| ADS-CRAWL-05 | Pass | Stable path URLs and deterministic canonicals; no session IDs. | Preserve URL contracts. |
| ADS-CRAWL-06 | Pass | Canonical bare host has valid TLS and stable Vercel `200`; `www` is handled under `ADS-CX-01`. | Monitor DNS/TLS and add `www` fallback. |
| ADS-CRAWL-07 | Pass | Sitemap and crawlable hubs expose all content routes; legal pages need internal links. | Link legal pages and monitor Search Console. |
| ADS-PROG-01 | Unknown | Self-click/invalid-impression procedure and traffic logs unavailable. | Document no-self-click policy and anomaly review. |
| ADS-PROG-02 | Pass | No copy asking users to click/view ads. | Recheck placement labels and nearby CTAs. |
| ADS-PROG-03 | N/A | No live Google ads or labels. | Validate neutral labels before launch. |
| ADS-PROG-04 | Unknown | Paid, referral, email, bot, and exchange traffic records unavailable. | Review sources and accept only legitimate documented traffic. |
| ADS-PROG-05 | N/A | No AdSense code or wrapper exists. | Use unmodified supported code. |
| ADS-PROG-06 | N/A | No Google ads are placed in prohibited contexts. | Apply route allowlist before adding code. |
| ADS-PROG-07 | N/A | Standard website, not an app WebView. | Reevaluate if embedded in an app. |
| ADS-PUB-01 | Pass | No illegal content/activity promotion observed in sampled/inventoried pages. | Maintain editorial review. |
| ADS-PUB-02 | Unknown | No infringement observed, but image/template/font licenses were not supplied. | Retain provenance/licenses for all assets. |
| ADS-PUB-03 | Pass | No hate, harassment, self-harm, extremist, or violent-praise content observed. | Reevaluate new inventory. |
| ADS-PUB-04 | N/A | No animal-cruelty or endangered-species content. | Reevaluate if topic changes. |
| ADS-PUB-05 | Fail | Old brand/emails, dead entity profiles, unsupported professional-review/current claims. | Normalize identity and substantiate or remove claims. |
| ADS-PUB-06 | Pass | No phishing, personal-data theft, or get-rich offer observed. | Keep forms limited to calculator inputs. |
| ADS-PUB-07 | N/A | No hacking, cheating, fake-document, tracking, or evasion content. | Reevaluate new tools. |
| ADS-PUB-08 | N/A | No sexual-services, adult-family, or exploitation content. | Reevaluate new inventory/UGC. |
| ADS-PUB-09 | Fail | Public site identity is inconsistent; account-to-ads.txt accuracy is unverified. | Make declarations consistent and match private account evidence. |
| ADS-PUB-10 | N/A | No ads are present to overlap or trap interaction. | Placement QA before launch. |
| ADS-PUB-11 | Unknown | No ad placement plan or reviewed page eligibility list exists; several pages are thin/utility/legal. | Create default-deny allowlist and preview every eligible template. |
| ADS-PUB-12 | N/A | No background/off-screen ad placement exists. | Recheck responsive preview. |
| ADS-PUB-13 | N/A | No election, harmful-health, or climate-consensus content. | Reevaluate if scope changes. |
| ADS-PUB-14 | N/A | No political/public-concern manipulated media observed. | Retain media provenance. |
| ADS-PUB-15 | N/A | No child/sexual-exploitation content or UGC. | Immediate escalation if any future signal appears. |
| ADS-PUB-16 | N/A | No crisis/sensitive-event content. | Exclude such pages from ads if introduced. |
| ADS-REST-01 | N/A | No sexual/reproductive restricted inventory. | Reevaluate new content. |
| ADS-REST-02 | N/A | No shocking/graphic/obscene inventory. | Reevaluate new content. |
| ADS-REST-03 | N/A | No weapons/explosives inventory. | Reevaluate new content. |
| ADS-REST-04 | N/A | No tobacco/recreational-drug inventory. | Reevaluate new content. |
| ADS-REST-05 | N/A | No alcohol sales/irresponsible-use inventory. | Reevaluate new content. |
| ADS-REST-06 | N/A | No gambling/paid games of chance. | Reevaluate new tools. |
| ADS-REST-07 | N/A | No prescription-drug/pharmacy/unapproved supplement inventory. | Reevaluate new content. |
| ADS-REST-08 | N/A | No ads or video inventory to obstruct. | Placement QA before launch. |
| ADS-PRIV-01 | Fail | `/privacy` omits Google/Vercel/optional GA data practices and uses the wrong publisher name. | Publish accurate comprehensive policy; accept network/copy audit. |
| ADS-PRIV-02 | Fail | No third-party cookie, web beacon, IP-address, or ad-serving disclosure. | Add Google-required disclosure and partner-data link. |
| ADS-PRIV-03 | Unknown | No live ad requests; future query/data-layer handling not implemented. | Verify no PII in URLs, data layer, or ad requests. |
| ADS-PRIV-04 | Fail | No certified CMP or regional consent behavior exists. | Implement and test certified CMP before applicable ad serving. |
| ADS-PRIV-05 | N/A | Site does not request or claim precise location data. | Reevaluate if geolocation is added. |
| ADS-PRIV-06 | N/A | Site is not directed to children. | Keep audience designation accurate. |
| ADS-PRIV-07 | N/A | No custom Google-cookie manipulation exists. | Retest after ad integration. |
| ADS-PRIV-08 | Unknown | Personalized-ad/audience configuration unavailable; tax site may process sensitive financial context. | Disable sensitive audiences and review every event/list before launch. |
| ADS-PRIV-09 | N/A | Site is not advertising/retargeting housing, employment, or credit offers. | Reevaluate if business model changes. |
| ADS-PRIV-10 | Unknown | Personalized ads and audience-data rights/controls are not configured. | Document lawful basis, disclosures, CMP, and ad controls. |

## 7. Codex supplemental checklist — 13 IDs

| ID | Status | Basis | Evidence | Next action / acceptance |
|---|---|---|---|---|
| ADS-CX-01 | Fail | Readiness | Canonicals/404 pass; `www` does not resolve; sitemap `lastmod` is deployment-derived. | Add `www` redirect and stable dates; accept all variant/template tests. |
| ADS-CX-02 | Unknown | Readiness | Forms render without overflow; mobile menu works; 10 logic tests pass. Every live calculator interaction was not completed on desktop and mobile. | Exercise each form, errors, output, reset, console, network, and responsive state. |
| ADS-CX-03 | Fail | Official | 2025 logic marketed as current in 2026; expired reviews; professional claims lack verifiable records. | Update facts and retain claim/reviewer evidence. |
| ADS-CX-04 | Unknown | Official | Hero/blog images, fonts, template, trademarks, and copy lack supplied provenance/licenses. | Produce an asset register; accept license/creation evidence for every asset. |
| ADS-CX-05 | N/A | Official | Only English is published; no localized routes or hreflang. | Reevaluate before localization. |
| ADS-CX-06 | Unknown | Official | No scaled publishing pipeline was found, but human editorial/provenance records were not supplied. | Document creation, fact-check, and human approval for every article/guide. |
| ADS-CX-07 | Fail | Readiness | No reviewed advertising allowlist/default-deny gate exists. | Implement route/content-state eligibility before any global loader. |
| ADS-CX-08 | Fail | Official | No Google-certified TCF CMP or regional message exists. | Implement certified CMP and verify TC string/request timing. |
| ADS-CX-09 | Fail | Official | No persistent advertising-consent revisit/revoke control exists. | Add privacy choices and prove post-withdrawal request changes. |
| ADS-CX-10 | Fail | Readiness | Vercel Analytics loads unconditionally; optional GA code has no consent/withdrawal/cleanup layer. | Implement intentional analytics choices and revocation tests. |
| ADS-CX-11 | Unknown | Official | Profile, payment, sanctions, account, Sites, and Policy Center evidence unavailable. | Supply dated private account evidence with exact publisher/site match. |
| ADS-CX-12 | Unknown | Official | Traffic sources, anomaly review, and invalid-traffic procedure unavailable. | Document source review, bot controls, and no-self-click procedure. |
| ADS-CX-13 | N/A | Official | No live or proposed ad units/placements were found. | Reevaluate when a placement plan exists; use preview/test facilities only. |

## 8. Sitemap evidence matrix

| Sitemap | Evidence layer | Result | Evidence |
|---|---|---|---|
| `https://gaintaxcalculator.com/sitemap.xml` | Origin delivery | Pass | Direct `200`, `application/xml`, 3,830 bytes, UTF-8 declaration, public Vercel cache. |
| Same | Format validity | Pass with reliability finding | `xmllint` parses; correct `urlset` namespace/root; 21 URL entries. `lastmod` values are syntactically valid but not meaningful for 17 generated entries. |
| Same | URL quality | Pass | 21 total/unique; 21 direct `200`; 0 redirects, blocked, `noindex`, canonical mismatch, duplicate, or missing routes. |
| Same | Discovery | Pass | Declared exactly in public `robots.txt`; declaration resolves. |
| Same | Google processing | Inconclusive | Search Console submitted URL, type, last read, status, and discovered count were not checked. |
| `https://gaintaxcalculator.com/sitemap.txt` | Origin delivery | N/A | Returns `404`, is not declared, and is not required while XML works. |

Search Console state: **Not checked**.
Sitemap mutation log: **None**.

## 9. Existing-site SEO report

### Evidence-quality summary

- Technical/content observations are high-confidence because live production and repository agree.
- Search performance, query demand, CTR, ranking loss, market/device segmentation, AI visibility, referrals, and conversions are all **Unknown**.
- No GEO/AEO audit was requested; no crawler permission or structured data result is treated as proof of AI retrieval/citation.

### Technical findings

| Severity | Affected surface | Observed evidence | Recommendation | Acceptance / monitoring |
|---|---|---|---|---|
| High | `robots.txt`, `src/config/seo.ts` | `/_next` blocked for all crawlers. | Allow essential CSS/JS resources. | Render test matches user browser immediately; monitor crawl errors 2–4 weeks. |
| High | `www` host | DNS resolution fails. | Add DNS and one-hop permanent canonical redirect. | Four host/scheme variants converge; monitor server errors 7 days. |
| High | Privacy/Terms/footer | Two legal pages are orphaned and internally inconsistent. | Rewrite and globally link them. | Crawler reaches both from every template immediately. |
| High | Financial templates/content | Current-year claims conflict with 2025 logic and expired review dates. | Update facts, review, sources, and dates. | Tests/build pass; monitor Search Console 4–8 weeks without causal claims. |
| High | Dependencies | Current production audit has critical/high advisories. | Upgrade through a tested compatibility plan. | No unresolved critical/high production audit finding. |
| Medium | `app/sitemap.ts` | Generated `lastmod` uses build time. | Use stable meaningful dates or omit. | Unchanged rebuild produces unchanged sitemap. |
| Medium | Organization JSON-LD | Both `sameAs` destinations return `404`; logo points to an OG image rather than a dedicated logo. | Use only authentic reachable identity URLs and correct logo asset. | JSON-LD parses and every URL resolves to the represented entity. |
| Medium | Metadata | Complete/unique, but several descriptions are 165–186 characters. | Tighten only after page intent/content is updated. | Truthful unique snippets aligned to visible content. |

### Query and page opportunities

No evidence-backed query opportunity or traffic-recovery estimate can be produced without Search Console or a named keyword dataset.

| Type | Status | Evidence needed |
|---|---|---|
| `/calculator/capital-gains` vs `/calculator/capital-gains-estimate` intent overlap | Hypothesis | GSC query/page exports for equal periods; landing-page engagement/conversion definitions. |
| Current-year “capital gains tax rate” support | Observed content gap, demand unknown | Update verified current-year data first; use GSC/keyword evidence to decide URL and title strategy. |
| State-specific calculator/content expansion | Unknown | Named market/keyword research plus current state-law maintenance capacity. Do not generate doorway pages. |

### Page action matrix

| URL(s) | Action | Reason and acceptance |
|---|---|---|
| `/` | Update | Replace 2025/current/CPA claims, link legal/blog surfaces; accept truthful current-year live copy. |
| `/calculator` | Update | Clarify distinct tool outcomes and current year; keep as hub. |
| `/calculator/capital-gains` | Update | Current-year engine/source review; keep multi-transaction purpose distinct. |
| `/calculator/capital-gains-estimate` | Update | Current-year engine; explicitly position as single-sale quick estimate; do not merge without query evidence. |
| `/calculator/real-estate-capital-gains` | Update | Validate exclusions/recapture/state assumptions and sources. |
| `/calculator/crypto-tax` | Update | Validate current reporting/tax treatment and source links. |
| `/calculator/scenario-planner` | Update | Validate dates/rates and explain assumptions/limitations. |
| `/guide` | Keep + update | Retain hub; show current review status and link Blog. |
| `/guide/capital-gains-tax-basics` | Update | Review deadline expired; update year and link official sources. |
| `/guide/real-estate-capital-gains` | Update | Review deadline expired; validate current federal/state rules. |
| `/guide/crypto-tax` | Update | Review deadline expired; update reporting guidance and official sources. |
| `/guide/tax-planning-scenarios` | Update | Review deadline expired; revalidate examples/calculations. |
| `/tax-rate` | Urgent update | 2025 table is stale for the site’s current-facing value proposition. |
| `/blog` | Keep + update | Add global navigation/internal links and current editorial explanation. |
| `/blog/2025-federal-capital-gains-update` | Keep historical + update | Preserve explicit 2025 scope; add reviewed historical note and current-year path when supported. |
| `/blog/california-vs-texas-capital-gains` | Update | Review expired; validate current state treatment and scenario inputs. |
| `/blog/tax-loss-harvesting-playbook` | Update | Refresh from Q4 2025 when a current reviewed version is ready. |
| `/blog/sell-in-december-or-january` | Update | Revalidate year-specific examples before Q4 2026. |
| `/about` | Revise | Normalize identity and substantiate team/credential/review claims. |
| `/privacy` | Revise | AdSense/analytics/CMP disclosure, correct brand/contact, global footer link. |
| `/terms` | Revise | Correct publisher/brand/contact and current legal terms; global footer link. |

### Unknowns and competing explanations

- Search demand, seasonality, SERP changes, rankings, CTR, index coverage, manual actions, and link equity were not supplied.
- No traffic decline was alleged. If one exists, equal-length GSC exports segmented by query, page, country, device, and search appearance are required before diagnosing causation.
- No page removal, mass redirect, or merge should be performed solely from this audit.

## 10. New-site intake gate

Status: **Blocked before audit**

Missing required input:

- User-supplied keyword research with a named source, target market, and language.

Accepted evidence:

- CSV/TSV/JSON/spreadsheet export from Semrush, Ahrefs, Google Keyword Planner, or another named provider.
- Documented manual SERP research.
- A newline list accompanied by dataset-level source, country/region, and language.

No new-site keyword clustering, keyword-to-URL mapping, or demand conclusion was produced because the required research evidence is incomplete.

## 11. Ordered remediation

1. **Blocker — establish truth and currency:** verify the publisher/team/credentials and update all tax data, sources, examples, review dates, and claims to the intended current year.
2. **Blocker — repair legal/privacy:** rewrite Privacy and Terms for the actual publisher; disclose current analytics and planned Google advertising; globally link Privacy, Terms, About, Contact, and Blog.
3. **Blocker — implement consent:** select a Google-certified CMP, define personalized/non-personalized/limited-ad policy by region, implement consent and withdrawal, and test request timing.
4. **Blocker — collect private evidence:** validate applicant eligibility, domain control, account uniqueness/standing, publisher ID, Sites state, and Policy Center.
5. **High — gate advertising:** default-deny routes and allow only substantial reviewed content; keep legal, errors, thin content, and unreviewed utilities ineligible.
6. **High — fix crawl/rendering:** allow necessary `/_next` resources and add the `www` canonical redirect.
7. **High — update dependencies:** upgrade Next.js and affected production dependencies with full regression testing.
8. **Medium — repair sitemap signals:** replace deployment-time `lastmod`, then verify Search Console processing without repeatedly resubmitting.
9. **Medium — improve content depth/trust:** add authoritative source links, verified bios, limitations, methodology, and differentiated examples.
10. **Apply only after retest:** do not submit the AdSense application until all confirmed Blockers are closed and High risks are fixed or explicitly accepted.

## 12. Retest plan and completeness check

### Retest

- Re-run the live + repository audit on homepage, every legal/trust page, every calculator, hubs, articles/guides, invalid URL, robots, sitemap, ads.txt, and all host/scheme variants.
- Exercise every distinct calculator/CTA/error/reset path on desktop and mobile; check console/network and overflow.
- Test clean regional sessions for CMP accept/reject/manage/revoke and verify request behavior.
- Parse all JSON-LD and compare its identity, dates, reviewer/author, sources, and claims to visible content.
- Run preflight, all tests, production build, and production dependency audit.
- Check Search Console sitemap status and index coverage read-only after deployment; allow a meaningful 2–4 week crawl window.
- For performance conclusions, compare equal-length GSC periods and monitor 4–8 weeks, preserving country, device, search type, and annotations.

### Completeness

- Upstream requirement IDs in source catalog: **73**
- Unique upstream IDs in this report: **73**
- Missing upstream IDs: **none**
- Duplicate upstream checklist rows: **none**
- Supplemental IDs in source catalog: **13**
- Unique supplemental IDs in this report: **13**
- Missing supplemental IDs: **none**
- Duplicate supplemental checklist rows: **none**
