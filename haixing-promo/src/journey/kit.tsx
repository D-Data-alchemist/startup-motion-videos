import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, monoFamily} from '../theme';
import {CLOCK, XF} from './timeline';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const PAPER = '#F2EFE6';
export const INK = '#14284B';
export const BLUE = '#1D4FA8';
export const RED = '#C8242B';
export const GRID = 'rgba(29,79,168,';

// Drafting-paper world: fine + major grid, soft vignette
export const Paper: React.FC = () => (
  <AbsoluteFill
    style={{
      background: PAPER,
      backgroundImage: `linear-gradient(${GRID}0.10) 1px, transparent 1px), linear-gradient(90deg, ${GRID}0.10) 1px, transparent 1px), linear-gradient(${GRID}0.045) 1px, transparent 1px), linear-gradient(90deg, ${GRID}0.045) 1px, transparent 1px)`,
      backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
    }}
  >
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(20,40,75,0.16) 100%)'}} />
    <div style={{position: 'absolute', inset: 28, border: `2px solid ${INK}`, opacity: 0.55}} />
  </AbsoluteFill>
);

// Engineering title block, bottom-right; the sheet number advances scene by scene
export const TitleBlock: React.FC<{sheet: number; of: number; title: string}> = ({sheet, of, title}) => (
  <div style={{position: 'absolute', right: 28, bottom: 28, display: 'grid', gridTemplateColumns: '210px 200px 120px', fontFamily: monoFamily, fontSize: 14, color: INK, border: `2px solid ${INK}`, background: PAPER}}>
    {[
      ['HAIXING PRECISION', '海星精密科技'],
      ['DWG', title],
      ['SHEET', `${sheet} / ${of}`],
    ].map(([k, v]) => (
      <div key={k} style={{padding: '8px 12px', borderLeft: k === 'HAIXING PRECISION' ? 'none' : `2px solid ${INK}`}}>
        <div style={{opacity: 0.55, fontSize: 11, letterSpacing: '0.15em'}}>{k}</div>
        <div style={{fontWeight: 500, marginTop: 2}}>{v}</div>
      </div>
    ))}
  </div>
);

// Elapsed-time HUD — the spine of the film
export const ClockHUD: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CLOCK.start - 10) return null;
  const xs = CLOCK.keys.map((k) => k[0]);
  const ys = CLOCK.keys.map((k) => k[1]);
  const h = interpolate(frame, xs, ys, {...clamp, easing: EASE.inOut});
  const s = Math.floor(h * 3600);
  const t = `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const stopped = frame >= CLOCK.stop;
  const show = interpolate(frame, [CLOCK.start - 10, CLOCK.start], [0, 1], clamp) * (1 - interpolate(frame, [CLOCK.stop + 150, CLOCK.stop + 170], [0, 1], clamp));
  return (
    <div style={{position: 'absolute', right: 60, top: 56, padding: '14px 22px', background: INK, color: '#fff', fontFamily: monoFamily, borderRadius: 6, opacity: show, boxShadow: '0 12px 30px rgba(20,40,75,0.25)'}}>
      <div style={{fontSize: 13, letterSpacing: '0.25em', opacity: 0.7, display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{width: 9, height: 9, borderRadius: '50%', background: stopped ? '#22C55E' : RED, opacity: stopped ? 1 : 0.5 + 0.5 * Math.abs(Math.sin(frame / 6))}} />
        {stopped ? 'SAMPLE READY' : 'ELAPSED SINCE DRAWING'}
      </div>
      <div style={{fontSize: 46, fontWeight: 500, marginTop: 4, fontVariantNumeric: 'tabular-nums'}}>{t}</div>
    </div>
  );
};

// Scene wrapper: whip-pans in from the right with motion blur and whips out to the left
export const Sheet: React.FC<{duration: number; children: React.ReactNode; last?: boolean; first?: boolean}> = ({duration, children, last, first}) => {
  const frame = useCurrentFrame();
  const inP = first ? 1 : interpolate(frame, [0, XF], [0, 1], {...clamp, easing: EASE.out});
  const outP = last ? 0 : interpolate(frame, [duration - XF, duration], [0, 1], {...clamp, easing: EASE.in});
  const speed = Math.sin(inP * Math.PI) * (1 - outP) + Math.sin(outP * Math.PI);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, inP * 1.6) * (1 - outP * outP),
        transform: `translateX(${(1 - inP) * 1300 - outP * 1300}px) skewX(${-speed * 9}deg)`,
        filter: speed > 0.02 ? `blur(${speed * 16}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Words slam in one by one: drop, tilt and blur resolve on a tight stagger
export const KineticWords: React.FC<{text: string; at: number; stagger?: number; style?: React.CSSProperties; wordStyle?: (i: number) => React.CSSProperties}> = ({text, at, stagger = 3, style, wordStyle}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 0.26em', ...style}}>
      {text.split(' ').map((w, i) => {
        const p = interpolate(frame, [at + i * stagger, at + i * stagger + 9], [0, 1], {...clamp, easing: EASE.snap});
        return (
          <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 70}px) rotate(${(1 - p) * 8}deg) scale(${1.25 - 0.25 * p})`, filter: `blur(${(1 - Math.min(p, 1)) * 10}px)`, ...wordStyle?.(i)}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Rubber stamp: thuds in on the beat
export const Stamp: React.FC<{at: number; color?: string; rotate?: number; children: React.ReactNode; style?: React.CSSProperties; size?: number}> = ({at, color = RED, rotate = -8, children, style, size = 54}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 6], [0, 1], {...clamp, easing: EASE.snap});
  if (frame < at) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '10px 26px',
        border: `5px double ${color}`,
        borderRadius: 10,
        color,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        transform: `rotate(${rotate}deg) scale(${2.2 - 1.2 * p})`,
        opacity: Math.min(1, p * 1.5) * 0.92,
        mixBlendMode: 'multiply',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Photo pinned to the sheet like a plate, with a slow push inside
export const Plate: React.FC<{src: string; x: number; y: number; w: number; h: number; at?: number; rotate?: number; caption?: string}> = ({src, x, y, w, h, at = 0, rotate = -2, caption}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 16, stiffness: 120}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: 12, paddingBottom: caption ? 44 : 12, background: '#fff', boxShadow: '0 24px 50px rgba(20,40,75,0.22)', transform: `rotate(${rotate}deg) translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 1.4)}}>
      <div style={{width: w - 24, height: h, overflow: 'hidden'}}>
        <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.05 + frame * 0.0008})`}} />
      </div>
      {caption && <div style={{position: 'absolute', left: 14, bottom: 12, fontFamily: monoFamily, fontSize: 15, color: INK, letterSpacing: '0.08em'}}>{caption}</div>}
    </div>
  );
};

// Section heading in the drawing's annotation style
export const Heading: React.FC<{n: string; title: string; zh: string; at?: number; x?: number; y?: number}> = ({n, title, zh, at = 4, x = 110, y = 110}) => {
  const frame = useCurrentFrame();
  const step = `STEP ${n}`;
  const typed = step.slice(0, Math.floor(interpolate(frame, [at, at + 6], [0, step.length], clamp)));
  const zhP = interpolate(frame, [at + 10, at + 20], [0, 1], {...clamp, easing: EASE.out});
  const bar = interpolate(frame, [at + 2, at + 16], [0, 1], {...clamp, easing: EASE.out});
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{fontFamily: monoFamily, fontSize: 20, letterSpacing: '0.25em', color: RED, height: 26}}>{typed}</div>
      <div style={{height: 4, width: 90 * bar, background: RED, marginTop: 6}} />
      <KineticWords text={title} at={at + 3} style={{fontSize: 64, fontWeight: 800, letterSpacing: '-0.035em', color: INK, marginTop: 8}} />
      <div style={{fontSize: 30, fontWeight: 700, color: BLUE, marginTop: 4, opacity: zhP, transform: `translateX(${(1 - zhP) * -40}px)`}}>{zh}</div>
    </div>
  );
};
