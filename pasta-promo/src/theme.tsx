import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to pppasta.com) ──────────────────────────────────
export const BRAND = {
  name: 'Train with Pasta.',
  kicker: 'A personal trainer, in your pocket.',
  cta: 'Get Pasta for iPhone',
  url: 'pppasta.com',
};

export const COLORS = {
  night: '#060606',
  warm: '#110F0D',
  gold: '#F3C66C',
  goldDeep: '#C58E2C',
  cream: '#EDE9E2',
  muted: '#9C9488',
  red: '#8E2A22',
  green: '#7BD389',
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
export const serifFamily = 'Cormorant Garamond';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['400', '500'] as const).forEach((weight) =>
  loadFont({family: serifFamily, url: staticFile(`fonts/cormorant-garamond-latin-${weight}-italic.woff2`), weight, style: 'italic'}),
);

export const Serif: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = COLORS.gold, children, style}) => (
  <span style={{fontFamily: serifFamily, fontStyle: 'italic', fontWeight: 500, fontSize: size, color, letterSpacing: '-0.01em', ...style}}>{children}</span>
);
