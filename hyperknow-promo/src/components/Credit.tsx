import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Studio sign-off appended after every film: the Waltz_studz mark draws itself, then "Made by waltz_studz"
export const STUDIO = 'Waltz_studz';
export const CREDIT_FRAMES = 60;

// The mark: one flowing three-beat "W" (a waltz is in 3/4) with a play mark, on a violet→coral badge
export const StudioMark: React.FC<{size: number; draw?: number}> = ({size, draw = 1}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="wz-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6E44FF" />
        <stop offset="1" stopColor="#FF5C8A" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="30" fill="url(#wz-grad)" />
    <path
      d="M22 38 C 28 60, 32 84, 38 84 C 45 84, 50 52, 60 52 C 70 52, 75 84, 82 84 C 88 84, 92 60, 98 38"
      stroke="#fff"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="200"
      strokeDashoffset={200 * (1 - Math.min(1, draw * 1.25))}
    />
    <path d="M55 26 L68 34 L55 42 Z" fill="#fff" opacity={interpolate(draw, [0.7, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
  </svg>
);

const MadeBy: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const bg = interpolate(frame, [0, 10], [0, 1], clamp);
  const pop = spring({frame: frame - 6, fps, config: {damping: 12, stiffness: 160}});
  const draw = interpolate(frame, [8, 30], [0, 1], clamp);
  const text = interpolate(frame, [18, 32], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, #1A1B2B 0%, #07080D 75%)', opacity: bg, alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
        <div style={{transform: `scale(${pop}) rotate(${(1 - pop) * -20}deg)`, filter: 'drop-shadow(0 20px 40px rgba(110,68,255,0.45))'}}>
          <StudioMark size={150} draw={draw} />
        </div>
        <div style={{opacity: text, transform: `translateX(${(1 - text) * -24}px)`}}>
          <div style={{fontSize: 18, letterSpacing: '0.6em', color: 'rgba(255,255,255,0.55)'}}>MADE BY</div>
          <div style={{fontSize: 84, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 6, lineHeight: 1}}>
            waltz<span style={{color: '#FF5C8A'}}>_</span>
            <span style={{fontWeight: 500}}>studz</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Wraps a film so it plays in full, then the studio credit fades in over its last frames
export const withCredit = (Film: React.FC, length: number): React.FC => {
  const Wrapped: React.FC = () => (
    <AbsoluteFill>
      <Sequence durationInFrames={length}>
        <Film />
      </Sequence>
      <Sequence from={length - 8}>
        <MadeBy />
      </Sequence>
    </AbsoluteFill>
  );
  return Wrapped;
};
