import {AbsoluteFill} from 'remotion';
import {COLORS} from '../theme';

export const Background: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg, overflow: 'hidden'}}>
    <div style={{position: 'absolute', width: 1100, height: 900, right: -300, top: -400, borderRadius: '50%', background: COLORS.cream, filter: 'blur(120px)', opacity: 0.9}} />
  </AbsoluteFill>
);
