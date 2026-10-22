import {Easing, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to inferock.ai) ──────────────────────────────────
export const BRAND = {
  name: 'Inferock',
  kicker: 'ACCOUNTABLE INFERENCE. ACROSS EVERY TIER.',
  headA: 'Run inference with',
  headB: 'accountability',
  sub: 'A receipt for every LLM call. Credits back for eligible failures.',
  cta: 'Sign up',
  url: 'inferock.ai',
  fine: 'Inferock Watch is free on your own provider keys',
};

export const COLORS = {
  bg: '#F2F6FB',
  surface: '#FFFFFF',
  ink: '#0F1B33',
  muted: '#5B6B82',
  line: '#DCE4EF',
  blue: '#0B63E5',
  blueDeep: '#0648AD',
  red: '#D64545',
  redSoft: '#FDECEC',
  green: '#1F9D63',
  greenSoft: '#E6F6EE',
  amber: '#B7791F',
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
export const displayFamily = 'Space Grotesk';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['500', '700'] as const).forEach((weight) =>
  loadFont({family: displayFamily, url: staticFile(`fonts/space-grotesk-latin-${weight}-normal.woff2`), weight}),
);

export const Logo: React.FC<{size: number}> = ({size}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.3}}>
    <Img src={staticFile('img/inferock-logo.svg')} style={{width: size, height: size}} />
    <span style={{fontFamily: displayFamily, fontWeight: 700, fontSize: size * 0.8, letterSpacing: '-0.02em', color: COLORS.ink}}>Inferock</span>
  </span>
);
