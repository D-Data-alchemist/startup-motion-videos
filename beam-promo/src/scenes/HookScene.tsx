import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera, kick, Shards} from '../components/Kinetic';
import {Win} from '../components/Window';
import {COLORS, display, EASE} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {fly: [0, 40], land: 40, line2: 44, dock: 50};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const settle = interpolate(frame, [0, 12], [1.05, 1], {...clamp, easing: EASE.out});
  // the window is already mid-flight on frame 0, so the poster frame shows the idea
  const t = interpolate(frame, HOOK.fly, [0.28, 1], {...clamp, easing: EASE.inOut});
  const x = interpolate(t, [0, 1], [330, 1160]);
  const y = interpolate(t, [0, 0.5, 1], [600, 380, 470]);
  const s = interpolate(t, [0, 0.5, 1], [0.42, 0.64, 0.56]);
  const land = spring({frame: frame - HOOK.land, fps, config: {damping: 10, stiffness: 220}});
  const line2 = spring({frame: frame - HOOK.line2, fps, config: {damping: 14, stiffness: 180}});
  const dock = spring({frame: frame - HOOK.dock, fps, config: {damping: 9, stiffness: 220}});
  const exit = interpolate(frame, [98, 110], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 + exit * 0.4})`, filter: exit > 0.02 ? `blur(${exit * 20}px)` : undefined, color: COLORS.text}}>
      <Shards color={COLORS.mint} tint="rgba(22,29,27,0.9)" opacity={0.4} count={10} />
      {/* the two Macs and the flying window ride the camera; the headline stays put */}
      <Camera keys={[{f: 0, x: 900, y: 560, s: 1.0, ry: 4}, {f: HOOK.land, x: 1240, y: 560, s: 1.1, ry: -2}, {f: 110, x: 1300, y: 590, s: 1.16, ry: -4}]} shake={kick(frame, HOOK.land, 4) * 8}>
        {/* the Mac mini, in the closet */}
        <div style={{position: 'absolute', left: 170, top: 640}}>
          <div style={{width: 340, height: 120, borderRadius: 26, background: 'linear-gradient(180deg,#D9DEE2,#A9B0B6)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}} />
          <div style={{position: 'absolute', left: 18, bottom: 16, width: 8, height: 8, borderRadius: 4, background: COLORS.studio, boxShadow: `0 0 10px ${COLORS.studio}`}} />
          <div style={{textAlign: 'center', marginTop: 22, fontSize: 26, color: COLORS.muted}}>Mac mini · “Studio” · no display</div>
        </div>
        {/* the MacBook in front of you */}
        <div style={{position: 'absolute', left: 1080, top: 420}}>
          <div style={{width: 700, height: 440, borderRadius: '22px 22px 0 0', background: '#0B0F0E', border: '12px solid #1E2222', borderBottom: 'none', overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#173A2E,#081310)'}} />
            <div style={{position: 'absolute', left: '50%', bottom: 10, transform: 'translateX(-50%)', display: 'flex', gap: 8, padding: '6px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)'}}>
              {['#2E7CF6', '#F7C948', '#E54B4B'].map((c) => <div key={c} style={{width: 32, height: 32, borderRadius: 8, background: c}} />)}
              <div style={{width: 32 * Math.min(1, dock), height: 32, borderRadius: 8, background: '#111', boxShadow: `0 0 0 2px ${COLORS.studio}`, transform: `scale(${Math.min(1, dock)}) translateY(${-Math.sin(Math.min(1, dock) * Math.PI) * 10}px)`}} />
            </div>
          </div>
          <div style={{width: 820, height: 26, marginLeft: -60, borderRadius: '0 0 18px 18px', background: 'linear-gradient(180deg,#C9CED2,#8E959B)'}} />
          <div style={{textAlign: 'center', marginTop: 18, fontSize: 26, color: COLORS.muted}}>Your MacBook</div>
        </div>
        {/* the beam: a trail from mini to MacBook */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: (1 - Math.min(1, land)) * 0.9}}>
          <path d={`M 340 640 Q 760 330 ${x + 40} ${y + 30}`} stroke={COLORS.mintLit} strokeWidth={4} fill="none" strokeDasharray="10 14" strokeDashoffset={-frame * 3} opacity={0.7} />
        </svg>
        <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s * (1 + 0.04 * (frame >= HOOK.land ? 1 - Math.min(1, land) : 0))})`, transformOrigin: 'top left', filter: frame < HOOK.land - 4 ? `blur(${Math.max(0, 3 - frame / 10)}px)` : undefined}}>
          <Win title="Terminal — agents" from="Studio" ring={COLORS.studio} w={1000} h={640} glow={1 - t + 0.4}>
            <div style={{padding: '24px 28px', fontFamily: 'SF Mono, Menlo, monospace', fontSize: 30, lineHeight: 1.8, color: '#D8E2DC'}}>
              <div>❯ claude</div>
              <div>● 4 agents running on Studio</div>
              <div style={{color: COLORS.mintLit}}>✓ build #212 passed</div>
            </div>
          </Win>
        </div>
      </Camera>
      <div style={{position: 'absolute', top: 64, width: '100%', textAlign: 'center', fontFamily: display, fontSize: 150, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.02, transform: `scale(${settle})`}}>
        <div>Agents on the Mac mini.</div>
        <div style={{color: COLORS.mint, opacity: Math.min(1, line2), transform: `translateY(${(1 - Math.min(1, line2)) * 30}px) scale(${1 + 0.08 * Math.max(0, 1 - line2)})`}}>Windows right here.</div>
      </div>
    </AbsoluteFill>
  );
};
