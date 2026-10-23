import {AbsoluteFill} from 'remotion';
import {COLORS} from '../theme';

export const Background: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg, overflow: 'hidden'}}>
    <AbsoluteFill style={{backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`, backgroundSize: '80px 80px', opacity: 0.5}} />
  </AbsoluteFill>
);
