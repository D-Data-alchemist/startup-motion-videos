# DriveStream Pro — 15s Promo (matched to drivestream.pro) (Remotion)

1920×1080 (and 3840×2160) · 30fps · 450 frames · H.264 + AAC 320k stereo

| Scene | Time | Frames | What happens |
|---|---|---|---|
| 1 · Hook | 0–3s | 0–95 | Kinetic headline (blur→sharp word reveal) over scattered, conflicting file chips; chips get pulled to the center |
| 2 · Action | 3–10s | 90–305 | App window springs in (3D tilt), camera pushes in, cursor arcs to **Sync all** and clicks, then progress bars stream, the counter ticks up to 2,481, devices light up, the sparkline draws, cursor hovers the stat card and a success toast appears |
| 3 · CTA | 10–15s | 300–450 | Logo mark springs in and its waves draw on, wordmark letters reveal as the lockup slides, gradient tagline, CTA pill with shimmer and a final cursor click |

Scenes overlap by 5 frames for seamless handoffs.

## Soundtrack

`public/audio/soundtrack.wav` is an original score plus sound effects, synthesized from code by `scripts/compose_soundtrack.py` (numpy only, no samples, so no licensing issues). It runs at 120 BPM, so one beat is exactly 15 frames and every hit lands on a video frame.

| Time | Music | Synced SFX |
|---|---|---|
| 0–3s | Am9 pad opening up, muffled heartbeat kick getting louder, filtered arpeggio | riser + reverse cymbal into the window landing |
| 3–10s | Impact, then the full groove: four-on-the-floor kick with sidechain pump, claps, hats, 16th shaker, bass, plucked arpeggio over Am9 → Fmaj9 → Cadd9 → Gsus | UI click on **Sync all**, data ticks while files sync, Cmaj7 bell chime on the success toast |
| 10–15s | Big impact, wide resolved chord, lighter groove, high arpeggio, ring-out | bell shimmer on the logo, click + "ding" on **Start free** |

Mastered to −14 LUFS integrated (the loudness YouTube, Instagram and LinkedIn normalize to), with −3.5 dBFS peak.
If you move a beat in the scenes, update the matching time in the script's `T_*` constants and run `npm run music`.

## Run

```bash
npm install
npm run studio      # live preview / scrub timeline at http://localhost:3000
npm run music       # (optional) regenerate public/audio/soundtrack.wav — needs python3 + numpy
npm run render      # → out/drivestream-promo.mp4 (1080p)
npm run render:4k   # → out/drivestream-promo-4k.mp4 (2160p)
```

If Remotion can't download its own Chrome (offline or sandboxed), point it at an existing one:
`npm run render -- --browser-executable=/path/to/chrome-headless-shell`

## Customize

Everything brand-related lives in `src/theme.ts`:
- `BRAND`: name, badge, hook lines, tagline, CTA, URL, counter value
- `COLORS` / `GRADIENT`: palette
- `SCENES`: scene timing
- `EASE`: motion curves (expo-out entrances, in-out travel)

Cursor targets in `ActionScene.tsx` are derived from the window geometry constants (`WIN`, `BTN`, …), so the pointer stays on target if you resize the UI.
Inter is self-hosted in `public/fonts`, so renders need no network access.
