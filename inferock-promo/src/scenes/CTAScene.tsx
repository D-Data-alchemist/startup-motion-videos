import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, COLORS, displayFamily, EASE, Logo} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = interpolate(frame, [2, 14], [0, 1], {...clamp, easing: EASE.out});
  const k = interpolate(frame, [8, 20], [0, 1], clamp);
  const a = interpolate(frame, [12, 26], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [26, 36], [0, 1], {...clamp, easing: EASE.snap});
  const sub = interpolate(frame, [44, 58], [0, 1], clamp);
  const btn = spring({frame: frame - 62, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{padding: '0 140px', justifyContent: 'center', color: COLORS.ink}}>
      <div style={{position: 'absolute', left: 140, top: 90, opacity: logo}}>
        <Logo size={64} />
      </div>
      <div style={{fontSize: 26, letterSpacing: '0.12em', color: COLORS.muted, opacity: k}}>{BRAND.kicker}</div>
      <div style={{fontFamily: displayFamily, fontSize: 150, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1.0, marginTop: 20}}>
        <div style={{opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>{BRAND.headA}</div>
        <div style={{opacity: Math.min(1, b * 2), transform: `scale(${1.25 - 0.25 * b})`, transformOrigin: 'left center'}}>
          <span style={{color: COLORS.blue}}>{BRAND.headB}</span>.
        </div>
      </div>
      <div style={{fontSize: 34, color: COLORS.muted, marginTop: 24, opacity: sub}}>{BRAND.sub}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 40, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
        <div style={{height: 76, padding: '0 46px', borderRadius: 12, background: COLORS.blue, color: '#fff', fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.06})`, boxShadow: `0 20px 50px rgba(11,99,229,${0.3 + press * 0.2})`}}>{BRAND.cta} →</div>
        <div style={{fontSize: 24, color: COLORS.muted, lineHeight: 1.5}}>
          <b style={{color: COLORS.ink}}>{BRAND.url}</b>
          <br />
          {BRAND.fine}
        </div>
      </div>
    </AbsoluteFill>
  );
};
