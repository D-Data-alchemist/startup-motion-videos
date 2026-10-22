# Startup Motion Videos — by Waltz_studz

Code-generated marketing videos built with [Remotion](https://www.remotion.dev/) (React). Every frame, transition and the original soundtrack are produced from code: the music is synthesized with Python/numpy, so there are no stock assets or licensing issues.

| Project | Videos | Style |
|---|---|---|
| [`hyperknow-promo/`](hyperknow-promo) | 15s promo · 68s explainer | Light SaaS UI walkthrough: course crafting, whiteboard lessons (PostgreSQL + ML), practice, marketplace |
| [`drivestream-pro-promo/`](drivestream-pro-promo) | 15s promo | Matched to drivestream.pro: library → program → 24/7 live channel |
| [`gazerank-promo/`](gazerank-promo) | 15s spec promo | Matched to gazerank.com: an AI-search hook, then a live scan with the score climbing from 72 to 89 |
| [`sellio-promo/`](sellio-promo) | 15s spec promo | Matched to sellio.chat: 3 AM message chaos → the AI agent answers with a cited source, then hands off to a human |
| [`haixing-promo/`](haixing-promo) | 3 × 45–50s brand films | CNC precision manufacturer: **"The 24-Hour Part"** demonstration film, a light reference-style edit, and a dark cinematic cut |

1080p renders are in [`showcase/`](showcase).

## Run any project

```bash
cd <project>
npm install
npm run studio     # live preview
npm run render     # 1080p MP4 → out/
npm run render:4k  # 4K MP4
```

Each project's README lists its scenes, timing and extra render commands. The soundtracks are regenerated with the `scripts/compose_*.py` files (python3 + numpy).

---

Made by **Waltz_studz**: launch videos, promos and explainers for startups and manufacturers.
