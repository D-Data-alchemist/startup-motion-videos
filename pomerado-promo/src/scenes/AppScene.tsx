import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera, card3D, kick, Rise, useZoomThrough} from '../components/Kinetic';
import {COLORS, EASE, Logo, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {build: 0, ask1: 6, site: 16, suck: [34, 50], tool: 50, rows: [58, 64, 70], heal: 80, ask2: 84, fail: 100, fix: 118, done: 136, result: 148, stats: 166};

const STEPS = [
  {at: APP.build, n: '01', title: 'Any website becomes a tool.', sub: 'Ask your coding agent. Pomerado builds and tests the integration.'},
  {at: APP.heal, n: '02', title: 'It fixes itself.', sub: 'When a site changes, Pomerado repairs the integration and finishes the call.'},
  {at: APP.stats, n: '03', title: 'Deterministic. Fast. Cheap.', sub: 'APIs that run in seconds, not agents reasoning through every page.'},
];

const Bubble: React.FC<{who: 'you' | 'claude'; children: React.ReactNode; o: number}> = ({who, children, o}) => (
  <div style={{display: 'flex', justifyContent: who === 'you' ? 'flex-end' : 'flex-start', opacity: o, transform: `translateY(${(1 - o) * 16}px)`, marginBottom: 14}}>
    <div style={{maxWidth: 700, padding: '16px 20px', borderRadius: 16, fontSize: 26, lineHeight: 1.45, background: who === 'you' ? '#F0EEE6' : 'transparent', color: '#1F1E1D'}}>
      {who === 'claude' && <span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 4, background: COLORS.claude, marginRight: 10, verticalAlign: 'middle'}} />}
      {children}
    </div>
  </div>
);

const ToolCard: React.FC<{title: string; site: string; status: React.ReactNode; tone: 'run' | 'fail' | 'fix' | 'ok'; o: number; children?: React.ReactNode}> = ({title, site, status, tone, o, children}) => {
  const c = {run: [COLORS.body, COLORS.band], fail: [COLORS.fail, COLORS.failBg], fix: ['#9A5B00', '#FDF1DC'], ok: [COLORS.ok, COLORS.okBg]}[tone];
  return (
    <div style={{margin: '0 0 14px 24px', width: 760, borderRadius: 14, border: `1px solid ${COLORS.line}`, background: '#fff', overflow: 'hidden', opacity: o, transform: `scale(${0.96 + 0.04 * o})`, transformOrigin: 'left top', boxShadow: '0 10px 30px rgba(13,13,13,0.06)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px'}}>
        <span style={{width: 26, height: 26, borderRadius: 13, background: COLORS.brand, boxShadow: `inset 0 0 0 5px ${COLORS.cream}`, outline: `3px solid ${COLORS.brand}`}} />
        <div style={{flex: 1}}>
          <div style={{fontSize: 23, fontWeight: 600, color: COLORS.ink}}>{title}</div>
          <div style={{fontSize: 17, color: COLORS.body, fontFamily: mono}}>{site}</div>
        </div>
        <span style={{padding: '7px 14px', borderRadius: 999, fontSize: 18, fontWeight: 600, color: c[0], background: c[1]}}>{status}</span>
      </div>
      {children}
    </div>
  );
};

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = useZoomThrough(210, 10, 12);
  const enter = 1;
  const CAM = [
    {f: 0, x: 1100, y: 560, s: 0.94, ry: -12, rx: 6},
    {f: 18, x: 1000, y: 540, s: 1.0, ry: -3},
    {f: APP.tool - 4, x: 1020, y: 560, s: 1.04},
    {f: APP.tool + 6, x: 1040, y: 520, s: 1.08, ry: -2},
    {f: APP.heal + 6, x: 1020, y: 540, s: 1.04},
    {f: APP.fail + 4, x: 1040, y: 520, s: 1.08},
    {f: APP.result + 6, x: 1040, y: 560, s: 1.08, ry: 2},
    {f: APP.stats + 4, x: 960, y: 540, s: 1.0},
    {f: 210, x: 980, y: 540, s: 1.05, ry: -3},
  ];
  const f = (at: number, d = 8) => interpolate(frame, [at, at + d], [0, 1], {...clamp, easing: EASE.out});
  const part1 = frame < APP.heal;
  const suck = interpolate(frame, APP.suck, [0, 1], {...clamp, easing: EASE.inOut});
  const tone = frame < APP.fail ? 'run' : frame < APP.fix ? 'fail' : frame < APP.done ? 'fix' : 'ok';
  const statusText = {run: 'Running…', fail: 'Run failed', fix: 'Repairing…', ok: '24 claims'}[tone];

  return (
    <AbsoluteFill style={{...scene, color: COLORS.ink}}>
      <div style={{position: 'absolute', left: 120, top: 80}}>
        <Logo size={44} />
      </div>
      {STEPS.map((s, i) => {
        const next = STEPS[i + 1]?.at ?? 999;
        const o = interpolate(frame, [s.at, s.at + 10, next - 6, next], [0, 1, 1, 0], clamp);
        return (
          <div key={s.n} style={{position: 'absolute', left: 120, top: 330, width: 700, opacity: o, transform: `translateY(${(1 - o) * 26}px)`}}>
            <div style={{fontFamily: mono, fontSize: 22, color: COLORS.brand, fontWeight: 700}}>{s.n}</div>
            <div style={{fontSize: 84, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.04, marginTop: 12}}>
              <Rise text={s.title} at={s.at} stagger={3} />
            </div>
            <div style={{fontSize: 30, color: COLORS.body, marginTop: 22, lineHeight: 1.4}}>{s.sub}</div>
          </div>
        );
      })}

      <Camera keys={CAM} shake={kick(frame, APP.fail, 4) * 7}>
      {/* the agent chat */}
      {frame < APP.stats + 4 && (
        <div style={{position: 'absolute', left: 880, top: 150, width: 920, height: 780, borderRadius: 24, background: '#FAF9F5', border: `1px solid ${COLORS.line}`, boxShadow: '0 40px 100px rgba(13,13,13,0.10)', padding: '30px 34px', overflow: 'hidden', ...card3D(frame, 0, 'right', 18), opacity: Math.min(1, frame / 8) * (1 - interpolate(frame, [APP.stats - 4, APP.stats + 4], [0, 1], clamp))}}>
          <div style={{display: 'flex', gap: 8, marginBottom: 24}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 13, height: 13, borderRadius: 7, background: c}} />)}
          </div>
          {part1 ? (
            <div style={{opacity: 1 - interpolate(frame, [APP.heal - 6, APP.heal], [0, 1], clamp)}}>
              <Bubble who="you" o={f(APP.ask1)}>Create a Pomerado integration for our Coupa supplier portal. List invoices by status and date range. Read only.</Bubble>
              <Bubble who="claude" o={f(APP.site)}>Kicking off the MCP creation with Pomerado.</Bubble>
              {/* the website gets turned into a tool */}
              <div style={{position: 'relative', height: 300, margin: '0 0 0 24px'}}>
                <div style={{position: 'absolute', left: 0, top: 0, width: 760, height: 280, borderRadius: 12, border: `1px solid ${COLORS.line}`, background: '#fff', opacity: f(APP.site) * (1 - suck), transform: `scale(${1 - suck * 0.6}) translateY(${suck * 40}px)`, transformOrigin: 'center bottom', filter: `blur(${suck * 3}px)`}}>
                  <div style={{height: 34, background: '#EEF1F5', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: mono, fontSize: 14, color: COLORS.body}}>supplier.coupahost.com/invoices</div>
                  {Array.from({length: 5}, (_, r) => (
                    <div key={r} style={{display: 'flex', gap: 14, padding: '10px 16px', borderBottom: `1px solid ${COLORS.line}`}}>
                      {[90, 160, 80, 110].map((w, c) => <span key={c} style={{width: w, height: 12, borderRadius: 6, background: r === 0 ? '#C9D2DE' : '#E8ECF1'}} />)}
                    </div>
                  ))}
                </div>
                <div style={{position: 'absolute', left: 0, top: 0, opacity: f(APP.tool)}}>
                  <ToolCard title="List Coupa invoices" site="supplier.coupahost.com" status="✓ 1 tool published" tone="ok" o={f(APP.tool)}>
                    <div style={{fontFamily: mono, fontSize: 18, background: '#14161A', color: '#E6E6E6', padding: '14px 18px', lineHeight: 1.6}}>
                      {[
                        ['INV-20418', 'PO-7731', '$12,480.00', 'past due'],
                        ['INV-20422', 'PO-7740', '$3,215.50', 'disputed'],
                        ['INV-20431', 'PO-7755', '$8,900.00', 'approved'],
                      ].map((r, i) => (
                        <div key={r[0]} style={{opacity: f(APP.rows[i], 6)}}>
                          {'{'} <span style={{color: '#FFB38A'}}>"{r[0]}"</span>, <span style={{color: '#9CDCFE'}}>"{r[1]}"</span>, {r[2]}, <span style={{color: r[3] === 'approved' ? '#7EE2A8' : '#FF8A80'}}>"{r[3]}"</span> {'}'}
                        </div>
                      ))}
                    </div>
                  </ToolCard>
                </div>
              </div>
            </div>
          ) : (
            <div style={{opacity: f(APP.heal)}}>
              <Bubble who="you" o={f(APP.ask2)}>Pull the status of this patient’s Anthem claims with September dates of service.</Bubble>
              <Bubble who="claude" o={f(APP.ask2 + 8)}>I’ll check Anthem’s provider portal with Pomerado.</Bubble>
              <ToolCard title="Anthem claim status" site="Provider portal · Sep dates of service" status={statusText} tone={tone} o={f(APP.ask2 + 14)}>
                <div style={{padding: '0 18px 18px', fontSize: 21, lineHeight: 1.6}}>
                  <div style={{color: COLORS.fail, opacity: f(APP.fail, 6)}}>✕ date filter not found · failure detected</div>
                  <div style={{color: '#9A5B00', opacity: f(APP.fix, 6)}}>↻ Maintenance patched the filter step · test passed</div>
                  <div style={{color: COLORS.ok, fontWeight: 600, opacity: f(APP.done, 6)}}>✓ Original run updated · 24 claims returned</div>
                </div>
              </ToolCard>
              <div style={{opacity: f(APP.result)}}>
                <Bubble who="claude" o={1}>
                  Found <b>24 claims</b> for this patient: 19 paid, 3 pending and 2 denied for missing prior authorization.
                </Bubble>
                <div style={{display: 'flex', height: 18, borderRadius: 9, overflow: 'hidden', margin: '4px 24px 0'}}>
                  {[[19, COLORS.ok], [3, '#E0A030'], [2, COLORS.fail]].map(([n, c], i) => (
                    <div key={i} style={{width: `${((n as number) / 24) * 100 * f(APP.result + 4 + i * 3, 10)}%`, background: c as string}} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* the three proof points, as on pomerado.ai */}
      <div style={{position: 'absolute', left: 900, top: 300, width: 900, display: 'flex', flexDirection: 'column', gap: 22}}>
        {[
          ['7x faster', 'than browser agents (customer results)'],
          ['Self-healing', 'fixes itself when sites change'],
          ['Deterministic', 'Pomerado creates deterministic APIs'],
        ].map(([k, v], i) => {
          const p = spring({frame: frame - APP.stats - 4 - i * 5, fps, config: {damping: 14, stiffness: 160}});
          return (
            <div key={k} style={{padding: '26px 34px', borderRadius: 20, background: '#fff', border: `1px solid ${COLORS.line}`, boxShadow: '0 20px 50px rgba(13,13,13,0.06)', ...card3D(frame, APP.stats + 2 + i * 5, 'below', 14)}}>
              <div style={{fontSize: 54, fontWeight: 600, letterSpacing: '-0.03em', color: i === 0 ? COLORS.brand : COLORS.ink}}>{k}</div>
              <div style={{fontSize: 24, color: COLORS.body, marginTop: 4}}>{v}</div>
            </div>
          );
        })}
      </div>
      </Camera>
    </AbsoluteFill>
  );
};
