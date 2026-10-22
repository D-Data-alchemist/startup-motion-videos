import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Soft blue-white canvas with a faint blueprint grid
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(11,99,229,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,99,229,0.05) 1px, transparent 1px)', backgroundSize: '56px 56px', backgroundPosition: `${frame * 0.3}px 0px`}} />
      <div style={{position: 'absolute', width: 1000, height: 800, right: -200, top: -300, borderRadius: '50%', background: COLORS.blue, filter: 'blur(260px)', opacity: 0.1}} />
    </AbsoluteFill>
  );
};
