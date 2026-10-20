import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {WordReveal} from '../components/WordReveal';
import {Cursor, ClickRipple, cursorAt} from '../components/Cursor';
import {BRAND, COLORS, EASE, MARK_PATHS, highlight} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CLICK = 116;
const BTN_Y = 730;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mark = spring({frame: frame - 2, fps, config: {damping: 13, stiffness: 120}});
  const draw = interpolate(frame, [8, 38], [0, 1], {...clamp, easing: EASE.out});
  const pulse = interpolate(frame, [8, 50], [0, 1], {...clamp, easing: EASE.out});
  const slide = interpolate(frame, [14, 40], [1, 0], {...clamp, easing: EASE.inOut});
  const letters = BRAND.name.split('');
  const hl = interpolate(frame, [70, 88], [0, 1], {...clamp, easing: EASE.out});

  const btn = spring({frame: frame - 76, fps, config: {damping: 14, stiffness: 140}});
  const shimmer = interpolate(frame, [96, 128], [-0.3, 1.3], clamp);
  const press = interpolate(frame, [CLICK - 4, CLICK, CLICK + 6], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [CLICK, CLICK + 20], [0, 1], clamp);
  const cursor = cursorAt(frame, [
    {f: 84, x: 1500, y: 1100},
    {f: 112, x: 1118, y: BTN_Y + 8, arc: -60},
  ]);
  const cursorOpacity = interpolate(frame, [84, 92, 136, 146], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,108,246,0.16) 0%, rgba(59,108,246,0.05) 40%, transparent 65%)',
          transform: `scale(${0.4 + pulse * 0.8})`,
          opacity: pulse,
          top: -80,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 270,
          display: 'flex',
          alignItems: 'center',
          gap: 36,
          transform: `translateX(${slide * 345}px)`,
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 40,
            background: COLORS.surface,
            border: `1px solid ${COLORS.borderHi}`,
            boxShadow: '0 30px 70px rgba(17,17,17,0.12)',
            transform: `scale(${mark}) rotate(${(1 - mark) * -30}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="100" height="100" viewBox="0 0 96 96">
            {MARK_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={COLORS.text}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="200"
                strokeDashoffset={200 * (1 - interpolate(draw, [i * 0.12, 0.6 + i * 0.12], [0, 1], clamp))}
              />
            ))}
          </svg>
        </div>
        <div style={{display: 'flex', fontSize: 132, fontWeight: 600, letterSpacing: '-0.05em', color: COLORS.text}}>
          {letters.map((l, i) => {
            const p = interpolate(frame, [18 + i * 1.4, 34 + i * 1.4], [0, 1], {...clamp, easing: EASE.out});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 50}px)`,
                  filter: `blur(${(1 - p) * 10}px)`,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
      </div>

      <div style={{position: 'absolute', top: 500, width: '100%'}}>
        <WordReveal
          words={BRAND.tagline}
          start={46}
          stagger={2.5}
          style={{fontSize: 58, fontWeight: 400, letterSpacing: '-0.03em', color: COLORS.muted}}
          wordStyle={(i) => (i === 2 ? {color: COLORS.text, ...highlight(hl)} : {})}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: BTN_Y - 38,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          opacity: Math.min(btn, 1),
          transform: `translateY(${(1 - btn) * 40}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '0 44px',
            height: 76,
            borderRadius: 999,
            background: COLORS.text,
            color: '#fff',
            fontSize: 28,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            transform: `scale(${btn * (1 - press * 0.06)})`,
            boxShadow: `0 20px 50px rgba(17,17,17,${0.22 + press * 0.15})`,
          }}
        >
          {BRAND.cta}
          <span style={{transform: `translateX(${press * 6}px)`}}>→</span>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 120,
              left: `${shimmer * 100}%`,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
              transform: 'skewX(-20deg)',
            }}
          />
        </div>
        <span style={{fontSize: 24, color: COLORS.muted, fontWeight: 500}}>{BRAND.url}</span>
      </div>

      <ClickRipple x={1122} y={BTN_Y + 12} progress={ripple} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={cursorOpacity} />
    </AbsoluteFill>
  );
};
