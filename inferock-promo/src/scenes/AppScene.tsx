import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, displayFamily, EASE, Logo} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {rows: (i: number) => 14 + i * 12, receipt: 86, credit: 126, wallet: [126, 160], report: 168};

// Illustrative call log (values are examples, as on inferock.ai)
const ROWS = [
  {id: 'req_8f21', model: 'gpt-class · route A', ms: '842 ms', ok: true},
  {id: 'req_8f22', model: 'claude-class · route B', ms: '1.2 s', ok: true},
  {id: 'req_8f23', model: 'open-weights · route A', ms: '30.0 s', ok: false, why: 'Provider timeout'},
  {id: 'req_8f24', model: 'gpt-class · route A', ms: '910 ms', ok: true},
  {id: 'req_8f25', model: 'claude-class · route B', ms: '1.4 s', ok: false, why: 'Invalid structured output'},
];

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 24});
  const exit = interpolate(frame, [194, 210], [0, 1], {...clamp, easing: EASE.in});
  const rc = spring({frame: frame - APP.receipt, fps, config: {damping: 15, stiffness: 150}});
  const elig = frame >= APP.credit;
  const eligP = spring({frame: frame - APP.credit, fps, config: {damping: 11, stiffness: 200}});
  const wallet = interpolate(frame, APP.wallet, [0, 3.84], {...clamp, easing: EASE.out});
  const report = spring({frame: frame - APP.report, fps, config: {damping: 15}});

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), color: COLORS.ink}}>
      <div style={{position: 'absolute', left: 110, top: 70}}>
        <Logo size={52} />
      </div>
      {/* call log */}
      <div style={{position: 'absolute', left: 110, top: 180, width: 1060, borderRadius: 22, background: COLORS.surface, border: `1px solid ${COLORS.line}`, boxShadow: '0 30px 80px rgba(15,27,51,0.08)', overflow: 'hidden', transform: `translateY(${(1 - enter) * 50}px)`}}>
        <div style={{display: 'flex', padding: '18px 28px', fontSize: 18, color: COLORS.muted, borderBottom: `1px solid ${COLORS.line}`, fontWeight: 600, letterSpacing: '0.05em'}}>
          <span style={{width: 150}}>REQUEST</span>
          <span style={{flex: 1}}>MODEL · ROUTE</span>
          <span style={{width: 120}}>LATENCY</span>
          <span style={{width: 330, textAlign: 'right'}}>OUTCOME</span>
        </div>
        {ROWS.map((r, i) => {
          const p = interpolate(frame, [APP.rows(i), APP.rows(i) + 10], [0, 1], {...clamp, easing: EASE.out});
          const hot = !r.ok && i === 4;
          return (
            <div key={r.id} style={{display: 'flex', alignItems: 'center', padding: '26px 28px', fontSize: 23, borderBottom: `1px solid ${COLORS.line}`, background: hot && frame >= APP.receipt ? '#FFF8F8' : 'transparent', opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
              <span style={{width: 150, fontFamily: 'monospace'}}>{r.id}</span>
              <span style={{flex: 1, color: COLORS.muted}}>{r.model}</span>
              <span style={{width: 120, fontFamily: 'monospace', color: r.ms.startsWith('30') ? COLORS.red : COLORS.ink}}>{r.ms}</span>
              <span style={{width: 330, textAlign: 'right', whiteSpace: 'nowrap'}}>
                <span style={{padding: '6px 12px', borderRadius: 999, fontSize: 17, fontWeight: 700, background: r.ok ? COLORS.greenSoft : COLORS.redSoft, color: r.ok ? COLORS.green : COLORS.red}}>{r.ok ? '✓ OK' : `✕ ${r.why}`}</span>
              </span>
            </div>
          );
        })}
      </div>
      {/* receipt */}
      <div style={{position: 'absolute', left: 1230, top: 180, width: 580, borderRadius: 22, background: COLORS.surface, border: `1px solid ${COLORS.line}`, boxShadow: '0 40px 90px rgba(15,27,51,0.14)', padding: '28px 32px', opacity: Math.min(1, rc), transform: `translateY(${(1 - Math.min(rc, 1)) * 60}px) rotate(${(1 - Math.min(rc, 1)) * 3}deg)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontFamily: displayFamily, fontSize: 28, fontWeight: 700}}>Receipt · req_8f25</span>
          <span style={{fontSize: 16, color: COLORS.muted, fontFamily: 'monospace'}}>14:02:51 UTC</span>
        </div>
        {[
          ['Route', 'claude-class · route B'],
          ['Schema check', '✕ invalid structured output'],
          ['Tokens in / out', '1,842 / 0 usable'],
          ['Cost of the failed call', '$0.0118'],
        ].map(([k, v], i) => (
          <div key={k} style={{display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px dashed ${COLORS.line}`, fontSize: 20, opacity: interpolate(frame, [APP.receipt + 8 + i * 6, APP.receipt + 16 + i * 6], [0, 1], clamp)}}>
            <span style={{color: COLORS.muted}}>{k}</span>
            <span style={{fontWeight: 600, color: v.startsWith('✕') ? COLORS.red : COLORS.ink}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop: 22, padding: '16px 18px', borderRadius: 14, background: elig ? COLORS.greenSoft : '#F4F6FA', border: `1.5px solid ${elig ? COLORS.green : COLORS.line}`, fontSize: 21, fontWeight: 700, color: elig ? COLORS.green : COLORS.muted, transform: `scale(${elig ? 1 + 0.05 * Math.exp(-(frame - APP.credit) / 4) : 1})`}}>
          {elig ? '✓ Eligible for an Inferock Serve service credit' : 'Remedy status: checking…'}
        </div>
      </div>
      {/* credit wallet */}
      <div style={{position: 'absolute', left: 1230, top: 740, width: 580, display: 'flex', gap: 16, opacity: Math.min(1, eligP)}}>
        <div style={{flex: 1, padding: '20px 24px', borderRadius: 18, background: COLORS.ink, color: '#fff'}}>
          <div style={{fontSize: 16, opacity: 0.7}}>Service credits this month</div>
          <div style={{fontFamily: displayFamily, fontSize: 52, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>${wallet.toFixed(2)}</div>
        </div>
        <div style={{flex: 1, padding: '20px 24px', borderRadius: 18, background: COLORS.surface, border: `1px solid ${COLORS.line}`, opacity: Math.min(1, report)}}>
          <div style={{fontSize: 16, color: COLORS.muted}}>Monthly loss report</div>
          <div style={{fontSize: 22, fontWeight: 700, marginTop: 8}}>What failed · what it cost · the evidence</div>
        </div>
      </div>
      {[
        {at: APP.receipt, text: <>Every call gets a <span style={{color: COLORS.blue}}>receipt.</span></>},
        {at: APP.credit, text: <>Eligible failures earn <span style={{color: COLORS.green}}>credits back.</span></>},
      ].map((c, i, all) => {
        const next = all[i + 1]?.at ?? 999;
        const o = interpolate(frame, [c.at, c.at + 8, next - 4, next], [0, 1, 1, 0], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 110, top: 800, fontFamily: displayFamily, fontSize: 64, fontWeight: 700, letterSpacing: '-0.035em', opacity: o, transform: `translateY(${(1 - Math.min(1, o)) * 24}px)`}}>{c.text}</div>
        );
      })}
      <div style={{position: 'absolute', left: 110, bottom: 50, fontSize: 20, color: COLORS.muted}}>Illustration · values are examples, not measurements</div>
    </AbsoluteFill>
  );
};
