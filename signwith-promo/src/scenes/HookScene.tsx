import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, displayFamily, EASE} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {charge: (i: number) => 8 + i * 9, line: 66, crumble: [88, 104]};
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
const SIGNED = [1, 0, 2, 1, 0, 2];

// Month after month of subscription charges — for a handful of signed documents
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(frame, [HOOK.line, HOOK.line + 12], [0, 1], {...clamp, easing: EASE.out});
  const crumble = interpolate(frame, HOOK.crumble, [0, 1], {...clamp, easing: EASE.in});
  const exit = interpolate(frame, [100, 112], [0, 1], clamp);
  const shown = MONTHS.filter((_, i) => frame >= HOOK.charge(i)).length;
  const total = SIGNED.slice(0, shown).reduce((a, b) => a + b, 0);

  return (
    <AbsoluteFill style={{opacity: 1 - exit}}>
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: displayFamily, fontSize: 30, letterSpacing: '0.2em', color: COLORS.muted}}>YOUR E-SIGNATURE SUBSCRIPTION</div>
      <div style={{position: 'absolute', top: 190, left: 210, right: 210, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 22}}>
        {MONTHS.map((m, i) => {
          const p = spring({frame: frame - HOOK.charge(i), fps, config: {damping: 12, stiffness: 200}});
          const fall = crumble * (1 + (i % 3) * 0.3);
          return (
            <div
              key={m}
              style={{
                height: 300,
                borderRadius: 18,
                background: '#fff',
                border: `1px solid ${COLORS.line}`,
                boxShadow: '0 16px 36px rgba(37,42,74,0.08)',
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: Math.min(1, p * 2) * (1 - crumble),
                transform: `translateY(${(1 - Math.min(p, 1)) * -60 + fall * 500}px) rotate(${fall * (i % 2 ? 25 : -25)}deg)`,
              }}
            >
              <div style={{fontFamily: displayFamily, fontSize: 26, fontWeight: 700, color: COLORS.logo}}>{m}</div>
              <div style={{alignSelf: 'center', padding: '10px 16px', border: `4px double ${COLORS.red}`, borderRadius: 10, color: COLORS.red, fontWeight: 800, fontSize: 22, transform: `rotate(-8deg) scale(${2 - Math.min(p, 1)})`, opacity: Math.min(1, p)}}>CHARGED</div>
              <div style={{fontSize: 18, color: COLORS.muted}}>
                Docs signed: <b style={{color: COLORS.ink}}>{SIGNED[i]}</b>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', fontSize: 26, color: COLORS.muted, opacity: shown ? 1 - crumble : 0}}>
        6 monthly charges · <b style={{color: COLORS.red}}>{total} documents</b> signed
      </div>
      <div style={{position: 'absolute', top: 660, width: '100%', textAlign: 'center', opacity: line, transform: `translateY(${(1 - line) * 30}px) scale(${1 + crumble * 0.05})`}}>
        <div style={{fontSize: 96, fontWeight: 800, letterSpacing: '-0.045em', color: COLORS.ink}}>
          Paying every month to sign <span style={{color: COLORS.red}}>6 documents?</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
