import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, EASE, serifFamily, Wordmark} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {rows: [20, 46, 72, 98, 124], verdict: (i: number) => [20, 46, 72, 98, 124][i] + 12, same: 160};

// Each agent call, and what Navige does with it (illustrative)
const ROWS = [
  {call: 'summarize_ticket', chip: 'Smart routing', verdict: '→ small model', save: 0.82},
  {call: 'read_file(schema.ts) ×3', chip: 'Cache and reuse', verdict: '→ cache hit', save: 0.97},
  {call: 'search_docs → 48k tokens', chip: 'Context trimming', verdict: '→ trimmed to 6k', save: 0.71},
  {call: 'retry → retry → retry …', chip: 'Loop guard', verdict: '→ loop stopped', save: 1},
  {call: 'plan_database_migration', chip: 'Kept on your model', verdict: '→ frontier model', save: 0},
];

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 24});
  const exit = interpolate(frame, [194, 210], [0, 1], {...clamp, easing: EASE.in});
  const done = ROWS.filter((_, i) => frame >= APP.verdict(i)).length;
  const bar = 1 - interpolate(done, [0, 5], [0, 0.62]);
  const animBar = interpolate(frame, [APP.verdict(0), APP.verdict(4) + 10], [1, 0.38], {...clamp, easing: EASE.out});
  const same = spring({frame: frame - APP.same, fps, config: {damping: 12, stiffness: 180}});

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), color: '#fff'}}>
      <div style={{position: 'absolute', left: 120, top: 80, display: 'flex', alignItems: 'center', gap: 22}}>
        <Wordmark size={56} />
        <span style={{fontSize: 22, color: COLORS.muted}}>sits between your agents and everything they pay for</span>
      </div>
      {/* call stream */}
      <div style={{position: 'absolute', left: 120, top: 190, width: 1080, display: 'flex', flexDirection: 'column', gap: 18}}>
        {ROWS.map((r, i) => {
          const p = spring({frame: frame - APP.rows[i], fps, config: {damping: 16, stiffness: 170}});
          const v = spring({frame: frame - APP.verdict(i), fps, config: {damping: 13, stiffness: 200}});
          const kept = r.save === 0;
          return (
            <div key={r.call} style={{height: 108, borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: `1px solid ${COLORS.line}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 22, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - Math.min(p, 1)) * -120}px)`}}>
              <span style={{fontFamily: 'monospace', fontSize: 28, flex: 1, textDecoration: r.chip === 'Loop guard' && v > 0.5 ? 'line-through' : 'none', opacity: r.chip === 'Loop guard' && v > 0.5 ? 0.5 : 1}}>{r.call}</span>
              <span style={{padding: '10px 18px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.6)', fontSize: 22, opacity: Math.min(1, v), transform: `scale(${Math.min(1, v)})`}}>{r.chip}</span>
              <span style={{width: 250, textAlign: 'right', fontSize: 26, fontWeight: 700, color: kept ? '#fff' : COLORS.green, opacity: Math.min(1, v)}}>{r.verdict}</span>
            </div>
          );
        })}
      </div>
      {/* cost meter */}
      <div style={{position: 'absolute', left: 1290, top: 190, width: 510, height: 640, borderRadius: 28, background: '#fff', color: COLORS.ink, padding: '34px 36px', boxShadow: '0 40px 90px rgba(5,7,26,0.35)', transform: `translateY(${(1 - enter) * 60}px)`}}>
        <div style={{fontSize: 22, color: '#8E8B94'}}>Cost per agent run</div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 40, height: 360, marginTop: 30}}>
          <div style={{flex: 1, textAlign: 'center'}}>
            <div style={{height: 320, borderRadius: 16, background: '#E8E6EC'}} />
            <div style={{fontSize: 20, color: '#8E8B94', marginTop: 10}}>Before</div>
          </div>
          <div style={{flex: 1, textAlign: 'center'}}>
            <div style={{height: 320 * animBar, borderRadius: 16, background: COLORS.blue}} />
            <div style={{fontSize: 20, color: '#8E8B94', marginTop: 10}}>With Navige</div>
          </div>
        </div>
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: '-0.05em', marginTop: 20, color: COLORS.blue, fontVariantNumeric: 'tabular-nums'}}>−{Math.round((1 - animBar) * 100)}%</div>
        <div style={{display: 'inline-flex', gap: 10, alignItems: 'center', padding: '10px 18px', borderRadius: 999, background: '#ECFDF5', color: '#047857', fontWeight: 700, fontSize: 22, opacity: Math.min(1, same), transform: `scale(${Math.min(1.05, same)})`}}>✓ Same output</div>
      </div>
      <div style={{position: 'absolute', left: 120, bottom: 70, fontSize: 22, color: COLORS.muted}}>Illustrative example · if unsure, Navige keeps your chosen model</div>
    </AbsoluteFill>
  );
};
