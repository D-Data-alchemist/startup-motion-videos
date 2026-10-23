# walkai-talkai — 17s Spec Promo (Remotion)

1920×1080 · 30fps · 450 frames + 2s studio credit · H.264 + AAC 320k · original score, −14 LUFS

An unsolicited spec piece for [walkai-talkai.com](https://walkai-talkai.com). It uses their palette, icon and Inter/JetBrains Mono type, and their real radio loop: Key up → Transcribe → Dispatch → Reply → Broadcast. The score includes the actual VOX preamble (880 → 1100 → 1400 Hz), squelch and a roger beep.

**Hook (bold claim + object in frame):** frame 0 shows "Fix bugs with a walkie-talkie." next to the radio. PTT at 0.7s, "Fix the buy button. Over.", then by 3s the agent answers over the radio.

| Time | Scene | What happens |
|---|---|---|
| 0–3.6s | Hook | The radio transmits, VOX tones play, then "Fixed. Ready to ship. Over." + ROGER |
| 3.3–10.3s | Product | The five-step loop: Whisper transcript → typed into Claude Code as a [radio command] → the agent fixes BuyButton.tsx → curl to 127.0.0.1:1988/api/reply → broadcast |
| 10–15s | CTA | "Talk to your AI agent over the radio." + Buy now |
| 15–17s | Credit | Made by Waltz_studz |

## Run

```bash
npm install
npm run studio      # preview at http://localhost:3000
npm run render      # → out/walkai-promo.mp4
npm run render:4k   # → out/walkai-promo-4k.mp4
npm run music       # regenerate public/audio/score.wav (python3 + numpy)
```

The copy lives in `src/theme.tsx` (`BRAND`). Each scene exports its beat frames, mirrored in `scripts/compose_soundtrack.py`.
