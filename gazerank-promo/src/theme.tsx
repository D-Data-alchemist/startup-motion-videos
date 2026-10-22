import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to gazerank.com) ─────────────────────────────────
export const BRAND = {
  name: 'GazeRank',
  tagline: 'Website health & AI search visibility in one scan.',
  cta: 'Scan your site free',
  url: 'gazerank.com',
  fine: '5 free scans/month · No credit card · No signup for your first scan',
};

export const COLORS = {
  bg: '#F6F8F5',
  surface: '#FFFFFF',
  ink: '#111827',
  text: '#14201C',
  muted: '#5A6B62',
  line: '#DCE3DD',
  soft: '#E6EFE9',
  emerald: '#10B981',
  emeraldDeep: '#2F6F4E',
  amber: '#D97706',
  red: '#A63D40',
  night: '#0F1412',
};

// ─── Timing (30fps, 15s + credit). 120 BPM → 15 frames per beat. ─────────────
export const VIDEO = {width: 1920, height: 1080, fps: 30, durationInFrames: 450};
export const SCENES = {
  hook: {from: 0, duration: 110},
  scan: {from: 100, duration: 210},
  cta: {from: 300, duration: 150},
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  snap: Easing.bezier(0.2, 1.4, 0.4, 1),
};

export const fontFamily = 'Inter';
export const monoFamily = 'IBM Plex Mono';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['400', '500', '600'] as const).forEach((weight) =>
  loadFont({family: monoFamily, url: staticFile(`fonts/ibm-plex-mono-latin-${weight}-normal.woff2`), weight}),
);

// GazeRank's eye mark (from their favicon): outline eye, emerald pupil, rising rank arrow. draw: 0→1
export const EyeMark: React.FC<{size: number; draw?: number; look?: number}> = ({size, draw = 1, look = 0}) => {
  const d = (len: number, delay = 0) => ({strokeDasharray: len, strokeDashoffset: len * (1 - Math.min(1, Math.max(0, draw * 1.4 - delay)))});
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M10 32C16 20 25 16 32 16s16 4 22 16c-6 12-15 16-22 16S16 44 10 32Z" stroke={COLORS.ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={d(110)} />
      <circle cx={32 + look * 6} cy="32" r={7 * Math.min(1, draw * 1.6)} fill={COLORS.emerald} />
      <path d="M20 40L28 32L35 36L46 22" stroke={COLORS.emerald} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={d(40, 0.3)} />
      <path d="M40 22H46V28" stroke={COLORS.emerald} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={d(14, 0.4)} />
    </svg>
  );
};
