import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Win} from '../components/Window';
import {COLORS, display, EASE, Logo} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {picker: 4, pick: 26, fly1: [30, 52], dock: 54, cmdTab: [66, 92], fly2: [96, 118], resize: [128, 150], file: [160, 182], lock: 186};
const CAPTIONS = [
  {at: 0, text: <>A window, <span style={{color: COLORS.mint}}>not a video feed.</span></>},
  {at: APP.dock, text: <>Its own Dock icon. A place in <span style={{color: COLORS.mint}}>⌘Tab.</span></>},
  {at: APP.fly2[0], text: <>Beam <span style={{color: COLORS.kitchen}}>several</span> at once.</>},
  {at: APP.file[0], text: <>Private by architecture. <span style={{color: COLORS.mint}}>We never see them.</span></>},
];
const CODE = ['❯ claude', '  ● Running 4 agents on Studio', '  ● build #212 · 1,284 tests', '  ✓ agents: 3 done, 1 working…'];

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 22});
  const exit = interpolate(frame, [196, 210], [0, 1], {...clamp, easing: EASE.in});
  const f = (at: number, d = 8) => interpolate(frame, [at, at + d], [0, 1], {...clamp, easing: EASE.out});
  const fly1 = interpolate(frame, APP.fly1, [0, 1], {...clamp, easing: EASE.inOut});
  const fly2 = interpolate(frame, APP.fly2, [0, 1], {...clamp, easing: EASE.inOut});
  const resize = interpolate(frame, APP.resize, [0, 1], {...clamp, easing: EASE.inOut});
  const file = interpolate(frame, APP.file, [0, 1], {...clamp, easing: EASE.inOut});
  const pickerO = f(APP.picker) * (1 - f(APP.fly1[0] + 4, 8));
  const cmdTab = interpolate(frame, [APP.cmdTab[0], APP.cmdTab[0] + 6, APP.cmdTab[1] - 6, APP.cmdTab[1]], [0, 1, 1, 0], clamp);
  const dock = spring({frame: frame - APP.dock, fps, config: {damping: 10, stiffness: 200}});
  const dock2 = spring({frame: frame - APP.fly2[1], fps, config: {damping: 10, stiffness: 200}});
  const w1 = 820 + resize * 120;

  // desktop is 1700×860 at (110, 170)
  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), color: COLORS.text}}>
      {CAPTIONS.map((c, i) => {
        const next = CAPTIONS[i + 1]?.at ?? 999;
        const o = interpolate(frame, [c.at, c.at + 8, next - 5, next], [0, 1, 1, 0], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 110, top: 52, fontFamily: display, fontSize: 70, fontWeight: 600, letterSpacing: '-0.03em', opacity: o, transform: `translateY(${(1 - o) * 18}px)`}}>{c.text}</div>
        );
      })}
      <div style={{position: 'absolute', left: 110, top: 170, width: 1700, height: 860, borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(160deg,#173A2E 0%,#0C1A15 55%,#081310 100%)', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 50px 120px rgba(0,0,0,0.6)', transform: `translateY(${(1 - enter) * 80}px)`}}>
        {/* menu bar */}
        <div style={{height: 34, display: 'flex', alignItems: 'center', gap: 22, padding: '0 20px', background: 'rgba(0,0,0,0.35)', fontSize: 15, color: '#E8ECEA'}}>
          <b>Beam</b><span>File</span><span>Edit</span><span>Window</span><span>Help</span>
          <span style={{marginLeft: 'auto'}}>MacBook Pro · Mon 9:41</span>
        </div>
        {/* Beam picker */}
        <div style={{position: 'absolute', left: 1140, top: 54, width: 500, borderRadius: 16, background: 'rgba(28,30,30,0.92)', border: '1px solid rgba(255,255,255,0.1)', padding: 16, opacity: pickerO, transform: `translateY(${(1 - f(APP.picker)) * -14}px)`}}>
          <div style={{fontSize: 14, color: COLORS.muted, marginBottom: 10}}>All Macs</div>
          {[
            ['S', 'Studio', COLORS.studio, ['Terminal — agents', 'Xcode', 'Logic Pro']],
            ['K', 'Kitchen', COLORS.kitchen, ['Final Cut Pro', 'Photos']],
            ['L', 'Loft', COLORS.loft, ['Blender', 'Safari']],
          ].map(([k, name, c, apps], i) => (
            <div key={k as string} style={{marginBottom: 10}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600}}>
                <span style={{width: 24, height: 24, borderRadius: 7, background: c as string, color: '#08110D', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{k as string}</span>
                {name as string}
              </div>
              <div style={{display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap'}}>
                {(apps as string[]).map((a, j) => (
                  <span key={a} style={{fontSize: 14, padding: '6px 10px', borderRadius: 8, background: i === 0 && j === 0 && frame >= APP.pick ? COLORS.studio : 'rgba(255,255,255,0.06)', color: i === 0 && j === 0 && frame >= APP.pick ? '#08110D' : '#D5DBD8', fontWeight: i === 0 && j === 0 ? 700 : 500}}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* window 1: from the Studio, walks across the room */}
        {frame >= APP.fly1[0] && (
          <div style={{position: 'absolute', left: interpolate(fly1, [0, 1], [1700, 80]), top: interpolate(fly1, [0, 1], [-200, 80]), transform: `scale(${interpolate(fly1, [0, 0.5, 1], [0.3, 0.8, 1])}) rotate(${(1 - fly1) * 8}deg)`, transformOrigin: 'top left', opacity: Math.min(1, fly1 * 3)}}>
            <Win title="Terminal — agents" from="Studio" ring={COLORS.studio} w={w1} h={480} glow={1 - fly1 + 0.3}>
              <div style={{padding: '18px 22px', fontFamily: 'SF Mono, Menlo, monospace', fontSize: 20, lineHeight: 1.8, color: '#D8E2DC'}}>
                {CODE.map((l, i) => (
                  <div key={i} style={{color: l.includes('✓') ? COLORS.mintLit : undefined, opacity: f(APP.fly1[1] + i * 5, 5)}}>{l}</div>
                ))}
                <div style={{marginTop: 10, fontSize: 16, color: COLORS.muted, opacity: f(APP.resize[0], 6)}}>Drag a corner here, and the real window resizes over there.</div>
              </div>
              {/* resize handle */}
              <div style={{position: 'absolute', right: 6, bottom: 6, width: 26, height: 26, borderRight: `3px solid ${COLORS.studio}`, borderBottom: `3px solid ${COLORS.studio}`, opacity: f(APP.resize[0] - 4, 4) * (1 - f(APP.resize[1] + 6, 6))}} />
            </Win>
          </div>
        )}

        {/* window 2: from the Kitchen */}
        {frame >= APP.fly2[0] && (
          <div style={{position: 'absolute', left: interpolate(fly2, [0, 1], [1800, 1060]), top: interpolate(fly2, [0, 1], [900, 200]), transform: `scale(${interpolate(fly2, [0, 0.5, 1], [0.3, 0.8, 1])}) rotate(${(1 - fly2) * -8}deg)`, transformOrigin: 'top left', opacity: Math.min(1, fly2 * 3)}}>
            <Win title="Final Cut Pro" from="Kitchen" ring={COLORS.kitchen} w={600} h={420} glow={1 - fly2 + 0.3}>
              <div style={{position: 'absolute', inset: 14, borderRadius: 8, background: 'linear-gradient(135deg,#2B1B3A,#3E2A16)'}} />
              <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, height: 90, borderRadius: 8, background: '#121214', display: 'flex', gap: 4, padding: 10}}>
                {[160, 90, 210, 70].map((w, i) => <div key={i} style={{width: w, borderRadius: 4, background: ['#5B7CFA', '#F2A93B', '#7AF2C4', '#E27BBF'][i], opacity: 0.8}} />)}
              </div>
            </Win>
          </div>
        )}

        {/* a file dragged onto the beamed window lands on the other Mac */}
        {frame >= APP.file[0] && (
          <div style={{position: 'absolute', left: interpolate(file, [0, 1], [1500, 520]), top: interpolate(file, [0, 1], [700, 330]), opacity: 1 - f(APP.file[1] + 2, 6), transform: `scale(${1 - f(APP.file[1], 6) * 0.5})`}}>
            <div style={{width: 74, height: 90, borderRadius: 8, background: '#F4F6F5', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, fontSize: 12, fontWeight: 700, color: '#333'}}>.env</div>
          </div>
        )}
        <div style={{position: 'absolute', left: 80, top: 590, display: 'flex', gap: 12, opacity: f(APP.file[1])}}>
          <span style={{padding: '10px 16px', borderRadius: 999, background: 'rgba(89,212,153,0.16)', color: COLORS.mintLit, fontSize: 18, fontWeight: 600}}>✓ .env landed on Studio</span>
          <span style={{padding: '10px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: '#D5DBD8', fontSize: 18, fontWeight: 600}}>🔒 Mac to Mac, encrypted</span>
        </div>

        {/* ⌘Tab switcher */}
        <div style={{position: 'absolute', left: 850, top: 330, transform: `translateX(-50%) scale(${0.95 + 0.05 * cmdTab})`, opacity: cmdTab, display: 'flex', gap: 18, padding: 22, borderRadius: 26, background: 'rgba(30,32,32,0.88)', border: '1px solid rgba(255,255,255,0.12)'}}>
          {[['Safari', '#2E7CF6'], ['Notes', '#F7C948'], ['Terminal · Studio', COLORS.studio], ['Mail', '#4FA3F7']].map(([n, c], i) => (
            <div key={n} style={{width: 120, textAlign: 'center'}}>
              <div style={{width: 96, height: 96, margin: '0 auto', borderRadius: 22, background: i === 2 ? '#111' : c, boxShadow: i === 2 ? `0 0 0 4px ${COLORS.studio}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'SF Mono, Menlo, monospace', color: COLORS.studio, fontSize: 30}}>{i === 2 ? '>_' : ''}</div>
              <div style={{fontSize: 14, marginTop: 8, color: i === 2 ? '#fff' : COLORS.muted}}>{n}</div>
            </div>
          ))}
        </div>

        {/* Dock */}
        <div style={{position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', display: 'flex', gap: 12, padding: '10px 14px', borderRadius: 22, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)'}}>
          {['#2E7CF6', '#F7C948', '#4FA3F7', '#E54B4B', '#8E8E93'].map((c, i) => <div key={i} style={{width: 62, height: 62, borderRadius: 15, background: c}} />)}
          <div style={{width: 62 * Math.min(1, dock), height: 62, borderRadius: 15, background: '#111', boxShadow: `0 0 0 3px ${COLORS.studio}`, transform: `scale(${Math.min(1, dock)}) translateY(${-Math.sin(Math.min(1, dock) * Math.PI) * 16}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.studio, fontFamily: 'SF Mono, Menlo, monospace', fontSize: 20}}>{'>_'}</div>
          <div style={{width: 62 * Math.min(1, dock2), height: 62, borderRadius: 15, background: 'linear-gradient(135deg,#3B2A55,#1B1B1D)', boxShadow: `0 0 0 3px ${COLORS.kitchen}`, transform: `scale(${Math.min(1, dock2)})`}} />
        </div>
      </div>
      <div style={{position: 'absolute', right: 110, top: 72}}>
        <Logo height={40} />
      </div>
    </AbsoluteFill>
  );
};
