# Emochi — 17s Spec Promo (Remotion)

1920×1080 · 30fps · 450 frames + 2s studio credit · H.264 + AAC 320k · original score, −14 LUFS

An unsolicited spec piece for [Emochi](https://kente-labs.com/emochi/) by Kente Labs. The palette, the Source Serif Pro + Manrope type, the nine emotion colours and Mochi itself all come from their site. Mochi is drawn with the same lobe geometry their page uses: each emotion pushes out its own lobe, and the dominant one sets the colour. The copy is theirs too: "Talk, don't type", "See the shape of your day", "Intensity, never a score", "Deeply understand yourself as you journal".

| Time | Scene | What happens |
|---|---|---|
| 0–3.6s | Hook | "Journaling feels like homework?" is on screen from frame 0, over a blank page where "Dear diary, today I…" gets typed and deleted. Then "Just talk to Mochi." and Mochi pops in |
| 3.3–10.3s | Product | 01 Talk: Mochi listens, a waveform plays and the transcript writes itself. 02 Edit: "system" → "sister". 03 Shape: Mochi moves through anxiety → love → joy, "A bright one.", intensity markers. 04 Patterns: a week of Mochis, "Tuesdays run heavier than you thought.", recurring themes, a 28-day trend and the day streak |
| 10–15s | CTA | "Deeply understand yourself **as you journal.**" while Mochi cycles joy → love → hope → gratitude, with App Store + Google Play badges |
| 15–17s | Credit | Made by Waltz_studz |

## Run

```bash
npm install
npm run studio      # preview at http://localhost:3000
npm run render      # → out/emochi-promo.mp4
npm run render:4k   # → out/emochi-promo-4k.mp4
npm run music       # regenerate public/audio/score.wav (python3 + numpy)
```

The copy lives in `src/theme.tsx` (`BRAND`) and Mochi in `src/components/Mochi.tsx`. Each scene exports its beat frames, mirrored in `scripts/compose_soundtrack.py`.
