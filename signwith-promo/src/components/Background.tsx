import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Clean cool-white canvas with a faint navy glow
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1100, height: 900, left: 300 + Math.sin(frame / 70) * 70, top: -300, borderRadius: '50%', background: COLORS.navy, filter: 'blur(260px)', opacity: 0.12}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(43,83,130,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(43,83,130,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)'}} />
    </AbsoluteFill>
  );
};
