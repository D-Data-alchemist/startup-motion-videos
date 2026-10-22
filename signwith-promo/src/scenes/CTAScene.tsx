import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClickRipple, Cursor, cursorAt} from '../components/Cursor';
import {BRAND, COLORS, displayFamily, EASE, Logo} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_CLICK = 116;
const BTN_Y = 760;

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: frame - 2, fps, config: {damping: 13, stiffness: 140}});
  const a = interpolate(frame, [16, 30], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [28, 38], [0, 1], {...clamp, easing: EASE.snap});
  const sub = interpolate(frame, [44, 58], [0, 1], clamp);
  const badge = spring({frame: frame - 60, fps, config: {damping: 14}});
  const btn = spring({frame: frame - 72, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_CLICK - 4, CTA_CLICK, CTA_CLICK + 6], [0, 1, 0], clamp);
  const cursor = cursorAt(frame, [
    {f: 84, x: 1500, y: 1100},
    {f: 112, x: 1000, y: BTN_Y + 8, arc: -60},
  ]);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 90, transform: `scale(${logo})`}}>
        <Logo width={250} />
      </div>
      <div style={{position: 'absolute', top: 330, textAlign: 'center', fontSize: 92, fontWeight: 800, letterSpacing: '-0.045em', color: COLORS.ink, lineHeight: 1.05}}>
        <div style={{opacity: a, transform: `translateY(${(1 - a) * 24}px)`}}>{BRAND.headA}</div>
        <div style={{color: COLORS.navy, display: 'inline-block', opacity: Math.min(1, b * 2), transform: `scale(${1.4 - 0.4 * b})`}}>{BRAND.headB}</div>
      </div>
      <div style={{position: 'absolute', top: 560, fontFamily: displayFamily, fontSize: 40, fontWeight: 500, color: COLORS.ink, opacity: sub}}>{BRAND.sub}</div>
      <div style={{position: 'absolute', top: 640, padding: '8px 16px', borderRadius: 999, background: '#E7EEF7', color: COLORS.navy, fontSize: 20, fontWeight: 600, opacity: Math.min(1, badge), transform: `scale(${Math.min(1, badge)})`}}>New · SignWith API and MCP server are live</div>
      <div style={{position: 'absolute', top: BTN_Y - 38 + 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 40}px)`}}>
        <div style={{height: 76, padding: '0 50px', borderRadius: 12, background: COLORS.navy, color: '#fff', fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.06})`, boxShadow: `0 20px 50px rgba(43,83,130,${0.3 + press * 0.2})`}}>{BRAND.cta} — 3 docs free every month</div>
        <div style={{fontSize: 26, fontWeight: 700, color: COLORS.logo}}>{BRAND.url}</div>
        <div style={{fontSize: 18, color: COLORS.muted}}>{BRAND.fine}</div>
      </div>
      <ClickRipple x={1004} y={BTN_Y + 62} progress={interpolate(frame, [CTA_CLICK, CTA_CLICK + 20], [0, 1], clamp)} />
      <Cursor x={cursor.x} y={cursor.y + 50} press={press} opacity={interpolate(frame, [84, 92, 136, 146], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
