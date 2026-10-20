import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {KenBurns} from '../components/KenBurns';
import {Sparks} from '../components/Sparks';
import {Slam} from '../components/Slam';
import {COLORS, img, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beat-synced statements (local frames) — mirrored in scripts/compose_soundtrack.py
export const COLD_HITS = [8, 38, 68, 98];
const LINES = [
  {t: 'Every part.', s: 'SHAFTS · DISCS · THREADS'},
  {t: 'Every micron.', s: 'TOLERANCES YOU CAN MEASURE'},
  {t: 'Every deadline.', s: 'ON-TIME, BATCH AFTER BATCH'},
];

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const active = COLD_HITS.filter((h) => frame >= h).length - 1;
  return (
    <AbsoluteFill>
      <KenBurns src={img('sparks.jpg')} duration={150} from={1.15} to={1.3} shade={0.82} />
      <Sparks x={1180} y={720} count={110} power={1.1} opacity={interpolate(frame, [0, 10], [0, 0.9], clamp)} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {LINES.map((l, i) =>
          i === active ? (
            <Slam key={i} at={COLD_HITS[i]} style={{textAlign: 'center'}}>
              <div style={{fontSize: 170, fontWeight: 800, letterSpacing: '-0.05em', color: COLORS.text}}>{l.t}</div>
              <div style={{fontFamily: monoFamily, fontSize: 26, letterSpacing: '0.3em', color: COLORS.spark, marginTop: 6}}>{l.s}</div>
            </Slam>
          ) : null,
        )}
        {active === 3 && (
          <Slam at={COLD_HITS[3]} from={1.25} style={{textAlign: 'center'}}>
            <div style={{fontSize: 150, fontWeight: 800, letterSpacing: '-0.05em', color: COLORS.text}}>
              Machined to <span style={{color: COLORS.redHot}}>spec.</span>
            </div>
            <div style={{fontSize: 44, fontWeight: 700, color: COLORS.steel, marginTop: 10, letterSpacing: '0.3em'}}>精工细作</div>
          </Slam>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
