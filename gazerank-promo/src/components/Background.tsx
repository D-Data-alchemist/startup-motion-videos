import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Soft sage canvas with a faint emerald glow and a slow-moving dot grid
export const Background: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(20,32,28,0.10) 1.2px, transparent 1.6px)',
          backgroundSize: '28px 28px',
          backgroundPosition: `${frame * 0.3}px ${frame * 0.2}px`,
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
        }}
      />
      <div style={{position: 'absolute', width: 1100, height: 900, left: 400 + Math.sin(frame / 60) * 80, top: 100, borderRadius: '50%', background: COLORS.emerald, filter: 'blur(260px)', opacity: 0.12 * intensity}} />
    </AbsoluteFill>
  );
};
