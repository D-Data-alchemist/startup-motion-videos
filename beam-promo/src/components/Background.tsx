import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Near-black green with a mint glow from below, like beam.win
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at 50% 120%, #0F2A20 0%, ${COLORS.bg} 55%)`, overflow: 'hidden'}}>
      {Array.from({length: 60}, (_, i) => {
        const x = (i * 337) % 1920, y = (i * 191) % 1080;
        return <div key={i} style={{position: 'absolute', left: x, top: (y - frame * (0.2 + (i % 5) * 0.08) + 1080) % 1080, width: 2, height: 2, borderRadius: 1, background: COLORS.mintLit, opacity: 0.08 + (i % 4) * 0.05}} />;
      })}
    </AbsoluteFill>
  );
};
