import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to kente-labs.com/emochi and the App Store listing) ─
export const BRAND = {
  name: 'Emochi',
  headA: 'Deeply understand yourself',
  headB: 'as you journal.',
  sub: 'Come tell Mochi about your day.',
  url: 'kente-labs.com/emochi',
  fine: 'Free · Your words stay yours.',
};

export const COLORS = {
  bg: '#F0EDE7',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F4ED',
  fg: '#333435',
  muted: '#5B6770',
  faint: '#A9AFB3',
  border: '#E5E5E5',
  teal: '#4ECDC4',
  tealDeep: '#2E9E96',
  accent: '#ED9B63',
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

export const fontFamily = 'Manrope';
export const serif = 'Source Serif Pro';
(['400', '500', '600', '700'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/manrope-latin-${weight}-normal.woff2`), weight}),
);
loadFont({family: serif, url: staticFile('fonts/source-serif-pro-latin-700-normal.woff2'), weight: '700'});
