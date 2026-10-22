import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to navige.ai) ────────────────────────────────────
export const BRAND = {
  name: 'navige',
  headA: 'Exactly',
  headB: 'enough.',
  sub: 'Cut AI agent costs. Same output.',
  chips: ['Smart routing', 'Cache and reuse', 'Context trimming', 'Loop guard'],
  cta: 'Get started',
  url: 'navige.ai',
};

export const COLORS = {
  blue: '#1B47C9',
  blueDeep: '#1338A8',
  ink: '#15131A',
  night: '#05071A',
  white: '#FFFFFF',
  pink: '#F2B8D6',
  pinkDeep: '#C2427F',
  muted: 'rgba(255,255,255,0.65)',
  line: 'rgba(255,255,255,0.22)',
  green: '#6EE7B7',
  red: '#FF8A8A',
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
export const serifFamily = 'Instrument Serif';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
loadFont({family: serifFamily, url: staticFile('fonts/instrument-serif-latin-400-italic.woff2'), weight: '400', style: 'italic'});

// "navige" wordmark: rounded lowercase with the tall "i" stem
export const Wordmark: React.FC<{size: number}> = ({size}) => (
  <span style={{fontSize: size, fontWeight: 600, letterSpacing: '-0.03em', color: '#fff'}}>
    nav<span style={{display: 'inline-block', width: size * 0.11, height: size * 0.62, background: '#fff', borderRadius: size * 0.05, margin: `0 ${size * 0.05}px`, transform: `translateY(${size * 0.06}px)`}} />
    ge
  </span>
);
