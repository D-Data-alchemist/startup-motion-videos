import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Warm paper with the soft teal blurs from Emochi's App Store art
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 900, height: 700, left: -250 + Math.sin(frame / 60) * 40, top: -300, borderRadius: '50%', background: COLORS.teal, filter: 'blur(200px)', opacity: 0.22}} />
      <div style={{position: 'absolute', width: 800, height: 700, right: -250, bottom: -350 + Math.cos(frame / 70) * 40, borderRadius: '50%', background: COLORS.teal, filter: 'blur(220px)', opacity: 0.18}} />
    </AbsoluteFill>
  );
};
