import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClickRipple, Cursor, cursorAt} from '../components/Cursor';
import {BRAND, COLORS, EASE, Icon, serifFamily, Wordmark} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_CLICK = 116;
const BTN_Y = 760;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const icon = spring({frame: frame - 2, fps, config: {damping: 11, stiffness: 150}});
  const word = interpolate(frame, [12, 28], [0, 1], {...clamp, easing: EASE.out});
  const tag = interpolate(frame, [32, 46], [0, 1], {...clamp, easing: EASE.out});
  const handled = interpolate(frame, [46, 56], [0, 1], {...clamp, easing: EASE.snap});
  const sub = interpolate(frame, [58, 72], [0, 1], clamp);
  const btn = spring({frame: frame - 74, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_CLICK - 4, CTA_CLICK, CTA_CLICK + 6], [0, 1, 0], clamp);
  const cursor = cursorAt(frame, [
    {f: 84, x: 1500, y: 1100},
    {f: 112, x: 1040, y: BTN_Y + 8, arc: -60},
  ]);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 120, display: 'flex', alignItems: 'center', gap: 30}}>
        <div style={{transform: `scale(${icon}) rotate(${(1 - icon) * -25}deg)`, filter: 'drop-shadow(0 24px 40px rgba(240,82,26,0.35))'}}>
          <Icon size={150} style={{borderRadius: 36}} />
        </div>
        <div style={{opacity: word, transform: `translateX(${(1 - word) * -30}px)`}}>
          <Wordmark size={170} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 400, display: 'flex', alignItems: 'baseline', gap: 22, fontSize: 84, fontWeight: 700, letterSpacing: '-0.045em', color: COLORS.ink}}>
        <span style={{opacity: tag, transform: `translateY(${(1 - tag) * 24}px)`, display: 'inline-block'}}>{BRAND.tagline}</span>
        <span style={{fontFamily: serifFamily, fontStyle: 'italic', fontWeight: 400, fontSize: 104, letterSpacing: '-0.02em', color: COLORS.orangeDeep, display: 'inline-block', opacity: Math.min(1, handled * 2), transform: `scale(${1.6 - 0.6 * handled}) rotate(${(1 - handled) * -6}deg)`}}>{BRAND.taglineEnd}</span>
      </div>
      <div style={{position: 'absolute', top: 540, fontSize: 30, color: COLORS.muted, opacity: sub}}>{BRAND.sub}</div>
      <div style={{position: 'absolute', top: BTN_Y - 38, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: Math.min(1, btn), transform: `translateY(${(1 - btn) * 40}px)`}}>
        <div style={{height: 76, padding: '0 46px', borderRadius: 999, background: COLORS.ink, color: '#fff', fontSize: 30, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${btn * (1 - press * 0.06)})`, boxShadow: `0 20px 50px rgba(25,25,25,${0.25 + press * 0.15})`}}>
          {BRAND.cta} →
        </div>
        <div style={{fontSize: 26, fontWeight: 600, color: COLORS.ink}}>{BRAND.url}</div>
        <div style={{fontSize: 20, color: COLORS.muted}}>{BRAND.fine}</div>
      </div>
      <ClickRipple x={1044} y={BTN_Y + 12} progress={interpolate(frame, [CTA_CLICK, CTA_CLICK + 20], [0, 1], clamp)} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [84, 92, 136, 146], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
