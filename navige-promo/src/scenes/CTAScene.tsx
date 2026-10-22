import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, COLORS, EASE, serifFamily, Wordmark} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = interpolate(frame, [2, 14], [0, 1], {...clamp, easing: EASE.out});
  const a = interpolate(frame, [10, 22], [0, 1], {...clamp, easing: EASE.snap});
  const b = interpolate(frame, [24, 40], [0, 1], {...clamp, easing: EASE.out});
  const btn = spring({frame: frame - 62, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{padding: '0 140px', justifyContent: 'center', color: '#fff'}}>
      <div style={{position: 'absolute', left: 140, top: 90, opacity: logo}}>
        <Wordmark size={70} />
      </div>
      <div style={{position: 'absolute', right: 140, top: 104, fontSize: 30, fontWeight: 600, opacity: logo}}>{BRAND.url}</div>
      <div style={{fontSize: 260, fontWeight: 800, letterSpacing: '-0.055em', lineHeight: 0.9, opacity: Math.min(1, a * 2), transform: `scale(${1.3 - 0.3 * a})`, transformOrigin: 'left center'}}>{BRAND.headA}</div>
      <div style={{fontFamily: serifFamily, fontStyle: 'italic', fontSize: 280, color: COLORS.pink, lineHeight: 0.95, opacity: b, transform: `translateY(${(1 - b) * 40}px)`, filter: `blur(${(1 - b) * 8}px)`}}>{BRAND.headB}</div>
      <div style={{display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap'}}>
        {BRAND.chips.map((c, i) => {
          const p = spring({frame: frame - (44 + i * 4), fps, config: {damping: 14}});
          return (
            <span key={c} style={{padding: '14px 26px', borderRadius: 999, border: '2px solid rgba(255,255,255,0.7)', fontSize: 28, opacity: Math.min(1, p), transform: `translateY(${(1 - Math.min(p, 1)) * 20}px)`}}>{c}</span>
          );
        })}
        <span style={{marginLeft: 20, height: 66, padding: '0 40px', borderRadius: 999, background: '#fff', color: COLORS.blue, fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', opacity: Math.min(1, btn), transform: `scale(${Math.min(1, btn) * (1 - press * 0.06)})`}}>{BRAND.cta} →</span>
      </div>
    </AbsoluteFill>
  );
};
