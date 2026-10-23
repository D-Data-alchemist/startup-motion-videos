# Startup Motion Videos — by Waltz_studz

Code-generated marketing videos built with [Remotion](https://www.remotion.dev/) (React). Every frame, transition and the original soundtrack are produced from code: the music is synthesized with Python/numpy, so there are no stock assets or licensing issues.

| Project | Videos | Style |
|---|---|---|
| [`hyperknow-promo/`](hyperknow-promo) | 15s promo · 68s explainer | Light SaaS UI walkthrough: course crafting, whiteboard lessons (PostgreSQL + ML), practice, marketplace |
| [`drivestream-pro-promo/`](drivestream-pro-promo) | 15s promo | Matched to drivestream.pro: library → program → 24/7 live channel |
| [`gazerank-promo/`](gazerank-promo) | 15s spec promo | Matched to gazerank.com: an AI-search hook, then a live scan with the score climbing from 72 to 89 |
| [`sellio-promo/`](sellio-promo) | 15s spec promo | Matched to sellio.chat: 3 AM message chaos → the AI agent answers with a cited source, then hands off to a human |
| [`talanoa-promo/`](talanoa-promo) | 15s spec promo | Matched to talanoa.email: a cluttered email thread dissolves into chat bubbles, then email → Todo and local-only privacy |
| [`signwith-promo/`](signwith-promo) | 15s spec promo | Matched to signwith.co: months of subscription charges vs. 6 docs signed, then upload → sign on a phone → pay per doc |
| [`pasta-promo/`](pasta-promo) | 15s spec promo | Matched to pppasta.com: phone-between-sets hook → "Thirty minutes, upper body, dumbbells only." → hands-free Dynamic Island coaching |
| [`navige-promo/`](navige-promo) | 15s spec promo | Matched to navige.ai: a runaway agent-spend counter → routing, caching and loop guards cut the bill, same output |
| [`inferock-promo/`](inferock-promo) | 15s spec promo | Matched to inferock.ai: "Your LLM call failed. Who pays?" → per-call receipts and service credits for eligible failures |
| [`emochi-promo/`](emochi-promo) | 15s spec promo | Matched to Emochi by Kente Labs: blank-page hook → voice journal, editable transcript, and Mochi changing shape and colour with your day |
| [`pomerado-promo/`](pomerado-promo) | 15s spec promo | Matched to pomerado.ai: their benchmark as a split-screen race ("$41.01 vs 3¢") → website-to-tool, self-healing integrations |
| [`tiden-promo/`](tiden-promo) | 15s spec promo | Matched to tiden.ai: "Tests pass." gets struck through → captured intent, a refused close gate, every promise proven |
| [`walkai-promo/`](walkai-promo) | 15s spec promo | Matched to walkai-talkai.com: "Fix bugs with a walkie-talkie." → the full radio loop, with the real VOX tones and roger beep |
| [`beam-promo/`](beam-promo) | 15s spec promo | Matched to beam.win: a window flies from a Mac mini to a MacBook → Dock icon, ⌘Tab, several Macs at once |
| [`haixing-promo/`](haixing-promo) | 3 × 45–50s brand films | CNC precision manufacturer: **"The 24-Hour Part"** demonstration film, a light reference-style edit, and a dark cinematic cut |

1080p renders are in [`showcase/`](showcase). Studio logo: [`brand/`](brand).

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
