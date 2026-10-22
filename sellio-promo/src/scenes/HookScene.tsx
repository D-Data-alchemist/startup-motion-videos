import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChannelBadge, Channel, COLORS, EASE, Icon, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {pop: (i: number) => 6 + i * 5, line1: 18, line2: 56, suck: [82, 100], icon: 86};
const PINGS: {ch: Channel; msg: string; x: number; y: number}[] = [
  {ch: 'whatsapp', msg: 'Is this still in stock?', x: 360, y: 190},
  {ch: 'instagram', msg: 'Do you ship to Lagos?', x: 1520, y: 170},
  {ch: 'email', msg: 'Where is my order??', x: 300, y: 700},
  {ch: 'telegram', msg: 'Can I change my booking?', x: 1620, y: 700},
  {ch: 'web', msg: 'Hello? Anyone there?', x: 420, y: 850},
  {ch: 'whatsapp', msg: 'Need a refund pls', x: 1480, y: 860},
  {ch: 'instagram', msg: 'Price for 3 pieces?', x: 900, y: 110},
  {ch: 'email', msg: 'Re: Re: Re: Invoice', x: 1000, y: 950},
  {ch: 'telegram', msg: 'Is the API down?', x: 1180, y: 300},
  {ch: 'web', msg: 'Quick question…', x: 720, y: 330},
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const suck = interpolate(frame, HOOK.suck, [0, 1], {...clamp, easing: EASE.in});
  const icon = spring({frame: frame - HOOK.icon, fps, config: {damping: 11, stiffness: 160}});
  const t = (at: number) => interpolate(frame, [at, at + 10], [0, 1], {...clamp, easing: EASE.out});
  const count = Math.min(99, Math.round(interpolate(frame, [6, 80], [0, 47], clamp)));

  return (
    <AbsoluteFill>
      {PINGS.map((p, i) => {
        const pop = spring({frame: frame - HOOK.pop(i), fps, config: {damping: 12, stiffness: 190}});
        const wob = Math.sin((frame + i * 17) / 9) * 6;
        const x = interpolate(suck, [0, 1], [p.x, 960]);
        const y = interpolate(suck, [0, 1], [p.y, 540]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y + wob,
              transform: `translate(-50%, -50%) scale(${Math.min(1, pop) * (1 - suck * 0.8)}) rotate(${(1 - suck) * (i % 2 ? 3 : -3)}deg)`,
              opacity: Math.min(1, pop * 2) * (1 - suck),
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 20px 14px 14px',
              borderRadius: 18,
              background: '#fff',
              border: `1px solid ${COLORS.line}`,
              boxShadow: '0 18px 40px rgba(25,25,25,0.10)',
              fontSize: 22,
              fontWeight: 500,
              color: COLORS.text,
              whiteSpace: 'nowrap',
            }}
          >
            <ChannelBadge ch={p.ch} size={32} />
            {p.msg}
          </div>
        );
      })}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - interpolate(frame, [HOOK.suck[0] - 6, HOOK.suck[0] + 4], [0, 1], clamp)}}>
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: '-0.05em', color: COLORS.ink, opacity: t(HOOK.line1), transform: `translateY(${(1 - t(HOOK.line1)) * 30}px)`}}>Customers message you everywhere.</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 14, opacity: t(HOOK.line2), transform: `translateY(${(1 - t(HOOK.line2)) * 30}px)`}}>
          <span style={{fontFamily: monoFamily, fontSize: 30, padding: '8px 16px', borderRadius: 10, background: COLORS.ink, color: '#fff'}}>3:12 AM</span>
          <span style={{fontSize: 64, color: COLORS.muted, fontWeight: 600, letterSpacing: '-0.03em'}}>
            …and they expect an answer <span style={{color: COLORS.orangeDeep}}>now.</span>
          </span>
        </div>
        <div style={{position: 'absolute', top: 120, right: 140, fontFamily: monoFamily, fontSize: 22, color: COLORS.red, opacity: t(10)}}>● {count} unanswered</div>
      </AbsoluteFill>

      {/* everything gets swallowed by the Sellio icon */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${icon * (1 + 0.15 * Math.exp(-Math.max(0, frame - HOOK.suck[1]) / 4))})`, filter: 'drop-shadow(0 30px 50px rgba(240,82,26,0.35))'}}>
          <Icon size={200} style={{borderRadius: 46}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
