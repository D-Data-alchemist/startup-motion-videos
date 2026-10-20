import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {Cursor, ClickRipple, cursorAt} from '../components/Cursor';
import {WordReveal} from '../components/WordReveal';
import {BRAND, COLORS, EASE, LogoMark, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CLICK = 116;
const BTN_Y = 790;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mark = spring({frame: frame - 2, fps, config: {damping: 13, stiffness: 120}});
  const draw = interpolate(frame, [4, 30], [0, 1], {...clamp, easing: EASE.out});
  const word = interpolate(frame, [10, 28], [0, 1], {...clamp, easing: EASE.out});
  const sub = interpolate(frame, [62, 78], [0, 1], {...clamp, easing: EASE.out});
  const btn = spring({frame: frame - 76, fps, config: {damping: 14, stiffness: 140}});
  const shimmer = interpolate(frame, [96, 128], [-0.3, 1.3], clamp);
  const press = interpolate(frame, [CLICK - 4, CLICK, CLICK + 6], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [CLICK, CLICK + 20], [0, 1], clamp);
  const cursor = cursorAt(frame, [
    {f: 84, x: 1500, y: 1100},
    {f: 112, x: 1060, y: BTN_Y + 8, arc: -60},
  ]);
  const cursorOpacity = interpolate(frame, [84, 92, 136, 146], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      {/* Lockup */}
      <div style={{position: 'absolute', top: 170, display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{transform: `scale(${mark}) rotate(${(1 - mark) * -20}deg)`}}>
          <LogoMark size={92} draw={draw} />
        </div>
        <div style={{fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', color: COLORS.text, opacity: word, transform: `translateX(${(1 - word) * -20}px)`}}>
          {BRAND.name}
          <span style={{fontWeight: 400, color: COLORS.muted}}> {BRAND.suffix}</span>
        </div>
      </div>

      {/* Tagline, straight from the landing page */}
      <div style={{position: 'absolute', top: 320, width: '100%'}}>
        <WordReveal words={BRAND.taglineA.split(' ')} start={24} style={{fontSize: 150, fontWeight: 700, letterSpacing: '-0.05em', color: COLORS.text, lineHeight: 1.05}} />
        <WordReveal words={BRAND.taglineB.split(' ')} start={40} style={{fontSize: 150, fontWeight: 700, letterSpacing: '-0.05em', color: COLORS.accent, lineHeight: 1.05}} />
      </div>
      <div style={{position: 'absolute', top: 680, fontFamily: monoFamily, fontSize: 22, letterSpacing: '0.08em', color: COLORS.muted, opacity: sub}}>{BRAND.sub}</div>

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          top: BTN_Y - 38,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          opacity: Math.min(btn, 1),
          transform: `translateY(${(1 - btn) * 40}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '0 46px',
            height: 76,
            borderRadius: 999,
            background: COLORS.accent,
            color: '#fff',
            fontSize: 28,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            transform: `scale(${btn * (1 - press * 0.06)})`,
            boxShadow: `0 20px 50px rgba(35,72,216,${0.3 + press * 0.2})`,
          }}
        >
          {BRAND.cta}
          <span style={{transform: `translate(${press * 4}px, ${-press * 4}px)`}}>↗</span>
          <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: `${shimmer * 100}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', transform: 'skewX(-20deg)'}} />
        </div>
        <span style={{fontSize: 24, color: COLORS.muted, fontWeight: 500}}>{BRAND.url}</span>
      </div>

      <ClickRipple x={1064} y={BTN_Y + 12} progress={ripple} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={cursorOpacity} />
    </AbsoluteFill>
  );
};
