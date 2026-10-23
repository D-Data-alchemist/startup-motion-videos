import {Easing, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to walkai-talkai.com) ────────────────────────────
export const BRAND = {
  name: 'walkai-talkai',
  headA: 'Talk to your AI agent',
  headB: 'over the radio.',
  sub: 'Press PTT on any walkie-talkie. Your Mac does the rest.',
  cta: 'Buy now',
  url: 'walkai-talkai.com',
  fine: 'macOS 13+ · Apple Silicon · Cursor · Claude Code · Antigravity',
};

export const COLORS = {
  bg: '#07080B',
  bg2: '#0C0E13',
  panel: '#1E222A',
  panel2: '#2C313C',
  line: 'rgba(255,255,255,0.08)',
  text: '#F3F4F6',
  muted: '#9AA3B2',
  orange: '#FF6B2B',
  orangeLit: '#FF9A5C',
  brand: '#EA580C',
  green: '#7EF0C4',
  emerald: '#00D294',
  lcd: '#B8F5D0',
  lcdBg: '#0F2219',
};

export const VIDEO = {width: 1920, height: 1080, fps: 30, durationInFrames: 450};
export const SCENES = {
  hook: {from: 0, duration: 110},
  app: {from: 100, duration: 210},
  cta: {from: 300, duration: 150},
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  snap: Easing.bezier(0.2, 1.4, 0.4, 1),
};

export const fontFamily = 'Inter';
export const mono = 'JetBrains Mono';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['400', '500', '700'] as const).forEach((weight) =>
  loadFont({family: mono, url: staticFile(`fonts/jetbrains-mono-latin-${weight}-normal.woff2`), weight}),
);

export const Logo: React.FC<{size: number}> = ({size}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.4}}>
    <Img src={staticFile('img/icon.svg')} style={{width: size, height: size}} />
    <span style={{fontSize: size * 0.66, fontWeight: 500, color: COLORS.text, letterSpacing: '-0.01em'}}>walkai-talkai</span>
  </span>
);
