import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera, punches, Rise, Shards} from '../components/Kinetic';
import {COLORS, display, EASE, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {crack: 30, question: 36, promises: [56, 62, 68], flag: 76};
const P = ['Free returns 429 above 60/min', 'Every 429 carries Retry-After', 'Pro returns 429 above 600'];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // frame 0 is the finished poster frame: the agent's claim, huge
  const settle = interpolate(frame, [0, 12], [1.04, 1], {...clamp, easing: EASE.out});
  const crack = interpolate(frame, [HOOK.crack, HOOK.crack + 8], [0, 1], {...clamp, easing: EASE.out});
  const q = spring({frame: frame - HOOK.question, fps, config: {damping: 14, stiffness: 200}});
  const flag = spring({frame: frame - HOOK.flag, fps, config: {damping: 9, stiffness: 220}});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  const shake = frame >= HOOK.crack && frame < HOOK.crack + 8 ? Math.sin((frame - HOOK.crack) * 3) * (8 - (frame - HOOK.crack)) : 0;
  return (
    <AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 + exit * 0.4})`, filter: exit > 0.02 ? `blur(${exit * 20}px)` : undefined, color: COLORS.ink}}>
      <Shards color={COLORS.blueLit} tint="#FFFFFF" opacity={0.35} count={10} />
      <Camera keys={[{f: 0, x: 960, y: 540, s: 1.0}, {f: HOOK.crack, x: 900, y: 420, s: 1.06}, {f: HOOK.question + 10, x: 960, y: 560, s: 1.0, rz: -0.6}, {f: 110, x: 980, y: 640, s: 1.06, rz: 0}]} shake={punches(frame, [HOOK.crack, HOOK.flag], 4) * 6}>
      <div style={{position: 'absolute', left: 140, top: 190, transform: `scale(${settle}) translateX(${shake}px)`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: mono, fontSize: 30, color: COLORS.muted}}>● Edited api/public/v1/limiter.go</div>
        <div style={{fontFamily: display, fontSize: 210, fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 1.05, marginTop: 10, position: 'relative', display: 'inline-block'}}>
          <span style={{color: COLORS.teal}}>✓</span> “Tests pass.”
          <div style={{position: 'absolute', left: 0, top: '54%', height: 14, width: `${crack * 100}%`, background: COLORS.red, borderRadius: 7}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 560, fontFamily: display, fontSize: 92, fontWeight: 500, letterSpacing: '-0.035em', }}>
        <Rise text="But is it what you asked for?" at={HOOK.question} accent={['asked', 'for']} accentColor={COLORS.blue} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 740, display: 'flex', gap: 18}}>
        {P.map((t, i) => {
          const o = interpolate(frame, [HOOK.promises[i], HOOK.promises[i] + 6], [0, 1], clamp);
          const bad = i === 2 && frame >= HOOK.flag;
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderRadius: 16, background: bad ? COLORS.redSoft : COLORS.card, border: `2px solid ${bad ? COLORS.red : COLORS.line}`, fontSize: 26, opacity: o, transform: `translateY(${(1 - o) * 20}px) scale(${bad ? 1 + 0.08 * Math.max(0, 1 - flag) + 0.02 : 1})`}}>
              <span style={{width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, background: bad ? COLORS.red : COLORS.teal}}>{bad ? '!' : '✓'}</span>
              {t}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 140, top: 880, fontFamily: mono, fontSize: 30, color: COLORS.red, opacity: Math.min(1, flag)}}>1 of 3 promises has no test.</div>
      </Camera>
    </AbsoluteFill>
  );
};
