import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {ColdOpen} from './scenes/ColdOpen';
import {LogoReveal} from './scenes/LogoReveal';
import {Factory} from './scenes/Factory';
import {Capabilities} from './scenes/Capabilities';
import {Products} from './scenes/Products';
import {Process} from './scenes/Process';
import {CTA} from './scenes/CTA';
import {COLORS, FONT_STACK, SCENES} from './theme';

const seq = (s: {from: number; duration: number}) => ({from: s.from, durationInFrames: s.duration});
const CUTS = [SCENES.logo.from, SCENES.factory.from, SCENES.caps.from, SCENES.products.from, SCENES.process.from, SCENES.cta.from];

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  // White flash-frame on every hard cut
  const flash = Math.max(0, ...CUTS.map((c) => interpolate(frame, [c - 1, c, c + 6], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  return (
    <AbsoluteFill style={{fontFamily: FONT_STACK, background: COLORS.bg, WebkitFontSmoothing: 'antialiased'}}>
      {/* Original cinematic score + SFX, beat-synced (120 BPM). Regenerate: python3 scripts/compose_soundtrack.py */}
      <Audio src={staticFile('audio/haixing.wav')} />
      <Sequence {...seq(SCENES.cold)} name="Cold open">
        <ColdOpen />
      </Sequence>
      <Sequence {...seq(SCENES.logo)} name="Logo">
        <LogoReveal />
      </Sequence>
      <Sequence {...seq(SCENES.factory)} name="Factory">
        <Factory />
      </Sequence>
      <Sequence {...seq(SCENES.caps)} name="Capabilities">
        <Capabilities />
      </Sequence>
      <Sequence {...seq(SCENES.products)} name="Products">
        <Products />
      </Sequence>
      <Sequence {...seq(SCENES.process)} name="Process">
        <Process />
      </Sequence>
      <Sequence {...seq(SCENES.cta)} name="Contact">
        <CTA />
      </Sequence>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{pointerEvents: 'none', background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};
