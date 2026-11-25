# Update my site

When the owner says "update my site", inspect public GitHub repositories first. Then ask at most these five questions in one batch, skipping anything already answered:

1. What changed?
2. Why does it matter, and is there a sourced result?
3. Is it shipping, building or paused?
4. What public link should readers use?
5. Is there a screenshot or diagram to add?

Edit `data/projects.json` for curated project copy. Set `confirmed` only after verifying the owner's statement or public repository evidence. Do not publish `[verify]` text or private repository names. Run `python3 scripts/render.py` after curated changes; check the HTML diff because homepage editorial copy is in templates/home.html. For Now updates use the owner's Now tab once configured, otherwise `data/now.json`.

Run `node scripts/sync-github.mjs` to refresh public repository metadata. Do not copy credentials into files. `GITHUB_TOKEN` is optional locally and supplied by Actions.

Add original media in WebP or AVIF with dimensions and descriptive alt text. Diagram labels must distinguish conceptual illustrations from measured results. Keep project descriptions and social metadata aligned; regenerate social images when titles change.

Show the actual diff, verify links, mobile layout, keyboard navigation, reduced motion and absence of emojis/unverified content. Commit and push to main when the owner's update instruction authorizes publication. Never send announcements or messages to other people unless separately instructed.

## Google Sheet setup

1. Create a private Google Sheet with `Messages` and `Now` tabs. In its bound Apps Script project paste `backend/Code.gs`, run `setup` and authorize it.
2. Deploy as a web app executing as the owner with access for anyone. Put its `/exec` URL in `data/profile.json` under `contactEndpoint`.
3. Add `title,status,link,updated` headers and rows to Now. Publish only that tab as CSV. Put the published CSV URL in `nowCsvUrl`. Do not publish Messages or the entire spreadsheet.
4. Test a real contact submission from the deployed site, verify the inbox row, then test bad email, overlong message, honeypot and repeat submissions. The UI reports success only from a readable `{ok:true}` response. Verify CORS from the actual Pages origin; never use opaque `no-cors` success.
5. Change a Now row on the phone and verify the published site after Google's publishing cache updates. Disconnect the network and verify fallback content. Keep email available if the service is down.

## Local preview

Run `python3 -m http.server 8000` from the repository root. Open http://localhost:8000 . Deployment uses GitHub Pages from `main`, root. No package installation or bundler is needed to serve the site.

## Timeline updates
Edit data/timeline.json using confirmed month/year dates. Preserve overlapping roles. Use null for a current role only when confirmed. Run python3 scripts/render.py to regenerate the timeline and project pages.

## Personal photographs
Selected owner photographs are stored in assets/photos; attribution and dimensions are in data/media.json. Journey photo placement and NCC title are controlled by data/timeline.json. The homepage template is templates/home.html; rebuild using npm run render.
