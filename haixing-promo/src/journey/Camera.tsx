import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {J} from './timeline';
import {CARD_AT, CTA_STAMP, PAIN_AT, RESULT_AT, SAMPLE_STAMP} from './Scenes';

// Frames where something hits hard (stamps, drops) → camera shake. [frame, strength]
const HITS: [number, number][] = [
  ...PAIN_AT.map((f) => [J.hook.from + f + 6, 10] as [number, number]),
  [J.sample.from + SAMPLE_STAMP, 22],
  [J.batch.from, 14],
  ...Array.from({length: 12}, (_, i) => [J.range.from + CARD_AT(i), 4] as [number, number]),
  ...RESULT_AT.map((f) => [J.proof.from + f, 10] as [number, number]),
  [J.cta.from, 10],
  [J.cta.from + CTA_STAMP, 14],
];
// Sections where the camera pumps on every beat (15 frames @ 120 BPM)
const GROOVE: [number, number][] = [
  [J.turning.from, J.sample.from + 20],
  [J.batch.from, J.proof.from],
  [J.cta.from + 15, J.total],
];
const SCENES = Object.values(J).filter((v): v is {from: number; duration: number} => typeof v === 'object');

// Hand-held, always-moving camera over the whole sheet world
export const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  // continuous drift
  let scale = 1.03 + Math.sin(frame / 70) * 0.01;
  let x = Math.sin(frame / 83) * 12;
  let y = Math.cos(frame / 97) * 8;
  let rot = Math.sin(frame / 120) * 0.35;
  // slow push-in across each scene
  const scene = [...SCENES].reverse().find((s) => frame >= s.from);
  if (scene) scale += interpolate(frame, [scene.from, scene.from + scene.duration], [0, 0.035], {extrapolateRight: 'clamp'});
  // beat punch
  if (GROOVE.some(([a, b]) => frame >= a && frame < b)) {
    const k = frame % 15;
    scale += 0.012 * Math.exp(-k / 2.5);
  }
  // impact shake (deterministic, decays over ~10 frames)
  for (const [f, s] of HITS) {
    const d = frame - f;
    if (d >= 0 && d < 12) {
      const a = s * Math.exp(-d / 3.5);
      x += Math.sin(d * 2.7 + f) * a;
      y += Math.cos(d * 3.1 + f) * a;
      rot += Math.sin(d * 1.9 + f) * a * 0.04;
    }
  }
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`}}>{children}</AbsoluteFill>;
};
