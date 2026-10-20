import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {Cursor, ClickRipple, cursorAt} from '../components/Cursor';
import {BRAND, COLORS, EASE, highlight, serifFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Window geometry (screen px); cursor targets derive from these
const WIN = {x: 160, y: 110, w: 1600, h: 860};
const BAR_H = 48;
const SIDEBAR_W = 260;
const MAIN_CX = SIDEBAR_W + (WIN.w - SIDEBAR_W) / 2; // window-relative
const BOX = {w: 860, h: 150, top: 340};
const BOX_LEFT = MAIN_CX - BOX.w / 2;
const INPUT = {x: WIN.x + BOX_LEFT + 120, y: WIN.y + BOX.top + 40};
const SEND = {x: WIN.x + BOX_LEFT + BOX.w - 42, y: WIN.y + BOX.top + BOX.h - 42};
const STATS_LEFT = 1200;
const CARD_CENTER = {x: WIN.x + STATS_LEFT + 175, y: WIN.y + 96 + 70};

// Key beats (local frames) — locked to the soundtrack
const INPUT_CLICK = 34;
const TYPE = [36, 52];
const CLICK = 58;
const GEN_START = CLICK + 4;
const GEN_END = GEN_START + 80;
const TOAST = 148;

const MODULES = [
  {t: 'Relational thinking', l: 3},
  {t: 'Schemas & constraints', l: 4},
  {t: 'Indexes that scale', l: 4},
  {t: 'Transactions & locking', l: 5},
  {t: 'Backups & recovery', l: 4},
  {t: "Capstone: ship a DB that won't break", l: 4},
];
const NAV = ['Home', 'Courses', 'Learning Feed', 'History', 'Marketplace'];

export const ActionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, mass: 0.9}, durationInFrames: 32});
  const exit = interpolate(frame, [188, 212], [0, 1], {...clamp, easing: EASE.in});
  const cam = interpolate(frame, [20, 50, 120, 158], [1, 1.1, 1.1, 1], {...clamp, easing: EASE.inOut});

  const cursor = cursorAt(frame, [
    {f: 14, x: 1760, y: 1080},
    {f: 32, x: INPUT.x, y: INPUT.y, arc: -60},
    {f: 44, x: INPUT.x, y: INPUT.y},
    {f: 55, x: SEND.x + 6, y: SEND.y + 6, arc: -30},
    {f: 80, x: SEND.x + 6, y: SEND.y + 6},
    {f: 112, x: CARD_CENTER.x, y: CARD_CENTER.y, arc: 60},
    {f: 150, x: CARD_CENTER.x, y: CARD_CENTER.y},
    {f: 186, x: 1500, y: 880, arc: -40},
  ]);
  const press =
    interpolate(frame, [INPUT_CLICK - 3, INPUT_CLICK, INPUT_CLICK + 4], [0, 0.7, 0], clamp) +
    interpolate(frame, [CLICK - 4, CLICK, CLICK + 6], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [CLICK, CLICK + 20], [0, 1], clamp);
  const cursorOpacity = interpolate(frame, [14, 22], [0, 1], clamp);
  const cardHover = interpolate(frame, [108, 116, 150, 160], [0, 1, 1, 0], clamp);

  const typed = BRAND.prompt.slice(0, Math.floor(interpolate(frame, [TYPE[0], TYPE[1]], [0, BRAND.prompt.length], clamp)));
  const focus = frame >= INPUT_CLICK;
  const hl = interpolate(frame, [18, 34], [0, 1], {...clamp, easing: EASE.out});

  // Home → course transition
  const homeOut = interpolate(frame, [58, 68], [0, 1], {...clamp, easing: EASE.in});
  const courseIn = spring({frame: frame - 68, fps, config: {damping: 200}, durationInFrames: 22});
  const genP = interpolate(frame, [GEN_START, GEN_END], [0, 1], {...clamp, easing: EASE.out});
  const done = frame >= GEN_END;
  const toastIn = spring({frame: frame - TOAST, fps, config: {damping: 18, stiffness: 140}});

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(enter * 1.4, 1) * (1 - exit),
        filter: `blur(${exit * 14}px)`,
        transform: `scale(${(1 - exit * 0.08) * cam})`,
        transformOrigin: `${WIN.x + MAIN_CX + 80}px ${WIN.y + 400}px`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 20,
          overflow: 'hidden',
          background: COLORS.surfaceHi,
          border: `1px solid ${COLORS.borderHi}`,
          boxShadow: '0 50px 120px rgba(17,17,17,0.16), 0 8px 24px rgba(17,17,17,0.06)',
          transform: `perspective(2200px) rotateX(${(1 - enter) * 16}deg) translateY(${(1 - enter) * 90}px) scale(${0.86 + 0.14 * enter})`,
          color: COLORS.text,
        }}
      >
        {/* Browser bar */}
        <div
          style={{
            height: BAR_H,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: 8,
            borderBottom: `1px solid ${COLORS.border}`,
            background: '#EFEFEC',
          }}
        >
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c}} />
          ))}
          <div
            style={{
              margin: '0 auto',
              width: 440,
              height: 28,
              borderRadius: 8,
              background: '#fff',
              border: `1px solid ${COLORS.border}`,
              color: COLORS.muted,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {BRAND.url}
          </div>
          <div style={{width: 52}} />
        </div>

        {/* Sidebar */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: BAR_H + 14,
            bottom: 14,
            width: SIDEBAR_W - 28,
            borderRadius: 16,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            padding: '22px 14px',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 22px', fontSize: 22, fontWeight: 500}}>
            <svg width="26" height="26" viewBox="0 0 96 96">
              <path d="M18 40 L48 26 L78 40 L48 54 Z M18 40 L18 58 L48 72 L78 58 L78 40" fill="none" stroke="#111" strokeWidth="7" strokeLinejoin="round" />
            </svg>
            {BRAND.name}
          </div>
          {NAV.map((item, i) => {
            const p = interpolate(frame, [10 + i * 3, 26 + i * 3], [0, 1], {...clamp, easing: EASE.out});
            const active = (item === 'Home' && frame < 66) || (item === 'Courses' && frame >= 66);
            return (
              <div
                key={item}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 17,
                  color: active ? COLORS.accent : COLORS.text,
                  background: active ? '#EAF0FF' : 'transparent',
                  opacity: p,
                  transform: `translateX(${(1 - p) * -16}px)`,
                  marginBottom: 2,
                }}
              >
                {item}
              </div>
            );
          })}
          <div style={{fontSize: 15, fontWeight: 600, margin: '26px 10px 10px'}}>Continue Learning</div>
          <div style={{margin: '0 4px', padding: 14, borderRadius: 12, border: `1px solid ${COLORS.border}`, fontSize: 14}}>
            <span style={{fontSize: 12, padding: '3px 8px', borderRadius: 6, background: COLORS.warm, border: '1px solid #E5DDBF'}}>Project</span>
            <div style={{fontWeight: 600, marginTop: 8}}>The Autonomous Platform</div>
            <div style={{height: 3, borderRadius: 3, background: '#EEE', marginTop: 10}}>
              <div style={{width: '18%', height: '100%', borderRadius: 3, background: COLORS.accent}} />
            </div>
          </div>
        </div>

        {/* ── Home: course prompt ── */}
        <div style={{position: 'absolute', inset: 0, opacity: 1 - homeOut, transform: `translateY(${-homeOut * 40}px)`}}>
          <div
            style={{
              position: 'absolute',
              left: MAIN_CX - 160,
              top: 120,
              display: 'flex',
              borderRadius: 10,
              background: '#EFEFEC',
              padding: 4,
              fontSize: 15,
            }}
          >
            <div style={{padding: '7px 14px', borderRadius: 8, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)'}}>Craft Courses</div>
            <div style={{padding: '7px 14px', color: COLORS.muted}}>Instant Assistance</div>
          </div>
          <div style={{position: 'absolute', left: SIDEBAR_W, right: 0, top: 196, textAlign: 'center'}}>
            <div style={{fontSize: 46, fontWeight: 500, letterSpacing: '-0.03em'}}>
              Craft your <span style={highlight(hl)}>personalized courses</span> with {BRAND.name},
            </div>
            <div style={{fontSize: 22, color: COLORS.muted, marginTop: 14}}>For mastering anything in human knowledge</div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: BOX_LEFT,
              top: BOX.top,
              width: BOX.w,
              height: BOX.h,
              borderRadius: 18,
              background: '#fff',
              border: `1px solid ${focus ? 'rgba(59,108,246,0.45)' : COLORS.borderHi}`,
              boxShadow: focus ? '0 0 0 4px rgba(59,108,246,0.10), 0 12px 30px rgba(17,17,17,0.06)' : '0 12px 30px rgba(17,17,17,0.06)',
              padding: '22px 22px',
            }}
          >
            <div style={{fontSize: 22, color: typed ? COLORS.text : COLORS.muted, height: 30}}>
              {typed || 'What do you want to master?'}
              {focus && frame < CLICK && Math.floor(frame / 8) % 2 === 0 && (
                <span style={{display: 'inline-block', width: 2, height: 24, background: COLORS.text, marginLeft: 2, verticalAlign: 'middle'}} />
              )}
            </div>
            <div style={{position: 'absolute', left: 22, right: 22, bottom: 20, display: 'flex', alignItems: 'center', gap: 10}}>
              <Pill>＋</Pill>
              <Pill>Self Study</Pill>
              <div style={{flex: 1}} />
              <Pill>
                Venus 1 Pro <span style={{color: COLORS.muted}}>Preview</span>
              </Pill>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: typed.length > 10 ? COLORS.text : '#E8E8E5',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  transform: `scale(${1 - interpolate(frame, [CLICK - 4, CLICK, CLICK + 6], [0, 0.12, 0], clamp)})`,
                }}
              >
                ↑
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: SIDEBAR_W, right: 0, top: BOX.top + BOX.h + 24, textAlign: 'center', fontSize: 16, color: COLORS.muted}}>
            Or import directly from <span style={{color: COLORS.text, textDecoration: 'underline'}}>your school's LMS</span>
          </div>
        </div>

        {/* ── Generated course ── */}
        <div style={{position: 'absolute', inset: 0, opacity: courseIn, transform: `translateY(${(1 - courseIn) * 50}px)`}}>
          <div
            style={{
              position: 'absolute',
              left: SIDEBAR_W + 20,
              top: 96,
              width: 880,
              height: 720,
              borderRadius: 18,
              background: '#fff',
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 12px 30px rgba(17,17,17,0.05)',
              padding: '30px 36px',
            }}
          >
            <div style={{fontSize: 14, color: COLORS.muted, display: 'flex', gap: 10, alignItems: 'center'}}>
              <span style={{padding: '4px 10px', borderRadius: 6, background: '#EAF0FF', color: COLORS.accent, fontWeight: 600}}>Course</span>
              Crafted by Venus 1 Pro
            </div>
            <div style={{fontFamily: serifFamily, fontSize: 40, fontWeight: 500, letterSpacing: '-0.01em', marginTop: 14, lineHeight: 1.15}}>
              {BRAND.courseTitle}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, fontSize: 16, color: COLORS.muted}}>
              <div style={{width: 260, height: 6, borderRadius: 6, background: '#EEE', overflow: 'hidden'}}>
                <div style={{width: `${genP * 100}%`, height: '100%', background: done ? COLORS.success : COLORS.accent}} />
              </div>
              {done ? (
                <span style={{color: COLORS.success, fontWeight: 600}}>✓ Course ready</span>
              ) : (
                <span style={{fontVariantNumeric: 'tabular-nums'}}>Crafting your course… {Math.round(genP * 100)}%</span>
              )}
            </div>
            <div style={{marginTop: 22}}>
              {MODULES.map((m, i) => {
                const s = GEN_START + 4 + i * 11;
                const appear = interpolate(frame, [s, s + 12], [0, 1], {...clamp, easing: EASE.out});
                const ok = spring({frame: frame - (s + 16), fps, config: {damping: 12, stiffness: 200}});
                const ready = frame >= s + 16;
                return (
                  <div
                    key={m.t}
                    style={{
                      height: 58,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      borderTop: `1px solid ${COLORS.border}`,
                      opacity: appear,
                      transform: `translateX(${(1 - appear) * 30}px)`,
                    }}
                  >
                    <span style={{fontSize: 15, color: COLORS.muted, width: 26, fontVariantNumeric: 'tabular-nums'}}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{flex: 1, fontFamily: serifFamily, fontSize: 25}}>{m.t}</span>
                    <span style={{fontSize: 15, color: COLORS.muted}}>{m.l} lessons · quiz</span>
                    <div style={{width: 28, display: 'flex', justifyContent: 'center'}}>
                      {ready ? (
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: COLORS.success,
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: `scale(${Math.max(ok, 0)})`,
                          }}
                        >
                          ✓
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: '2.5px solid #E2E2E2',
                            borderTopColor: COLORS.accent,
                            transform: `rotate(${frame * 22}deg)`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study material stats */}
          {[
            {label: 'Lessons', value: 24, icon: '📖'},
            {label: 'Flashcards', value: 48, icon: '🗂️'},
            {label: 'Quiz questions', value: 36, icon: '✏️'},
            {label: 'Hands-on projects', value: 3, icon: '🛠️'},
          ].map((s, i) => {
            const appear = interpolate(frame, [70 + i * 5, 88 + i * 5], [0, 1], {...clamp, easing: EASE.out});
            const hover = i === 0 ? cardHover : 0;
            return (
              <div
                key={s.label}
                style={{
                  position: 'absolute',
                  left: STATS_LEFT,
                  top: 96 + i * 174,
                  width: 350,
                  height: 152,
                  borderRadius: 18,
                  background: '#fff',
                  border: `1px solid ${hover > 0 ? `rgba(59,108,246,${0.3 + hover * 0.5})` : COLORS.border}`,
                  boxShadow: hover > 0 ? `0 0 0 ${hover * 4}px rgba(59,108,246,0.10)` : '0 12px 30px rgba(17,17,17,0.05)',
                  padding: '24px 26px',
                  opacity: appear,
                  transform: `translateY(${(1 - appear) * 24}px) scale(${1 + hover * 0.02})`,
                }}
              >
                <div style={{fontSize: 16, color: COLORS.muted}}>
                  {s.icon} {s.label}
                </div>
                <div style={{fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', marginTop: 8, fontVariantNumeric: 'tabular-nums'}}>
                  {Math.round(genP * s.value)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Toast */}
        <div
          style={{
            position: 'absolute',
            left: SIDEBAR_W + 20 + 880 - 520,
            bottom: 64,
            width: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 20px',
            borderRadius: 14,
            background: COLORS.text,
            color: '#fff',
            boxShadow: '0 20px 50px rgba(17,17,17,0.25)',
            fontSize: 18,
            fontWeight: 500,
            opacity: Math.min(toastIn, 1),
            transform: `translateY(${(1 - toastIn) * 40}px)`,
          }}
        >
          <div style={{width: 26, height: 26, borderRadius: '50%', background: COLORS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700}}>✓</div>
          Your course is ready
          <span style={{marginLeft: 'auto', color: '#9DB8FF'}}>Start Module 1 →</span>
        </div>
      </div>

      <ClickRipple x={SEND.x + 10} y={SEND.y + 10} progress={ripple} />
      <Cursor x={cursor.x} y={cursor.y} press={Math.min(press, 1)} opacity={cursorOpacity} />
    </AbsoluteFill>
  );
};

const Pill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      height: 44,
      padding: '0 16px',
      borderRadius: 999,
      border: `1px solid ${COLORS.borderHi}`,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 17,
      background: '#fff',
    }}
  >
    {children}
  </div>
);
