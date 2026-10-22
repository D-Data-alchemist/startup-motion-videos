import {Easing, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ─── Brand config (matched to sellio.chat) ──────────────────────────────────
export const BRAND = {
  name: 'sellio',
  tagline: 'All the customer support,',
  taglineEnd: 'handled.',
  sub: 'One shared inbox for every conversation — with an AI agent that answers day and night.',
  cta: 'Try it for free',
  url: 'sellio.chat',
  fine: 'Go live in 5 minutes · No credit card required',
};

export const COLORS = {
  bg: '#FFFFFF',
  canvas: '#FBF8F6',
  ink: '#171717',
  text: '#191919',
  muted: '#646976',
  line: '#E2E4E9',
  soft: '#F5F5F5',
  orange: '#FF6A2B',
  orangeDeep: '#F0521A',
  orangeSoft: '#FFF1EA',
  green: '#12B76A',
  red: '#E5484D',
  blue: '#2E90FA',
};

export const CHANNELS = {
  whatsapp: {label: 'WhatsApp', color: '#25D366', glyph: '✆'},
  instagram: {label: 'Instagram', color: '#E1306C', glyph: '◎'},
  telegram: {label: 'Telegram', color: '#229ED9', glyph: '➤'},
  email: {label: 'Email', color: '#646976', glyph: '✉'},
  web: {label: 'Website chat', color: '#FF6A2B', glyph: '●'},
} as const;
export type Channel = keyof typeof CHANNELS;

// ─── Timing (30fps, 15s + credit). 120 BPM → 15 frames per beat. ─────────────
export const VIDEO = {width: 1920, height: 1080, fps: 30, durationInFrames: 450};
export const SCENES = {
  hook: {from: 0, duration: 110},
  inbox: {from: 100, duration: 210},
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
export const monoFamily = 'Geist Mono';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
loadFont({family: serifFamily, url: staticFile('fonts/instrument-serif-latin-400-normal.woff2'), weight: '400'});
loadFont({family: serifFamily, url: staticFile('fonts/instrument-serif-latin-400-italic.woff2'), weight: '400', style: 'italic'});
(['400', '500'] as const).forEach((weight) =>
  loadFont({family: monoFamily, url: staticFile(`fonts/geist-mono-latin-${weight}-normal.woff2`), weight}),
);

export const Icon: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <Img src={staticFile('img/sellio-icon.png')} style={{width: size, height: size, ...style}} />
);

// "sellio" wordmark: heavy lowercase with the orange square in place of the i's dot
export const Wordmark: React.FC<{size: number; color?: string}> = ({size, color = COLORS.ink}) => (
  <span style={{fontSize: size, fontWeight: 800, letterSpacing: '-0.06em', color, lineHeight: 1, display: 'inline-flex', alignItems: 'baseline'}}>
    sell
    <span style={{position: 'relative', display: 'inline-block'}}>
      ı
      <span style={{position: 'absolute', left: '50%', top: '-0.02em', width: '0.2em', height: '0.2em', marginLeft: '-0.1em', background: `linear-gradient(160deg, #FF9A5A, ${COLORS.orangeDeep})`}} />
    </span>
    o
  </span>
);

// Channel badge (sits on an avatar corner)
export const ChannelBadge: React.FC<{ch: Channel; size?: number}> = ({ch, size = 22}) => (
  <span style={{width: size, height: size, borderRadius: '50%', background: CHANNELS[ch].color, color: '#fff', fontSize: size * 0.55, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxSizing: 'border-box'}}>
    {CHANNELS[ch].glyph}
  </span>
);
