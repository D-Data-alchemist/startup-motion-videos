import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, COLORS, display, EASE, Logo} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const icon = spring({frame: frame - 2, fps, config: {damping: 12, stiffness: 120}});
  const a = interpolate(frame, [12, 26], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [24, 36], [0, 1], {...clamp, easing: EASE.out});
  const sub = interpolate(frame, [44, 58], [0, 1], clamp);
  const btn = spring({frame: frame - 62, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: COLORS.text}}>
      <div style={{position: 'absolute', left: '50%', bottom: -420, width: 1600, height: 700, marginLeft: -800, borderRadius: '50%', background: COLORS.mint, filter: 'blur(200px)', opacity: 0.25 * a}} />
      <Img src={staticFile('img/beam-icon-512.png')} style={{width: 150, height: 150, transform: `scale(${icon})`, filter: `drop-shadow(0 0 40px rgba(89,212,153,${0.4 * icon}))`}} />
      <div style={{fontFamily: display, fontSize: 118, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.04, marginTop: 34}}>
        <div style={{opacity: a, transform: `translateY(${(1 - a) * 30}px)`, background: 'linear-gradient(#fff 24%, #C2D2CB 100%)', WebkitBackgroundClip: 'text', color: 'transparent'}}>{BRAND.headA}</div>
        <div style={{opacity: b, transform: `translateY(${(1 - b) * 30}px)`, color: COLORS.mint}}>{BRAND.headB}</div>
      </div>
      <div style={{fontSize: 32, color: COLORS.muted, marginTop: 24, opacity: sub}}>{BRAND.sub}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 40, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
        <div style={{height: 72, padding: '0 40px', borderRadius: 999, background: COLORS.mint, color: '#06110C', fontSize: 26, fontWeight: 700, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.06})`, boxShadow: `0 0 ${40 + press * 30}px rgba(89,212,153,0.45)`}}>{BRAND.cta}</div>
        <div style={{fontSize: 22, color: COLORS.muted, textAlign: 'left', lineHeight: 1.5}}>
          <b style={{color: COLORS.text}}>{BRAND.url}</b>
          <br />
          {BRAND.fine}
        </div>
      </div>
    </AbsoluteFill>
  );
};
