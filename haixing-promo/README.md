# Haixing Precision Technology — 45s Brand Film (Remotion)

1920×1080 (and 3840×2160) · 30fps · 1350 frames · H.264 + AAC 320k · original score, −14 LUFS

Built from the company brochure: real factory, equipment and product photos, bilingual EN/中文 copy.
The style is a dark, cinematic industrial film: macro product hero shots, grinding sparks and beat-synced hard cuts with flash frames.

| Time | Scene | What happens |
|---|---|---|
| 0–5s | Cold open | Grinding sparks; "Every part. / Every micron. / Every deadline. / Machined to spec." slam in on the beat |
| 5–9s | Logo | HAIXING letters slam in, the star badge spins in, 海星精密科技有限公司, heartbeat rules |
| 9–16s | Factory | Factory-floor push-ins; "Rooted in Shenzhen. Built for precision." Count-ups: 100+ staff, 1,000 m², 99%+ pass rate, 24 h samples |
| 16–24s | Capabilities | 5 split-screen cards with a red wipe: programming, custom rotary parts, prototyping → batch, multi-material turning, full QC |
| 24–34s | Products | Spotlit hero parts with floor reflections (impeller, flange housing, sprocket flange, titanium worm, valve core), then a 12-part grid |
| 34–39s | Process | 8-step one-stop flow lights up node by node; scrolling industries ticker |
| 39–45s | Contact | 精工细作 · 诚信共赢, logo lockup, phone and address, fade to black |

## Light edit (`HaixingLight`, modelled on the client's reference films)

An airy sky-blue gradient, frosted-glass tiles and thin white type. Scenes cross-dissolve continuously with no hard cuts, and the score is calm, mastered to −14 LUFS like the references.
The flow: the question (word-swap type) → logo + 2013—2026 → 15-part grid filling → material swatches (one part re-tinted) → turning-process chips → inspection badges + 99%+ → Step 1 drawing & order card → Step 2 blueprint becomes the part and then a batch → stats + industries → white end card with a hand-drawn underline.
Code: `src/light/`; score: `scripts/compose_light.py` → `public/audio/haixing-light.wav`.

```bash
npm run render:light      # → out/haixing-light.mp4
npm run render:light:4k   # → out/haixing-light-4k.mp4
```

## Run

```bash
npm install
npm run studio      # preview at http://localhost:3000
npm run render      # → out/haixing-promo.mp4
npm run render:4k   # → out/haixing-promo-4k.mp4
npm run music       # regenerate public/audio/haixing.wav (python3 + numpy)
npm run fonts       # re-slice Noto Sans SC after changing any Chinese text
```

## Assets

- `public/img/`: cleaned images extracted from the brochure (`scripts/prepare_assets.py`), with transparent cut-outs for every product.
- `public/fonts/cjk/`: only the Noto Sans SC slices covering the Chinese characters used (`scripts/prepare_fonts.py` → `src/cjk-fonts.ts`).
- The copy and contact details live in `src/theme.tsx` (`BRAND`). Scene timing lives in `SCENES`, and each scene file exports its beat frames, mirrored in `scripts/compose_soundtrack.py`.
