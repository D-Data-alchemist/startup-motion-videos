// Mochi, ported from the geometry Emochi publishes on kente-labs.com/emochi (mochi.js):
// nine emotion lobes around a core; each lobe's reach is that emotion's intensity.
export const EMOTIONS = ['anger', 'anxiety', 'sadness', 'disgust', 'guilt', 'joy', 'love', 'hope', 'gratitude'] as const;
export type Emotion = (typeof EMOTIONS)[number];
export type Emotions = Partial<Record<Emotion, number>>;

export const EMOTION_COLORS: Record<Emotion, string> = {
  anger: '#FF706D', anxiety: '#8E6CDE', sadness: '#7B6664', disgust: '#7BA05B', guilt: '#ADADAD',
  joy: '#FCC681', love: '#E089CB', hope: '#5BB8D9', gratitude: '#4ECDC4',
};
const ANGLE: Record<Emotion, number> = {
  anger: 70, anxiety: 110, sadness: 150, disgust: -170, guilt: -130, joy: -90, love: -50, hope: -10, gratitude: 30,
};
const CORE = 118, MIN_REACH = 125, MAX_REACH = 190, FLOOR = 10, FAT = 0.33, SAMPLES = 360;

const hexToRgb = (hex: string) => {
  const i = parseInt(hex.replace('#', ''), 16);
  return [(i >> 16) & 255, (i >> 8) & 255, i & 255];
};
const toHex = (c: number[]) => '#' + c.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')).join('');
export const mix = (a: string, b: string, t: number) => {
  const x = hexToRgb(a), y = hexToRgb(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
};
// Hue-path blend so teal → amber passes through clean greens, not grey
export const mixHue = (a: string, b: string, t: number) => {
  const hsl = (hex: string) => {
    const [r, g, bl] = hexToRgb(hex).map((v) => v / 255);
    const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl), l = (mx + mn) / 2, d = mx - mn;
    if (!d) return [0, 0, l];
    const sat = d / (1 - Math.abs(2 * l - 1));
    const h = mx === r ? ((g - bl) / d + 6) % 6 : mx === g ? (bl - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, sat, l];
  };
  const [h1, s1, l1] = hsl(a), [h2, s2, l2] = hsl(b);
  let dh = h2 - h1;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const h = (h1 + dh * t + 360) % 360, sa = s1 + (s2 - s1) * t, l = l1 + (l2 - l1) * t;
  const c = (1 - Math.abs(2 * l - 1)) * sa, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m0 = l - c / 2;
  const [r, g, bl] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return toHex([r, g, bl].map((v) => (v + m0) * 255));
};
const shade = (hex: string, amt: number) =>
  toHex(hexToRgb(hex).map((c) => (amt >= 0 ? c + (255 - c) * amt : c * (1 + amt))));

const full = (e: Emotions) => Object.fromEntries(EMOTIONS.map((k) => [k, e[k] ?? 12])) as Record<Emotion, number>;
export const lerpEmotions = (a: Emotions, b: Emotions, t: number): Emotions => {
  const fa = full(a), fb = full(b);
  return Object.fromEntries(EMOTIONS.map((k) => [k, fa[k] + (fb[k] - fa[k]) * t]));
};
export const dominant = (e: Emotions): Emotion => EMOTIONS.reduce((best, k) => ((e[k] ?? 0) > (e[best] ?? 0) ? k : best), 'gratitude' as Emotion);
// Same pattern as the site: dominant at 95, small deterministic bumps for the rest
export const sample = (emo: Emotion): Emotions => {
  const d = EMOTIONS.indexOf(emo);
  return Object.fromEntries(EMOTIONS.map((k, i) => [k, k === emo ? 95 : 12 + ((i * 7 + d * 13) % 5) * 6]));
};
export const NEUTRAL: Emotions = Object.fromEntries(EMOTIONS.map((k) => [k, 30]));

const tip = (s: number) => MIN_REACH + ((MAX_REACH - MIN_REACH) * Math.max(FLOOR, Math.min(100, s))) / 100;
const body = (e: Record<Emotion, number>, wobble: number) => {
  const lobes = EMOTIONS.map((k, i) => ({a: (ANGLE[k] * Math.PI) / 180, tip: tip(e[k]) + Math.sin(wobble + i * 1.7) * 2.5}));
  let d = '';
  for (let s = 0; s < SAMPLES; s++) {
    const th = (s * 2 * Math.PI) / SAMPLES;
    let rOut = CORE;
    for (const l of lobes) {
      const rho = Math.max(1, FAT * l.tip), dd = l.tip - rho, uc = dd * Math.cos(th - l.a), disc = uc * uc - dd * dd + rho * rho;
      if (disc >= 0) rOut = Math.max(rOut, uc + Math.sqrt(disc));
    }
    d += (s ? 'L' : 'M') + (200 + rOut * Math.cos(th)).toFixed(1) + ' ' + (200 + rOut * Math.sin(th)).toFixed(1);
  }
  return d + 'Z';
};

export const Mochi: React.FC<{
  emotions: Emotions;
  color?: string;
  size: number;
  face?: boolean;
  blink?: number; // 0 open → 1 closed
  wobble?: number;
  id: string;
}> = ({emotions, color, size, face = true, blink = 0, wobble = 0, id}) => {
  const e = full(emotions);
  const c = color ?? EMOTION_COLORS[dominant(emotions)];
  const maxPos = Math.max(e.joy, e.love, e.hope, e.gratitude);
  const maxNeg = Math.max(e.sadness, e.anxiety, e.disgust, e.anger, e.guilt);
  const happy = (maxPos - maxNeg) / 100;
  const droop = (Math.max(e.sadness, e.guilt) / 100) * 1.2;
  const open = Math.max(e.joy, e.love) >= 70 && happy > 0.2;
  const curve = happy >= 0 ? 1.5 + happy * 11 : 1.5 + happy * 16;
  const eyeRy = 9 * (1 - 0.9 * blink);
  return (
    <svg width={size} height={size} viewBox="-10 -10 420 420" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor={shade(c, -0.2)} />
          <stop offset="55%" stopColor={shade(c, -0.2)} stopOpacity={0.85} />
          <stop offset="100%" stopColor={shade(c, 0.18)} />
        </radialGradient>
      </defs>
      <path d={body(e, wobble)} fill={`url(#${id})`} />
      {face && (
        <>
          <ellipse cx={157} cy={157 + droop} rx={9} ry={eyeRy} fill="#1f2a3a" />
          <ellipse cx={239} cy={148 + droop} rx={9} ry={eyeRy} fill="#1f2a3a" />
          {open ? (
            <path d="M 188 182 A 12 10.8 0 0 0 212 182 Z" fill="#1f3a5a" />
          ) : (
            <path d={`M 188 182 Q 194 ${182 + curve / 2} 200 ${182 + curve / 2} T 212 182`} stroke="#1f3a5a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </svg>
  );
};
