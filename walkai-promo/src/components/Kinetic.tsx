import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

// Motion toolkit distilled from top launch films (Linear, Framer, Claude, Bolt, Notion, Superhuman):
// a camera that follows the action, motion blur from velocity, zoom-through scene changes,
// masked word reveals and 3D card entrances. Everything is a pure function of the frame.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.bezier(0.65, 0, 0.35, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);

// ─── Camera ────────────────────────────────────────────────────────────────
// Keys name the canvas point to centre (x, y), the zoom (s) and a 3D tilt (rx, ry, rz).
export type CamKey = {f: number; x?: number; y?: number; s?: number; rx?: number; ry?: number; rz?: number};
type Cam = Required<CamKey>;
const fill = (keys: CamKey[]) =>
  keys.reduce<Cam[]>((acc, k) => {
    const p = acc[acc.length - 1] ?? {f: 0, x: 960, y: 540, s: 1, rx: 0, ry: 0, rz: 0};
    acc.push({...p, ...k});
    return acc;
  }, []);
const sample = (keys: Cam[], f: number): Cam => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const t = io((f - a.f) / Math.max(1, b.f - a.f));
      const l = (k: keyof Cam) => a[k] + (b[k] - a[k]) * t;
      return {f, x: l('x'), y: l('y'), s: l('s'), rx: l('rx'), ry: l('ry'), rz: l('rz')};
    }
  }
  return keys[keys.length - 1];
};

export const Camera: React.FC<{keys: CamKey[]; children: React.ReactNode; maxBlur?: number; shake?: number}> = ({keys, children, maxBlur = 5, shake = 0}) => {
  const frame = useCurrentFrame();
  const k = fill(keys);
  const c = sample(k, frame), p = sample(k, frame - 1);
  const speed = Math.hypot((c.x - p.x) * c.s, (c.y - p.y) * c.s) + Math.abs(c.s - p.s) * 1200;
  const blur = Math.min(maxBlur, Math.max(0, speed - 16) * 0.12);
  const sx = shake ? Math.sin(frame * 2.7) * shake : 0, sy = shake ? Math.cos(frame * 3.1) * shake : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${960 - c.x * c.s + sx}px, ${540 - c.y * c.s + sy}px) scale(${c.s}) translate(${c.x}px, ${c.y}px) perspective(1800px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg) translate(${-c.x}px, ${-c.y}px)`,
          filter: blur > 0.4 ? `blur(${blur.toFixed(2)}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Exponential "kick" after a beat: 1 on the beat, decaying to 0
export const kick = (frame: number, at: number, decay = 5) => (frame >= at ? Math.exp(-(frame - at) / decay) : 0);
// Sum of kicks — for a camera punch on every listed beat
export const punches = (frame: number, beats: number[], decay = 5) => beats.reduce((s, b) => s + kick(frame, b, decay), 0);

// ─── Scene transitions: zoom-through with blur instead of crossfades ────────
export const useZoomThrough = (duration: number, inFrames = 10, outFrames = 12): React.CSSProperties => {
  const frame = useCurrentFrame();
  const i = inFrames ? interpolate(frame, [0, inFrames], [0, 1], {...clamp, easing: out}) : 1;
  const o = outFrames ? interpolate(frame, [duration - outFrames, duration], [0, 1], {...clamp, easing: Easing.bezier(0.7, 0, 0.84, 0)}) : 0;
  const b = (1 - i) * 18 + o * 22;
  return {
    opacity: Math.min(1, i * 1.4) * (1 - o),
    transform: `scale(${(0.86 + 0.14 * i) * (1 + 0.45 * o)})`,
    filter: b > 0.4 ? `blur(${b.toFixed(2)}px)` : undefined,
  };
};

// ─── Masked word reveal (each word rises out of its own mask) ──────────────
export const Rise: React.FC<{text: string; at: number; stagger?: number; color?: string; accent?: string[]; accentColor?: string; dur?: number; style?: React.CSSProperties}> = ({
  text, at, stagger = 3, color, accent = [], accentColor, dur = 12, style,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <span style={{display: 'inline', ...style}}>
      {words.map((w, i) => {
        const t = interpolate(frame, [at + i * stagger, at + i * stagger + dur], [0, 1], {...clamp, easing: out});
        const hot = accent.includes(w.replace(/[.,!?]/g, ''));
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - t) * 105}%) rotate(${(1 - t) * 6}deg)`, color: hot ? accentColor : color, filter: t < 1 ? `blur(${(1 - t) * 6}px)` : undefined}}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          </span>
        );
      })}
    </span>
  );
};

// ─── 3D card entrance: flips up out of the floor, blurred, then settles ─────
export const card3D = (frame: number, at: number, from: 'below' | 'left' | 'right' = 'below', dur = 16): React.CSSProperties => {
  const t = interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: out});
  const rx = from === 'below' ? (1 - t) * 38 : 0;
  const ry = from === 'left' ? (1 - t) * -38 : from === 'right' ? (1 - t) * 38 : 0;
  const tx = from === 'left' ? (1 - t) * -160 : from === 'right' ? (1 - t) * 160 : 0;
  const ty = from === 'below' ? (1 - t) * 120 : 0;
  return {
    opacity: Math.min(1, t * 1.6),
    transform: `perspective(1600px) translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${0.9 + 0.1 * t})`,
    filter: t < 1 ? `blur(${((1 - t) * 10).toFixed(2)}px)` : undefined,
  };
};

// ─── Floating UI shards drifting toward the camera (parallax depth) ────────
export const Shards: React.FC<{color: string; tint?: string; count?: number; opacity?: number; speed?: number}> = ({color, tint = 'rgba(255,255,255,0.9)', count = 14, opacity = 0.5, speed = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{perspective: 1200, overflow: 'hidden', pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = (n: number) => ((seed * (n + 1)) % 1000) / 1000;
        const z = ((r(1) * 1400 + frame * 6 * speed) % 1400) - 1200; // -1200 → 200
        const x = (r(2) - 0.5) * 2200, y = (r(3) - 0.5) * 1300;
        const fade = interpolate(z, [-1200, -900, 50, 200], [0, 1, 1, 0], clamp);
        const w = 160 + r(4) * 180, h = 90 + r(5) * 90;
        const dof = Math.min(8, Math.abs(z + 500) / 90);
        return (
          <div key={i} style={{position: 'absolute', left: 960 + x - w / 2, top: 540 + y - h / 2, width: w, height: h, borderRadius: 14, background: tint, border: `1.5px solid ${color}`, opacity: fade * opacity, transform: `translateZ(${z}px) rotateY(${(r(6) - 0.5) * 50}deg) rotateX(${(r(7) - 0.5) * 30}deg)`, filter: `blur(${dof.toFixed(1)}px)`, padding: 14, boxShadow: '0 20px 50px rgba(0,0,0,0.15)'}}>
            {[0.8, 0.55, 0.65].map((l, j) => <div key={j} style={{height: 8, width: `${l * 100}%`, borderRadius: 4, background: color, opacity: 0.35, marginBottom: 10}} />)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Light sweep: a glowing bar crossing the frame (Framer-style wipe) ─────
export const Sweep: React.FC<{at: number; color: string; dur?: number; vertical?: boolean}> = ({at, color, dur = 14, vertical = false}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: io});
  if (t <= 0 || t >= 1) return null;
  const pos = -10 + t * 120;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div style={{position: 'absolute', [vertical ? 'top' : 'left']: `${pos}%`, [vertical ? 'left' : 'top']: 0, [vertical ? 'width' : 'height']: '100%', [vertical ? 'height' : 'width']: 6, background: color, boxShadow: `0 0 40px 12px ${color}`, opacity: Math.sin(t * Math.PI)}} />
    </AbsoluteFill>
  );
};
