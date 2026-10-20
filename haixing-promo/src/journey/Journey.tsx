import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FONT_STACK} from '../theme';
import {J} from './timeline';
import {ClockHUD, Paper, Sheet, TitleBlock} from './kit';
import {Batch, CTA, DrawingIn, Hook, Inspect, Program, Proof, Range, Sample, Turning} from './Scenes';

const SCENES = [
  [J.hook, <Hook />, 'BRIEF'],
  [J.drawing, <DrawingIn />, 'FLANGE SHAFT REV2'],
  [J.program, <Program />, 'TOOLPATH'],
  [J.turning, <Turning />, 'TURNING'],
  [J.inspect, <Inspect />, 'INSPECTION'],
  [J.sample, <Sample />, 'SAMPLE'],
  [J.batch, <Batch />, 'BATCH'],
  [J.range, <Range />, 'RANGE'],
  [J.proof, <Proof />, 'CASE'],
  [J.cta, <CTA />, 'CONTACT'],
] as const;

const Block: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.max(0, SCENES.findIndex(([s]) => frame < s.from + s.duration - 5));
  return <TitleBlock sheet={idx + 1} of={SCENES.length} title={SCENES[idx][2]} />;
};

export const Journey: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT_STACK, WebkitFontSmoothing: 'antialiased'}}>
    {/* Original score + SFX. Regenerate: python3 scripts/compose_journey.py */}
    <Audio src={staticFile('audio/haixing-journey.wav')} />
    <Paper />
    {SCENES.map(([s, el], i) => (
      <Sequence key={i} from={s.from} durationInFrames={s.duration}>
        <Sheet duration={s.duration} last={i === SCENES.length - 1}>
          {el}
        </Sheet>
      </Sequence>
    ))}
    <ClockHUD />
    <Block />
  </AbsoluteFill>
);
