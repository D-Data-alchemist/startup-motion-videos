import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Mochi, NEUTRAL} from '../components/Mochi';
import {COLORS, EASE, serif} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {type: [6, 34], erase: [42, 52], line2: 62, mochi: 64};
const DRAFT = 'Dear diary, today I…';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = interpolate(frame, [0, 6], [0, 1], {...clamp, easing: EASE.out});
  const typed = Math.round(interpolate(frame, HOOK.type, [0, DRAFT.length], clamp));
  const erased = Math.round(interpolate(frame, HOOK.erase, [0, DRAFT.length], clamp));
  const shown = DRAFT.slice(0, Math.max(0, typed - erased));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const swap = interpolate(frame, [HOOK.line2 - 6, HOOK.line2 + 6], [0, 1], {...clamp, easing: EASE.inOut});
  const pop = spring({frame: frame - HOOK.mochi, fps, config: {damping: 9, stiffness: 160}});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  const blink = frame > 84 && frame < 90 ? 1 : 0;
  return (
    <AbsoluteFill style={{opacity: 1 - exit, color: COLORS.fg}}>
      {/* line 1 — on screen from frame 0 */}
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: serif, fontWeight: 700, fontSize: 124, letterSpacing: '-0.02em', opacity: head * (1 - swap), transform: `scale(${1.08 - 0.08 * head}) translateY(${-swap * 40}px)`}}>
        Journaling feels like <span style={{color: COLORS.accent}}>homework?</span>
      </div>
      {/* the blank page */}
      <div style={{position: 'absolute', left: 460, top: 400, width: 1000, height: 380, borderRadius: 24, background: COLORS.surface, boxShadow: '0 30px 80px rgba(51,52,53,0.10)', opacity: head * (1 - swap), transform: `translateY(${swap * 80}px) rotate(${-1 + swap * -3}deg)`, backgroundImage: 'repeating-linear-gradient(transparent 0 63px, #E9E6DF 63px 64px)', backgroundPosition: '0 40px', padding: '52px 70px'}}>
        <div style={{fontSize: 44, color: COLORS.muted, fontWeight: 500}}>
          {shown}
          <span style={{display: 'inline-block', width: 3, height: 50, marginLeft: 4, background: COLORS.fg, verticalAlign: 'middle', opacity: caret ? 1 : 0}} />
        </div>
      </div>
      {/* line 2 + Mochi */}
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: serif, fontWeight: 700, fontSize: 124, letterSpacing: '-0.02em', opacity: swap, transform: `translateY(${(1 - swap) * 40}px)`}}>
        Just <span style={{color: COLORS.tealDeep}}>talk</span> to Mochi.
      </div>
      <div style={{position: 'absolute', left: 960 - 210, top: 380, transform: `scale(${pop}) translateY(${Math.sin(frame / 7) * 6}px)`, opacity: Math.min(1, pop * 2)}}>
        <Mochi id="hook-mochi" emotions={NEUTRAL} size={420} blink={blink} wobble={frame / 10} />
      </div>
    </AbsoluteFill>
  );
};
