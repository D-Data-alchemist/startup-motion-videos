import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, COLORS, display, EASE, Logo, Mark} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = interpolate(frame, [2, 14], [0, 1], {...clamp, easing: EASE.out});
  const a = interpolate(frame, [8, 22], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [20, 32], [0, 1], {...clamp, easing: EASE.out});
  const sub = interpolate(frame, [42, 56], [0, 1], clamp);
  const btn = spring({frame: frame - 60, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);
  const wave = spring({frame: frame - 4, fps, config: {damping: 16, stiffness: 90}});
  return (
    <AbsoluteFill style={{padding: '0 140px', justifyContent: 'center', color: COLORS.ink}}>
      <div style={{position: 'absolute', right: -120, top: 120, opacity: 0.12 * wave, transform: `rotate(${(1 - wave) * -40 + frame * 0.08}deg) scale(${0.8 + 0.2 * wave})`}}>
        <Mark size={900} id="cta-wave" />
      </div>
      <div style={{position: 'absolute', left: 140, top: 90, opacity: logo}}>
        <Logo size={56} />
      </div>
      <div style={{fontFamily: display, fontSize: 138, fontWeight: 400, letterSpacing: '-0.045em', lineHeight: 1.02}}>
        <div style={{opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
          Intent <span style={{color: COLORS.blue}}>verification</span>
        </div>
        <div style={{opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>for coding agents</div>
      </div>
      <div style={{fontSize: 32, color: COLORS.muted, marginTop: 30, opacity: sub, maxWidth: 1200, lineHeight: 1.4}}>{BRAND.sub}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 44, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
        <div style={{height: 74, padding: '0 40px', borderRadius: 12, background: COLORS.ink, color: '#fff', fontSize: 27, fontWeight: 600, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.06})`, boxShadow: `0 18px 40px rgba(29,33,37,${0.2 + press * 0.2})`}}>{BRAND.cta}</div>
        <div style={{fontSize: 24, color: COLORS.muted, lineHeight: 1.5}}>
          <b style={{color: COLORS.ink}}>{BRAND.url}</b>
          <br />
          Or set up with your agent
        </div>
      </div>
    </AbsoluteFill>
  );
};
