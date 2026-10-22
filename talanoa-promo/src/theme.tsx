import {Easing, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to talanoa.email) ────────────────────────────────
export const BRAND = {
  name: 'talanoa',
  headA: 'Inbox for people',
  headB: 'who hate email',
  sub: ['Save hours. Clear your mind.', 'Love your inbox again.'],
  cta: 'Download for free',
  url: 'talanoa.email',
  platforms: 'macOS · Windows · Linux',
};

export const COLORS = {
  night: '#0E0E0F',
  paper: '#F8F8F7',
  surface: '#FFFFFF',
  ink: '#111111',
  text: '#1C1C1E',
  muted: '#7A7A80',
  line: '#E5E5E8',
  soft: '#F0F0F2',
  purple: '#8022FE',
  purpleSoft: '#F1E8FF',
  bubbleIn: '#EDEDF0',
};

// ─── Timing (30fps, 15s + credit). 120 BPM → 15 frames per beat. ─────────────
export const VIDEO = {width: 1920, height: 1080, fps: 30, durationInFrames: 450};
export const SCENES = {
  hook: {from: 0, duration: 125},
  app: {from: 115, duration: 195},
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
export const logoFamily = 'Lato';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['300', '400'] as const).forEach((weight) =>
  (['normal', 'italic'] as const).forEach((style) =>
    loadFont({family: serifFamily, url: staticFile(`fonts/cormorant-garamond-latin-${weight}-${style}.woff2`), weight, style}),
  ),
);
(['400', '700'] as const).forEach((weight) =>
  loadFont({family: logoFamily, url: staticFile(`fonts/lato-latin-${weight}-normal.woff2`), weight}),
);

// Talanoa mark (their logo SVG) — invert for dark backgrounds
export const Mark: React.FC<{size: number; light?: boolean}> = ({size, light}) => (
  <Img src={staticFile('img/talanoa-logo.svg')} style={{width: size, height: size, filter: light ? 'invert(1)' : undefined}} />
);

export const Wordmark: React.FC<{size: number; light?: boolean}> = ({size, light}) => (
  <span style={{fontFamily: logoFamily, fontSize: size, fontWeight: 400, letterSpacing: '-0.02em', color: light ? '#fff' : COLORS.ink}}>{BRAND.name}</span>
);

const AV = ['#F6D7B8', '#C9D6FF', '#D7F0E2', '#F5D0E0', '#E9DDFB', '#FDE7B0', '#D8E8F0'];
export const Avatar: React.FC<{name: string; size?: number; i?: number}> = ({name, size = 34, i = 0}) => (
  <span style={{width: size, height: size, borderRadius: '50%', background: AV[i % AV.length], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.42, fontWeight: 600, color: COLORS.text, flexShrink: 0}}>
    {name[0]}
  </span>
);
