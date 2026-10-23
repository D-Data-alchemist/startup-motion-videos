import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Dark station with the orange glow from walkai-talkai.com
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1400, height: 700, left: 260 + Math.sin(frame / 50) * 60, top: -480, borderRadius: '50%', background: COLORS.brand, filter: 'blur(240px)', opacity: 0.32}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px'}} />
    </AbsoluteFill>
  );
};
