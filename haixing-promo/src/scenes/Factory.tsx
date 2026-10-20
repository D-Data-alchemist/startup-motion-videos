import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {KenBurns} from '../components/KenBurns';
import {COLORS, EASE, img, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Stats land on beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const FACTORY_STATS = [45, 60, 75, 90];
const STATS = [
  {n: 100, suffix: '+', label: 'Employees', zh: '员工'},
  {n: 1000, suffix: ' m²', label: 'Factory floor', zh: '工厂面积'},
  {n: 99, suffix: '%+', label: 'Pass rate', zh: '产品合格率'},
  {n: 24, suffix: ' h', label: 'Samples delivered', zh: '快速出样'},
];

export const Factory: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = (a: number) => interpolate(frame, [a, a + 14], [0, 1], {...clamp, easing: EASE.out});
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={105}>
        <KenBurns src={img('factory-floor.jpg')} duration={105} from={1.08} to={1.2} panX={-30} shade={0.6} />
      </Sequence>
      <Sequence from={105}>
        <KenBurns src={img('machine-hall.jpg')} duration={105} from={1.2} to={1.08} panX={30} shade={0.6} />
      </Sequence>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,7,12,0.85) 0%, rgba(5,7,12,0.2) 60%, transparent 100%)'}} />

      <div style={{position: 'absolute', left: 140, top: 190}}>
        <div style={{fontFamily: monoFamily, fontSize: 24, letterSpacing: '0.3em', color: COLORS.redHot, opacity: reveal(4)}}>SINCE 2013 · SHENZHEN, GUANGDONG</div>
        <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-0.04em', color: COLORS.text, lineHeight: 1.05, marginTop: 20}}>
          <div style={{opacity: reveal(10), transform: `translateX(${(1 - reveal(10)) * -60}px)`}}>Rooted in Shenzhen.</div>
          <div style={{opacity: reveal(20), transform: `translateX(${(1 - reveal(20)) * -60}px)`, color: COLORS.steel}}>Built for precision.</div>
        </div>
        <div style={{fontSize: 30, color: COLORS.muted, marginTop: 24, opacity: reveal(118)}}>Programming → Machining → Inspection → Delivery. Under one roof.</div>
      </div>

      <div style={{position: 'absolute', left: 140, right: 140, bottom: 110, display: 'flex', gap: 28}}>
        {STATS.map((s, i) => {
          const a = FACTORY_STATS[i];
          const p = reveal(a);
          const count = Math.round(interpolate(frame, [a, a + 20], [0, s.n], {...clamp, easing: EASE.out}));
          return (
            <div
              key={s.label}
              style={{
                flex: 1,
                padding: '26px 30px',
                borderLeft: `4px solid ${COLORS.red}`,
                background: 'linear-gradient(90deg, rgba(200,36,43,0.18), rgba(10,14,24,0.55))',
                backdropFilter: 'blur(6px)',
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px)`,
              }}
            >
              <div style={{fontSize: 76, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', fontVariantNumeric: 'tabular-nums'}}>
                {count.toLocaleString('en-US')}
                <span style={{color: COLORS.redHot}}>{s.suffix}</span>
              </div>
              <div style={{fontSize: 24, color: COLORS.steel, marginTop: 4}}>
                {s.label} <span style={{color: COLORS.muted}}>· {s.zh}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
