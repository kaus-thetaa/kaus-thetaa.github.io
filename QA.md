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
