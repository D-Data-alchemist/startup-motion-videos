# Tiden — 17s Spec Promo (Remotion)

1920×1080 · 30fps · 450 frames + 2s studio credit · H.264 + AAC 320k · original score, −14 LUFS

An unsolicited spec piece for [tiden.ai](https://tiden.ai). It uses their wave mark, palette and Geist/DM Mono type. The demo session is the one on their homepage (rate limiting the public API, the close gate refusing an untested promise, run #11).

**Hook (contrarian):** frame 0 is the agent's claim, huge: ✓ "Tests pass." At 1s it gets struck through, then "But is it what you asked for?", and by 2.5s "1 of 3 promises has no test."

**Motion:** built with `src/components/Kinetic.tsx`, a toolkit distilled from frame-by-frame study of top launch films (Linear, Framer, Claude, Bolt, Notion, Superhuman):
- A camera follows the action with whip-and-hold moves, 3D tilt and velocity-based motion blur.
- Scenes change by zooming through with blur instead of crossfading.
- Captions are revealed word by word from masks, and cards make 3D entrances.
- Floating interface shards add depth of field, and impacts get a camera punch.

| Time | Scene | What happens |
|---|---|---|
| 0–3.6s | Hook | "Tests pass." is crossed out; three promises, one flagged red |
| 3.3–10.3s | Product | Terminal: intent captured → close gate refused → test written → 4 passed → ready for review. The Promises card goes red → green → Merge |
| 10–15s | CTA | "Intent verification for coding agents" + Start free trial |
| 15–17s | Credit | Made by Waltz_studz |

## Run

```bash
npm install
npm run studio      # preview at http://localhost:3000
npm run render      # → out/tiden-promo.mp4
npm run render:4k   # → out/tiden-promo-4k.mp4
npm run music       # regenerate public/audio/score.wav (python3 + numpy)
```

The copy lives in `src/theme.tsx` (`BRAND`). Each scene exports its beat frames, mirrored in `scripts/compose_soundtrack.py`.
