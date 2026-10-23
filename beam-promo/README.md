# Beam — 17s Spec Promo (Remotion)

1920×1080 · 30fps · 450 frames + 2s studio credit · H.264 + AAC 320k · original score, −14 LUFS

An unsolicited spec piece for [beam.win](https://beam.win). It uses their icon, wordmark, Google Sans Flex type, mint palette and per-Mac accent rings ("the ring wears the Mac it came from"). The copy is theirs: "A window, not a video feed.", "Like the app walked across the room."

**Hook (demo-first):** the window is already mid-flight from a display-less Mac mini on frame 0, under "Agents on the Mac mini." It lands on the MacBook at 1.3s, gets a Dock icon, and the second line "Windows right here." pays it off.

| Time | Scene | What happens |
|---|---|---|
| 0–3.6s | Hook | Terminal window flies Mac mini → MacBook and lands with a Dock icon |
| 3.3–10.3s | Product | Beam picker (Studio / Kitchen / Loft) → the window walks in → its own Dock icon and a place in ⌘Tab → a second window from the Kitchen → resize → a file dropped onto it lands on the other Mac, encrypted |
| 10–15s | CTA | "Your other Mac’s windows, on this Mac." + Get Beam |
| 15–17s | Credit | Made by Waltz_studz |

## Run

```bash
npm install
npm run studio      # preview at http://localhost:3000
npm run render      # → out/beam-promo.mp4
npm run render:4k   # → out/beam-promo-4k.mp4
npm run music       # regenerate public/audio/score.wav (python3 + numpy)
```

The copy lives in `src/theme.tsx` (`BRAND`). Each scene exports its beat frames, mirrored in `scripts/compose_soundtrack.py`.
