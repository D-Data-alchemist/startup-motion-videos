import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, EASE, Serif} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {pings: [24, 32, 40, 48, 56], line2: 70};
const PINGS = [
  {t: 'Was that 10 reps or 12?', x: 420, y: 560},
  {t: 'Rest 60s… or 90?', x: 1480, y: 600},
  {t: 'What’s the next exercise?', x: 560, y: 760},
  {t: '🔔 3 new notifications', x: 1380, y: 800},
  {t: 'Wait, which set am I on?', x: 960, y: 920},
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // on screen from frame 0: snaps in over 5 frames
  const head = interpolate(frame, [0, 5], [0, 1], {...clamp, easing: EASE.out});
  const line2 = interpolate(frame, [HOOK.line2, HOOK.line2 + 10], [0, 1], {...clamp, easing: EASE.out});
  const clear = interpolate(frame, [HOOK.line2 - 6, HOOK.line2 + 6], [0, 1], {...clamp, easing: EASE.in});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: 1 - exit}}>
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', transform: `scale(${1.12 - 0.12 * head}) translateY(${-clear * 60}px)`, opacity: head}}>
        <Serif size={124} color={COLORS.cream}>
          Still checking your phone
        </Serif>
        <br />
        <Serif size={124}>between sets?</Serif>
      </div>
      {PINGS.map((p, i) => {
        const s = spring({frame: frame - HOOK.pings[i], fps, config: {damping: 11, stiffness: 220}});
        return (
          <div key={i} style={{position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%, -50%) scale(${Math.min(1, s) * (1 - clear)}) rotate(${i % 2 ? 3 : -3}deg)`, opacity: Math.min(1, s * 2) * (1 - clear), padding: '16px 24px', borderRadius: 18, background: 'rgba(237,233,226,0.95)', color: '#111', fontSize: 30, fontWeight: 600, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', whiteSpace: 'nowrap'}}>
            {p.t}
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', opacity: line2, transform: `translateY(${(1 - line2) * 30}px)`}}>
        <div style={{fontSize: 64, fontWeight: 700, color: COLORS.cream, letterSpacing: '-0.03em'}}>
          Put it in your bag. <span style={{color: COLORS.gold}}>Pasta talks you through it.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
