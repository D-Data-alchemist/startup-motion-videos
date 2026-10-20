import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {WordReveal} from './WordReveal';
import {COLORS, EASE, highlight} from '../theme';

type Line = {words: string[]; start: number; muted?: boolean; highlightFrom?: number};

// Centered kinetic statement with optional blue marker sweep on the last words
export const TitleCard: React.FC<{lines: Line[]; exitAt: number; size?: number; hlStart?: number}> = ({
  lines,
  exitAt,
  size = 84,
  hlStart = 0,
}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [exitAt, exitAt + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.in});
  const hl = interpolate(frame, [hlStart, hlStart + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.out});
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
        padding: '0 120px',
        opacity: 1 - exit,
        filter: `blur(${exit * 14}px)`,
        transform: `scale(${1 + exit * 0.08})`,
      }}
    >
      {lines.map((l, i) => (
        <WordReveal
          key={i}
          words={l.words}
          start={l.start}
          stagger={2.5}
          style={{fontSize: size, fontWeight: 500, letterSpacing: '-0.04em', color: l.muted ? COLORS.muted : COLORS.text}}
          wordStyle={(w) => (l.highlightFrom !== undefined && w >= l.highlightFrom ? {color: COLORS.text, ...highlight(hl)} : {})}
        />
      ))}
    </AbsoluteFill>
  );
};
