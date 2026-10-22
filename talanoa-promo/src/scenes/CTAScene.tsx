import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClickRipple, Cursor, cursorAt} from '../components/Cursor';
import {BRAND, COLORS, EASE, Mark, serifFamily, Wordmark} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_CLICK = 116;
const BTN_Y = 820;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 140}});
  const a = interpolate(frame, [14, 30], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [28, 46], [0, 1], {...clamp, easing: EASE.out});
  const s1 = interpolate(frame, [50, 62], [0, 1], clamp);
  const s2 = interpolate(frame, [60, 72], [0, 1], clamp);
  const btn = spring({frame: frame - 74, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_CLICK - 4, CTA_CLICK, CTA_CLICK + 6], [0, 1, 0], clamp);
  const cursor = cursorAt(frame, [
    {f: 84, x: 1500, y: 1100},
    {f: 112, x: 1050, y: BTN_Y + 8, arc: -60},
  ]);
  return (
    <AbsoluteFill style={{color: '#fff'}}>
      <div style={{position: 'absolute', left: 160, top: 110, display: 'flex', alignItems: 'center', gap: 18, opacity: Math.min(1, logo), transform: `translateY(${(1 - Math.min(logo, 1)) * 20}px)`}}>
        <Mark size={54} light />
        <Wordmark size={60} light />
      </div>
      <div style={{position: 'absolute', left: 160, top: 250, fontFamily: serifFamily, fontWeight: 300, lineHeight: 1.0}}>
        <div style={{fontSize: 150, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, filter: `blur(${(1 - a) * 8}px)`}}>{BRAND.headA}</div>
        <div style={{fontSize: 150, fontStyle: 'italic', opacity: b, transform: `translateY(${(1 - b) * 30}px)`, filter: `blur(${(1 - b) * 8}px)`}}>{BRAND.headB}</div>
      </div>
      <div style={{position: 'absolute', left: 160, top: 620, fontSize: 40, lineHeight: 1.4}}>
        <div style={{color: 'rgba(255,255,255,0.6)', opacity: s1}}>{BRAND.sub[0]}</div>
        <div style={{opacity: s2}}>{BRAND.sub[1]}</div>
      </div>
      <div style={{position: 'absolute', left: 160, top: BTN_Y - 38, display: 'flex', alignItems: 'center', gap: 30, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
        <div style={{height: 76, padding: '0 44px', borderRadius: 999, background: '#fff', color: COLORS.ink, fontSize: 28, fontWeight: 600, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.06})`, boxShadow: `0 0 0 ${press * 10}px rgba(199,166,255,0.25)`}}>
          {BRAND.cta} ↓
        </div>
        <div style={{fontSize: 24, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5}}>
          {BRAND.platforms}
          <br />
          <span style={{color: '#fff', fontWeight: 600}}>{BRAND.url}</span>
        </div>
      </div>
      <ClickRipple x={1054} y={BTN_Y + 12} progress={interpolate(frame, [CTA_CLICK, CTA_CLICK + 20], [0, 1], clamp)} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [84, 92, 136, 146], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
