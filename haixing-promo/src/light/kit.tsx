import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE} from '../theme';
import {XFADE} from './timeline';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const INK = '#16325C';
export const SKY = '#EAF4FF';

// Soft scene wrapper: fades/blurs in and out over the overlap so scenes flow without hard cuts
export const Flow: React.FC<{duration: number; children: React.ReactNode}> = ({duration, children}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, XFADE], [0, 1], {...clamp, easing: EASE.out});
  const outP = interpolate(frame, [duration - XFADE, duration], [0, 1], {...clamp, easing: EASE.in});
  return (
    <AbsoluteFill style={{opacity: inP * (1 - outP), filter: `blur(${(1 - inP) * 10 + outP * 10}px)`, transform: `scale(${0.985 + 0.015 * inP + outP * 0.02})`}}>
      {children}
    </AbsoluteFill>
  );
};

// Frosted glass tile
export const glass = (alpha = 0.16): React.CSSProperties => ({
  background: `rgba(255,255,255,${alpha})`,
  border: '1px solid rgba(255,255,255,0.45)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(22,50,92,0.12), inset 0 1px 0 rgba(255,255,255,0.35)',
});

// Fade + rise helper
export const rise = (frame: number, at: number, dist = 24, dur = 16): React.CSSProperties => {
  const p = interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: EASE.out});
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`, filter: `blur(${(1 - p) * 6}px)`};
};

// Small section caption at the top, like the reference ("Materials & strength grades")
export const Caption: React.FC<{children: React.ReactNode; at?: number; color?: string}> = ({children, at = 4, color = '#fff'}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: 96, width: '100%', textAlign: 'center', fontSize: 34, fontWeight: 400, color, letterSpacing: '0.01em', ...rise(frame, at, 14)}}>
      {children}
    </div>
  );
};

// Selector chip bar (material / process swatches)
export const ChipBar: React.FC<{items: {label: string; dot?: React.CSSProperties}[]; active: number; style?: React.CSSProperties}> = ({items, active, style}) => (
  <div style={{display: 'flex', gap: 6, padding: 8, borderRadius: 16, background: 'rgba(255,255,255,0.92)', boxShadow: '0 14px 36px rgba(22,50,92,0.18)', ...style}}>
    {items.map((it, i) => (
      <div
        key={it.label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 18px',
          borderRadius: 11,
          fontSize: 21,
          fontWeight: i === active ? 600 : 400,
          color: i === active ? INK : '#8A9BB3',
          background: i === active ? '#E6F0FF' : 'transparent',
          border: `1.5px solid ${i === active ? '#3B82F6' : 'transparent'}`,
        }}
      >
        {it.dot && <span style={{width: 26, height: 26, borderRadius: '50%', boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)', ...it.dot}} />}
        {it.label}
      </div>
    ))}
  </div>
);
