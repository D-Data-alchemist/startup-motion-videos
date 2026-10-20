// "The 24-Hour Part" — a demonstration film (show, don't tell). One part's journey from drawing to delivery,
// timed by an on-screen clock. Frames @30fps; 120 BPM → 15 frames per beat. Mirrored in scripts/compose_journey.py.
export const J = {
  hook: {from: 0, duration: 160},
  drawing: {from: 150, duration: 140},
  program: {from: 280, duration: 150},
  turning: {from: 420, duration: 160},
  inspect: {from: 570, duration: 160},
  sample: {from: 720, duration: 150},
  batch: {from: 860, duration: 160},
  range: {from: 1010, duration: 220},
  proof: {from: 1220, duration: 140},
  cta: {from: 1350, duration: 150},
  total: 1500,
};
export const XF = 10; // scene overlap

// Clock keyframes (global frame → elapsed hours). It starts when the drawing lands and stops at the sample.
export const CLOCK = {start: 230, stop: 752, keys: [[230, 0], [300, 0.2], [420, 1.6], [570, 4.2], [700, 9.5], [752, 21.6]] as [number, number][]};
