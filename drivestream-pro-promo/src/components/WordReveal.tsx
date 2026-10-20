import {useCurrentFrame, interpolate} from 'remotion';
import {EASE} from '../theme';

// Per-word blur → sharp, slide-up reveal (the "premium SaaS" kinetic type look)
export const WordReveal: React.FC<{
  words: string[];
  start: number;
  stagger?: number;
  duration?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number) => React.CSSProperties;
}> = ({words, start, stagger = 3, duration = 18, style, wordStyle}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em', ...style}}>
      {words.map((w, i) => {
        const p = interpolate(frame, [start + i * stagger, start + i * stagger + duration], [0, 1], {
          easing: EASE.out,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              filter: `blur(${(1 - p) * 14}px)`,
              transform: `translateY(${(1 - p) * 40}px)`,
              ...wordStyle?.(i),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
