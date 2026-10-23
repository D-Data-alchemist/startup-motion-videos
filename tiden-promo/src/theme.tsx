import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to tiden.ai) ─────────────────────────────────────
export const BRAND = {
  name: 'Tiden',
  headA: 'Intent verification',
  headB: 'for coding agents',
  sub: 'Your agents write the code. Tiden verifies it does what you actually asked for.',
  cta: 'Start free trial',
  url: 'tiden.ai',
  fine: 'Works with Claude Code and your existing tests',
};

export const COLORS = {
  bg: '#F8F8F6',
  card: '#FFFFFF',
  ink: '#1D2125',
  text: '#2C2F33',
  muted: '#6B7280',
  line: '#E6E6E1',
  blue: '#005087',
  blueLit: '#4C8BC5',
  teal: '#3EA885',
  tealLit: '#65BF9F',
  red: '#C2413B',
  redSoft: '#FBEAE8',
  greenSoft: '#E7F5EF',
  term: '#161A1C',
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

export const fontFamily = 'Geist';
export const display = 'Inter';
export const mono = 'DM Mono';
loadFont({family: fontFamily, url: staticFile('fonts/geist-var.woff2'), weight: '100 900'});
(['300', '400', '500', '600'] as const).forEach((weight) =>
  loadFont({family: display, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
(['400', '500'] as const).forEach((weight) => loadFont({family: mono, url: staticFile(`fonts/dm-mono-${weight}.woff2`), weight}));

// Tiden's wave mark (from tiden.ai/icon.svg), tinted with the brand gradient
export const Mark: React.FC<{size: number; id?: string}> = ({size, id = 'tiden-g'}) => (
  <svg width={size} height={size} viewBox="0 0 260 260">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={COLORS.blue} />
        <stop offset="1" stopColor={COLORS.teal} />
      </linearGradient>
    </defs>
    <path
      d="M93.9732 5.12675C162.939 -14.7703 234.976 25.0075 254.873 93.9731C274.77 162.939 234.992 234.976 166.027 254.873C97.0615 274.77 25.0243 234.993 5.12686 166.028C-14.7704 97.0621 25.0075 25.0241 93.9732 5.12675ZM130.184 130.62C121.727 102.556 94.4334 88.2353 68.1155 95.8281C41.5903 103.481 26.2909 131.188 33.9437 157.714C49.2494 210.764 104.663 241.362 157.714 226.056C195.768 215.077 222.267 183.46 228.559 146.881C229.035 141.134 229.737 136.712 227.233 136.34C224.729 135.969 223.727 137.901 220.344 142.749C218.592 145.537 216.564 148.155 214.285 150.56C213.799 151.126 213.289 151.713 212.749 152.316C207.068 157.812 200.01 161.828 191.885 164.172C165.568 171.765 138.086 156.763 130.184 130.62Z"
      fill={`url(#${id})`}
      fillRule="evenodd"
    />
  </svg>
);

export const Logo: React.FC<{size: number}> = ({size}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.35}}>
    <Mark size={size} id={`tiden-logo-${size}`} />
    <span style={{fontFamily: display, fontSize: size * 0.8, fontWeight: 500, color: COLORS.ink, letterSpacing: '-0.01em'}}>Tiden</span>
  </span>
);
