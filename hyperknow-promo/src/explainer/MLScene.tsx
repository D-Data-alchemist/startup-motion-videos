import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {AppFrame, BAR_H} from '../components/AppFrame';
import {COLORS, EASE, handFamily, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_explainer.py
export const ML = {curve: [40, 80], steps: [95, 110, 125, 140, 155, 170], minimum: 175};

const INK = '#1F1F1F';
const PURPLE = '#6D4AFF';
const MARKER = '#FFF1A8';
const CHAT = {x: 1176, w: 410};
const TOP = BAR_H + 100;

const LINES: {k: 'h' | 't' | 'c' | 'b'; s: string; label?: string; indent?: boolean}[] = [
  {k: 'h', s: 'Course Map'},
  {k: 't', s: 'Unit: Machine Learning'},
  {k: 't', s: 'Session: Gradient Descent'},
  {k: 't', s: 'What is a loss?', indent: true},
  {k: 't', s: 'Follow the slope', indent: true},
  {k: 't', s: 'Pick a learning rate', indent: true},
  {k: 'h', s: 'The Update Rule'},
  {k: 'c', s: 'w ← w − η · ∇L(w)'},
  {k: 'b', label: 'η', s: 'learning rate'},
];

// Loss valley (window-relative): lowest point at x = 800, rising toward both edges
const curveY = (x: number) => TOP + 520 - 400 * ((x - 800) / 330) ** 2;
const CURVE = Array.from({length: 61}, (_, i) => 470 + i * 11).map((x) => `${x},${curveY(x).toFixed(1)}`).join(' ');
const BALL_X = [500, 610, 690, 745, 780, 798];

const MSG1 = 'Think of the loss as a valley. Gradient descent takes small steps downhill until it reaches the bottom.';
const MSG2 = 'The size of each step is η — the learning rate.';
const QUESTION = 'Quick check: what happens if η is way too big?';

export const MLScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const curve = interpolate(frame, ML.curve, [0, 1], {...clamp, easing: EASE.inOut});
  const circle = interpolate(frame, [118, 138], [0, 1], {...clamp, easing: EASE.out});
  const stepIdx = ML.steps.filter((s) => frame >= s).length;
  // Ball eases between steps
  const seg = Math.max(0, stepIdx - 1);
  const t = stepIdx === 0 ? 0 : interpolate(frame, [ML.steps[seg], ML.steps[seg] + 10], [0, 1], {...clamp, easing: EASE.out});
  const fromX = BALL_X[Math.max(0, seg - 1)] ?? BALL_X[0];
  const ballX = stepIdx <= 1 ? BALL_X[0] : fromX + (BALL_X[seg] - fromX) * t;
  const ballIn = spring({frame: frame - 86, fps, config: {damping: 12}});
  const done = spring({frame: frame - ML.minimum, fps, config: {damping: 12, stiffness: 180}});
  const q = spring({frame: frame - 160, fps, config: {damping: 16}});
  const stream = (s: string, a: number, b: number) => s.slice(0, Math.floor(interpolate(frame, [a, b], [0, s.length], clamp)));
  const lbl = (icon: string, text: string, at: number) =>
    frame >= at && (
      <div style={{display: 'flex', gap: 8, fontSize: 15, color: COLORS.muted}}>
        <span>{icon}</span>
        {text}
      </div>
    );

  let y = TOP;
  return (
    <AppFrame active="" sidebar={false} exitAt={192} cam={interpolate(frame, [0, 215], [1, 1.04])}>
      <div style={{position: 'absolute', left: 0, top: BAR_H, right: CHAT.w + 24, bottom: 0, background: '#fff'}} />
      <div style={{position: 'absolute', left: 24, top: BAR_H + 22, display: 'flex', gap: 12}}>
        <Pill>✕</Pill>
        <Pill>
          <span style={{fontWeight: 600}}>Gradient Descent, Visually</span>
        </Pill>
      </div>

      {/* Notes column */}
      {LINES.map((l, i) => {
        const top = y;
        y += l.k === 'h' ? 72 : 54;
        const at = 8 + i * 6;
        const w = interpolate(frame, [at, at + 10], [0, 100], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 40 + (l.indent ? 24 : 0) + (l.k === 'h' ? 50 : 0),
              top: top + (l.k === 'h' ? 10 : 0),
              whiteSpace: 'nowrap',
              clipPath: `inset(-10px ${100 - w}% -10px -10px)`,
              fontFamily: l.k === 'c' ? monoFamily : handFamily,
              fontSize: l.k === 'h' ? 38 : l.k === 'c' ? 24 : 27,
              color: l.k === 'h' ? PURPLE : INK,
              ...(l.k === 'h' ? {backgroundImage: `linear-gradient(${MARKER}, ${MARKER})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 90%', backgroundSize: '100% 40%'} : {}),
            }}
          >
            {l.k === 'b' ? (
              <>
                <b>{l.label}</b>: {l.s}
              </>
            ) : (
              l.s
            )}
          </div>
        );
      })}
      {/* red circle on "η: learning rate" */}
      <svg style={{position: 'absolute', left: 24, top: y - 54 - 6, overflow: 'visible'}} width="260" height="56">
        <ellipse cx="120" cy="26" rx="116" ry="27" fill="none" stroke="#C2410C" strokeWidth="2.5" strokeDasharray="600" strokeDashoffset={600 * (1 - circle)} transform="rotate(-2 120 26)" />
      </svg>

      {/* Loss valley */}
      <div style={{position: 'absolute', left: 560, top: TOP + 10, fontFamily: handFamily, fontSize: 38, color: PURPLE, backgroundImage: `linear-gradient(${MARKER}, ${MARKER})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 90%', backgroundSize: '100% 40%', clipPath: `inset(-10px ${100 - interpolate(frame, [30, 42], [0, 100], clamp)}% -10px -10px)`}}>
        Loss Landscape
      </div>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width="1176" height="860">
        <path d={`M450 ${TOP + 90} L450 ${TOP + 560} L1150 ${TOP + 560}`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - interpolate(frame, [30, 50], [0, 1], clamp))} />
        <polyline points={CURVE} fill="none" stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - curve)} />
        {/* dashed trail */}
        {BALL_X.slice(0, Math.max(0, stepIdx - 1)).map((x, i) => (
          <g key={i}>
            <line x1={x} y1={curveY(x) - 16} x2={BALL_X[i + 1]} y2={curveY(BALL_X[i + 1]) - 16} stroke="#C2410C" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx={x} cy={curveY(x) - 16} r="5" fill="#C2410C" opacity="0.5" />
          </g>
        ))}
        <circle cx={ballX} cy={curveY(ballX) - 16} r={14 * Math.min(ballIn, 1)} fill="#C2410C" />
      </svg>
      <div style={{position: 'absolute', left: 410, top: TOP + 80, fontFamily: handFamily, fontSize: 22, color: COLORS.muted, transform: 'rotate(-90deg)', transformOrigin: 'left top', opacity: curve}}>loss</div>
      <div style={{position: 'absolute', left: 1040, top: TOP + 572, fontFamily: handFamily, fontSize: 22, color: COLORS.muted, opacity: curve}}>weight w</div>
      {stepIdx > 0 && stepIdx < 6 && (
        <div style={{position: 'absolute', left: ballX + 24, top: curveY(ballX) - 70, fontFamily: handFamily, fontSize: 22, color: '#C2410C'}}>step {stepIdx}</div>
      )}
      <div style={{position: 'absolute', left: 860, top: curveY(800) - 60, fontFamily: handFamily, fontSize: 28, color: COLORS.success, transform: `scale(${Math.max(done, 0)})`}}>minimum ✓</div>

      {/* Chat */}
      <div style={{position: 'absolute', left: CHAT.x, top: BAR_H + 14, width: CHAT.w, bottom: 14, borderRadius: 18, background: '#fff', border: `1px solid ${COLORS.border}`, boxShadow: '0 10px 30px rgba(17,17,17,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <div style={{padding: '20px 22px', fontSize: 19, fontWeight: 600, display: 'flex', gap: 10, borderBottom: `1px solid ${COLORS.border}`}}>
          💬 Chat history <span style={{marginLeft: 'auto', color: COLORS.muted, fontWeight: 400}}>✕</span>
        </div>
        <div style={{flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14, fontSize: 17, lineHeight: 1.55, color: '#444'}}>
          {lbl('✎', 'Board note', 20)}
          <div>{stream(MSG1, 22, 80)}</div>
          {lbl('✐', 'Highlight', 112)}
          {frame >= 114 && <div>{stream(MSG2, 114, 150)}</div>}
          {frame >= 160 && <div style={{color: COLORS.text, fontWeight: 500, opacity: Math.min(q, 1), transform: `translateY(${(1 - Math.min(q, 1)) * 14}px)`}}>{QUESTION}</div>}
        </div>
        <div style={{margin: '0 16px 16px', height: 56, borderRadius: 999, border: `1px solid ${COLORS.borderHi}`, display: 'flex', alignItems: 'center', padding: '0 8px 0 18px', gap: 10, fontSize: 16, color: COLORS.muted}}>
          <span style={{fontSize: 20}}>＋</span>
          <span style={{flex: 1}}>Ask a question…</span>
          <span style={{fontSize: 18, color: '#E11D48'}}>🎙</span>
          <div style={{width: 40, height: 40, borderRadius: '50%', background: '#E8E8E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18}}>↑</div>
        </div>
      </div>
    </AppFrame>
  );
};

const Pill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{height: 50, padding: '0 18px', borderRadius: 999, background: '#fff', border: `1px solid ${COLORS.borderHi}`, boxShadow: '0 4px 14px rgba(17,17,17,0.05)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 18}}>
    {children}
  </div>
);
