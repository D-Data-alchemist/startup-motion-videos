import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background} from './components/Background';
import {HookScene} from './scenes/HookScene';
import {InboxScene} from './scenes/InboxScene';
import {CTAScene} from './scenes/CTAScene';
import {fontFamily, SCENES} from './theme';

export const Main: React.FC = () => (
  <AbsoluteFill style={{fontFamily, WebkitFontSmoothing: 'antialiased'}}>
    {/* Original score + SFX, beat-synced (120 BPM). Regenerate: python3 scripts/compose_soundtrack.py */}
    <Audio src={staticFile('audio/sellio.wav')} />
    <Background />
    <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration} name="1 · Hook">
      <HookScene />
    </Sequence>
    <Sequence from={SCENES.inbox.from} durationInFrames={SCENES.inbox.duration} name="2 · Inbox">
      <InboxScene />
    </Sequence>
    <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration} name="3 · CTA">
      <CTAScene />
    </Sequence>
  </AbsoluteFill>
);
