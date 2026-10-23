import {Easing, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to pomerado.ai) ──────────────────────────────────
export const BRAND = {
  name: 'Pomerado',
  headA: 'Connect agents to any website.',
  headB: 'No API needed.',
  sub: 'Pomerado turns any website into an API/MCP in minutes. Open source.',
  cta: 'Sign up for free',
  url: 'pomerado.ai',
  fine: 'Backed by Y Combinator',
};

export const COLORS = {
  bg: '#FFFFFF',
  band: '#F7F8FA',
  cream: '#FFF3E3',
  creamDeep: '#FFEED8',
  ink: '#0D0D0D',
  body: '#535C6B',
  line: '#E6E8EC',
  brand: '#C71F3E',
  brandDeep: '#A70023',
  coral: '#FF6B4A',
  claude: '#D97757',
  ok: '#2F7A4A',
  okBg: '#E3F1E7',
  fail: '#B4342D',
  failBg: '#F9E5E3',
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
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.35}}>
    <Img src={staticFile('img/icon.svg')} style={{width: size, height: size}} />
    <span style={{fontSize: size * 0.8, fontWeight: 500, color: COLORS.ink, letterSpacing: '-0.02em'}}>Pomerado</span>
  </span>
);
