import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE, serifFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {calls: (i: number) => 6 + i * 6, line2: 64, slam: 84};
const CALLS = ['summarize_ticket', 'read_file(schema.ts)', 'read_file(schema.ts)', 'classify_email', 'retry → retry → retry', 'read_file(schema.ts)', 'format_json', 'plan_next_step'];

// A runaway agent bill, ticking up from the first frame
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [0, 5], [0, 1], {...clamp, easing: EASE.out});
  const spend = interpolate(frame, [0, 84], [412.38, 1284.6], {...clamp, easing: EASE.in});
  const line2 = interpolate(frame, [HOOK.line2, HOOK.line2 + 10], [0, 1], {...clamp, easing: EASE.out});
  const slam = interpolate(frame, [HOOK.slam, HOOK.slam + 8], [0, 1], {...clamp, easing: EASE.snap});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  const shake = frame < 84 ? Math.sin(frame * 2.3) * (frame / 84) * 3 : 0;
  return (
    <AbsoluteFill style={{opacity: 1 - exit, color: '#fff'}}>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', opacity: head, transform: `scale(${1.12 - 0.12 * head})`}}>
        <div style={{fontSize: 30, letterSpacing: '0.3em', color: COLORS.muted}}>THIS WEEK’S AGENT SPEND</div>
        <div style={{fontSize: 210, fontWeight: 800, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', color: frame > 60 ? COLORS.red : '#fff', transform: `translateX(${shake}px)`}}>${spend.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
      <div style={{position: 'absolute', top: 520, left: 0, right: 0, overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 26, color: 'rgba(255,255,255,0.5)'}}>
        <div style={{transform: `translateX(${-frame * 14}px)`}}>
          {Array.from({length: 4}).map((_, r) =>
            CALLS.map((c, i) => (
              <span key={`${r}${i}`} style={{marginRight: 40, color: c.includes('retry') ? COLORS.red : c.includes('schema') ? '#FFD38A' : undefined}}>
                → {c} <span style={{color: 'rgba(255,255,255,0.35)'}}>frontier-model</span>
              </span>
            )),
          )}
        </div>
      </div>
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', opacity: line2, transform: `translateY(${(1 - line2) * 30}px)`}}>
        <div style={{fontSize: 76, fontWeight: 800, letterSpacing: '-0.04em'}}>
          Your AI agents are <span style={{fontFamily: serifFamily, fontStyle: 'italic', fontWeight: 400, color: COLORS.pink, fontSize: 96}}>overpaying.</span>
        </div>
        <div style={{fontSize: 36, color: COLORS.muted, marginTop: 10, opacity: slam}}>Frontier models on easy calls. Repeat reads. Runaway loops.</div>
      </div>
    </AbsoluteFill>
  );
};
