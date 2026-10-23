# Pomerado — 17s Spec Promo (Remotion)

1920×1080 · 30fps · 450 frames + 2s studio credit · H.264 + AAC 320k · original score, −14 LUFS

An unsolicited spec piece for [pomerado.ai](https://pomerado.ai). It uses their colours, logo and type, and every number comes from their own site: the published benchmark (8m16s for 3¢ vs 21m22s and $41.01), the self-healing Anthem example and the Coupa integration.

**Hook (stat + split screen):** frame 0 is already a finished poster: "$41.01 vs 3¢" over two racing lanes. Pomerado's lane finishes at 1.3s, the browser agent's at 2.7s, then "No browser. Just an API."

| Time | Scene | What happens |
|---|---|---|
| 0–3.6s | Hook | The benchmark race, labelled "shown at 321× speed" as on their site |
| 3.3–10.3s | Product | 01 A Coupa portal becomes a published tool with JSON rows · 02 The Anthem lookup fails, Pomerado repairs it, 24 claims come back · 03 7x faster / Self-healing / Deterministic |
| 10–15s | CTA | "Connect agents to any website → legacy portals → consumer sites → internal tools. No API needed." + Sign up for free |
| 15–17s | Credit | Made by Waltz_studz |

## Run

```bash
npm install
npm run studio      # preview at http://localhost:3000
npm run render      # → out/pomerado-promo.mp4
npm run render:4k   # → out/pomerado-promo-4k.mp4
npm run music       # regenerate public/audio/score.wav (python3 + numpy)
```

The copy lives in `src/theme.tsx` (`BRAND`). Each scene exports its beat frames, mirrored in `scripts/compose_soundtrack.py`.
