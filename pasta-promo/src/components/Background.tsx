import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Chiaroscuro: near-black canvas with a warm painterly light that slowly breathes
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const b = 0.9 + 0.1 * Math.sin(frame / 40);
  return (
    <AbsoluteFill style={{background: COLORS.night}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 60% at 38% 42%, rgba(197,142,44,${0.22 * b}) 0%, rgba(17,15,13,0.6) 45%, transparent 75%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};
