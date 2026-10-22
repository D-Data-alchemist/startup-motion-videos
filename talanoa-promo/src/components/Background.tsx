import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, SCENES} from '../theme';

// Dark, soft-lit canvas (as on talanoa.email); lightens to paper behind the app scene
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const light = interpolate(frame, [SCENES.app.from, SCENES.app.from + 20, SCENES.cta.from - 6, SCENES.cta.from + 10], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: COLORS.night}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 55% at 30% 40%, rgba(255,255,255,0.10) 0%, transparent 70%)'}} />
      <div style={{position: 'absolute', width: 900, height: 700, right: -150 + Math.sin(frame / 70) * 50, bottom: -250, borderRadius: '50%', background: COLORS.purple, filter: 'blur(240px)', opacity: 0.18}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, ${COLORS.paper} 60%, #EFEFED 100%)`, opacity: light}} />
    </AbsoluteFill>
  );
};
