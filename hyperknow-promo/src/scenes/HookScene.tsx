import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {WordReveal} from '../components/WordReveal';
import {BRAND, COLORS, EASE, highlight} from '../theme';

// The problem: learning from scattered, overwhelming resources
const CHIPS = [
  {name: 'SQL Full Course · 4:12:08', x: 330, y: 200, color: '#EF4444'},
  {name: 'postgres-manual.pdf · 3,214 pp', x: 1560, y: 180, color: '#3B6CF6'},
  {name: 'Where do I even start?', x: 300, y: 760, color: '#F59E0B'},
  {name: '17 bookmarked tutorials', x: 1640, y: 760, color: '#8B5CF6'},
  {name: 'Course #4 (abandoned)', x: 420, y: 930, color: '#9CA3AF'},
  {name: 'Stack Overflow · 38 tabs', x: 1500, y: 930, color: '#F97316'},
  {name: 'notes_v2.md (empty)', x: 860, y: 120, color: '#10B981'},
  {name: 'Which tutorial first?', x: 1080, y: 980, color: '#EC4899'},
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exit = interpolate(frame, [68, 92], [0, 1], {...clamp, easing: EASE.in});
  const mark = interpolate(frame, [44, 62], [0, 1], {...clamp, easing: EASE.out});

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
              gap: 14,
              padding: '14px 22px 14px 14px',
              borderRadius: 14,
              background: COLORS.surface,
              border: `1px solid ${COLORS.borderHi}`,
              boxShadow: '0 18px 40px rgba(17,17,17,0.10)',
              color: COLORS.text,
              fontSize: 22,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{width: 30, height: 30, borderRadius: 8, background: `${c.color}22`, border: `1.5px solid ${c.color}`}} />
            {c.name}
          </div>
        );
      })}

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 6,
          transform: `scale(${1 + exit * 0.25})`,
          opacity: 1 - exit,
          filter: `blur(${exit * 16}px)`,
        }}
      >
        <WordReveal
          words={BRAND.hookLine1}
          start={4}
          style={{fontSize: 92, fontWeight: 500, letterSpacing: '-0.04em', color: COLORS.text}}
        />
        <WordReveal
          words={BRAND.hookLine2}
          start={24}
          stagger={2.5}
          style={{fontSize: 92, fontWeight: 500, letterSpacing: '-0.04em', color: COLORS.text}}
          wordStyle={(i) => (i >= 2 ? highlight(mark) : {})}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
