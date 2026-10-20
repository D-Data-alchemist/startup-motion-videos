import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {Background} from './components/Background';
import {HookScene} from './scenes/HookScene';
import {ActionScene} from './scenes/ActionScene';
import {CTAScene} from './scenes/CTAScene';
import {SCENES, fontFamily} from './theme';

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  // Background glow blooms for the brand moment
  const intensity = interpolate(frame, [SCENES.cta.from - 10, SCENES.cta.from + 30], [1, 1.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{fontFamily, WebkitFontSmoothing: 'antialiased'}}>
      {/* Original score + SFX, beat-synced (120 BPM = 15 frames/beat). Regenerate: python3 scripts/compose_soundtrack.py */}
      <Audio src={staticFile('audio/soundtrack.wav')} />
      <Background intensity={intensity} />
      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration} name="1 · Hook">
        <HookScene />
      </Sequence>
      <Sequence from={SCENES.action.from} durationInFrames={SCENES.action.duration} name="2 · Action">
        <ActionScene />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration} name="3 · CTA">
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
