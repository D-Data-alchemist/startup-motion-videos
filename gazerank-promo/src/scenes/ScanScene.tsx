import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClickRipple, Cursor, cursorAt} from '../components/Cursor';
import {BRAND, COLORS, EASE, EyeMark, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const SCAN = {type: [12, 30], click: 38, cats: [50, 62, 74, 86], ring: [86, 110], fixes: [114, 124, 134], tick: [150, 165, 180], toast: 186};
const CATS = [
  {icon: '📈', label: 'SEO', v: 78},
  {icon: '⚡', label: 'Performance', v: 65},
  {icon: '♿', label: 'Accessibility', v: 71},
  {icon: '🤖', label: 'AI Readiness', v: 68},
];
// GazeRank's own example scan: missing meta description, images without alt text, slow assets
const FIXES = [
  {t: 'Add a meta description', pts: 6},
  {t: 'Add alt text to 14 images', pts: 5},
  {t: 'Let AI crawlers in (llms.txt)', pts: 6},
];

// Window geometry → cursor targets
const WIN = {x: 160, y: 90, w: 1600, h: 900};
const BTN = {x: WIN.x + 1180, y: WIN.y + 168, w: 330, h: 64};

const ringColor = (s: number) => (s >= 85 ? COLORS.emerald : s >= 75 ? '#65A30D' : COLORS.amber);

export const ScanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 26});
  const exit = interpolate(frame, [192, 210], [0, 1], {...clamp, easing: EASE.in});
  const cam = interpolate(frame, [40, 70, 140, 175], [1, 1.06, 1.06, 1.0], {...clamp, easing: EASE.inOut});

  const url = 'yourbusiness.com';
  const typed = url.slice(0, Math.floor(interpolate(frame, SCAN.type, [0, url.length], clamp)));
  const scanning = frame >= SCAN.click + 2 && frame < SCAN.ring[1];
  const ringP = interpolate(frame, SCAN.ring, [0, 1], {...clamp, easing: EASE.out});
  const fixed = SCAN.tick.filter((t) => frame >= t).length;
  const gain = FIXES.slice(0, fixed).reduce((a, f) => a + f.pts, 0);
  const prevGain = FIXES.slice(0, Math.max(0, fixed - 1)).reduce((a, f) => a + f.pts, 0);
  const lastTick = fixed ? SCAN.tick[fixed - 1] : 0;
  const animGain = fixed ? prevGain + (gain - prevGain) * interpolate(frame, [lastTick, lastTick + 10], [0, 1], {...clamp, easing: EASE.out}) : 0;
  const score = Math.round(72 * ringP + animGain);
  const status = score >= 85 ? 'Looking strong' : 'Needs attention';
  const toast = spring({frame: frame - SCAN.toast, fps, config: {damping: 14, stiffness: 160}});

  const cursor = cursorAt(frame, [
    {f: 4, x: 1700, y: 1080},
    {f: 32, x: BTN.x + BTN.w / 2 + 40, y: BTN.y + BTN.h / 2 + 6, arc: -50},
    {f: 60, x: BTN.x + BTN.w / 2 + 40, y: BTN.y + BTN.h / 2 + 6},
    {f: 140, x: WIN.x + 1460, y: WIN.y + 520, arc: 60},
    {f: 150, x: WIN.x + 1460, y: WIN.y + 520},
    {f: 165, x: WIN.x + 1460, y: WIN.y + 600, arc: 0},
    {f: 180, x: WIN.x + 1460, y: WIN.y + 680, arc: 0},
    {f: 205, x: 1700, y: 1000},
  ]);
  const press = Math.max(
    interpolate(frame, [SCAN.click - 4, SCAN.click, SCAN.click + 6], [0, 1, 0], clamp),
    ...SCAN.tick.map((t) => interpolate(frame, [t - 3, t, t + 5], [0, 0.8, 0], clamp)),
  );

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), filter: `blur(${exit * 12}px)`, transform: `scale(${cam * (1 - exit * 0.06)})`, transformOrigin: '1180px 560px'}}>
      <div
        style={{
          position: 'absolute',
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 22,
          overflow: 'hidden',
          background: COLORS.surface,
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 50px 120px rgba(20,32,28,0.16)',
          transform: `translateY(${(1 - enter) * 80}px) scale(${0.92 + 0.08 * enter})`,
          color: COLORS.text,
        }}
      >
        {/* Browser bar */}
        <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', background: '#EEF1EE', borderBottom: `1px solid ${COLORS.line}`}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c}} />
          ))}
          <div style={{margin: '0 auto', width: 420, height: 28, borderRadius: 8, background: '#fff', border: `1px solid ${COLORS.line}`, color: COLORS.muted, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{BRAND.url}</div>
          <div style={{width: 52}} />
        </div>
        {/* Nav */}
        <div style={{height: 62, display: 'flex', alignItems: 'center', gap: 12, padding: '0 34px', borderBottom: `1px solid ${COLORS.line}`}}>
          <EyeMark size={34} look={scanning ? Math.sin(frame / 3) : 0} />
          <span style={{fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em'}}>{BRAND.name}</span>
          <div style={{marginLeft: 'auto', display: 'flex', gap: 28, fontSize: 16, color: COLORS.muted}}>
            {['Tools', 'GEO Toolbox', 'Pricing', 'Extension'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
        {/* URL input row */}
        <div style={{position: 'absolute', left: 60, top: 140, right: 60, display: 'flex', gap: 16}}>
          <div style={{flex: 1, height: 64, borderRadius: 14, border: `2px solid ${frame >= SCAN.type[0] ? COLORS.emerald : COLORS.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 24, fontFamily: monoFamily, color: typed ? COLORS.text : COLORS.muted}}>
            🔗&nbsp;&nbsp;{typed || 'Website URL to scan'}
            {frame >= SCAN.type[0] && frame < SCAN.click && Math.floor(frame / 8) % 2 === 0 && <span style={{width: 2, height: 28, background: COLORS.text, marginLeft: 2}} />}
          </div>
          <div style={{width: BTN.w, height: BTN.h, borderRadius: 14, background: COLORS.ink, color: '#fff', fontSize: 22, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - interpolate(frame, [SCAN.click - 4, SCAN.click, SCAN.click + 6], [0, 0.06, 0], clamp)})`}}>
            {scanning ? 'Scanning…' : `${BRAND.cta} →`}
          </div>
        </div>
        {/* scan line sweeping the page while scanning */}
        {scanning && <div style={{position: 'absolute', left: 0, right: 0, top: 240 + ((frame - SCAN.click) * 14) % 640, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.emerald}, transparent)`, boxShadow: `0 0 16px ${COLORS.emerald}`, opacity: 0.8}} />}

        {/* Score ring */}
        <div style={{position: 'absolute', left: 60, top: 250, width: 520, height: 600, borderRadius: 20, background: COLORS.bg, border: `1px solid ${COLORS.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: interpolate(frame, [SCAN.click, SCAN.click + 12], [0, 1], clamp)}}>
          <div style={{fontFamily: monoFamily, fontSize: 18, color: COLORS.muted}}>{typed || 'yourbusiness.com'}</div>
          <div style={{position: 'relative', width: 300, height: 300, marginTop: 20}}>
            <svg width="300" height="300" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="125" stroke={COLORS.line} strokeWidth="22" fill="none" />
              <circle cx="150" cy="150" r="125" stroke={ringColor(score)} strokeWidth="22" fill="none" strokeLinecap="round" strokeDasharray={2 * Math.PI * 125} strokeDashoffset={2 * Math.PI * 125 * (1 - score / 100)} transform="rotate(-90 150 150)" />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontSize: 110, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + (fixed ? 0.08 * Math.exp(-(frame - lastTick) / 5) : 0)})`}}>{score}</div>
              <div style={{fontSize: 22, color: COLORS.muted}}>/ 100</div>
            </div>
          </div>
          <div style={{marginTop: 24, padding: '8px 18px', borderRadius: 999, fontSize: 20, fontWeight: 600, background: score >= 85 ? COLORS.soft : '#FEF3C7', color: score >= 85 ? COLORS.emeraldDeep : COLORS.amber, opacity: ringP}}>{status}</div>
        </div>

        {/* Category bars */}
        <div style={{position: 'absolute', left: 620, top: 250, width: 420, display: 'flex', flexDirection: 'column', gap: 18}}>
          {CATS.map((c, i) => {
            const p = interpolate(frame, [SCAN.cats[i], SCAN.cats[i] + 16], [0, 1], {...clamp, easing: EASE.out});
            return (
              <div key={c.label} style={{padding: '20px 22px', borderRadius: 16, border: `1px solid ${COLORS.line}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 30}px)`}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 600}}>
                  <span>
                    {c.icon} {c.label}
                  </span>
                  <span style={{fontVariantNumeric: 'tabular-nums'}}>{Math.round(c.v * p)}</span>
                </div>
                <div style={{height: 10, borderRadius: 10, background: COLORS.soft, marginTop: 12, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${c.v * p}%`, borderRadius: 10, background: c.v >= 75 ? '#65A30D' : COLORS.amber}} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Prioritized fixes */}
        <div style={{position: 'absolute', left: 1080, top: 250, width: 460}}>
          <div style={{fontSize: 22, fontWeight: 700, opacity: interpolate(frame, [SCAN.fixes[0] - 6, SCAN.fixes[0]], [0, 1], clamp)}}>Fix these first</div>
          {FIXES.map((f, i) => {
            const pop = spring({frame: frame - SCAN.fixes[i], fps, config: {damping: 14, stiffness: 170}});
            const done = frame >= SCAN.tick[i];
            return (
              <div
                key={f.t}
                style={{
                  marginTop: 16,
                  height: 64,
                  padding: '0 18px',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontSize: 20,
                  border: `1.5px solid ${done ? COLORS.emerald : COLORS.line}`,
                  background: done ? COLORS.soft : '#fff',
                  transform: `scale(${Math.min(1, pop)}) translateX(${(1 - Math.min(pop, 1)) * 40}px)`,
                  opacity: Math.min(1, pop * 1.5),
                }}
              >
                <span style={{width: 28, height: 28, borderRadius: 8, border: `2px solid ${done ? COLORS.emerald : COLORS.line}`, background: done ? COLORS.emerald : '#fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800}}>{done ? '✓' : ''}</span>
                <span style={{flex: 1, textDecoration: done ? 'line-through' : 'none', color: done ? COLORS.muted : COLORS.text}}>{f.t}</span>
                <span style={{fontFamily: monoFamily, fontSize: 18, color: COLORS.emeraldDeep, fontWeight: 600}}>+{f.pts}</span>
              </div>
            );
          })}
          <div style={{marginTop: 26, padding: '16px 20px', borderRadius: 14, background: COLORS.ink, color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', gap: 12, opacity: Math.min(1, toast), transform: `translateY(${(1 - Math.min(toast, 1)) * 30}px)`}}>
            <span style={{color: COLORS.emerald, fontWeight: 800}}>▲ +17 pts</span> now AI search can see you
          </div>
        </div>
      </div>
      <ClickRipple x={BTN.x + BTN.w / 2 + 44} y={BTN.y + BTN.h / 2 + 10} progress={interpolate(frame, [SCAN.click, SCAN.click + 20], [0, 1], clamp)} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [4, 12, 196, 206], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
