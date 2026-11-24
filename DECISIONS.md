# Instrument: decisions and first-iteration scope

## Positioning and approval
The owner confirmed Kaustubh Chaturvedi, MIT Manipal CSE (2025–2029), Manipal and kaussthetaa5@gmail.com on 24 November 2026. He delegated remaining design choices and asked for the earliest first iteration. Priority: AI/ML internships, technical depth, creative and marketing range, collaborations, creator deals. Draft copy was selected under that delegation. Project descriptions are grounded in his public READMEs; no unsupported metrics are published.

## Design brief
An editorial portfolio with the material language of instruments. Oversized left-aligned typography establishes identity; a restrained HUD carries the material concept. A machined multi-function display makes five projects inspectable. All explanatory copy sits on flat surfaces. The remaining sections are quiet, with strong spacing and rules.

Desktop: navigation / identity + HUD / current focus / filtered project selector + detail screen / about / evidence-linked skills / flight / creative work / contact.
Mobile: navigation / identity / HUD / current focus / project buttons above a single detail view / remaining sections in one column. Native scrolling and normal URLs remain available.

Tokens: panel #0B0D0E; graphite #15181A; steel #2B3034; text #DAD8CE; muted #9B9E98; live/focus #86F2A8; active #FFB020. Muted text is slightly lighter than the supplied dim token to preserve small-text readability. Spacing is based on 8px; components use 2–4px radii. The layout uses proportional columns within a shared 1360px maximum width.

## Implementation choices
- Big Shoulders Display for headlines; Geist for body/UI. Both are locally hosted variable WOFF2 fonts. The contrast is condensed industrial versus neutral, with no monospace labels.
- Hand-authored SVG for external-link marks, HUD and conceptual project diagrams. No icon library, stock imagery or generated raster art. Diagrams are not screenshots or empirical plots.
- No Three.js: the HUD is a lightweight SVG and needs no WebGL context.
- Zero runtime build: HTML, CSS and ES modules. `scripts/render.py` regenerates pages from the curated JSON and its HTML templates. Generated HTML is committed and served from main/root.
- GSAP 3.13.0, ScrollTrigger 3.13.0 and Lenis 1.3.11 are vendored. Motion libraries load after the initial render, avoiding competition with fonts on mobile. Intro is 1.6 seconds once per session, skippable and disabled for reduced motion. Filter movement uses FLIP; switching uses a short opacity transition. Lenis leaves touch native. No continuous decorative animation.
- Native same-origin View Transitions with browser fallback; no navigation interception, modifier-click changes or link delays.
- JPG social images use original typography and palette for reliable social previews. Runtime visuals use SVG. One title/description/image per project URL.
- Lowercase kebab-case URLs and files. Shared `css/tokens.css` can be reused by Zanskar without changing its content.
- No photo or resume link until supplied. No follower count, publication claim or leadership term until confirmed. EdgeGaze/EdgeWatch is omitted pending identity clarification. There is no empty research section.
- Public README status is interpreted conservatively: shipped core AI-OS and ground-station app; ORBIT, RaceLine-AI and VeilRelay remain building. Public code is evidence of implementation, not independent certification.
- RaceLine-AI has no active Pages configuration, so the first iteration links its code and does not invent a live dashboard URL.

## References opened
https://2xa.studio/ — sparse navigation and a code-led project identity; take the discipline of a single computational idea rather than filling every surface with ornament.
The accessible page supports the hierarchy/content assessment; motion was not benchmarked. Avoid its conceptual density in a recruiter-facing portfolio; make the work concrete.

https://www.niccolomiranda.com/ — editorial hierarchy, large typography and a single paper material identity; take the commitment to one material and clear project entry points.
Its page exposes a sideways project interaction; avoid requiring dragging or device rotation to access projects. No assets, layout or copy reused.

https://www.danilodemarco.com/ — a type-led designer portfolio with distinct branding, type and poster sections; take evidence-led grouping and decisive type scale.
This resolves to a visual/type designer and may not be the brief's intended reference. Motion is unverified; avoid assuming the brief's award/palette claims. Ambiguous names were not guessed.

## GitHub and data
`projects.json` owns curated narrative; `github.json` supplies public repository updates, merged by repo name. Browser traffic never reaches the GitHub API. Sync runs nightly and on push with the built-in token, paginates and explicitly excludes private repositories. An explicit Pages rebuild follows the bot commit because token-origin pushes do not reliably trigger another workflow. Existing JSON survives a failed sync.

## Google Sheet readiness and limits
The first iteration uses a working email link and local Now fallback. The form is hidden until a deployed Apps Script URL is configured. `backend/Code.gs` contains validation, a honeypot, formula-injection protection, script locking and CacheService throttling. `js/api.js` owns all browser network calls and supports a published Now CSV with a 3.5-second fallback. CSV values are rendered as text, and unsafe URL schemes are rejected.

Publish only the Now tab. Messages contains private correspondence and must never be published or shared publicly. This refines the brief's "nothing private in the Sheet" instruction: public configuration and published tab stay public; the inbox tab stays private. A public endpoint cannot be treated as a secret. CacheService throttling is best-effort; Apps Script does not expose a dependable client IP, so email-keyed and global caps are used, not IP security claims.

As checked on 24 November 2026, consumer Apps Script quotas include 6 minutes per execution, 30 simultaneous executions per user and 100 email recipients/day (optional MailApp is intentionally not enabled). Quotas can change: https://developers.google.com/apps-script/guides/services/quotas . Native Sheets integration and contact delivery are not claimed tested until an account-owned deployment exists.

## Remaining owner inputs
Resume, optional photo, actual project screenshots, EdgeGaze identity, LinkedIn pasted text/export, current Instagram figures and selected post links, exact AIESEC term and role confirmation, research/publication evidence. None blocks the initial public portfolio. No LinkedIn or Instagram scraping was performed.

## Second iteration: direction from the owner, 24 November 2026
The owner asked for a stronger 2xA-inspired visual direction, real imagery and a continuous personal timeline. Direct visual comparison showed that 2xA gives motion imagery most of the opening viewport, shifts image scale across the scroll and uses much less panel framing. The first version overemphasized the decorative HUD and left too little space for evidence of actual work.

The next composition will use oversized neutral typography, large real project media, asymmetrical editorial layouts, restrained instrument details and a continuous chronological journey. Remain dark throughout. Use the reference's visual hierarchy and pacing, not its assets, dot typeface, copy or exact layout. Portrait and actual work photos should ground the site in Kaustubh's experience. Do not create synthetic documentary images of the owner or projects.

The owner supplied a screenshot confirming AIESEC and thrustMIT roles and dates. `data/timeline.json` preserves overlapping roles, uses stated start/end months, omits the screenshot's relative durations, and does not infer a January term end. The local timeline renders semantic ordered lists with sticky years on desktop, normal flow on mobile and a static usable reduced-motion/no-JavaScript version.

Real image acquisition is pending: automatic approval review failed on the network download request because the workspace spend cap was reached. The action did not run. No alternate mechanism was used to bypass the review. Local changes remain unpublished until the image-led redesign can be completed and verified.


## Second-iteration preview implemented
The owner explicitly asked to proceed before photos arrive. The preview now replaces the old MFD with an asymmetric editorial project gallery, increases typographic scale, and replaces the cockpit hero with an original toroidal wireframe study. It follows 2xA's principles of image scale, negative space and composition changes, not its exact layout or distinctive dotted lettering. Geist is now the single primary family; the previous condensed industrial face remains in the assets but is not requested. This is an intentional change to the initial two-family direction in response to the owner's redesign request.

Five distinct CSS/SVG concept studies keep the work visually differentiated while real images are pending. Each is explicitly labelled. The hero canvas is drawn only for resize, scroll or pointer input, pauses offscreen, caps device-pixel ratio at 2 and stays static for reduced motion. No perpetual animation loop or Three.js dependency is used. Lenis loads after the first render; GSAP is no longer requested because native animations are sufficient here.

The timeline has six owner-confirmed entries, year jump links, a desktop sticky year rail, a mobile sticky compact year control and a scroll-progress line. No project launch dates were inferred from repository update timestamps. Content is fully present in static HTML without JavaScript. The home template lives in templates/home.html; scripts/render.py handles shared navigation, project pages and timeline generation.

## Interactive preview refinement, 24 November 2026

The hero now uses a projected neural network, connecting the visual language to ML. Pointer input rotates it with damping; a keyboard-accessible button sends a finite pulse through its layers. Offscreen rendering stops and reduced motion keeps a static equivalent. No Three.js dependency is needed. The visible code excerpt comes from this site's actual animation module.

Two locally hosted WebP stock photographs replace concept visuals for AI-OS and the ground station in this local preview. Credits and source/license links are recorded in data/media.json. Captions identify them as temporary stock, not the owner's project photos. The owner requested replacement before publication; do not deploy this iteration until those assets are replaced.

The timeline foregrounds thrustMIT Junior Engineer and keeps LCVP Marketing smaller and secondary. Associate and recruitment entries were removed at the owner's request. NCC Senior Cadet Officer, 2022–2024, was directly confirmed by the owner. thrustMIT links to https://www.thrustmit.in/. Copy says 'I help build rockets in my free time.' No Mach 2 claim: the documented Mach 1.8 flight refers to AgniAstra in 2024, before the owner's tenure (https://blog.mygov.in/editorial/celebrating-indias-young-innovators-who-outshined-at-spaceport-america-cup-2024/).
