import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, COLORS, EASE, Serif} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = interpolate(frame, [4, 18], [0, 1], {...clamp, easing: EASE.out});
  const t = interpolate(frame, [16, 36], [0, 1], {...clamp, easing: EASE.out});
  const btn = spring({frame: frame - 56, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{padding: '0 160px', justifyContent: 'center'}}>
      <div style={{opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>
        <Serif size={56} color={COLORS.cream}>
          {BRAND.kicker}
        </Serif>
      </div>
      <div style={{opacity: t, transform: `translateY(${(1 - t) * 30}px)`, filter: `blur(${(1 - t) * 8}px)`, marginTop: 6}}>
        <Serif size={220}>{BRAND.name}</Serif>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 40, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
        <div style={{height: 80, padding: '0 46px', borderRadius: 999, background: COLORS.gold, color: '#1A1208', fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${1 - press * 0.06})`, boxShadow: `0 0 ${30 + press * 30}px rgba(243,198,108,0.45)`}}>
           {BRAND.cta}
        </div>
        <div style={{fontSize: 28, color: COLORS.cream, fontWeight: 600}}>{BRAND.url}</div>
      </div>
    </AbsoluteFill>
  );
};
