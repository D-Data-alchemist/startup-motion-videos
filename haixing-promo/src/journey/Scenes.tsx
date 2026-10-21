import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sparks} from '../components/Sparks';
import {BRAND, EASE, img, monoFamily} from '../theme';
import {PartDrawing} from './Drawing';
import {BLUE, clamp, Heading, INK, KineticWords, Plate, RED, Stamp} from './kit';

const handFamily = 'Architects Daughter';
const fade = (frame: number, at: number, d = 14) => interpolate(frame, [at, at + d], [0, 1], {...clamp, easing: EASE.out});

// ── 1 · Hook: the buyer's real pain (from the brochure's case study) ────────
export const PAIN_AT = [8, 38, 68];
const PAINS = ['Parts that jam on assembly.', 'Batches that don’t match.', 'Prototypes that take weeks.'];
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [96, 112], [0, 1], {...clamp, easing: EASE.inOut});
  return (
    <AbsoluteFill>
      {PAINS.map((p, i) => (
        <div key={p} style={{position: 'absolute', left: 180, top: 230 + i * 150, display: 'flex', alignItems: 'center', gap: 40, opacity: fade(frame, PAIN_AT[i], 4), transform: `translateX(${(1 - fade(frame, PAIN_AT[i], 8)) * -500}px) skewX(${(1 - fade(frame, PAIN_AT[i], 8)) * 20}deg)`, filter: `blur(${(1 - fade(frame, PAIN_AT[i], 8)) * 14}px)`}}>
          <div style={{position: 'relative', fontSize: 84, fontWeight: 800, letterSpacing: '-0.04em', color: INK}}>
            {p}
            <div style={{position: 'absolute', left: -10, top: '52%', height: 8, width: `${strike * 104}%`, background: RED, borderRadius: 4, transform: 'rotate(-1.5deg)'}} />
          </div>
          <Stamp at={PAIN_AT[i] + 6} size={40} rotate={-10}>
            ✕
          </Stamp>
        </div>
      ))}
      <KineticWords text="Don’t take our word for it. Watch. →" at={112} stagger={2} style={{position: 'absolute', left: 180, top: 720, fontFamily: handFamily, fontSize: 64, color: RED, transform: 'rotate(-2deg)'}} />
    </AbsoluteFill>
  );
};

// ── 2 · The drawing arrives ─────────────────────────────────────────────────
export const DrawingIn: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [12, 70], [0, 1], {...clamp, easing: EASE.inOut});
  return (
    <AbsoluteFill>
      <Heading n="01" title="Your drawing arrives." zh="来图来样" />
      <div style={{position: 'absolute', left: 980, top: 150}}>
        <PartDrawing draw={draw} dims={fade(frame, 60)} height={720} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 430, width: 700, fontSize: 34, lineHeight: 1.5, color: INK, opacity: fade(frame, 30)}}>
        A drawing — or just a sample part.
        <br />
        <span style={{color: BLUE, fontWeight: 600}}>Custom, non-standard, rotary.</span>
      </div>
      <div style={{position: 'absolute', left: 120, top: 640, fontFamily: handFamily, fontSize: 46, color: RED, transform: 'rotate(-3deg)', opacity: fade(frame, 78, 10)}}>
        09:00 — the clock starts ↗
      </div>
    </AbsoluteFill>
  );
};

// ── 3 · Programming & toolpath ──────────────────────────────────────────────
export const Program: React.FC = () => {
  const frame = useCurrentFrame();
  const tool = interpolate(frame, [18, 125], [0, 1], {...clamp, easing: EASE.inOut});
  return (
    <AbsoluteFill>
      <Heading n="02" title="Programmed. Toolpath optimized." zh="编程评估 · 工艺与刀路优化" />
      <div style={{position: 'absolute', left: 260, top: 300}}>
        <PartDrawing draw={1} dims={0.35} tool={tool} height={640} />
      </div>
      <Plate src={img('cnc-center.jpg')} x={1020} y={300} w={760} h={420} rotate={2} at={10} caption="CNC PROGRAMMING · 电脑编程" />
      <div style={{position: 'absolute', left: 1040, top: 820, fontFamily: handFamily, fontSize: 40, color: RED, transform: 'rotate(-2deg)', opacity: fade(frame, 70)}}>
        less waste, faster cycles ✓
      </div>
    </AbsoluteFill>
  );
};

// ── 4 · Precision turning: the part is "cut" out of the sheet ───────────────
export const TURN_OPS_AT = [40, 62, 84, 106];
const OPS = ['OD turning', 'Facing', 'Grooving', 'Threading'];
export const Turning: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = interpolate(frame, [20, 128], [0, 1], {...clamp, easing: EASE.inOut});
  const edgeY = 300 + cut * 540;
  return (
    <AbsoluteFill>
      <Heading n="03" title="Precision turning." zh="精密车削加工" />
      <div style={{position: 'absolute', left: 110, top: 330, width: 860, height: 560, overflow: 'hidden', border: '12px solid #fff', boxShadow: '0 24px 50px rgba(20,40,75,0.22)', transform: 'rotate(-1.5deg)'}}>
        <Img src={img('eq-turning.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 + frame * 0.001})`}} />
        <Sparks x={430} y={300} count={70} power={0.8} seed="turn" opacity={0.85} />
      </div>
      {/* part revealed top→bottom as if machined, with a hot cutting line */}
      <div style={{position: 'absolute', left: 1180, top: 300, width: 560, height: 560}}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.35}}>
          <PartDrawing draw={1} dims={0} height={560} />
        </div>
        <Img src={img('flange-shaft.png')} style={{position: 'absolute', left: 60, top: 0, height: 560, clipPath: `inset(0 0 ${100 - cut * 100}% 0)`, filter: 'drop-shadow(0 20px 26px rgba(20,40,75,0.35))'}} />
      </div>
      {cut > 0 && cut < 1 && <div style={{position: 'absolute', left: 1180, top: edgeY, width: 520, height: 3, background: '#FF8A3D', boxShadow: '0 0 18px #FF8A3D'}} />}
      <div style={{position: 'absolute', left: 1180, top: 900, display: 'flex', gap: 14}}>
        {OPS.map((o, i) => (
          <div key={o} style={{fontFamily: monoFamily, fontSize: 18, padding: '8px 14px', border: `2px solid ${frame >= TURN_OPS_AT[i] ? BLUE : 'rgba(20,40,75,0.25)'}`, color: frame >= TURN_OPS_AT[i] ? BLUE : 'rgba(20,40,75,0.4)', background: frame >= TURN_OPS_AT[i] ? '#E7EEFA' : 'transparent', borderRadius: 4}}>
            {frame >= TURN_OPS_AT[i] ? '✓ ' : ''}
            {o.toUpperCase()}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 5 · Inspection: measured callouts on the real part ──────────────────────
export const CHECK_AT = [36, 58, 80];
const CHECKS = [
  {label: 'Ø48', x1: 130, y1: 70, x2: 470, y2: 70, tx: 285, ty: 55},
  {label: '86', x1: 560, y1: 40, x2: 560, y2: 600, tx: 575, ty: 330},
  {label: 'M30', x1: 70, y1: 330, x2: 70, y2: 520, tx: -10, ty: 430},
];
export const Inspect: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Heading n="04" title="Measured, not assumed." zh="首件检测 · 巡检 · 出货检验" />
      <Plate src={img('eq-cmm.jpg')} x={110} y={360} w={640} h={460} rotate={-2.5} at={6} caption="COORDINATE MEASURING MACHINE" />
      <div style={{position: 'absolute', left: 960, top: 300, width: 640, height: 640}}>
        <Img src={img('flange-shaft.png')} style={{position: 'absolute', left: 120, top: 40, height: 560, filter: 'drop-shadow(0 20px 26px rgba(20,40,75,0.3))'}} />
        <svg width="640" height="640" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {CHECKS.map((c, i) => {
            const p = interpolate(frame, [CHECK_AT[i], CHECK_AT[i] + 12], [0, 1], {...clamp, easing: EASE.out});
            const len = Math.hypot(c.x2 - c.x1, c.y2 - c.y1);
            return (
              <g key={c.label} opacity={p > 0 ? 1 : 0}>
                <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={BLUE} strokeWidth="2.5" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
                <text x={c.tx} y={c.ty} fill={INK} fontFamily={monoFamily} fontSize="26" fontWeight="500" opacity={p}>
                  {c.label} <tspan fill="#16A34A">✓</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{position: 'absolute', left: 980, top: 960, display: 'flex', gap: 22, fontFamily: monoFamily, fontSize: 19, color: INK}}>
        {['FIRST-ARTICLE', 'PATROL', 'OUTGOING'].map((t, i) => (
          <span key={t} style={{opacity: fade(frame, 96 + i * 8, 8)}}>
            <span style={{color: '#16A34A'}}>✓</span> {t}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 6 · Sample ready (clock stops) ──────────────────────────────────────────
export const SAMPLE_STAMP = 32;
export const Sample: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hero = spring({frame: frame - 2, fps, config: {damping: 15, stiffness: 110}});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Img src={img('flange-shaft.png')} style={{position: 'absolute', top: 170, height: 640, transform: `translateY(${(1 - hero) * -500}px) scale(${(0.6 + 0.4 * hero) * (1 + 0.06 * Math.exp(-Math.max(0, frame - SAMPLE_STAMP) / 4) * (frame >= SAMPLE_STAMP ? 1 : 0))}) rotate(${(1 - hero) * 40}deg)`, filter: 'drop-shadow(0 34px 40px rgba(20,40,75,0.35))'}} />
      <div style={{position: 'absolute', top: 400, left: 1080}}>
        <Stamp at={SAMPLE_STAMP} size={64} rotate={-9}>
          Sample ready
        </Stamp>
      </div>
      <div style={{position: 'absolute', top: 860, width: '100%', textAlign: 'center', opacity: fade(frame, 48)}}>
        <KineticWords text="Drawing to sample in under 24 hours." at={44} style={{justifyContent: 'center', fontSize: 64, fontWeight: 800, letterSpacing: '-0.035em', color: INK}} wordStyle={(i) => (i >= 4 ? {color: RED} : {})} />
        <div style={{fontSize: 30, fontWeight: 700, color: BLUE, marginTop: 8}}>新品快速打样 · 24小时内出样</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 7 · Batch: one becomes many, identical ──────────────────────────────────
export const Batch: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pass = Math.round(interpolate(frame, [70, 110], [0, 99], {...clamp, easing: EASE.out}));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 100}}>
        <KineticWords text="Then batch after batch." at={2} style={{fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', color: INK}} />
        <KineticWords text="Identical." at={16} style={{fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', color: BLUE}} />
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 380, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', rowGap: 10}}>
        {Array.from({length: 24}, (_, i) => {
          const p = spring({frame: frame - (14 + (i % 12) * 2 + Math.floor(i / 12) * 6), fps, config: {damping: 14, stiffness: 160}});
          const wave = Math.sin((frame - i * 2.5) / 5) * 10 * Math.min(1, Math.max(0, (frame - 60) / 20));
          return <Img key={i} src={img('flange-shaft.png')} style={{height: 230, justifySelf: 'center', transform: `translateY(${(1 - Math.min(p, 1)) * -420 + wave}px) rotate(${(1 - Math.min(p, 1)) * (i % 2 ? 30 : -30)}deg) scale(${p})`, filter: 'drop-shadow(0 12px 12px rgba(20,40,75,0.25))'}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 120, top: 900, display: 'flex', alignItems: 'baseline', gap: 26, opacity: fade(frame, 66)}}>
        <span style={{display: 'inline-block', fontSize: 110, fontWeight: 800, letterSpacing: '-0.04em', color: RED, fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + (pass >= 99 ? 0.12 * Math.exp(-Math.max(0, frame - 110) / 4) : 0)})`, transformOrigin: 'left bottom'}}>{pass}%+</span>
        <span style={{fontSize: 32, color: INK}}>stable pass rate · small-to-medium batches · 中小批量</span>
      </div>
    </AbsoluteFill>
  );
};

// ── 8 · Range: one spec card per beat ───────────────────────────────────────
export const CARD_AT = (i: number) => 26 + i * 15;
const CARDS: [string, string, string][] = [
  ['impeller-3d.png', 'Impellers', '叶轮'], ['long-lead-screw.png', 'Lead screws', '丝杆'], ['red-flange-assembly.png', 'Flange housings', '法兰壳体'],
  ['valve-core.png', 'Valve cores', '阀芯'], ['sprocket-flange.png', 'Sprocket flanges', '链轮法兰'], ['titanium-worm.png', 'Titanium worms', '钛合金涡杆'],
  ['cylindrical-housing.png', 'Housings', '圆筒壳体'], ['pin-shafts.png', 'Pin shafts', '销轴'], ['valve-body.png', 'Valve bodies', '阀体'],
  ['black-housing.png', 'Black housings', '黑色壳体'], ['long-shaft.png', 'Stepped shafts', '长轴'], ['flange-housing.png', 'Complex flanges', '复杂法兰'],
];
export const Range: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 80, display: 'flex', alignItems: 'baseline', gap: 30}}>
        <KineticWords text="Not just shafts." at={2} style={{fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', color: INK}} />
        <span style={{fontFamily: handFamily, fontSize: 46, color: RED, opacity: fade(frame, 14), transform: `translateX(${(1 - fade(frame, 14)) * 60}px)`}}>steel · stainless · aluminum · copper · titanium</span>
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 230, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 22}}>
        {CARDS.map(([f, en, zh], i) => {
          const p = spring({frame: frame - CARD_AT(i), fps, config: {damping: 12, stiffness: 190}});
          const rot = ((i * 47) % 7) - 3;
          return (
            <div key={f} style={{height: 360, background: '#fff', boxShadow: '0 16px 34px rgba(20,40,75,0.16)', border: `1px solid rgba(20,40,75,0.12)`, transform: `translate(${(1 - Math.min(p, 1)) * [900, 0, -900, 0][i % 4]}px, ${(1 - Math.min(p, 1)) * [0, -700, 0, 700][i % 4]}px) rotate(${rot + (1 - Math.min(p, 1)) * (i % 2 ? 45 : -45)}deg) scale(${1.3 - 0.3 * Math.min(p, 1)})`, opacity: Math.min(1, p * 3), position: 'relative'}}>
              <div style={{position: 'absolute', top: 10, left: 12, fontFamily: monoFamily, fontSize: 13, color: RED}}>HX-{String(i + 1).padStart(3, '0')}</div>
              <Img src={img(f)} style={{position: 'absolute', left: '50%', top: 40, height: 220, maxWidth: '84%', objectFit: 'contain', transform: 'translateX(-50%)'}} />
              <div style={{position: 'absolute', left: 14, bottom: 14, right: 14, borderTop: `2px solid ${INK}`, paddingTop: 8}}>
                <div style={{fontSize: 22, fontWeight: 700, color: INK}}>{en}</div>
                <div style={{fontSize: 18, color: BLUE}}>{zh}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── 9 · Proof: the brochure's real case study ───────────────────────────────
export const RESULT_AT = [56, 76, 96];
export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 110, width: 900, opacity: fade(frame, 4)}}>
        <div style={{fontFamily: monoFamily, fontSize: 20, letterSpacing: '0.25em', color: RED}}>CASE · 合作案例</div>
        <KineticWords text="A local automation-equipment maker." at={4} style={{fontSize: 60, fontWeight: 800, letterSpacing: '-0.035em', color: INK, marginTop: 10, lineHeight: 1.1}} />
        <div style={{fontSize: 30, color: INK, marginTop: 24, lineHeight: 1.5, opacity: fade(frame, 18)}}>
          Spindles, connecting shafts, bushings, flanges.
          <br />
          Tight specs. Many batches. Designs that change fast.
        </div>
      </div>
      <div style={{position: 'absolute', left: 1080, top: 200, display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'flex-start'}}>
        <Stamp at={RESULT_AT[0]} size={40} rotate={-4} color="#16A34A">
          Assembly jams solved
        </Stamp>
        <Stamp at={RESULT_AT[1]} size={40} rotate={3} color={BLUE}>
          99%+ pass rate
        </Stamp>
        <Stamp at={RESULT_AT[2]} size={40} rotate={-6}>
          Designated long-term supplier
        </Stamp>
      </div>
      <Plate src={img('machine-hall.jpg')} x={140} y={560} w={760} h={330} rotate={-1.5} at={30} />
    </AbsoluteFill>
  );
};

// ── 10 · CTA ────────────────────────────────────────────────────────────────
export const CTA_STAMP = 70;
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: frame - 4, fps, config: {damping: 13, stiffness: 140}});
  return (
    <AbsoluteFill>
      <Plate src={img('factory-floor.jpg')} x={110} y={170} w={800} h={520} rotate={-2} at={2} caption="SHENZHEN · SINCE 2013 · 1,000 m²" />
      <div style={{position: 'absolute', left: 1010, top: 170}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${logo})`, transformOrigin: 'left center'}}>
          <Img src={img('logo.png')} style={{width: 110, height: 110, objectFit: 'contain', mixBlendMode: 'multiply'}} />
          <div>
            <div style={{fontSize: 96, fontWeight: 800, color: RED, lineHeight: 0.95, letterSpacing: '-0.02em'}}>{BRAND.name}</div>
            <div style={{fontSize: 30, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', marginTop: 6}}>{BRAND.zh}</div>
          </div>
        </div>
        <div style={{marginTop: 50}}>
          <KineticWords text="Send your drawing." at={20} style={{fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', color: INK}} />
          <KineticWords text="Get your sample in 24 h." at={30} style={{fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', color: RED}} />
        </div>
        <div style={{marginTop: 34, fontFamily: monoFamily, fontSize: 22, color: INK, lineHeight: 1.7, opacity: fade(frame, 36)}}>
          TEL +86 {BRAND.phone} · {BRAND.contact}
          <br />
          <span style={{fontSize: 17, opacity: 0.75}}>{BRAND.address}</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 1000, top: 800}}>
        <Stamp at={CTA_STAMP} size={44} rotate={-5}>
          {BRAND.mottoZh}
        </Stamp>
      </div>
      <div style={{position: 'absolute', left: 140, top: 800, fontFamily: handFamily, fontSize: 40, color: BLUE, transform: 'rotate(-2deg)', opacity: fade(frame, 50)}}>
        {BRAND.mottoEn}
      </div>
    </AbsoluteFill>
  );
};
