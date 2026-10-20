import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, img} from '../theme';
import {Caption, ChipBar, clamp, glass, rise} from './kit';

// ── 1 · Question (word-swap kinetic type, as in the Pulse reference) ────────
export const SWAP_AT = [50, 78, 106];
const SWAPS = ['precise?', 'reliable?', 'on time?'];

export const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ['Looking', 'for', 'a', 'precision', 'CNC', 'partner'];
  const cur = SWAP_AT.filter((s) => frame >= s).length - 1;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 64, fontWeight: 400, letterSpacing: '-0.01em'}}>
      <div style={{display: 'flex', gap: '0 0.28em', marginTop: -120}}>
        {words.map((w, i) => (
          <span key={w} style={rise(frame, 8 + i * 4, 18, 14)}>
            {w}
          </span>
        ))}
      </div>
      <div style={{display: 'flex', gap: '0 0.28em', marginTop: 12, lineHeight: 1.2}}>
        <span style={rise(frame, 34, 18, 14)}>that's always</span>
        <span style={{position: 'relative', display: 'inline-block', width: 300, height: '1.2em'}}>
          {SWAPS.map((s, i) => {
            const inP = interpolate(frame, [SWAP_AT[i], SWAP_AT[i] + 10], [0, 1], {...clamp, easing: EASE.out});
            const outP = i < SWAPS.length - 1 ? interpolate(frame, [SWAP_AT[i + 1] - 2, SWAP_AT[i + 1] + 6], [0, 1], clamp) : 0;
            if (i !== cur && i !== cur + 1) return null;
            return (
              <span
                key={s}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  fontWeight: 700,
                  opacity: inP * (1 - outP),
                  transform: `translateY(${(1 - inP) * 34 - outP * 34}px)`,
                  filter: `blur(${(1 - inP) * 8 + outP * 8}px)`,
                }}
              >
                {s}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── 2 · Logo + "2013 ___ 2026" ───────────────────────────────────────────────
export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const spin = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 110}});
  const up = interpolate(frame, [58, 80], [0, 1], {...clamp, easing: EASE.inOut});
  const year = Math.round(interpolate(frame, [96, 132], [2013, 2026], {...clamp, easing: EASE.out}));
  const line = interpolate(frame, [92, 108], [0, 1], {...clamp, easing: EASE.out});
  return (
    <AbsoluteFill style={{alignItems: 'center', color: '#fff'}}>
      <div style={{position: 'absolute', top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${-up * 110}px) scale(${1 - up * 0.32})`}}>
        <div style={{width: 170, height: 170, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(22,50,92,0.25)', transform: `scale(${spin}) rotate(${(1 - spin) * -200}deg)`}}>
          <Img src={img('logo.png')} style={{width: 120, height: 120, objectFit: 'contain'}} />
        </div>
        <div style={{fontSize: 92, fontWeight: 700, letterSpacing: '0.12em', marginTop: 30, ...rise(frame, 14, 20)}}>海星精密</div>
        <div style={{fontSize: 22, letterSpacing: '0.5em', marginTop: 6, opacity: 0.9, ...rise(frame, 22, 12)}}>HAIXING PRECISION TECHNOLOGY</div>
      </div>
      <div style={{position: 'absolute', top: 520, fontSize: 36, ...rise(frame, 76, 16)}}>One factory. From drawing to delivery.</div>
      <div style={{position: 'absolute', top: 620, display: 'flex', alignItems: 'baseline', gap: 26, fontSize: 104, fontWeight: 600, fontVariantNumeric: 'tabular-nums', ...rise(frame, 90, 16)}}>
        <span>2013</span>
        <span style={{width: 140 * line, height: 3, background: 'rgba(255,255,255,0.8)', alignSelf: 'center'}} />
        <span>{year}</span>
      </div>
      <div style={{position: 'absolute', top: 760, fontSize: 24, opacity: 0.85, letterSpacing: '0.2em', ...rise(frame, 110, 10)}}>SHENZHEN · GUANGDONG · 100+ PEOPLE · 1,000 m²</div>
    </AbsoluteFill>
  );
};

// ── 3 · Product families grid filling up ────────────────────────────────────
export const FILL_AT = (i: number) => 22 + i * 7;
const PARTS: [string, string][] = [
  ['impeller-3d.png', 'Precision impeller'], ['long-lead-screw.png', 'Long lead screw'], ['flange-housing.png', 'Flange housing'],
  ['cylindrical-housing.png', 'Cylindrical housing'], ['black-housing.png', 'Black housing'], ['pin-shafts.png', 'Pin shafts'],
  ['valve-body.png', 'Valve body'], ['long-shaft.png', 'Long shaft'], ['black-valve-body.png', 'Black valve body'],
  ['flange-shaft.png', 'Flange shaft'], ['sprocket-flange.png', 'Sprocket flange'], ['red-flange-assembly.png', 'Flange assembly'],
  ['titanium-worm.png', 'Titanium worm'], ['valve-core.png', 'Valve core'], ['slender-shaft.png', 'Slender shaft'],
];
const TW = 300;
const TH = 214;
const GAP = 18;
const LEFT = (1920 - (TW * 5 + GAP * 4)) / 2;

export const Families: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const filled = PARTS.filter((_, i) => frame >= FILL_AT(i)).length;
  return (
    <AbsoluteFill style={{color: '#fff'}}>
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontSize: 32, ...rise(frame, 2, 12)}}>
        <b style={{fontVariantNumeric: 'tabular-nums'}}>{String(filled).padStart(2, '0')}</b>
        <span style={{opacity: 0.85}}> / 15 custom parts · </span>
        <b>Shafts · Discs · Housings · Valves · Impellers</b>
      </div>
      {PARTS.map(([file, label], i) => {
        const x = LEFT + (i % 5) * (TW + GAP);
        const y = 190 + Math.floor(i / 5) * (TH + GAP + 20);
        const tile = interpolate(frame, [i * 1.2, i * 1.2 + 12], [0, 1], {...clamp, easing: EASE.out});
        const pop = spring({frame: frame - FILL_AT(i), fps, config: {damping: 13, stiffness: 170}});
        return (
          <div key={file} style={{position: 'absolute', left: x, top: y, width: TW, height: TH + 20, ...glass(0.12 + 0.1 * Math.min(pop, 1)), opacity: tile, overflow: 'hidden'}}>
            <Img
              src={img(file)}
              style={{position: 'absolute', left: '50%', top: 18, height: 150, maxWidth: TW - 40, objectFit: 'contain', transform: `translateX(-50%) scale(${pop}) rotate(${(1 - Math.min(pop, 1)) * -20}deg)`, filter: 'drop-shadow(0 10px 14px rgba(22,50,92,0.35))'}}
            />
            <div style={{position: 'absolute', bottom: 14, width: '100%', textAlign: 'center', fontSize: 18, opacity: Math.min(pop, 1)}}>{label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 4 · Materials: one part, swatch chips change the metal ──────────────────
export const MATERIAL_AT = [0, 30, 60, 90, 120];
const MATERIALS = [
  {label: 'Carbon steel', filter: 'brightness(0.72) contrast(1.2) saturate(0.5)', dot: {background: 'radial-gradient(circle at 35% 30%, #9aa0a8, #3a3f46)'}},
  {label: 'Stainless steel', filter: 'none', dot: {background: 'radial-gradient(circle at 35% 30%, #f4f6f8, #9aa3ad)'}},
  {label: 'Aluminum', filter: 'brightness(1.18) saturate(0.35) contrast(0.92)', dot: {background: 'radial-gradient(circle at 35% 30%, #ffffff, #c4cbd3)'}},
  {label: 'Copper', filter: 'sepia(0.95) saturate(2.4) hue-rotate(-18deg) brightness(0.92)', dot: {background: 'radial-gradient(circle at 35% 30%, #f3b48a, #a2522a)'}},
  {label: 'Titanium', filter: 'saturate(0.25) brightness(0.82) contrast(1.15)', dot: {background: 'radial-gradient(circle at 35% 30%, #d7cfc4, #6d6458)'}},
];

export const Materials: React.FC = () => {
  const frame = useCurrentFrame();
  const active = MATERIAL_AT.filter((m) => frame >= m).length - 1;
  const breathe = Math.sin(frame / 30) * 0.02;
  return (
    <AbsoluteFill style={{color: '#fff'}}>
      <Caption>Materials · 多材料加工</Caption>
      <div style={{position: 'absolute', left: '50%', top: 200, width: 600, height: 560, transform: `translateX(-50%) rotate(${Math.sin(frame / 40) * 3}deg) scale(${1 + breathe})`}}>
        {MATERIALS.map((m, i) => {
          const op = interpolate(frame, [MATERIAL_AT[i], MATERIAL_AT[i] + 8], [0, 1], clamp) * (i < MATERIALS.length - 1 ? 1 - interpolate(frame, [MATERIAL_AT[i + 1], MATERIAL_AT[i + 1] + 8], [0, 1], clamp) : 1);
          return <Img key={m.label} src={img('valve-body.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter: `${m.filter} drop-shadow(0 30px 40px rgba(22,50,92,0.35))`, opacity: i === 0 ? Math.max(op, frame < 8 ? interpolate(frame, [0, 8], [0, 1], clamp) : op) : op}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: '50%', top: 790, width: 420, height: 30, marginLeft: -210, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(22,50,92,0.3), transparent 70%)'}} />
      <div style={{position: 'absolute', top: 860, width: '100%', display: 'flex', justifyContent: 'center', ...rise(frame, 6, 20)}}>
        <ChipBar items={MATERIALS.map((m) => ({label: m.label, dot: m.dot}))} active={active} />
      </div>
    </AbsoluteFill>
  );
};

