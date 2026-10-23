import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera, punches, Rise, Shards} from '../components/Kinetic';
import {COLORS, EASE, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
// Pomerado's published benchmark: same task, 8m16s for 3 cents vs 21m22s and $41.01
export const HOOK = {pomDone: 40, agentDone: 80, line2: 84};
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const Lane: React.FC<{name: string; sub: string; secs: number; cost: string; done: boolean; brand?: boolean; progress: number; pop: number}> = ({name, sub, secs, cost, done, brand, progress, pop}) => (
  <div style={{flex: 1, borderRadius: 28, padding: '40px 44px', background: brand ? COLORS.cream : COLORS.band, border: `2px solid ${brand ? COLORS.brand : COLORS.line}`, transform: `scale(${1 + 0.04 * pop})`}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div>
        <div style={{fontSize: 42, fontWeight: 700, color: brand ? COLORS.brand : COLORS.ink}}>{name}</div>
        <div style={{fontSize: 24, color: COLORS.body}}>{sub}</div>
      </div>
      <span style={{padding: '8px 16px', borderRadius: 999, fontSize: 20, fontWeight: 700, background: done ? (brand ? COLORS.brand : COLORS.ink) : '#fff', color: done ? '#fff' : COLORS.body, border: done ? 'none' : `1px solid ${COLORS.line}`}}>{done ? '✓ Done' : 'Running…'}</span>
    </div>
    <div style={{display: 'flex', gap: 40, marginTop: 26, fontFamily: mono, fontVariantNumeric: 'tabular-nums'}}>
      <div>
        <div style={{fontSize: 18, color: COLORS.body}}>TIME</div>
        <div style={{fontSize: 110, fontWeight: 700, color: COLORS.ink}}>{mmss(secs)}</div>
      </div>
      <div>
        <div style={{fontSize: 18, color: COLORS.body}}>COST</div>
        <div style={{fontSize: 110, fontWeight: 700, color: brand ? COLORS.brand : COLORS.ink}}>{cost}</div>
      </div>
    </div>
    <div style={{height: 16, borderRadius: 8, background: '#fff', marginTop: 28, overflow: 'hidden'}}>
      <div style={{width: `${progress * 100}%`, height: '100%', background: brand ? COLORS.coral : '#9AA3AF'}} />
    </div>
  </div>
);

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // frame 0 is a finished, readable poster frame; motion starts from it
  const settle = interpolate(frame, [0, 10], [1.05, 1], {...clamp, easing: EASE.out});
  const pom = interpolate(frame, [0, HOOK.pomDone], [0, 1], clamp);
  const agent = interpolate(frame, [0, HOOK.agentDone], [0, 1], clamp);
  const pomPop = Math.exp(-Math.max(0, frame - HOOK.pomDone) / 5) * (frame >= HOOK.pomDone ? 1 : 0);
  const agentPop = Math.exp(-Math.max(0, frame - HOOK.agentDone) / 5) * (frame >= HOOK.agentDone ? 1 : 0);
  const line2 = spring({frame: frame - HOOK.line2, fps, config: {damping: 14, stiffness: 180}});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 + exit * 0.4})`, filter: exit > 0.02 ? `blur(${exit * 20}px)` : undefined, color: COLORS.ink}}>
      <Shards color={COLORS.coral} tint="#FFFFFF" opacity={0.35} count={10} />
      <Camera keys={[{f: 0, x: 960, y: 540, s: 1.0}, {f: HOOK.pomDone, x: 1180, y: 560, s: 1.06, ry: -2}, {f: HOOK.agentDone, x: 760, y: 560, s: 1.06, ry: 2}, {f: 110, x: 960, y: 600, s: 1.03}]} shake={punches(frame, [HOOK.pomDone, HOOK.agentDone], 4) * 7}>
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontSize: 30, color: COLORS.body}}>Same task: onboard 2 new employees across HR, IT, courses and library</div>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontSize: 190, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1, transform: `scale(${settle})`}}>
        <span style={{color: '#9AA3AF', textDecoration: frame >= HOOK.agentDone ? 'line-through' : 'none', textDecorationThickness: 12}}>$41.01</span> vs <span style={{color: COLORS.brand}}>3¢</span>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 370, display: 'flex', gap: 36}}>
        <Lane name="Browser agent" sub="Codex Computer Use" secs={agent * 1282} cost={`$${(agent * 41.01).toFixed(2)}`} done={frame >= HOOK.agentDone} progress={agent} pop={agentPop} />
        <Lane name="Pomerado" sub="Deterministic API" secs={pom * 496} cost={`$${(pom * 0.03).toFixed(2)}`} done={frame >= HOOK.pomDone} brand progress={pom} pop={pomPop} />
      </div>
      <div style={{position: 'absolute', top: 880, width: '100%', textAlign: 'center', fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', }}>
        <Rise text="No browser. Just an API." at={HOOK.line2} accent={['Just', 'an', 'API']} accentColor={COLORS.brand} />
      </div>
      </Camera>
      <div style={{position: 'absolute', bottom: 40, right: 120, fontSize: 18, color: COLORS.body, fontFamily: mono}}>pomerado.ai benchmark · shown at 321× speed</div>
    </AbsoluteFill>
  );
};
