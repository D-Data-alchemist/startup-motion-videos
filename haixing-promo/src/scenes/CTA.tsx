import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KenBurns} from '../components/KenBurns';
import {Pulse, Slam} from '../components/Slam';
import {BRAND, COLORS, EASE, img, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = interpolate(frame, [22, 44], [0, 1], {...clamp, easing: EASE.out});
  const lock = spring({frame: frame - 44, fps, config: {damping: 14}});
  const card = interpolate(frame, [62, 78], [0, 1], {...clamp, easing: EASE.out});
  const close = interpolate(frame, [86, 100], [0, 1], clamp);
  const fade = interpolate(frame, [165, 180], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KenBurns src={img('factory-blue.jpg')} duration={180} from={1.05} to={1.15} shade={0.55} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,7,12,0.2) 0%, rgba(29,79,168,0.35) 55%, rgba(5,7,12,0.92) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 150}}>
          <Slam at={4} from={1.4}>
            <div style={{fontSize: 140, fontWeight: 900, color: '#fff', letterSpacing: '0.06em', textShadow: '0 10px 50px rgba(0,0,0,0.6)'}}>{BRAND.mottoZh}</div>
          </Slam>
        </div>
        <div style={{position: 'absolute', top: 350, display: 'flex', alignItems: 'center', gap: 24}}>
          <Pulse width={220} progress={pulse} />
          <span style={{fontSize: 40, color: '#fff', fontWeight: 600, opacity: pulse}}>{BRAND.mottoEn}</span>
          <Pulse width={220} progress={pulse} flip />
        </div>
        <div style={{position: 'absolute', top: 450, display: 'flex', alignItems: 'center', gap: 22, padding: '22px 40px 22px 26px', borderRadius: 24, background: '#fff', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', transform: `scale(${lock})`, opacity: Math.min(lock, 1)}}>
          <div style={{width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={img('logo.png')} style={{width: 84, height: 84, objectFit: 'contain'}} />
          </div>
          <div>
            <div style={{fontSize: 96, fontWeight: 800, color: COLORS.red, lineHeight: 0.95, letterSpacing: '-0.02em'}}>{BRAND.name}</div>
            <div style={{fontSize: 34, fontWeight: 700, color: COLORS.blue, letterSpacing: '0.1em', marginTop: 8}}>{BRAND.zh}</div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 680,
            display: 'flex',
            gap: 60,
            padding: '28px 48px',
            borderRadius: 18,
            background: 'rgba(8,12,22,0.7)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            opacity: card,
            transform: `translateY(${(1 - card) * 30}px)`,
          }}
        >
          <div>
            <div style={{fontFamily: monoFamily, fontSize: 18, letterSpacing: '0.25em', color: COLORS.redHot}}>TEL · 联系电话</div>
            <div style={{fontSize: 44, fontWeight: 800, color: '#fff', marginTop: 6, fontVariantNumeric: 'tabular-nums'}}>{BRAND.phone}</div>
            <div style={{fontSize: 22, color: COLORS.steel}}>{BRAND.contact}</div>
          </div>
          <div style={{width: 1, background: 'rgba(255,255,255,0.15)'}} />
          <div style={{maxWidth: 620}}>
            <div style={{fontFamily: monoFamily, fontSize: 18, letterSpacing: '0.25em', color: COLORS.redHot}}>ADDRESS · 地址</div>
            <div style={{fontSize: 26, color: '#fff', marginTop: 10, lineHeight: 1.4}}>{BRAND.address}</div>
          </div>
        </div>
        <div style={{position: 'absolute', top: 920, fontSize: 30, color: COLORS.steel, opacity: close}}>{BRAND.closing}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};
