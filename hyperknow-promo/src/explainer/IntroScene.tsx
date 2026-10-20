import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {WordReveal} from '../components/WordReveal';
import {BRAND, COLORS, EASE, MARK_PATHS, highlight} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// "Meet Hyperknow" — logo lockup + positioning line from the launch post
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame: frame - 2, fps, config: {damping: 13, stiffness: 120}});
  const draw = interpolate(frame, [6, 34], [0, 1], {...clamp, easing: EASE.out});
  const hl = interpolate(frame, [78, 96], [0, 1], {...clamp, easing: EASE.out});
  const exit = interpolate(frame, [128, 150], [0, 1], {...clamp, easing: EASE.in});

  return (
    <AbsoluteFill style={{alignItems: 'center', opacity: 1 - exit, filter: `blur(${exit * 14}px)`}}>
      <div style={{position: 'absolute', top: 300, display: 'flex', alignItems: 'center', gap: 28}}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 32,
            background: COLORS.surface,
            border: `1px solid ${COLORS.borderHi}`,
            boxShadow: '0 24px 60px rgba(17,17,17,0.12)',
            transform: `scale(${mark}) rotate(${(1 - mark) * -30}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="80" height="80" viewBox="0 0 96 96">
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
        <WordReveal words={['Meet', BRAND.name]} start={10} style={{fontSize: 104, fontWeight: 600, letterSpacing: '-0.05em', color: COLORS.text}} />
      </div>
      <div style={{position: 'absolute', top: 520, width: '100%'}}>
        <WordReveal
          words={['The', 'AI', 'professor', 'that', 'turns', 'any', 'learning', 'goal']}
          start={36}
          stagger={2}
          style={{fontSize: 52, fontWeight: 400, letterSpacing: '-0.03em', color: COLORS.muted}}
        />
        <WordReveal
          words={['into', 'a', '1-on-1,', 'interactive', 'course.']}
          start={52}
          stagger={2.5}
          style={{fontSize: 52, fontWeight: 400, letterSpacing: '-0.03em', color: COLORS.muted, marginTop: 8}}
          wordStyle={(i) => (i >= 2 ? {color: COLORS.text, ...highlight(hl)} : {})}
        />
      </div>
    </AbsoluteFill>
  );
};
