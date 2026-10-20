import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sparks} from '../components/Sparks';
import {Pulse} from '../components/Slam';
import {BRAND, COLORS, EASE, img, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const badge = spring({frame: frame - 30, fps, config: {damping: 12, stiffness: 150}});
  const zh = interpolate(frame, [34, 48], [0, 1], {...clamp, easing: EASE.out});
  const pulse = interpolate(frame, [44, 70], [0, 1], {...clamp, easing: EASE.out});
  const svc = interpolate(frame, [60, 76], [0, 1], clamp);
  const push = interpolate(frame, [0, 120], [1, 1.06]);

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #141A2A 0%, ${COLORS.bg} 70%)`}}>
      <Sparks x={960} y={520} count={70} power={1.5} spread={1.4} seed="logo" opacity={interpolate(frame, [2, 6, 30, 50], [0, 1, 0.6, 0], clamp)} />
      <AbsoluteFill style={{alignItems: 'center', transform: `scale(${push})`}}>
        <div
          style={{
            position: 'absolute',
            top: 120,
            width: 150,
            height: 150,
            borderRadius: 34,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(29,79,168,0.5)',
            transform: `scale(${badge}) rotate(${(1 - badge) * -40}deg)`,
          }}
        >
          <Img src={img('logo.png')} style={{width: 112, height: 112, objectFit: 'contain'}} />
        </div>
        {/* HAIXING — letters slam in one by one */}
        <div style={{position: 'absolute', top: 290, display: 'flex', fontSize: 250, fontWeight: 800, letterSpacing: '-0.02em', color: COLORS.red, lineHeight: 1}}>
          {BRAND.name.split('').map((ch, i) => {
            const p = interpolate(frame, [4 + i * 3, 12 + i * 3], [0, 1], {...clamp, easing: EASE.snap});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: Math.min(1, p * 2),
                  transform: `translateY(${(1 - p) * -120}px) scale(${1.5 - 0.5 * p})`,
                  textShadow: '0 10px 60px rgba(200,36,43,0.45)',
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{position: 'absolute', top: 580, fontSize: 84, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', opacity: zh, transform: `translateY(${(1 - zh) * 30}px)`, textShadow: '0 0 40px rgba(59,130,246,0.6)'}}>
          {BRAND.zh}
        </div>
        <div style={{position: 'absolute', top: 712, display: 'flex', alignItems: 'center', gap: 24}}>
          <Pulse width={260} progress={pulse} />
          <span style={{fontSize: 34, color: COLORS.redHot, fontWeight: 500, opacity: pulse}}>{BRAND.en}</span>
          <Pulse width={260} progress={pulse} flip />
        </div>
        <div style={{position: 'absolute', top: 800, fontFamily: monoFamily, fontSize: 24, letterSpacing: '0.12em', color: COLORS.steel, opacity: svc}}>
          {BRAND.services}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
