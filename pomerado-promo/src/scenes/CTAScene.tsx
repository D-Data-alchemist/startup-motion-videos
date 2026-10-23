import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, COLORS, EASE, Logo, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;
const ROTATE = ['any website', 'legacy portals', 'consumer sites', 'internal tools'];
export const ROTATE_AT = 22;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = interpolate(frame, [2, 14], [0, 1], {...clamp, easing: EASE.out});
  const a = interpolate(frame, [6, 20], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [70, 80], [0, 1], {...clamp, easing: EASE.snap});
  const sub = interpolate(frame, [80, 92], [0, 1], clamp);
  const btn = spring({frame: frame - 86, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);
  const idx = Math.min(ROTATE.length - 1, Math.max(0, Math.floor((frame - 10) / ROTATE_AT)));
  const local = (frame - 10) - idx * ROTATE_AT;
  const swap = idx < ROTATE.length - 1 ? interpolate(local, [ROTATE_AT - 5, ROTATE_AT], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{padding: '0 140px', justifyContent: 'center', color: COLORS.ink}}>
      <div style={{position: 'absolute', left: 140, top: 90, opacity: logo}}>
        <Logo size={56} />
      </div>
      <div style={{fontSize: 130, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1.02}}>
        <div style={{opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>Connect agents to</div>
        <div style={{height: 140, overflow: 'hidden', opacity: a}}>
          <div style={{color: COLORS.brand, transform: `translateY(${-swap * 140}px)`}}>
            <div>{ROTATE[idx]}</div>
            <div>{ROTATE[Math.min(idx + 1, ROTATE.length - 1)]}</div>
          </div>
        </div>
        <div style={{opacity: Math.min(1, b * 2), transform: `scale(${1.15 - 0.15 * b})`, transformOrigin: 'left center', color: COLORS.brand}}>No API needed.</div>
      </div>
      <div style={{fontSize: 32, color: COLORS.body, marginTop: 26, opacity: sub}}>{BRAND.sub}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 40, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
        <div style={{height: 74, padding: '0 40px', borderRadius: 12, background: COLORS.brand, color: '#fff', fontSize: 27, fontWeight: 600, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.06})`, boxShadow: `0 18px 40px rgba(199,31,62,${0.25 + press * 0.2})`}}>{BRAND.cta}</div>
        <div style={{height: 74, padding: '0 30px', borderRadius: 12, border: `1px solid ${COLORS.line}`, background: '#fff', fontFamily: mono, fontSize: 20, display: 'flex', alignItems: 'center'}}>claude mcp add pomerado</div>
        <div style={{fontSize: 22, color: COLORS.body, lineHeight: 1.5, marginLeft: 8}}>
          <b style={{color: COLORS.ink}}>{BRAND.url}</b> · Open source
          <br />
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 8}}><span style={{width: 20, height: 20, borderRadius: 4, background: '#F26522', color: '#fff', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>Y</span>{BRAND.fine}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
