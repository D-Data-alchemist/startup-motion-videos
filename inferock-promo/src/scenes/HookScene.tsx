import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, displayFamily, EASE} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {errs: [14, 24, 34, 44], line2: 66};
// Inferock's own list of objective failures
const ERRS = [
  {code: '504', t: 'Provider timeout', x: 400, y: 470},
  {code: '∅', t: 'Empty output', x: 1540, y: 450},
  {code: '…', t: 'Truncated output', x: 430, y: 800},
  {code: '{ }', t: 'Invalid tool-call arguments', x: 1430, y: 800},
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = interpolate(frame, [0, 5], [0, 1], {...clamp, easing: EASE.out});
  const line2 = interpolate(frame, [HOOK.line2, HOOK.line2 + 10], [0, 1], {...clamp, easing: EASE.snap});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  const glitch = frame < 8 ? Math.sin(frame * 5) * 6 : 0;
  return (
    <AbsoluteFill style={{opacity: 1 - exit}}>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', opacity: head, transform: `scale(${1.12 - 0.12 * head}) translateX(${glitch}px)`}}>
        <div style={{fontFamily: 'monospace', fontSize: 30, color: COLORS.red}}>POST /v1/chat/completions → ✕ failed</div>
        <div style={{fontFamily: displayFamily, fontSize: 150, fontWeight: 700, letterSpacing: '-0.04em', color: COLORS.ink, marginTop: 10}}>Your LLM call failed.</div>
      </div>
      {ERRS.map((e, i) => {
        const p = spring({frame: frame - HOOK.errs[i], fps, config: {damping: 11, stiffness: 220}});
        return (
          <div key={e.t} style={{position: 'absolute', left: e.x, top: e.y, transform: `translate(-50%, -50%) scale(${Math.min(1, p)}) rotate(${i % 2 ? 2 : -2}deg)`, opacity: Math.min(1, p * 2) * (1 - line2 * 0.6), display: 'flex', alignItems: 'center', gap: 16, padding: '20px 30px', borderRadius: 18, whiteSpace: 'nowrap', background: COLORS.surface, border: `1.5px solid ${COLORS.red}`, boxShadow: '0 18px 40px rgba(214,69,69,0.15)', fontSize: 36, fontWeight: 600, color: COLORS.ink}}>
            <span style={{fontFamily: 'monospace', padding: '4px 10px', borderRadius: 8, background: COLORS.redSoft, color: COLORS.red}}>{e.code}</span>
            {e.t}
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', opacity: Math.min(1, line2 * 2), transform: `scale(${1.4 - 0.4 * line2})`}}>
        <div style={{fontFamily: displayFamily, fontSize: 110, fontWeight: 700, letterSpacing: '-0.04em', color: COLORS.blue}}>Who pays for that?</div>
      </div>
    </AbsoluteFill>
  );
};
