import {AbsoluteFill, Img, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, EASE, img, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Hero parts on a dark stage (local start frames) — mirrored in scripts/compose_soundtrack.py
export const HEROES = [
  {f: 0, len: 60, file: 'impeller-3d.png', t: 'Precision Impeller', zh: '精密叶轮', d: 'Complex curved surfaces. Zero room for error.', h: 680},
  {f: 60, len: 40, file: 'red-flange-assembly.png', t: 'Flange Housing Assembly', zh: '法兰壳体组件', d: 'Multi-face machining, strict geometric tolerance.', h: 560},
  {f: 100, len: 40, file: 'sprocket-flange.png', t: 'Sprocket Flange Assembly', zh: '链轮法兰组件', d: 'Built for transmission and fixation.', h: 520},
  {f: 140, len: 40, file: 'titanium-worm.png', t: 'Titanium Double-lead Worm', zh: '钛合金双岛程涡杆', d: 'High fit accuracy, wear-resistant.', h: 640},
  {f: 180, len: 40, file: 'valve-core.png', t: 'Valve Core Shaft Assembly', zh: '阀芯轴组件', d: 'Sealing-grade precision for fluid control.', h: 600},
];
export const GRID_AT = 220;
const GRID = [
  'impeller-top.png', 'long-lead-screw.png', 'flange-housing.png', 'cylindrical-housing.png', 'black-housing.png', 'pin-shafts.png',
  'valve-body.png', 'long-shaft.png', 'black-valve-body.png', 'flange-shaft.png', 'sprocket-flange.png', 'red-flange-assembly.png',
];

const Hero: React.FC<{h: (typeof HEROES)[number]; i: number}> = ({h, i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const exit = interpolate(frame, [h.len - 8, h.len], [0, 1], {...clamp, easing: EASE.in});
  const drift = interpolate(frame, [0, h.len], [0, 1]);
  const label = interpolate(frame, [6, 18], [0, 1], {...clamp, easing: EASE.out});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 1260,
          top: 470,
          transform: `translate(-50%, -50%) translateX(${(1 - enter) * 500 - exit * 300}px) rotate(${(1 - enter) * 14 - drift * 3}deg) scale(${(0.85 + 0.15 * enter + drift * 0.05) * (1 - exit * 0.1)})`,
          opacity: Math.min(enter * 1.5, 1) * (1 - exit),
          filter: `blur(${exit * 10}px) drop-shadow(0 40px 60px rgba(0,0,0,0.7))`,
        }}
      >
        <Img src={img(h.file)} style={{height: h.h, width: 'auto', display: 'block'}} />
        {/* floor reflection */}
        <Img
          src={img(h.file)}
          style={{position: 'absolute', left: 0, top: '100%', height: h.h, width: 'auto', display: 'block', transform: 'scaleY(-1)', opacity: 0.18, marginTop: 6, maskImage: 'linear-gradient(to top, black 0%, transparent 35%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 35%)'}}
        />
      </div>
      <div style={{position: 'absolute', left: 130, top: 330, width: 640, opacity: label * (1 - exit), transform: `translateX(${(1 - label) * -40}px)`}}>
        <div style={{fontFamily: monoFamily, fontSize: 24, color: COLORS.redHot, letterSpacing: '0.2em'}}>/ 0{i + 1}</div>
        <div style={{fontSize: 68, fontWeight: 800, letterSpacing: '-0.035em', color: COLORS.text, lineHeight: 1.05, marginTop: 14}}>{h.t}</div>
        <div style={{fontSize: 38, fontWeight: 700, color: COLORS.steel, marginTop: 12}}>{h.zh}</div>
        <div style={{fontSize: 28, color: COLORS.muted, marginTop: 18}}>{h.d}</div>
      </div>
    </AbsoluteFill>
  );
};

const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = interpolate(frame, [4, 18], [0, 1], {...clamp, easing: EASE.out});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', opacity: title}}>
        <div style={{fontSize: 64, fontWeight: 800, letterSpacing: '-0.035em', color: COLORS.text}}>Shafts · Discs · Gears · Housings · Valves</div>
        <div style={{fontFamily: monoFamily, fontSize: 22, letterSpacing: '0.25em', color: COLORS.redHot, marginTop: 12}}>FROM YOUR DRAWINGS OR SAMPLES · 来图来样定制</div>
      </div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 250, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 26}}>
        {GRID.map((f, i) => {
          const p = spring({frame: frame - (2 + i * 2), fps, config: {damping: 13, stiffness: 160}});
          return (
            <div
              key={f}
              style={{
                height: 340,
                borderRadius: 18,
                background: 'radial-gradient(circle at 50% 40%, #1C2333 0%, #0B0F18 75%)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${p}) translateY(${(1 - Math.min(p, 1)) * 40}px)`,
                opacity: Math.min(p, 1),
              }}
            >
              <Img src={img(f)} style={{maxWidth: '78%', maxHeight: '78%', objectFit: 'contain', filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.6))'}} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Products: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.92 + 0.08 * Math.sin(frame / 3) * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      {/* spotlight + floor */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 40% 60% at 65% 42%, rgba(220,230,255,${0.16 * flicker}) 0%, transparent 70%)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)'}} />
      {HEROES.map((h, i) => (
        <Sequence key={h.file} from={h.f} durationInFrames={h.len}>
          <Hero h={h} i={i} />
        </Sequence>
      ))}
      <Sequence from={GRID_AT}>
        <Grid />
      </Sequence>
    </AbsoluteFill>
  );
};
