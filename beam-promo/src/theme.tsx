import {Easing, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to beam.win) ─────────────────────────────────────
export const BRAND = {
  name: 'Beam',
  headA: 'Your other Mac’s windows,',
  headB: 'on this Mac.',
  sub: 'Native, live, and sharp. Like the app walked across the room.',
  cta: 'Get Beam',
  url: 'beam.win',
  fine: 'Free to try · Encrypted between your Macs',
};

// Each Mac wears its own accent ring, as on beam.win
export const COLORS = {
  bg: '#070B0A',
  bg2: '#0E1513',
  panel: '#161D1B',
  line: 'rgba(244,246,245,0.10)',
  text: '#F4F6F5',
  muted: '#9AA8A2',
  mint: '#59D499',
  mintLit: '#7AF2C4',
  studio: '#33CF95',
  kitchen: '#F2A93B',
  loft: '#E27BBF',
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
export const display = 'Google Sans Flex';
(['400', '500', '600', '700'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
loadFont({family: display, url: staticFile('fonts/GoogleSansFlex-latin.woff2'), weight: '400 700'});

export const Logo: React.FC<{height: number}> = ({height}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: height * 0.35}}>
    <Img src={staticFile('img/beam-icon-512.png')} style={{width: height * 1.25, height: height * 1.25}} />
    <Img src={staticFile('img/wordmark.svg')} style={{height: height * 0.62}} />
  </span>
);
