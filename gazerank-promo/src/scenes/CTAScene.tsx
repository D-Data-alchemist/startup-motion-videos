import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClickRipple, Cursor, cursorAt} from '../components/Cursor';
import {WordReveal} from '../components/WordReveal';
import {BRAND, COLORS, EASE, EyeMark, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_CLICK = 116;
const BTN_Y = 720;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(frame, [2, 30], [0, 1], {...clamp, easing: EASE.out});
  const pop = spring({frame: frame - 2, fps, config: {damping: 12, stiffness: 140}});
  const word = interpolate(frame, [16, 32], [0, 1], {...clamp, easing: EASE.out});
  const btn = spring({frame: frame - 70, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_CLICK - 4, CTA_CLICK, CTA_CLICK + 6], [0, 1, 0], clamp);
  const shimmer = interpolate(frame, [92, 124], [-0.3, 1.3], clamp);
  const cursor = cursorAt(frame, [
    {f: 84, x: 1500, y: 1100},
    {f: 112, x: 1100, y: BTN_Y + 6, arc: -60},
  ]);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 200, display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{transform: `scale(${pop})`}}>
          <EyeMark size={150} draw={draw} look={Math.sin(frame / 14) * 0.6} />
        </div>
        <div style={{fontSize: 130, fontWeight: 800, letterSpacing: '-0.05em', color: COLORS.ink, opacity: word, transform: `translateX(${(1 - word) * -30}px)`}}>{BRAND.name}</div>
      </div>
      <div style={{position: 'absolute', top: 430, width: '100%'}}>
        <WordReveal words={BRAND.tagline.split(' ')} start={34} stagger={2.5} style={{fontSize: 54, fontWeight: 600, letterSpacing: '-0.03em', color: COLORS.muted}} wordStyle={(i) => (i >= 3 && i <= 5 ? {color: COLORS.emeraldDeep} : {})} />
      </div>
      <div style={{position: 'absolute', top: BTN_Y - 38, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: Math.min(1, btn), transform: `translateY(${(1 - btn) * 40}px)`}}>
        <div style={{position: 'relative', overflow: 'hidden', height: 76, padding: '0 46px', borderRadius: 999, background: COLORS.emerald, color: '#06281C', fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${btn * (1 - press * 0.06)})`, boxShadow: `0 20px 50px rgba(16,185,129,${0.35 + press * 0.2})`}}>
          {BRAND.cta} →
          <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: `${shimmer * 100}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(-20deg)'}} />
        </div>
        <div style={{fontSize: 26, fontWeight: 600, color: COLORS.ink}}>{BRAND.url}</div>
        <div style={{fontFamily: monoFamily, fontSize: 18, color: COLORS.muted}}>{BRAND.fine}</div>
      </div>
      <ClickRipple x={1104} y={BTN_Y + 10} progress={interpolate(frame, [CTA_CLICK, CTA_CLICK + 20], [0, 1], clamp)} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [84, 92, 136, 146], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
