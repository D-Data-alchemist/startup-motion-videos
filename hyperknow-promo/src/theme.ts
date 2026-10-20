import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to agent.hyperknow.io) ───────────────────────────
export const BRAND = {
  name: 'Hyperknow',
  hookLine1: ['Learning', 'something', 'new'],
  hookLine2: ['starts', 'with', '47', 'open', 'tabs.'],
  prompt: "Learn PostgreSQL to build a database that won't break",
  courseTitle: "PostgreSQL: Build a Database That Won't Break",
  tagline: ['For', 'mastering', 'anything', 'in', 'human', 'knowledge.'],
  cta: 'Craft your first course',
  url: 'agent.hyperknow.io',
};

export const COLORS = {
  bg: '#F6F6F3',
  surface: '#FFFFFF',
  surfaceHi: '#FAFAF8',
  border: 'rgba(17,17,17,0.08)',
  borderHi: 'rgba(17,17,17,0.14)',
  text: '#111111',
  muted: '#8A8A8A',
  accent: '#3B6CF6',
  highlight: '#D9E5FF',
  success: '#16A34A',
  warm: '#F4F1E4',
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
export const serifFamily = 'Newsreader';
export const handFamily = 'Architects Daughter'; // whiteboard handwriting
export const monoFamily = 'JetBrains Mono';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['400', '500'] as const).forEach((weight) =>
  loadFont({family: serifFamily, url: staticFile(`fonts/newsreader-latin-${weight}-normal.woff2`), weight}),
);

// Outline "stacked book" mark — swap for the official logo SVG when available
export const MARK_PATHS = [
  'M18 40 L48 26 L78 40 L48 54 Z',
  'M18 40 L18 58 L48 72 L78 58 L78 40',
  'M30 46 L30 62',
  'M48 54 L48 72',
];

loadFont({family: handFamily, url: staticFile('fonts/architects-daughter-latin-400-normal.woff2'), weight: '400'});
(['400', '500'] as const).forEach((weight) =>
  loadFont({family: monoFamily, url: staticFile(`fonts/jetbrains-mono-latin-${weight}-normal.woff2`), weight}),
);

// Blue marker-highlight sweep (Hyperknow's signature "personalized courses" style)
export const highlight = (p: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(${COLORS.highlight}, ${COLORS.highlight})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 85%',
  backgroundSize: `${p * 100}% 55%`,
});
