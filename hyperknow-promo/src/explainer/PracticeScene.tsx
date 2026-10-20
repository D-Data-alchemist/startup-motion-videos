import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {AppFrame, WIN} from '../components/AppFrame';
import {Cursor, ClickRipple, cursorAt} from '../components/Cursor';
import {COLORS, EASE, serifFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_explainer.py
export const PRACTICE = {flip1: 40, click1: 95, flip2: 140, click2: 195, ringDone: 232};

const CARD = {cx: 560, cy: 400, w: 620, h: 360}; // window-relative center
const GOT_IT = {x: WIN.x + CARD.cx + 110, y: WIN.y + CARD.cy + CARD.h / 2 + 70};
const CARDS = [
  {q: 'What does an index do?', a: 'Lets Postgres find rows without scanning the whole table.'},
  {q: 'Why is a B-tree lookup fast?', a: 'Sorted keys in a shallow tree — about 4 page reads for 10M rows.'},
];

export const PracticeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = interpolate(frame, [40, PRACTICE.ringDone], [0, 0.92], {...clamp, easing: EASE.inOut});
  const chip1 = spring({frame: frame - 120, fps, config: {damping: 16}});
  const chip2 = spring({frame: frame - 160, fps, config: {damping: 16}});
  const done = spring({frame: frame - (PRACTICE.click2 + 22), fps, config: {damping: 14}});

  const cursor = cursorAt(frame, [
    {f: 60, x: 1700, y: 1080},
    {f: 90, x: GOT_IT.x, y: GOT_IT.y, arc: -50},
    {f: 190, x: GOT_IT.x, y: GOT_IT.y},
    {f: 240, x: 1380, y: 760, arc: -40},
  ]);
  const press =
    interpolate(frame, [PRACTICE.click1 - 4, PRACTICE.click1, PRACTICE.click1 + 6], [0, 1, 0], clamp) +
    interpolate(frame, [PRACTICE.click2 - 4, PRACTICE.click2, PRACTICE.click2 + 6], [0, 1, 0], clamp);
  const ripple = (c: number) => interpolate(frame, [c, c + 20], [0, 1], clamp);
  const R = 110;
  const C = 2 * Math.PI * R;

  return (
    <AppFrame
      active="Learning Feed"
      exitAt={278}
      overlay={
        <>
          <ClickRipple x={GOT_IT.x + 4} y={GOT_IT.y + 8} progress={ripple(PRACTICE.click1)} />
          <ClickRipple x={GOT_IT.x + 4} y={GOT_IT.y + 8} progress={ripple(PRACTICE.click2)} />
          <Cursor x={cursor.x} y={cursor.y} press={Math.min(press, 1)} opacity={interpolate(frame, [60, 68], [0, 1], clamp)} />
        </>
      }
    >
      <div style={{position: 'absolute', left: 280, top: 80, fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em'}}>
        Daily review <span style={{fontSize: 18, color: COLORS.muted, fontWeight: 400}}>· PostgreSQL · Module 3</span>
      </div>

      {/* Flashcards */}
      {CARDS.map((c, i) => {
        const flipAt = i === 0 ? PRACTICE.flip1 : PRACTICE.flip2;
        const leaveAt = i === 0 ? PRACTICE.click1 : PRACTICE.click2;
        const enter = i === 0 ? spring({frame: frame - 10, fps, config: {damping: 16}}) : spring({frame: frame - (PRACTICE.click1 + 8), fps, config: {damping: 16}});
        const flip = interpolate(frame, [flipAt, flipAt + 20], [0, 180], {...clamp, easing: EASE.inOut});
        const leave = interpolate(frame, [leaveAt + 2, leaveAt + 22], [0, 1], {...clamp, easing: EASE.in});
        const face = (back: boolean): React.CSSProperties => ({
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          background: back ? '#FFFDF5' : '#fff',
          border: `1px solid ${COLORS.borderHi}`,
          boxShadow: '0 24px 60px rgba(17,17,17,0.10)',
          backfaceVisibility: 'hidden',
          transform: back ? 'rotateY(180deg)' : undefined,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 50,
          textAlign: 'center',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CARD.cx - CARD.w / 2,
              top: CARD.cy - CARD.h / 2,
              width: CARD.w,
              height: CARD.h,
              perspective: 1600,
              opacity: Math.min(enter, 1) * (1 - leave),
              transform: `translateX(${leave * 500}px) rotate(${leave * 12}deg) scale(${0.9 + 0.1 * Math.min(enter, 1)})`,
            }}
          >
            <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${flip}deg)`}}>
              <div style={face(false)}>
                <div style={{fontSize: 15, color: COLORS.muted, letterSpacing: '0.06em'}}>CARD {i + 1} OF 48</div>
                <div style={{fontFamily: serifFamily, fontSize: 40, marginTop: 18, lineHeight: 1.2}}>{c.q}</div>
              </div>
              <div style={face(true)}>
                <div style={{fontSize: 15, color: COLORS.accent, letterSpacing: '0.06em', fontWeight: 600}}>ANSWER</div>
                <div style={{fontFamily: serifFamily, fontSize: 32, marginTop: 18, lineHeight: 1.3}}>{c.a}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: CARD.cx - CARD.w / 2, top: CARD.cy - CARD.h / 2, width: CARD.w, height: CARD.h, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(done, 1), transform: `scale(${0.9 + 0.1 * Math.min(done, 1)})`}}>
        <div style={{fontSize: 30, fontWeight: 600, color: COLORS.success}}>✓ Review complete · 48/48</div>
      </div>

      {/* Buttons */}
      <div style={{position: 'absolute', left: CARD.cx - 230, top: CARD.cy + CARD.h / 2 + 40, display: 'flex', gap: 20}}>
        {['Again', 'Got it'].map((b, i) => (
          <div
            key={b}
            style={{
              width: 210,
              height: 60,
              borderRadius: 999,
              background: i ? COLORS.text : '#fff',
              color: i ? '#fff' : COLORS.text,
              border: `1px solid ${COLORS.borderHi}`,
              fontSize: 20,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: i ? `scale(${1 - Math.min(press, 1) * 0.06})` : undefined,
            }}
          >
            {b}
          </div>
        ))}
      </div>

      {/* Mastery ring */}
      <div style={{position: 'absolute', left: 1040, top: 130, width: 520, height: 650, borderRadius: 20, background: '#fff', border: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, gap: 18}}>
        <div style={{fontSize: 18, color: COLORS.muted}}>Module 3 mastery</div>
        <div style={{position: 'relative', width: 280, height: 280}}>
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r={R} fill="none" stroke="#EEE" strokeWidth="18" />
            <circle
              cx="140"
              cy="140"
              r={R}
              fill="none"
              stroke={frame >= PRACTICE.ringDone ? COLORS.success : COLORS.accent}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ring)}
              transform="rotate(-90 140 140)"
            />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, fontWeight: 600, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums'}}>
            {Math.round(ring * 100)}%
          </div>
        </div>
        {[
          {t: '🔥 7-day learning streak', p: chip1},
          {t: '🗓️ Next review · Tomorrow, 9:00 AM', p: chip2},
        ].map((c) => (
          <div key={c.t} style={{padding: '12px 20px', borderRadius: 999, background: '#F6F6F3', border: `1px solid ${COLORS.border}`, fontSize: 18, opacity: Math.min(c.p, 1), transform: `translateY(${(1 - Math.min(c.p, 1)) * 16}px)`}}>
            {c.t}
          </div>
        ))}
      </div>
    </AppFrame>
  );
};
