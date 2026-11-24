## Interactive preview checks, 24 November 2026

- Browser: signal button responds without console errors; Flight filter returns one project and All restores five.
- Timeline: five entries, thrustMIT first, marketing secondary, NCC 2022–2024 present; removed roles absent. Year navigation works.
- Both local stock WebP images loaded successfully. Sources recorded in data/media.json; this iteration remains local pending replacement.
- Visual review: desktop hero and timeline, 390px mobile hero and NCC; document width checked at 360px and 390px with no horizontal overflow.
- Generated pages checked for duplicate IDs, missing local asset paths and verification markers. JavaScript syntax and git whitespace checks passed. Changed site text passed an emoji scan.
- Reduced-motion branches and offscreen animation cancellation reviewed in code. A new Lighthouse run and full reduced-motion browser audit remain pending; historical scores below do not apply to this preview.

# Second-iteration preview verification

24 November 2026. This redesign is a local preview; the Lighthouse scores further below belong to the earlier deployed version and have not been remeasured for this design.

- Direct browser checks: project category filtering, navigation into the journey, keyboard activation of year links, and sticky year tracking from 2026 to 2025 passed.
- Visually inspected desktop hero, project gallery, desktop timeline, 390px hero and 360px timeline.
- No horizontal overflow observed at 360, 390, 768, 1024 and 1920px.
- No browser errors observed in the inspected preview.
- Static check: seven HTML pages have valid local file references, unique IDs and no unverified markers. Source scan found no emojis in HTML, CSS, JavaScript, template or data files.
- Node syntax checks passed for app.js and sculpture.js. Runtime JavaScript remains below 250KB gzipped. Only Lenis is requested for smooth scrolling; GSAP files remain vendored but unused.
- Reduced-motion paths are implemented: static sculpture, no filter or year transitions and no smooth-scroll library. A full automated reduced-motion and accessibility rerun remains pending for the redesign.
- All five project visuals are original, labelled concept studies. Real photos and application screenshots remain pending; none of these illustrations is presented as a screenshot or measured output.

## Historical first-iteration results

# First-iteration verification

24 November 2026.

## Mobile Lighthouse

Local HTTP preview, Lighthouse 13.6.0, simulated mobile/4G and 4x CPU slowdown. These are lab results, not field measurements.

- performance: 100
- accessibility: 100
- best-practices: 100
- seo: 100

- Largest Contentful Paint: 1.2 s
- Cumulative Layout Shift: 0

## Browser and accessibility

Playwright with Chromium: no horizontal overflow at 360, 390, 768, 1024, 1440 and 1920px. Project category filtering, project selection and detail navigation pass. Reduced-motion mode, skip-link access and no-JavaScript project links pass. No browser errors observed. Axe WCAG 2 A/AA and 2.1 AA checks report zero violations on the home page and ORBIT detail page. Desktop and mobile screenshots were visually inspected.

## Publication and content

Public repo created; Pages is configured for main/root. GitHub sync ran successfully in Actions, committed the public snapshot and requested a Pages rebuild. No unverified markers appear in published HTML. No secret keys are present in client configuration. Runtime JavaScript is approximately 55 KB gzipped, below the 250 KB budget.

## Integration boundary

Email contact works through a mailto link. Google Sheet and Apps Script configuration are not deployed; contact-form end-to-end delivery and live Sheet updates remain unverified. The optional implementation and instructions are included, and its form stays hidden until configured. Resume, photo, leadership dates, research status and creator metrics remain omitted pending evidence.

## Repeat

Run npm ci and npx playwright install chromium for QA tooling; serve the repo on port 8000, then npm run qa. Set CHROME_PATH if using an existing Chrome installation. Lighthouse can run with npx lighthouse http://localhost:8000/ --chrome-flags="--headless --no-sandbox". No dependencies are needed for static hosting.
