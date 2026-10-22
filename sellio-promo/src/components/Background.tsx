import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Warm white canvas with a soft orange glow, echoing sellio.chat
export const Background: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.canvas, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1000, height: 900, right: -200 + Math.sin(frame / 60) * 60, top: -250, borderRadius: '50%', background: COLORS.orange, filter: 'blur(260px)', opacity: 0.16 * intensity}} />
      <div style={{position: 'absolute', width: 800, height: 700, left: -250, bottom: -300, borderRadius: '50%', background: '#FFC9A8', filter: 'blur(240px)', opacity: 0.35 * intensity}} />
    </AbsoluteFill>
  );
};
