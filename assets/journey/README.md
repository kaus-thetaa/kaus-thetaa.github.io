# Journey media

Drop photos and/or MP4 videos into the folder for the matching organization and role, then run `npm run render`.

The renderer creates one folder per timeline role under `assets/journey/` (for example `thrustmit-junior-engineer/` and `aiesec-in-m-a-h-e-lcvp-marketing/`). Files are sorted by name. Use names such as `01-team.webp`, `02-workbench.jpg`, or `01-launch.mp4`.

One photo displays on its own; multiple photos become a slideshow. Existing timeline photos stay in the slideshow alongside any new folder photos. One MP4 per role is shown separately as a scroll-controlled film with no visible player controls. If more than one MP4 is present, the first filename alphabetically is used. Visitors who prefer reduced motion see the paused opening frame instead of scroll scrubbing.

Supported formats: JPG, JPEG, PNG, WebP, MP4. Use descriptive image filenames, keep videos short and compressed, and add captions or meaningful alt text to `data/timeline.json` when the auto-generated wording is not specific enough.

Useful next images: actual AI-OS search results, ORBIT hand-tracking in use, RaceLine simulation, VeilRelay before/after redaction, ground-station telemetry dashboard, and one candid marketing/team-working photograph.
