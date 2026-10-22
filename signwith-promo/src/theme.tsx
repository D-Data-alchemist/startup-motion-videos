import {Easing, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to signwith.co) ──────────────────────────────────
export const BRAND = {
  name: 'SignWith',
  headA: 'E-signatures without the',
  headB: 'subscription.',
  sub: 'Pay per doc, not per month.',
  cta: 'Start free',
  url: 'signwith.co',
  fine: 'No credit card · Works on mobile · Recipients don’t need an account',
};

export const COLORS = {
  bg: '#F5F8FC',
  surface: '#FFFFFF',
  navy: '#2B5382',
  navyDeep: '#24476F',
  ink: '#212529',
  logo: '#252A4A',
  muted: '#6C757D',
  line: '#DEE2E6',
  soft: '#F1F3F5',
  green: '#22A06B',
  amber: '#D97706',
  red: '#C92A2A',
};

// ─── Timing (30fps, 15s + credit). 120 BPM → 15 frames per beat. ─────────────
export const VIDEO = {width: 1920, height: 1080, fps: 30, durationInFrames: 450};
export const SCENES = {
  hook: {from: 0, duration: 112},
  app: {from: 102, duration: 208},
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

export const Logo: React.FC<{width: number}> = ({width}) => <Img src={staticFile('img/signwith-logo.svg')} style={{width, height: width * 0.7}} />;

// Hand-drawn signature path, revealed by `draw` 0→1
export const Signature: React.FC<{draw: number; width: number; color?: string}> = ({draw, width, color = COLORS.navyDeep}) => (
  <svg width={width} height={width * 0.35} viewBox="0 0 400 140" style={{overflow: 'visible'}}>
    <path
      d="M20 95 C 40 40, 60 30, 70 70 S 85 120, 100 80 C 110 55, 120 50, 128 78 C 134 98, 142 96, 150 70 C 158 48, 170 52, 172 80 C 174 100, 190 96, 200 70 C 214 34, 236 40, 232 78 C 230 96, 246 100, 262 72 C 276 50, 296 54, 300 76 C 304 94, 322 92, 340 66 M 60 112 C 160 100, 270 102, 380 96"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1300"
      strokeDashoffset={1300 * (1 - draw)}
    />
  </svg>
);
