import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Warm cream canvas with soft peach + blue light, like drivestream.pro
export const Background: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70) * 70;
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1100, height: 900, left: -200 + drift, top: -300, borderRadius: '50%', background: '#FFD9C2', filter: 'blur(240px)', opacity: 0.5 * intensity}} />
      <div style={{position: 'absolute', width: 1000, height: 900, right: -250 - drift, bottom: -350, borderRadius: '50%', background: '#C9D6FF', filter: 'blur(240px)', opacity: 0.45 * intensity}} />
    </AbsoluteFill>
  );
};
