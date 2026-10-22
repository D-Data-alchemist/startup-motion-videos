# Inferock — 17s Spec Promo (Remotion)

1920×1080 · 30fps · 450 frames + 2s studio credit · H.264 + AAC 320k · original score, −14 LUFS

An unsolicited spec piece for [inferock.ai](https://inferock.ai). Colours, type, logo and every claim come from their site: per-call receipts, objective failure types, service credits for eligible failures on Inferock Serve, and Watch being free on your own provider keys. Values in the call log are illustrative.

| Time | Scene | What happens |
|---|---|---|
| 0–3.6s | Hook | "Your LLM call failed." is on screen from frame 0. Their four failure types pop in on the beat, then "Who pays for that?" slams in |
| 3.3–10.3s | Product | A call log fills row by row; two calls fail. A receipt slides in for req_8f25 and flips to "Eligible for an Inferock Serve service credit"; the credits wallet counts up and the monthly loss report lands. Captions: "Every call gets a receipt." / "Eligible failures earn credits back." |
| 10–15s | CTA | "Run inference with **accountability**." + Sign up → inferock.ai |
| 15–17s | Credit | Made by Waltz_studz |

## Run

```bash
npm install
npm run studio      # preview at http://localhost:3000
npm run render      # → out/inferock-promo.mp4
npm run render:4k   # → out/inferock-promo-4k.mp4
npm run music       # regenerate public/audio/score.wav (python3 + numpy)
```

Copy lives in `src/theme.tsx` (`BRAND`). Each scene exports its beat frames, which are mirrored in `scripts/compose_soundtrack.py`.
