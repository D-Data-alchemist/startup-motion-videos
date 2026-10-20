import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {FONT_STACK} from '../theme';
import {LIGHT} from './timeline';
import {Flow} from './kit';
import {Families, LogoScene, Materials, Question} from './ScenesA';
import {EndCard, Processes, Quality, Scale, Steps} from './ScenesB';

const seq = (s: {from: number; duration: number}) => ({from: s.from, durationInFrames: s.duration});

// Airy sky gradient that slowly drifts; a white wash fades in for the "Steps" and end card
const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const white =
    interpolate(frame, [LIGHT.steps.from, LIGHT.steps.from + 20, LIGHT.scale.from, LIGHT.scale.from + 20], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) +
    interpolate(frame, [LIGHT.end.from, LIGHT.end.from + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const d = Math.sin(frame / 90) * 60;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #3F7FD9 0%, #5C9BE6 40%, #86BDEE 75%, #BFE8DF 100%)'}}>
      <div style={{position: 'absolute', width: 1000, height: 800, left: -200 + d, top: -260, borderRadius: '50%', background: '#2F6BC8', filter: 'blur(200px)', opacity: 0.55}} />
      <div style={{position: 'absolute', width: 900, height: 700, right: -200 - d, bottom: -260, borderRadius: '50%', background: '#D4F2EA', filter: 'blur(200px)', opacity: 0.6}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #EEF4FB 70%, #E3ECF7 100%)', opacity: Math.min(1, white)}} />
    </AbsoluteFill>
  );
};

export const Light: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT_STACK, WebkitFontSmoothing: 'antialiased'}}>
    {/* Original calm score + SFX. Regenerate: python3 scripts/compose_light.py */}
    <Audio src={staticFile('audio/haixing-light.wav')} />
    <Sky />
    {(
      [
        [LIGHT.question, <Question />],
        [LIGHT.logo, <LogoScene />],
        [LIGHT.families, <Families />],
        [LIGHT.materials, <Materials />],
        [LIGHT.processes, <Processes />],
        [LIGHT.quality, <Quality />],
        [LIGHT.steps, <Steps />],
        [LIGHT.scale, <Scale />],
        [LIGHT.end, <EndCard />],
      ] as const
    ).map(([s, el], i) => (
      <Sequence key={i} {...seq(s)}>
        <Flow duration={s === LIGHT.end ? s.duration + 30 : s.duration}>{el}</Flow>
      </Sequence>
    ))}
  </AbsoluteFill>
);
