import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EMOTION_COLORS, Emotion, lerpEmotions, mixHue, Mochi, sample} from '../components/Mochi';
import {BRAND, COLORS, EASE, serif} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CTA_PRESS = 110;
// Mochi cycles through the bright ones while the CTA holds
export const CYCLE: Emotion[] = ['joy', 'love', 'hope', 'gratitude'];
export const CYCLE_AT = 28;

const Badge: React.FC<{top: string; label: string; press?: number}> = ({top, label, press = 0}) => (
  <div style={{height: 82, padding: '0 34px', borderRadius: 16, background: COLORS.fg, color: COLORS.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 3px 0 rgba(0,0,0,.25)', transform: `scale(${1 - press * 0.06})`}}>
    <div style={{fontSize: 16, opacity: 0.8}}>{top}</div>
    <div style={{fontSize: 28, fontWeight: 700, marginTop: -2}}>{label}</div>
  </div>
);

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 2, fps, config: {damping: 10, stiffness: 150}});
  const a = interpolate(frame, [8, 22], [0, 1], {...clamp, easing: EASE.out});
  const b = interpolate(frame, [20, 32], [0, 1], {...clamp, easing: EASE.snap});
  const sub = interpolate(frame, [40, 54], [0, 1], clamp);
  const btn = spring({frame: frame - 58, fps, config: {damping: 14, stiffness: 140}});
  const press = interpolate(frame, [CTA_PRESS - 4, CTA_PRESS, CTA_PRESS + 6], [0, 1, 0], clamp);

  const idx = Math.max(0, Math.floor((frame - 10) / CYCLE_AT));
  const t = interpolate((frame - 10) % CYCLE_AT, [0, 10], [0, 1], {...clamp, easing: EASE.inOut});
  const from = CYCLE[Math.max(0, idx - 1) % CYCLE.length];
  const to = CYCLE[idx % CYCLE.length];
  const emotions = idx === 0 ? sample('joy') : lerpEmotions(sample(from), sample(to), t);
  const color = idx === 0 ? EMOTION_COLORS.joy : mixHue(EMOTION_COLORS[from], EMOTION_COLORS[to], t);
  const blink = frame % 70 > 64 ? 1 : 0;

  return (
    <AbsoluteFill style={{color: COLORS.fg}}>
      <div style={{position: 'absolute', right: 150, top: 190, transform: `scale(${pop}) translateY(${Math.sin(frame / 8) * 8}px)`}}>
        <Mochi id="cta-mochi" emotions={emotions} color={color} size={620} blink={blink} wobble={frame / 9} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 230, width: 1100}}>
        <div style={{fontFamily: serif, fontWeight: 700, fontSize: 40, display: 'flex', alignItems: 'center', gap: 16, opacity: a}}>
          <Mochi id="cta-logo" emotions={sample('gratitude')} size={52} face={false} />
          Emochi
        </div>
        <div style={{fontFamily: serif, fontWeight: 700, fontSize: 112, lineHeight: 1.04, letterSpacing: '-0.02em', marginTop: 30}}>
          <div style={{opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>{BRAND.headA}</div>
          <div style={{color: COLORS.tealDeep, opacity: Math.min(1, b * 2), transform: `scale(${1.2 - 0.2 * b})`, transformOrigin: 'left center'}}>{BRAND.headB}</div>
        </div>
        <div style={{fontSize: 36, color: COLORS.muted, marginTop: 26, opacity: sub}}>{BRAND.sub}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 44, opacity: Math.min(1, btn), transform: `translateY(${(1 - Math.min(btn, 1)) * 30}px)`}}>
          <Badge top="Download on the" label="App Store" press={press} />
          <Badge top="Get it on" label="Google Play" />
          <div style={{fontSize: 22, color: COLORS.muted, lineHeight: 1.5, marginLeft: 12}}>
            <b style={{color: COLORS.fg}}>{BRAND.url}</b>
            <br />
            {BRAND.fine}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
