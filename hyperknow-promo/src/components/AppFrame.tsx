import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {BRAND, COLORS, EASE, MARK_PATHS} from '../theme';

export const WIN = {x: 160, y: 110, w: 1600, h: 860};
export const BAR_H = 48;
export const SIDEBAR_W = 260;
const NAV = ['Home', 'Courses', 'Learning Feed', 'History', 'Marketplace'];

// Hyperknow app chrome (browser bar + sidebar) with spring-in / blur-out; children are window-relative
export const AppFrame: React.FC<{active: string; exitAt: number; children: React.ReactNode; overlay?: React.ReactNode; cam?: number; origin?: string; sidebar?: boolean}> = ({
  active,
  sidebar = true,
  exitAt,
  children,
  overlay,
  cam = 1,
  origin = '960px 540px',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200, mass: 0.9}, durationInFrames: 28});
  const exit = interpolate(frame, [exitAt, exitAt + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.in});
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(enter * 1.4, 1) * (1 - exit),
        filter: `blur(${exit * 14}px)`,
        transform: `scale(${(1 - exit * 0.08) * cam})`,
        transformOrigin: origin,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 20,
          overflow: 'hidden',
          background: COLORS.surfaceHi,
          border: `1px solid ${COLORS.borderHi}`,
          boxShadow: '0 50px 120px rgba(17,17,17,0.16), 0 8px 24px rgba(17,17,17,0.06)',
          transform: `translateY(${(1 - enter) * 60}px) scale(${0.92 + 0.08 * enter})`,
          color: COLORS.text,
        }}
      >
        <div style={{height: BAR_H, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 8, borderBottom: `1px solid ${COLORS.border}`, background: '#EFEFEC'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c}} />
          ))}
          <div style={{margin: '0 auto', width: 440, height: 28, borderRadius: 8, background: '#fff', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {BRAND.url}
          </div>
          <div style={{width: 52}} />
        </div>
        {sidebar && (
        <div style={{position: 'absolute', left: 14, top: BAR_H + 14, bottom: 14, width: SIDEBAR_W - 28, borderRadius: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: '22px 14px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 22px', fontSize: 22, fontWeight: 500}}>
            <svg width="26" height="26" viewBox="0 0 96 96">
              <path d={MARK_PATHS.slice(0, 2).join(' ')} fill="none" stroke="#111" strokeWidth="7" strokeLinejoin="round" />
            </svg>
            {BRAND.name}
          </div>
          {NAV.map((item) => (
            <div
              key={item}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 17,
                color: item === active ? COLORS.accent : COLORS.text,
                background: item === active ? '#EAF0FF' : 'transparent',
                marginBottom: 2,
              }}
            >
              {item}
            </div>
          ))}
        </div>
        )}
        {children}
      </div>
      {overlay}
    </AbsoluteFill>
  );
};
