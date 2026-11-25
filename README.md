# Kaustubh Chaturvedi

Personal portfolio: https://kaus-thetaa.github.io/

Static HTML, CSS and ES modules. Serve locally with `python3 -m http.server 8000`. GitHub Pages deploys `main` from the root directory.

- `data/profile.json`: identity and integration configuration
- `data/projects.json`: curated projects
- `data/github.json`: public-only automated repository snapshot
- `data/now.json`: current-focus fallback
- `assets/journey/`: role-specific photos and videos; see `assets/journey/README.md`
- `scripts/render.py`: generates static project pages and homepage
- `scripts/sync-github.mjs`: refreshes public GitHub data
- `backend/Code.gs`: optional Google Sheet contact backend
- `DECISIONS.md`: design choices, scope and sources
- `UPDATE.md`: maintenance and Sheet connection instructions

Run the renderer after changes to curated projects and commit generated HTML. The site requires no runtime build. Contact currently uses email; the optional form appears only when its endpoint is configured.
