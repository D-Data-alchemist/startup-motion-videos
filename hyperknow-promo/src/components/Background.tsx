import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {COLORS} from '../theme';

// Warm off-white canvas with Hyperknow's dot field + a faint blue glow
export const Background: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  const dots = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          opacity: dots,
          backgroundImage: 'radial-gradient(circle, rgba(17,17,17,0.16) 1.2px, transparent 1.6px)',
          backgroundSize: '26px 26px',
          backgroundPosition: `0px ${-frame * 0.4}px`,
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 15%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 15%, transparent 80%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1200,
          height: 800,
          left: 360 + Math.sin(frame / 70) * 80,
          top: 140,
          borderRadius: '50%',
          background: COLORS.accent,
          filter: 'blur(260px)',
          opacity: 0.07 * intensity,
        }}
      />
    </AbsoluteFill>
  );
};
