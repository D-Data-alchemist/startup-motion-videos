import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {TitleCard} from '../components/TitleCard';
import {HookScene} from '../scenes/HookScene';
import {ActionScene} from '../scenes/ActionScene';
import {CTAScene} from '../scenes/CTAScene';
import {IntroScene} from './IntroScene';
import {LearnScene} from './LearnScene';
import {MLScene} from './MLScene';
import {PracticeScene} from './PracticeScene';
import {ExploreScene} from './ExploreScene';
import {COLORS, fontFamily} from '../theme';

// ~68s explainer timeline (30fps). Scenes overlap by 5 frames for seamless handoffs.
// Mirrored in scripts/compose_explainer.py — keep both in sync.
export const EXPLAINER = {
  opener: {from: 0, duration: 155},
  problem: {from: 150, duration: 95},
  intro: {from: 240, duration: 150},
  craft: {from: 385, duration: 215},
  learn: {from: 595, duration: 360},
  ml: {from: 950, duration: 215},
  practice: {from: 1160, duration: 300},
  explore: {from: 1455, duration: 255},
  manifesto: {from: 1705, duration: 155},
  cta: {from: 1855, duration: 185},
  total: 2040,
};

const STEPS = [
  {at: EXPLAINER.craft.from, n: 1, t: 'Craft a course for anything'},
  {at: EXPLAINER.learn.from, n: 2, t: 'Learn on a live whiteboard with your AI professor'},
  {at: EXPLAINER.ml.from, n: 2, t: 'Any subject — like Machine Learning'},
  {at: EXPLAINER.practice.from, n: 3, t: 'Practice until it sticks'},
  {at: EXPLAINER.explore.from, n: 4, t: 'Explore expert-built courses'},
];

const StepLabel: React.FC<{n: number; text: string}> = ({n, text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 4, fps, config: {damping: 16, stiffness: 140}});
  const out = interpolate(frame, [80, 96], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          marginTop: 34,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 22px 10px 10px',
          borderRadius: 999,
          background: '#fff',
          border: `1px solid ${COLORS.borderHi}`,
          boxShadow: '0 12px 30px rgba(17,17,17,0.10)',
          fontSize: 24,
          fontWeight: 500,
          opacity: Math.min(p, 1) * (1 - out),
          transform: `translateY(${(1 - Math.min(p, 1)) * -20 - out * 10}px)`,
        }}
      >
        <span style={{width: 38, height: 38, borderRadius: '50%', background: COLORS.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700}}>
          {n}
        </span>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const seq = (s: {from: number; duration: number}) => ({from: s.from, durationInFrames: s.duration});

export const Explainer: React.FC = () => {
  const frame = useCurrentFrame();
  const intensity = interpolate(frame, [EXPLAINER.cta.from - 10, EXPLAINER.cta.from + 30], [1, 1.7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{fontFamily, WebkitFontSmoothing: 'antialiased'}}>
      {/* Original score + SFX. Regenerate: python3 scripts/compose_explainer.py */}
      <Audio src={staticFile('audio/explainer.wav')} />
      <Background intensity={intensity} />
      <Sequence {...seq(EXPLAINER.opener)} name="Opener">
        <TitleCard
          exitAt={132}
          hlStart={66}
          lines={[
            {words: ['Every', 'AI', 'is', 'racing', 'to', 'think', 'for', 'you.'], start: 6},
            {words: ['What', 'if', 'one', 'helped', 'you', 'understand?'], start: 46, muted: true, highlightFrom: 5},
          ]}
        />
      </Sequence>
      <Sequence {...seq(EXPLAINER.problem)} name="Problem">
        <HookScene />
      </Sequence>
      <Sequence {...seq(EXPLAINER.intro)} name="Meet Hyperknow">
        <IntroScene />
      </Sequence>
      <Sequence {...seq(EXPLAINER.craft)} name="1 · Craft">
        <ActionScene />
      </Sequence>
      <Sequence {...seq(EXPLAINER.learn)} name="2 · Learn">
        <LearnScene />
      </Sequence>
      <Sequence {...seq(EXPLAINER.ml)} name="2b · Machine Learning">
        <MLScene />
      </Sequence>
      <Sequence {...seq(EXPLAINER.practice)} name="3 · Practice">
        <PracticeScene />
      </Sequence>
      <Sequence {...seq(EXPLAINER.explore)} name="4 · Explore">
        <ExploreScene />
      </Sequence>
      <Sequence {...seq(EXPLAINER.manifesto)} name="Manifesto">
        <TitleCard
          exitAt={134}
          hlStart={84}
          size={78}
          lines={[
            {words: ['Not', 'here', 'to', 'replace', 'your', 'thinking.'], start: 4},
            {words: ['Here', 'to', 'bring', 'back', 'the', 'joy', 'of', 'understanding.'], start: 40, muted: true, highlightFrom: 7},
          ]}
        />
      </Sequence>
      <Sequence {...seq(EXPLAINER.cta)} name="CTA">
        <CTAScene />
      </Sequence>
      {STEPS.map((s) => (
        <Sequence key={s.at} from={s.at} durationInFrames={100} name={`Step ${s.n} label`}>
          <StepLabel n={s.n} text={s.t} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
