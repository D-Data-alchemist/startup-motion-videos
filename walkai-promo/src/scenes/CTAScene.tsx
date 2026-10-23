import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Radio} from '../components/Radio';
import {BRAND, COLORS, EASE, Logo} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = interpolate(frame, [2, 14], [0, 1], {...clamp, easing: EASE.out});
  const a = interpolate(frame, [8, 22], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [20, 32], [0, 1], {...clamp, easing: EASE.snap});
  const sub = interpolate(frame, [42, 56], [0, 1], clamp);
  const btn = spring({frame: frame - 60, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);
  const radio = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 90}});
  return (
    <AbsoluteFill style={{padding: '0 140px', justifyContent: 'center', color: COLORS.text}}>
      <div style={{position: 'absolute', right: 200, top: 150, transform: `translateY(${(1 - radio) * 300}px) rotate(${6 - radio * 2}deg)`}}>
        <Radio scale={1.0} lcd="OVER." rx={frame > 30 && frame % 40 < 20} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 90, opacity: logo}}>
        <Logo size={56} />
      </div>
      <div style={{fontSize: 124, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.04}}>
        <div style={{opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>{BRAND.headA}</div>
        <div style={{color: COLORS.orange, opacity: Math.min(1, b * 2), transform: `scale(${1.15 - 0.15 * b})`, transformOrigin: 'left center'}}>{BRAND.headB}</div>
      </div>
      <div style={{fontSize: 32, color: COLORS.muted, marginTop: 26, opacity: sub}}>{BRAND.sub}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 44, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
        <div style={{height: 74, padding: '0 42px', borderRadius: 12, background: COLORS.orange, color: '#fff', fontSize: 27, fontWeight: 700, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.06})`, boxShadow: `0 18px 44px rgba(255,107,43,${0.3 + press * 0.25})`}}>{BRAND.cta}</div>
        <div style={{fontSize: 22, color: COLORS.muted, lineHeight: 1.5}}>
          <b style={{color: COLORS.text}}>{BRAND.url}</b>
          <br />
          {BRAND.fine}
        </div>
      </div>
    </AbsoluteFill>
  );
};
