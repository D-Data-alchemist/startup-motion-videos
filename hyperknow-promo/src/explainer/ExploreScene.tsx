import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {AppFrame, WIN} from '../components/AppFrame';
import {Cursor, ClickRipple, cursorAt} from '../components/Cursor';
import {COLORS, EASE, serifFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const EXPLORE = {click: 170};

const COURSES = [
  {t: 'Introduction to Sociology', bg: '#F1EEE6', icon: '🏛️'},
  {t: 'AP Biology', bg: '#F2F4D6', icon: '🧬'},
  {t: 'Machine Learning', bg: '#F2E6D8', icon: '🤖'},
  {t: 'Organic Chemistry', bg: '#E4EDF7', icon: '⚗️'},
  {t: 'World History', bg: '#EFE6F3', icon: '🌍'},
  {t: 'Linear Algebra', bg: '#E5F2EB', icon: '📐'},
];
const COLS = [290, 720, 1150];
const ROWS = [150, 500];
const CW = 410;
const CH = 320;
const ENROLL = {x: WIN.x + COLS[1] + CW - 20 - 60, y: WIN.y + ROWS[0] + CH - 20 - 21};

export const ExploreScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enrolled = frame >= EXPLORE.click + 2;
  const badge = spring({frame: frame - EXPLORE.click, fps, config: {damping: 12, stiffness: 200}});
  const hover = interpolate(frame, [120, 135], [0, 1], clamp);
  const lms = spring({frame: frame - 30, fps, config: {damping: 16}});

  const cursor = cursorAt(frame, [
    {f: 90, x: 1700, y: 1080},
    {f: 162, x: ENROLL.x, y: ENROLL.y, arc: -60},
    {f: 230, x: ENROLL.x + 40, y: ENROLL.y + 60},
  ]);
  const press = interpolate(frame, [EXPLORE.click - 4, EXPLORE.click, EXPLORE.click + 6], [0, 1, 0], clamp);

  return (
    <AppFrame
      active="Marketplace"
      exitAt={232}
      cam={interpolate(frame, [0, 255], [1, 1.05])}
      overlay={
        <>
          <ClickRipple x={ENROLL.x + 4} y={ENROLL.y + 8} progress={interpolate(frame, [EXPLORE.click, EXPLORE.click + 20], [0, 1], clamp)} />
          <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [90, 98], [0, 1], clamp)} />
        </>
      }
    >
      <div style={{position: 'absolute', left: COLS[0], top: 78, right: 40, display: 'flex', alignItems: 'center'}}>
        <span style={{fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em'}}>Marketplace</span>
        <span
          style={{
            marginLeft: 'auto',
            padding: '10px 18px',
            borderRadius: 999,
            background: '#fff',
            border: `1px solid ${COLORS.borderHi}`,
            fontSize: 17,
            opacity: Math.min(lms, 1),
            transform: `scale(${0.9 + 0.1 * Math.min(lms, 1)})`,
          }}
        >
          ⤓ Import from your school's LMS
        </span>
      </div>
      {COURSES.map((c, i) => {
        const a = interpolate(frame, [8 + i * 6, 30 + i * 6], [0, 1], {...clamp, easing: EASE.out});
        const isTarget = i === 1;
        return (
          <div
            key={c.t}
            style={{
              position: 'absolute',
              left: COLS[i % 3],
              top: ROWS[Math.floor(i / 3)],
              width: CW,
              height: CH,
              borderRadius: 18,
              overflow: 'hidden',
              background: '#fff',
              border: `1px solid ${isTarget && hover ? `rgba(59,108,246,${0.3 + hover * 0.5})` : COLORS.border}`,
              boxShadow: isTarget && hover ? `0 0 0 ${hover * 4}px rgba(59,108,246,0.10), 0 20px 40px rgba(17,17,17,0.08)` : '0 10px 26px rgba(17,17,17,0.05)',
              opacity: a,
              transform: `translateY(${(1 - a) * 30 - (isTarget ? hover * 6 : 0)}px)`,
            }}
          >
            <div style={{height: 180, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 84, position: 'relative'}}>
              {c.icon}
              {isTarget && enrolled && (
                <div style={{position: 'absolute', top: 14, right: 14, padding: '6px 12px', borderRadius: 8, background: COLORS.success, color: '#fff', fontSize: 15, fontWeight: 700, transform: `scale(${Math.max(badge, 0)})`}}>
                  ✓ Enrolled
                </div>
              )}
            </div>
            <div style={{padding: '16px 20px'}}>
              <div style={{fontSize: 15, color: COLORS.muted}}>Hyperknow Learning Lab <span style={{color: COLORS.accent}}>✓</span></div>
              <div style={{fontFamily: serifFamily, fontSize: 28, marginTop: 6}}>{c.t}</div>
            </div>
            <div
              style={{
                position: 'absolute',
                right: 20,
                bottom: 20,
                width: 120,
                height: 42,
                borderRadius: 999,
                background: isTarget && enrolled ? 'rgba(22,163,74,0.1)' : COLORS.text,
                color: isTarget && enrolled ? COLORS.success : '#fff',
                fontSize: 16,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isTarget ? `scale(${1 - press * 0.08})` : undefined,
              }}
            >
              {isTarget && enrolled ? 'Start →' : 'Enroll'}
            </div>
          </div>
        );
      })}
    </AppFrame>
  );
};
