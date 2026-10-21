import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';

// Studio sign-off appended after every film: "Made by Waltz_studz"
export const STUDIO = 'Waltz_studz';
export const CREDIT_FRAMES = 60;

const MadeBy: React.FC = () => {
  const frame = useCurrentFrame();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const bg = interpolate(frame, [0, 12], [0, 1], clamp);
  const text = interpolate(frame, [10, 24], [0, 1], clamp);
  const line = interpolate(frame, [18, 36], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, #1A1F33 0%, #07080D 75%)`, opacity: bg, alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif'}}>
      <div style={{opacity: text, transform: `translateY(${(1 - text) * 16}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 18, letterSpacing: '0.6em', color: 'rgba(255,255,255,0.55)', marginLeft: '0.6em'}}>MADE BY</div>
        <div style={{fontSize: 76, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginTop: 14}}>{STUDIO}</div>
        <div style={{height: 2, width: 220 * line, background: '#fff', opacity: 0.6, margin: '18px auto 0'}} />
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
