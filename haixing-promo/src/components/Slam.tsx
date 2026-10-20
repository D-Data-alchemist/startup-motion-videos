import {interpolate, useCurrentFrame} from 'remotion';
import {EASE} from '../theme';

// Hard-hitting title: scales down from big + blur into place on the beat
export const Slam: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number}> = ({at, children, style, from = 1.6}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.snap});
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        transform: `scale(${from - (from - 1) * p})`,
        filter: `blur(${(1 - Math.min(p, 1)) * 12}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Thin red "heartbeat" rule from the brochure title slide
export const Pulse: React.FC<{width: number; progress: number; flip?: boolean}> = ({width, progress, flip}) => (
  <svg width={width} height="40" viewBox={`0 0 ${width} 40`} style={{transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible'}}>
    <path
      d={`M0 20 L${width - 70} 20 L${width - 58} 4 L${width - 46} 36 L${width - 36} 12 L${width - 28} 20 L${width} 20`}
      fill="none"
      stroke="#E0312F"
      strokeWidth="2.5"
      strokeLinejoin="round"
      strokeDasharray={width + 80}
      strokeDashoffset={(width + 80) * (1 - progress)}
    />
  </svg>
);
