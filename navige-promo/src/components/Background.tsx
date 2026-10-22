import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, SCENES} from '../theme';

// Navige royal blue; the hook starts on deep night, then blooms into blue
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const blue = interpolate(frame, [SCENES.app.from - 10, SCENES.app.from + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: COLORS.night}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${COLORS.blue} 0%, ${COLORS.blueDeep} 70%)`, opacity: blue}} />
      <div style={{position: 'absolute', width: 900, height: 800, right: -200 + Math.sin(frame / 60) * 60, bottom: -300, borderRadius: '50%', background: COLORS.pink, filter: 'blur(240px)', opacity: 0.18}} />
    </AbsoluteFill>
  );
};
