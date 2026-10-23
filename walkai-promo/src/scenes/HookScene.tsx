import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Radio} from '../components/Radio';
import {Camera, punches, Shards} from '../components/Kinetic';
import {COLORS, EASE, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {ptt: 22, say: [24, 48], release: 52, vox: [58, 62, 66], reply: [70, 92], roger: 94};
const SAY = 'Fix the buy button. Over.';
const REPLY = 'Fixed. Ready to ship. Over.';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const settle = interpolate(frame, [0, 12], [1.05, 1], {...clamp, easing: EASE.out});
  const tx = frame >= HOOK.ptt && frame < HOOK.release;
  const rx = frame >= HOOK.vox[0] && frame < HOOK.roger + 6;
  const said = Math.ceil(interpolate(frame, HOOK.say, [0, SAY.split(' ').length], clamp));
  const replied = Math.ceil(interpolate(frame, HOOK.reply, [0, REPLY.split(' ').length], clamp));
  const bob = spring({frame: frame - HOOK.ptt, fps, config: {damping: 10, stiffness: 260}});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 + exit * 0.4})`, filter: exit > 0.02 ? `blur(${exit * 20}px)` : undefined, color: COLORS.text}}>
      <Shards color={COLORS.orange} tint="rgba(30,34,42,0.9)" opacity={0.45} count={10} />
      <Camera keys={[{f: 0, x: 960, y: 540, s: 1.0}, {f: HOOK.ptt, x: 1000, y: 520, s: 1.05}, {f: HOOK.reply[0], x: 900, y: 600, s: 1.08, rz: -0.5}, {f: 110, x: 920, y: 600, s: 1.12}]} shake={punches(frame, [HOOK.ptt, HOOK.vox[0], HOOK.roger], 4) * 7}>
      {/* frame 0: the claim + the object, both fully on screen */}
      <div style={{position: 'absolute', left: 130, top: 170, fontSize: 160, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.98, transform: `scale(${settle})`, transformOrigin: 'left center'}}>
        Fix bugs with
        <br />
        <span style={{color: COLORS.orange}}>a walkie-talkie.</span>
      </div>
      <div style={{position: 'absolute', left: 130, top: 600, minHeight: 200}}>
        {frame >= HOOK.say[0] && frame < HOOK.reply[0] && (
          <div style={{fontSize: 56, fontWeight: 600, color: COLORS.green}}>
            <span style={{fontFamily: mono, fontSize: 26, padding: '6px 12px', borderRadius: 8, background: 'rgba(126,240,196,0.12)', marginRight: 18, verticalAlign: 'middle'}}>YOU · TX</span>
            “{SAY.split(' ').slice(0, said).join(' ')}”
          </div>
        )}
        {frame >= HOOK.reply[0] && (
          <div style={{fontSize: 56, fontWeight: 600, color: COLORS.orangeLit}}>
            <span style={{fontFamily: mono, fontSize: 26, padding: '6px 12px', borderRadius: 8, background: 'rgba(255,107,43,0.15)', marginRight: 18, verticalAlign: 'middle'}}>CLAUDE CODE · RX</span>
            “{REPLY.split(' ').slice(0, replied).join(' ')}”
          </div>
        )}
        <div style={{display: 'flex', gap: 10, marginTop: 22, fontFamily: mono, fontSize: 20}}>
          {[880, 1100, 1400].map((hz, i) => (
            <span key={hz} style={{padding: '4px 12px', borderRadius: 6, background: frame >= HOOK.vox[i] ? COLORS.orange : COLORS.panel, color: frame >= HOOK.vox[i] ? '#fff' : COLORS.muted, opacity: frame >= HOOK.vox[0] - 4 ? 1 : 0}}>{hz} Hz</span>
          ))}
          {frame >= HOOK.roger && <span style={{padding: '4px 12px', borderRadius: 6, background: COLORS.panel2, color: COLORS.orange, fontWeight: 700}}>ROGER ⟂</span>}
        </div>
      </div>
      <div style={{position: 'absolute', right: 150, top: 150, transform: `rotate(${6 - (tx ? 2 * Math.min(1, bob) : 0)}deg) translateY(${tx ? -10 * Math.min(1, bob) : 0}px)`}}>
        <Radio scale={1.0} tx={tx} rx={rx} lcd={tx ? 'TX ▮▮▮' : rx ? 'RX ▮▮▮' : 'CLAUDE'} ptt={tx ? 1 : 0} />
      </div>
      </Camera>
    </AbsoluteFill>
  );
};
