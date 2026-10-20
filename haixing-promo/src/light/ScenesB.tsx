import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, EASE, img} from '../theme';
import {Caption, ChipBar, clamp, glass, INK, rise} from './kit';

// ── 5 · Processes: lineup + process chips ───────────────────────────────────
export const PROCESS_AT = [20, 46, 72, 98, 124];
const LINEUP = [
  {file: 'long-shaft.png', h: 380, p: 'External turning'},
  {file: 'flange-shaft.png', h: 300, p: 'Facing'},
  {file: 'pin-shafts.png', h: 300, p: 'Grooving'},
  {file: 'flange-housing.png', h: 270, p: 'Tapping'},
  {file: 'titanium-worm.png', h: 320, p: 'Threading'},
];

export const Processes: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = PROCESS_AT.filter((t) => frame >= t).length - 1;
  return (
    <AbsoluteFill style={{color: '#fff'}}>
      <Caption>Precision turning · 精密车削</Caption>
      <div style={{position: 'absolute', left: 150, right: 150, top: 230, height: 520, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around'}}>
        {LINEUP.map((l, i) => {
          const enter = spring({frame: frame - (2 + i * 4), fps, config: {damping: 15, stiffness: 120}});
          const on = i === active ? spring({frame: frame - PROCESS_AT[i], fps, config: {damping: 14, stiffness: 160}}) : 0;
          const off = i === active - 1 ? 1 - interpolate(frame, [PROCESS_AT[active], PROCESS_AT[active] + 10], [0, 1], clamp) : 0;
          const lift = Math.max(on, off);
          return (
            <div key={l.file} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(enter, 1), transform: `translateX(${(1 - enter) * 300}px) translateY(${-lift * 34}px) scale(${1 + lift * 0.1})`}}>
              <Img src={img(l.file)} style={{height: l.h, filter: `drop-shadow(0 ${24 + lift * 20}px ${30 + lift * 10}px rgba(22,50,92,${0.3 + lift * 0.15}))`, transform: `rotate(${(i % 2 ? 1 : -1) * 6 + Math.sin((frame + i * 20) / 30) * 2}deg)`}} />
              <div style={{width: 160, height: 18, marginTop: 20, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(22,50,92,0.3), transparent 70%)'}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 860, width: '100%', display: 'flex', justifyContent: 'center', ...rise(frame, 8, 20)}}>
        <ChipBar items={LINEUP.map((l) => ({label: l.p}))} active={Math.max(0, active)} />
      </div>
    </AbsoluteFill>
  );
};

// ── 6 · Quality: scan line + inspection badges ──────────────────────────────
export const BADGE_AT = [34, 52, 70];
const BADGES = ['First-article inspection · 首件检测', 'Patrol inspection · 巡检', 'Outgoing inspection · 出货检验'];

export const Quality: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [10, 70], [0, 1], {...clamp, easing: EASE.inOut});
  const pass = Math.round(interpolate(frame, [92, 124], [0, 99], {...clamp, easing: EASE.out}));
  return (
    <AbsoluteFill style={{color: '#fff'}}>
      <Caption>Inspected at every step · 全程质检</Caption>
      <div style={{position: 'absolute', left: 330, top: 230, width: 560, height: 560}}>
        <Img src={img('impeller-top.png')} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `rotate(${frame * 0.6}deg)`, filter: 'drop-shadow(0 30px 40px rgba(22,50,92,0.35))'}} />
        <div style={{position: 'absolute', left: -60, right: -60, top: `${scan * 100}%`, height: 2, background: 'linear-gradient(90deg, transparent, #fff, transparent)', boxShadow: '0 0 18px #fff', opacity: scan > 0 && scan < 1 ? 1 : 0}} />
      </div>
      <div style={{position: 'absolute', left: 1030, top: 300, display: 'flex', flexDirection: 'column', gap: 18}}>
        {BADGES.map((b, i) => (
          <div key={b} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.94)', color: INK, fontSize: 26, fontWeight: 500, boxShadow: '0 14px 30px rgba(22,50,92,0.15)', ...rise(frame, BADGE_AT[i], 20)}}>
            <span style={{width: 30, height: 30, borderRadius: '50%', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17}}>✓</span>
            {b}
          </div>
        ))}
        <div style={{marginTop: 30, ...rise(frame, 88, 20)}}>
          <div style={{fontSize: 120, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{pass}%+</div>
          <div style={{fontSize: 26, opacity: 0.9, marginTop: 8}}>stable pass rate · 产品合格率</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 7 · Steps: drawing + order card → blueprint becomes the part → batch ────
export const STEP2_AT = 82;
const FIELDS = [
  ['Part', 'Flange shaft'],
  ['Material', 'Stainless steel'],
  ['Quantity', '500 pcs'],
  ['Sample', 'Within 24 h'],
];

const Blueprint: React.FC<{draw: number; width: number}> = ({draw, width}) => {
  const d = (len: number) => ({strokeDasharray: len, strokeDashoffset: len * (1 - draw)});
  return (
    <svg width={width} height={width * 1.3} viewBox="0 0 200 260" style={{overflow: 'visible'}}>
      <g fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="55" y="20" width="90" height="34" rx="2" style={d(260)} />
        <rect x="72" y="54" width="56" height="70" style={d(260)} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x="62" y={130 + i * 14} width="76" height="8" rx="2" style={d(170)} />
        ))}
        <rect x="80" y="214" width="40" height="26" style={d(140)} />
        <line x1="100" y1="10" x2="100" y2="250" strokeDasharray="6 4" stroke="#93C5FD" />
      </g>
      <g stroke="#64748B" strokeWidth="1" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono" opacity={draw}>
        <line x1="55" y1="12" x2="145" y2="12" />
        <text x="88" y="8" stroke="none">Ø48</text>
        <line x1="170" y1="20" x2="170" y2="240" />
        <text x="174" y="134" stroke="none">86</text>
        <line x1="30" y1="130" x2="30" y2="208" />
        <text x="6" y="172" stroke="none">M30</text>
      </g>
    </svg>
  );
};

export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const two = frame >= STEP2_AT;
  const draw = interpolate(frame, [6, 40], [0, 1], {...clamp, easing: EASE.inOut});
  const phaseA = 1 - interpolate(frame, [STEP2_AT - 10, STEP2_AT], [0, 1], clamp);
  const bp = interpolate(frame, [STEP2_AT, STEP2_AT + 12], [0, 1], {...clamp, easing: EASE.out});
  const real = interpolate(frame, [STEP2_AT + 18, STEP2_AT + 32], [0, 1], {...clamp, easing: EASE.inOut});
  const army = interpolate(frame, [STEP2_AT + 44, STEP2_AT + 70], [0, 1], {...clamp, easing: EASE.inOut});
  const pill = (n: number, text: string, at: number) => (
    <div style={{position: 'absolute', top: 96, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, fontSize: 32, color: INK, ...rise(frame, at, 14)}}>
      <span style={{padding: '6px 16px', borderRadius: 999, background: '#2563EB', color: '#fff', fontSize: 22, fontWeight: 600}}>Step {n}</span>
      {text}
    </div>
  );
  return (
    <AbsoluteFill>
      {!two ? pill(1, 'Send your drawing or sample · 来图来样', 4) : pill(2, 'Machined to your exact spec · 按图加工', STEP2_AT)}
      {/* Phase A: drawing + order card */}
      <AbsoluteFill style={{opacity: phaseA}}>
        <div style={{position: 'absolute', left: 380, top: 230, width: 460, height: 600, background: '#fff', borderRadius: 10, boxShadow: '0 30px 60px rgba(22,50,92,0.16)', transform: 'rotate(-3deg)', backgroundImage: 'linear-gradient(#EEF4FF 1px, transparent 1px), linear-gradient(90deg, #EEF4FF 1px, transparent 1px)', backgroundSize: '24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...rise(frame, 2, 30)}}>
          <div style={{position: 'absolute', top: 16, left: 20, fontSize: 16, color: '#64748B', fontFamily: 'JetBrains Mono'}}>📄 flange_shaft_rev2.pdf</div>
          <Blueprint draw={draw} width={300} />
        </div>
        <div style={{position: 'absolute', left: 1000, top: 300, width: 520, padding: '28px 32px', borderRadius: 16, background: '#fff', boxShadow: '0 30px 60px rgba(22,50,92,0.14)', color: INK, ...rise(frame, 14, 30)}}>
          <div style={{fontSize: 26, fontWeight: 600, marginBottom: 14}}>Order details</div>
          {FIELDS.map(([k, v], i) => {
            const at = 30 + i * 10;
            const typed = v.slice(0, Math.floor(interpolate(frame, [at, at + 8], [0, v.length], clamp)));
            return (
              <div key={k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #E5ECF6', fontSize: 22}}>
                <span style={{color: '#64748B'}}>{k}</span>
                {typed && <span style={{padding: '4px 12px', borderRadius: 8, background: '#E6F0FF', color: '#1D4ED8', fontWeight: 500}}>{typed}</span>}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* Phase B: blueprint → real part → batch */}
      {two && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'absolute', opacity: bp * (1 - real) * (1 - army), transform: `scale(${0.9 + 0.1 * bp})`}}>
            <Blueprint draw={1} width={360} />
          </div>
          <Img src={img('flange-shaft.png')} style={{position: 'absolute', height: 470, opacity: real * (1 - army), transform: `scale(${0.92 + 0.08 * real})`, filter: 'drop-shadow(0 30px 40px rgba(22,50,92,0.3))'}} />
          <div style={{position: 'absolute', left: 150, right: 150, top: 220, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', rowGap: 24, opacity: army}}>
            {Array.from({length: 30}, (_, i) => {
              const p = spring({frame: frame - (STEP2_AT + 44 + (i % 10) + Math.floor(i / 10) * 3), fps, config: {damping: 14, stiffness: 150}});
              return <Img key={i} src={img('flange-shaft.png')} style={{height: 170, justifySelf: 'center', transform: `scale(${p}) rotate(${((i * 37) % 11) - 5}deg)`, filter: 'drop-shadow(0 12px 14px rgba(22,50,92,0.25))'}} />;
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ── 8 · Scale: stats + industries ───────────────────────────────────────────
const INDUSTRIES = [
  ['🤖', 'Automation'], ['⚙️', 'Machinery'], ['🔌', 'Electromechanical'], ['🚗', 'Auto parts'],
  ['📏', 'Instruments'], ['🧩', 'Molds'], ['💡', 'Lighting'], ['🏗️', 'Construction'],
];
export const INDUSTRY_AT = (i: number) => 58 + i * 5;

export const Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const n = (a: number, b: number, to: number) => Math.round(interpolate(frame, [a, b], [0, to], {...clamp, easing: EASE.out}));
  const STATS = [
    {v: `${n(8, 40, 24)} h`, l: 'samples for new parts · 快速出样'},
    {v: `${n(14, 46, 1000).toLocaleString('en-US')} m²`, l: 'factory floor · 工厂面积'},
    {v: `${n(20, 52, 100)}+`, l: 'skilled people · 专业团队'},
  ];
  return (
    <AbsoluteFill style={{color: '#fff'}}>
      <Caption>From sample to batch supply · 从打样到批量供货</Caption>
      <div style={{position: 'absolute', top: 250, width: '100%', display: 'flex', justifyContent: 'center', gap: 120}}>
        {STATS.map((s, i) => (
          <div key={s.l} style={{textAlign: 'center', ...rise(frame, 6 + i * 6, 20)}}>
            <div style={{fontSize: 112, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums'}}>{s.v}</div>
            <div style={{fontSize: 24, opacity: 0.9}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 640, left: 260, right: 260, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18}}>
        {INDUSTRIES.map(([icon, label], i) => (
          <div key={label} style={{display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', padding: '20px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.95)', color: INK, fontSize: 24, fontWeight: 500, boxShadow: '0 12px 28px rgba(22,50,92,0.15)', ...rise(frame, INDUSTRY_AT(i), 24, 12)}}>
            <span>{icon}</span>
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 9 · End card (white), hand-drawn underline as in the Pulse reference ────
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const spin = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 110}});
  const ul = interpolate(frame, [42, 62], [0, 1], {...clamp, easing: EASE.out});
  return (
    <AbsoluteFill style={{alignItems: 'center', color: INK}}>
      <div style={{position: 'absolute', top: 170, width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${spin}) rotate(${(1 - spin) * -200}deg)`}}>
        <Img src={img('logo.png')} style={{width: 160, height: 160, objectFit: 'contain'}} />
      </div>
      <div style={{position: 'absolute', top: 370, fontSize: 70, fontWeight: 700, color: '#1D4FA8', letterSpacing: '0.08em', ...rise(frame, 12, 18)}}>{BRAND.zh}</div>
      <div style={{position: 'absolute', top: 470, fontSize: 22, letterSpacing: '0.5em', color: '#64748B', ...rise(frame, 18, 10)}}>HAIXING PRECISION TECHNOLOGY</div>
      <div style={{position: 'absolute', top: 540, fontSize: 40, ...rise(frame, 26, 14)}}>
        Your{' '}
        <span style={{position: 'relative', fontWeight: 700}}>
          one-stop
          <svg style={{position: 'absolute', left: -8, top: '88%', overflow: 'visible'}} width="190" height="24" viewBox="0 0 190 24">
            <path d="M4 14 C 50 4, 120 6, 186 12" fill="none" stroke="#C8242B" strokeWidth="4" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 * (1 - ul)} />
          </svg>
        </span>{' '}
        precision machining partner.
      </div>
      <div style={{position: 'absolute', top: 650, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 30px', borderRadius: 999, background: '#2563EB', color: '#fff', fontSize: 30, fontWeight: 600, boxShadow: '0 16px 36px rgba(37,99,235,0.35)', ...rise(frame, 40, 16)}}>
        📞 +86 {BRAND.phone} <span style={{fontWeight: 400, opacity: 0.9, fontSize: 24}}>· {BRAND.contact}</span>
      </div>
      <div style={{position: 'absolute', top: 760, fontSize: 20, letterSpacing: '0.18em', color: '#8A9BB3', ...rise(frame, 54, 10)}}>CNC PROGRAMMING · PRECISION TURNING · CUSTOM ROTARY PARTS · SHENZHEN</div>
    </AbsoluteFill>
  );
};
