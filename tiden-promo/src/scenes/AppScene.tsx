import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, display, EASE, Logo, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {lines: [4, 14, 22, 34, 50, 58, 66, 84, 100, 112, 126, 138], promises: [24, 28, 32], refused: 58, write: 84, pass3: 116, ready: 142, merge: 168};

// Tiden's own demo session from tiden.ai
const TERM: {t: string; c?: string; at: number}[] = [
  {t: '> Add rate limiting to the public API', c: '#E8E8E8', at: APP.lines[0]},
  {t: '$ tiden intent start "Add rate limiting to the public API"', c: '#9FB4C7', at: APP.lines[1]},
  {t: '✓ intent captured · 3 promised', c: COLORS.tealLit, at: APP.lines[2]},
  {t: '● Edited api/public/v1/limiter.go. Tests pass.', c: '#E8E8E8', at: APP.lines[3]},
  {t: '$ tiden intent close', c: '#9FB4C7', at: APP.lines[4]},
  {t: 'Close gate refused — session stays open.', c: '#FF8A80', at: APP.lines[5]},
  {t: 'delta open: TIDEN-377 (no_test)', c: '#FFB074', at: APP.lines[6]},
  {t: '● Nothing tests “Pro returns 429 above 600”. Writing it.', c: '#E8E8E8', at: APP.lines[7]},
  {t: '$ tiden run exec -- go test ./...', c: '#9FB4C7', at: APP.lines[8]},
  {t: 'run #11 · 4 passed', c: COLORS.tealLit, at: APP.lines[9]},
  {t: '$ tiden intent close', c: '#9FB4C7', at: APP.lines[10]},
  {t: '✓ Tiden · ready for review  [ PASS ]', c: COLORS.tealLit, at: APP.lines[11]},
];
const PROMISES = [
  {t: 'Free returns 429 above 60 requests a minute', proof: '2 tests passed'},
  {t: 'Every 429 carries Retry-After in seconds', proof: '1 test passed'},
  {t: 'Pro returns 429 above 600', proof: '1 test passed'},
];
const CAPTIONS = [
  {at: 0, text: <>Capture what you <b style={{color: COLORS.blue}}>asked for</b>.</>},
  {at: APP.refused, text: <>Untested promise? <b style={{color: COLORS.red}}>The gate stays shut.</b></>},
  {at: APP.ready, text: <>Every promise proven. <b style={{color: COLORS.teal}}>Merge is your call.</b></>},
];

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 22});
  const exit = interpolate(frame, [196, 210], [0, 1], {...clamp, easing: EASE.in});
  const f = (at: number, d = 8) => interpolate(frame, [at, at + d], [0, 1], {...clamp, easing: EASE.out});
  const shown = TERM.filter((l) => frame >= l.at);
  const scroll = Math.max(0, shown.length - 9) * 46;
  const shake = frame >= APP.refused && frame < APP.refused + 10 ? Math.sin((frame - APP.refused) * 2.4) * (10 - (frame - APP.refused)) : 0;
  const ready = spring({frame: frame - APP.ready, fps, config: {damping: 12, stiffness: 180}});
  const merge = interpolate(frame, [APP.merge - 3, APP.merge, APP.merge + 6], [0, 1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), color: COLORS.text}}>
      <div style={{position: 'absolute', left: 110, top: 64}}>
        <Logo size={44} />
      </div>
      {CAPTIONS.map((c, i) => {
        const next = CAPTIONS[i + 1]?.at ?? 999;
        const o = interpolate(frame, [c.at, c.at + 8, next - 5, next], [0, 1, 1, 0], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 110, top: 150, fontFamily: display, fontSize: 62, fontWeight: 400, letterSpacing: '-0.03em', color: COLORS.ink, opacity: o, transform: `translateY(${(1 - o) * 20}px)`}}>{c.text}</div>
        );
      })}

      {/* terminal */}
      <div style={{position: 'absolute', left: 110, top: 290, width: 940, height: 600, borderRadius: 20, background: COLORS.term, boxShadow: '0 40px 90px rgba(22,26,28,0.25)', overflow: 'hidden', transform: `translateY(${(1 - enter) * 60}px) translateX(${shake}px)`}}>
        <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />)}
          <span style={{marginLeft: 16, fontFamily: mono, fontSize: 16, color: '#8A949C'}}>claude · ~/api</span>
        </div>
        <div style={{position: 'absolute', top: 46, left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
        <div style={{padding: '22px 28px', fontFamily: mono, fontSize: 21, lineHeight: '46px', transform: `translateY(${-scroll}px)`}}>
          {shown.map((l, i) => (
            <div key={i} style={{color: l.c, opacity: f(l.at, 5), whiteSpace: 'nowrap', background: l.t.startsWith('Close gate') ? 'rgba(255,90,80,0.12)' : 'transparent'}}>{l.t}</div>
          ))}
        </div>
        </div>
      </div>

      {/* review card */}
      <div style={{position: 'absolute', left: 1100, top: 290, width: 710, borderRadius: 20, background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: '0 30px 80px rgba(29,33,37,0.08)', padding: '26px 30px', transform: `translateY(${(1 - f(APP.promises[0], 14)) * 40}px)`, opacity: f(APP.promises[0], 10)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontFamily: mono, fontSize: 15, color: COLORS.muted}}>intent/rate-limit-public-api</div>
            <div style={{fontSize: 24, fontWeight: 600, color: COLORS.ink, marginTop: 4}}>Promises</div>
          </div>
          <span style={{padding: '6px 14px', borderRadius: 999, fontSize: 16, fontWeight: 600, background: frame >= APP.ready ? COLORS.greenSoft : COLORS.redSoft, color: frame >= APP.ready ? COLORS.teal : COLORS.red}}>{frame >= APP.ready ? '✓ Pass' : 'Open'}</span>
        </div>
        {PROMISES.map((p, i) => {
          const proven = i < 2 ? frame >= APP.lines[3] : frame >= APP.pass3;
          const flagged = i === 2 && frame >= APP.refused && !proven;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderTop: `1px solid ${COLORS.line}`, marginTop: i === 0 ? 18 : 0, opacity: f(APP.promises[i], 8)}}>
              <span style={{width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: '#fff', background: proven ? COLORS.teal : flagged ? COLORS.red : COLORS.line, transform: `scale(${proven && i === 2 ? 1 + 0.3 * Math.exp(-(frame - APP.pass3) / 4) : 1})`}}>{proven ? '✓' : flagged ? '!' : ''}</span>
              <div style={{flex: 1}}>
                <div style={{fontSize: 21, color: COLORS.ink}}>{p.t}</div>
                <div style={{fontFamily: mono, fontSize: 15, color: proven ? COLORS.teal : flagged ? COLORS.red : COLORS.muted, marginTop: 3}}>{proven ? p.proof : flagged ? 'no test · TIDEN-377' : 'checking…'}</div>
              </div>
            </div>
          );
        })}
        <div style={{display: 'flex', gap: 14, marginTop: 14, opacity: Math.min(1, ready), transform: `translateY(${(1 - Math.min(1, ready)) * 16}px)`}}>
          <div style={{flex: 1, padding: '16px 18px', borderRadius: 14, background: COLORS.greenSoft, color: COLORS.teal, fontSize: 20, fontWeight: 600}}>Ready for review · 3 of 3 promises · run #11</div>
          <div style={{padding: '16px 26px', borderRadius: 14, background: COLORS.ink, color: '#fff', fontSize: 20, fontWeight: 600, transform: `scale(${1 - merge * 0.06})`}}>Merge</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
