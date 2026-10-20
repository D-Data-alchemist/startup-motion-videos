import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {WordReveal} from '../components/WordReveal';
import {BRAND, COLORS, EASE, Eyebrow} from '../theme';

// The problem: keeping a channel live around the clock by hand
const CHIPS = [
  {name: '⚠ Stream offline · 3:12 AM', x: 360, y: 200, color: COLORS.live},
  {name: 'OBS not responding', x: 1560, y: 190, color: COLORS.live},
  {name: 'Laptop on all night again', x: 300, y: 770, color: '#F59E0B'},
  {name: 'Missed peak hours', x: 1630, y: 770, color: '#F59E0B'},
  {name: '0 watching now', x: 430, y: 940, color: COLORS.muted},
  {name: 'Reconnecting… (4)', x: 1500, y: 940, color: COLORS.live},
  {name: 'Re-upload the replay?', x: 880, y: 120, color: COLORS.accent},
  {name: 'Wi-Fi dropped', x: 1100, y: 985, color: COLORS.muted},
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exit = interpolate(frame, [68, 92], [0, 1], {...clamp, easing: EASE.in});
  const eyebrow = interpolate(frame, [2, 16], [0, 1], {...clamp, easing: EASE.out});

  return (
    <AbsoluteFill>
      {CHIPS.map((c, i) => {
        const pop = spring({frame: frame - (6 + i * 4), fps, config: {damping: 14, stiffness: 160}});
        const floatX = Math.sin((frame + i * 20) / 18) * 8;
        const floatY = Math.cos((frame + i * 13) / 15) * 10;
        const tilt = Math.sin((frame + i * 30) / 25) * 3 + (i % 2 ? 3 : -3);
        const x = interpolate(exit, [0, 1], [c.x, 960]);
        const y = interpolate(exit, [0, 1], [c.y, 540]);
        return (
          <div
            key={c.name}
            style={{
              position: 'absolute',
              left: x + floatX,
              top: y + floatY,
              transform: `translate(-50%, -50%) scale(${pop * (1 - exit * 0.7)}) rotate(${tilt * (1 - exit)}deg)`,
              opacity: Math.min(pop, 1) * (1 - exit),
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 22px',
              borderRadius: 14,
              background: COLORS.surface,
              border: `1px solid ${COLORS.borderHi}`,
              boxShadow: '0 18px 40px rgba(20,27,52,0.10)',
              color: COLORS.text,
              fontSize: 22,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{width: 10, height: 10, borderRadius: '50%', background: c.color, opacity: 0.6 + 0.4 * Math.sin(frame / 4 + i)}} />
            {c.name}
          </div>
        );
      })}

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 4,
          transform: `scale(${1 + exit * 0.25})`,
          opacity: 1 - exit,
          filter: `blur(${exit * 16}px)`,
        }}
      >
        <Eyebrow text={BRAND.eyebrow} style={{opacity: eyebrow, marginBottom: 26}} />
        <WordReveal words={BRAND.hookLine1} start={6} style={{fontSize: 100, fontWeight: 700, letterSpacing: '-0.045em', color: COLORS.text}} />
        <WordReveal
          words={BRAND.hookLine2}
          start={26}
          stagger={2.5}
          style={{fontSize: 100, fontWeight: 700, letterSpacing: '-0.045em', color: COLORS.accent}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
