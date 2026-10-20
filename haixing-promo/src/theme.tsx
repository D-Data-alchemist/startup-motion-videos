import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {CJK_FONT_FILES} from './cjk-fonts';

// ─── Brand config (from the Haixing company brochure) ───────────────────────
export const BRAND = {
  name: 'HAIXING',
  zh: '海星精密科技有限公司',
  en: 'Haixing Precision Technology Co., Ltd.',
  services: 'CNC Programming  ·  Precision Turning  ·  Custom Non-standard Rotary Parts',
  mottoZh: '精工细作 · 诚信共赢',
  mottoEn: 'Precision Craftsmanship · Win-win Integrity',
  phone: '138 2317 6851',
  contact: 'Mr. Zhou · 周生',
  address: 'Building B16, Hengfeng Industrial City, Hangcheng St., Bao’an District, Shenzhen',
  closing: 'Let’s create value in precision manufacturing — together.',
};

export const COLORS = {
  bg: '#05070C',
  steel: '#C9CED6',
  text: '#F4F6FA',
  muted: '#8B93A3',
  red: '#C8242B',
  redHot: '#FF3B30',
  blue: '#1D4FA8',
  blueHot: '#3B82F6',
  spark: '#FFB347',
};

// ─── Timing (30fps). 120 BPM → 1 beat = 15 frames; every cut lands on a beat. ─
export const VIDEO = {width: 1920, height: 1080, fps: 30, durationInFrames: 1350};
export const BEAT = 15;
export const SCENES = {
  cold: {from: 0, duration: 150},
  logo: {from: 150, duration: 120},
  factory: {from: 270, duration: 210},
  caps: {from: 480, duration: 240},
  products: {from: 720, duration: 300},
  process: {from: 1020, duration: 150},
  cta: {from: 1170, duration: 180},
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  snap: Easing.bezier(0.2, 1.4, 0.4, 1), // slight overshoot for slams
};

export const fontFamily = 'Inter';
export const monoFamily = 'JetBrains Mono';
export const cjkFamily = 'Noto Sans SC';
(['400', '500', '600', '700', '800'] as const).forEach((weight) =>
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight}),
);
loadFont({family: monoFamily, url: staticFile('fonts/jetbrains-mono-latin-500-normal.woff2'), weight: '500'});
loadFont({family: 'Architects Daughter', url: staticFile('fonts/architects-daughter-latin-400-normal.woff2'), weight: '400'});
// Only the Noto Sans SC slices containing characters used in the video (see scripts/prepare_fonts.py)
CJK_FONT_FILES.forEach(({file, weight, range}) =>
  loadFont({family: cjkFamily, url: staticFile(`fonts/cjk/${file}`), weight, unicodeRange: range}),
);

export const FONT_STACK = `${fontFamily}, ${cjkFamily}, sans-serif`;
export const img = (name: string) => staticFile(`img/${name}`);
