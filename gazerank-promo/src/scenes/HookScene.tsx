import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, EASE, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {question: 4, answer: [16, 52], miss: 62, line2: 80};
const PICKS = ['competitor-a.com', 'competitor-b.com', 'competitor-c.com'];

// An AI assistant answers a buyer's question — and the viewer's site isn't in it
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const q = spring({frame: frame - HOOK.question, fps, config: {damping: 16}});
  const answered = interpolate(frame, HOOK.answer, [0, 1], clamp);
  const miss = interpolate(frame, [HOOK.miss, HOOK.miss + 8], [0, 1], {...clamp, easing: EASE.snap});
  const line2 = interpolate(frame, [HOOK.line2, HOOK.line2 + 10], [0, 1], {...clamp, easing: EASE.out});
  const exit = interpolate(frame, [96, 110], [0, 1], {...clamp, easing: EASE.in});
  const shrink = interpolate(frame, [HOOK.miss - 4, HOOK.miss + 10], [0, 1], {...clamp, easing: EASE.inOut});

  return (
    <AbsoluteFill style={{opacity: 1 - exit, filter: `blur(${exit * 12}px)`}}>
      {/* AI chat card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 170,
          width: 980,
          marginLeft: -490,
          padding: '34px 40px',
          borderRadius: 26,
          background: COLORS.surface,
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 40px 90px rgba(20,32,28,0.14)',
          transform: `translateY(${(1 - card) * 60 - shrink * 90}px) scale(${(0.94 + 0.06 * card) * (1 - shrink * 0.12)})`,
          opacity: Math.min(1, card * 1.4) * (1 - shrink * 0.35),
          filter: `blur(${shrink * 3}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 18, color: COLORS.muted, fontFamily: monoFamily}}>
          <span style={{width: 28, height: 28, borderRadius: 8, background: COLORS.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15}}>✦</span>
          AI assistant
        </div>
        <div style={{marginTop: 22, marginLeft: 'auto', width: 'fit-content', maxWidth: 640, padding: '14px 20px', borderRadius: '18px 18px 4px 18px', background: COLORS.ink, color: '#fff', fontSize: 28, opacity: Math.min(1, q), transform: `translateY(${(1 - Math.min(q, 1)) * 16}px)`}}>
          What’s the best tool for my kind of business?
        </div>
        <div style={{marginTop: 22, fontSize: 26, color: COLORS.text, lineHeight: 1.5, minHeight: 210}}>
          <div style={{opacity: interpolate(answered, [0, 0.15], [0, 1], clamp)}}>Here are the top recommendations:</div>
          {PICKS.map((p, i) => {
            const a = interpolate(answered, [0.2 + i * 0.25, 0.4 + i * 0.25], [0, 1], clamp);
            return (
              <div key={p} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, opacity: a, transform: `translateX(${(1 - a) * 20}px)`}}>
                <span style={{fontFamily: monoFamily, color: COLORS.muted}}>{i + 1}.</span>
                <span style={{fontWeight: 600}}>{p}</span>
                <span style={{fontSize: 16, padding: '3px 10px', borderRadius: 999, background: COLORS.soft, color: COLORS.emeraldDeep}}>cited</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* The punch */}
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center'}}>
        <div style={{fontSize: 96, fontWeight: 800, letterSpacing: '-0.045em', color: COLORS.ink, opacity: Math.min(1, miss * 2), transform: `scale(${1.5 - 0.5 * miss})`, filter: `blur(${(1 - Math.min(miss, 1)) * 10}px)`}}>
          Your site isn’t in the answer.
        </div>
        <div style={{fontSize: 40, fontWeight: 500, color: COLORS.muted, marginTop: 16, opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`}}>
          Strong SEO doesn’t mean <span style={{color: COLORS.emeraldDeep, fontWeight: 700}}>AI can find you.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
