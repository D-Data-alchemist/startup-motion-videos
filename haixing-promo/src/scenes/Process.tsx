import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// One node per beat (local frames) — mirrored in scripts/compose_soundtrack.py
export const STEP_AT = (i: number) => 18 + i * 13;
const STEPS = [
  ['Requirement', '需求沟通'],
  ['Drawings / Samples', '来图/来样'],
  ['Programming', '编程评估'],
  ['Toolpath Optimization', '工艺与刀路优化'],
  ['Prototyping', '打样/试产'],
  ['Batch Machining', '批量加工'],
  ['Quality Inspection', '质检'],
  ['Delivery', '交付'],
];
const INDUSTRIES = 'AUTOMATION EQUIPMENT · MECHANICAL EQUIPMENT · HARDWARE & ELECTROMECHANICAL · AUTO PARTS · INSTRUMENTS & METERS · MOLDS · LIGHTING · CONSTRUCTION MACHINERY · ';
const X0 = 180;
const X1 = 1740;
const Y = 560;

export const Process: React.FC = () => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [2, 16], [0, 1], {...clamp, easing: EASE.out});
  const line = interpolate(frame, [STEP_AT(0), STEP_AT(7)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, #0E1424 0%, ${COLORS.bg} 75%)`}}>
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', opacity: title, transform: `translateY(${(1 - title) * 30}px)`}}>
        <div style={{fontFamily: monoFamily, fontSize: 24, letterSpacing: '0.3em', color: COLORS.redHot}}>ONE-STOP SERVICE · 一站式配套</div>
        <div style={{fontSize: 96, fontWeight: 800, letterSpacing: '-0.045em', color: COLORS.text, marginTop: 14}}>
          From drawing to <span style={{color: COLORS.blueHot}}>delivery.</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: X0, top: Y - 2, width: X1 - X0, height: 4, background: 'rgba(255,255,255,0.1)'}} />
      <div style={{position: 'absolute', left: X0, top: Y - 2, width: (X1 - X0) * line, height: 4, background: `linear-gradient(90deg, ${COLORS.blueHot}, ${COLORS.redHot})`, boxShadow: `0 0 20px ${COLORS.redHot}`}} />
      {STEPS.map(([en, zh], i) => {
        const x = X0 + ((X1 - X0) / 7) * i;
        const on = interpolate(frame, [STEP_AT(i), STEP_AT(i) + 8], [0, 1], {...clamp, easing: EASE.snap});
        const up = i % 2 === 0;
        return (
          <div key={en}>
            <div
              style={{
                position: 'absolute',
                left: x - 18,
                top: Y - 18,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: on > 0.5 ? COLORS.redHot : '#1A2030',
                border: '3px solid #fff',
                boxShadow: on > 0.5 ? `0 0 30px ${COLORS.redHot}` : 'none',
                transform: `scale(${0.6 + 0.4 * on})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: x - 130,
                width: 260,
                top: up ? Y - 150 : Y + 46,
                textAlign: 'center',
                opacity: on,
                transform: `translateY(${(1 - on) * (up ? 20 : -20)}px)`,
              }}
            >
              <div style={{fontFamily: monoFamily, fontSize: 20, color: COLORS.muted}}>0{i + 1}</div>
              <div style={{fontSize: 28, fontWeight: 700, color: COLORS.text, marginTop: 4}}>{en}</div>
              <div style={{fontSize: 24, color: COLORS.steel, marginTop: 2}}>{zh}</div>
            </div>
          </div>
        );
      })}
      {/* industries ticker */}
      <div style={{position: 'absolute', bottom: 80, left: 0, right: 0, overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: monoFamily, fontSize: 22, letterSpacing: '0.2em', color: COLORS.muted, opacity: interpolate(frame, [20, 40], [0, 1], clamp)}}>
        <div style={{transform: `translateX(${-frame * 4}px)`}}>{INDUSTRIES.repeat(3)}</div>
      </div>
    </AbsoluteFill>
  );
};
