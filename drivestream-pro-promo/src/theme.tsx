import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to drivestream.pro) ──────────────────────────────
export const BRAND = {
  name: 'DriveStream',
  suffix: 'Pro',
  eyebrow: 'PRE-RECORDED VIDEO. LIVE POSSIBILITIES.',
  hookLine1: ['Going', 'live', '24/7'],
  hookLine2: ["shouldn't", 'mean', 'never', 'sleeping.'],
  channel: 'Everlight Worship',
  taglineA: 'Made once.',
  taglineB: 'Live on repeat.',
  sub: 'Your library → Your program → Your channel',
  cta: 'Start in Studio',
  url: 'drivestream.pro',
};

export const COLORS = {
  bg: '#F5F1EA',
  surface: '#FFFFFF',
  surfaceHi: '#FBF9F5',
  border: 'rgba(20,27,52,0.08)',
  borderHi: 'rgba(20,27,52,0.14)',
  text: '#141B34',
  muted: '#6B7080',
  accent: '#2348D8',
  orange: '#E4572E',
  live: '#E5322D',
  success: '#16A34A',
};

// ─── Timing (30fps, 15s) — key beats match the soundtrack ───────────────────
export const VIDEO = {width: 1920, height: 1080, fps: 30, durationInFrames: 450};
export const SCENES = {
  hook: {from: 0, duration: 95},
  action: {from: 90, duration: 215},
  cta: {from: 300, duration: 150},
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

export const fontFamily = 'Inter';
export const monoFamily = 'JetBrains Mono';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['400', '500'] as const).forEach((weight) =>
  loadFont({family: monoFamily, url: staticFile(`fonts/jetbrains-mono-latin-${weight}-normal.woff2`), weight}),
);

// DriveStream's angled "D" chevron mark (approximation — swap for the official SVG)
export const LogoMark: React.FC<{size: number; draw?: number}> = ({size, draw = 1}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {['M18 18 L58 18 L84 50 L58 82 L18 82', 'M34 36 L52 36 L64 50 L52 64 L34 64'].map((d, i) => (
      <path
        key={i}
        d={d}
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={i ? 11 : 13}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="260"
        strokeDashoffset={260 * (1 - Math.min(1, Math.max(0, draw * 1.3 - i * 0.3)))}
      />
    ))}
  </svg>
);

// Mono eyebrow with the red live dot, as on the landing page
export const Eyebrow: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: monoFamily, fontSize: 20, letterSpacing: '0.18em', color: COLORS.orange, ...style}}>
    <span style={{width: 12, height: 12, borderRadius: '50%', background: COLORS.orange}} />
    {text}
  </div>
);
