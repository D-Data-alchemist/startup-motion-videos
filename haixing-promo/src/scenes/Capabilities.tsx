import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {KenBurns} from '../components/KenBurns';
import {COLORS, EASE, img, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const CAP_LEN = 48; // frames per capability (3.2 beats → cuts alternate on/off beat for momentum)
const CAPS = [
  {t: 'CNC Programming & Machining', zh: '数控车床编程加工', d: 'Computer programming, toolpath optimization, precision turning.', photo: 'eq-5axis.jpg'},
  {t: 'Custom Non-standard Rotary Parts', zh: '非标回转零件定制', d: 'Shafts, discs and threaded parts — from your drawings or samples.', photo: 'eq-turning.jpg'},
  {t: 'Prototyping to Batch Production', zh: '样品打样与中小批量生产', d: 'Samples within 24 hours. Flexible small-to-medium batches.', photo: 'cnc-center.jpg'},
  {t: 'Precision Turning, Any Metal', zh: '精密车削 · 多材料加工', d: 'Carbon steel · Stainless · Aluminum · Copper · Titanium.', photo: 'eq-lathe.jpg'},
  {t: 'Full-process Quality Inspection', zh: '全程质检', d: 'CMM, 2D projector, height gauges — first-article to outgoing checks.', photo: 'eq-cmm.jpg'},
];

const Cap: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const c = CAPS[i];
  const wipe = interpolate(frame, [0, 10], [100, 0], {...clamp, easing: EASE.out});
  const txt = (d: number) => interpolate(frame, [d, d + 12], [0, 1], {...clamp, easing: EASE.out});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 820, top: 0, right: 0, bottom: 0, clipPath: `inset(0 0 0 ${wipe}%)`}}>
        <KenBurns src={img(c.photo)} duration={CAP_LEN} from={1.12} to={1.22} shade={0.25} />
      </div>
      <div style={{position: 'absolute', left: 820 - 6, top: 0, bottom: 0, width: 12, background: COLORS.red, transform: `translateX(${(wipe / 100) * 1100}px)`}} />
      <div style={{position: 'absolute', left: 120, top: 250, width: 640}}>
        <div style={{fontFamily: monoFamily, fontSize: 150, color: 'transparent', WebkitTextStroke: `2px ${COLORS.redHot}`, lineHeight: 1, opacity: txt(2)}}>0{i + 1}</div>
        <div style={{fontSize: 62, fontWeight: 800, letterSpacing: '-0.035em', color: COLORS.text, lineHeight: 1.08, marginTop: 26, opacity: txt(5), transform: `translateY(${(1 - txt(5)) * 30}px)`}}>{c.t}</div>
        <div style={{fontSize: 36, fontWeight: 700, color: COLORS.blueHot, marginTop: 16, opacity: txt(9)}}>{c.zh}</div>
        <div style={{fontSize: 28, color: COLORS.muted, marginTop: 20, lineHeight: 1.45, opacity: txt(12)}}>{c.d}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Capabilities: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      {CAPS.map((_, i) => (
        <Sequence key={i} from={i * CAP_LEN} durationInFrames={CAP_LEN}>
          <Cap i={i} />
        </Sequence>
      ))}
      {/* progress rail */}
      <div style={{position: 'absolute', left: 120, bottom: 90, display: 'flex', gap: 10}}>
        {CAPS.map((_, i) => (
          <div key={i} style={{width: 70, height: 4, background: 'rgba(255,255,255,0.15)'}}>
            <div style={{height: '100%', background: COLORS.redHot, width: `${interpolate(frame, [i * CAP_LEN, (i + 1) * CAP_LEN], [0, 100], clamp)}%`}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 120, top: 120, fontFamily: monoFamily, fontSize: 22, letterSpacing: '0.3em', color: COLORS.muted}}>CAPABILITIES · 业务范围</div>
    </AbsoluteFill>
  );
};
