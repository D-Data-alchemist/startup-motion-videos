import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {AppFrame, WIN, BAR_H} from '../components/AppFrame';
import {Cursor, ClickRipple, cursorAt} from '../components/Cursor';
import {COLORS, EASE, handFamily, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_explainer.py
export const LEARN = {highlight: 85, answer: [118, 200], question: 205, inputClick: 240, type: [244, 280], click: 288};

const INK = '#1F1F1F';
const PURPLE = '#6D4AFF';
const MARKER = '#FFF1A8';

// Whiteboard layout (window-relative). Chat panel matches the real "Chat history" sidebar.
const BOARD_TOP = BAR_H + 100;
const COL_X = [40, 420, 790];
const LINE_H = 54;
const CHAT = {x: 1176, w: 410};
const INPUT = {x: WIN.x + CHAT.x + 90, y: WIN.y + WIN.h - 14 - 16 - 28};
const SEND = {x: WIN.x + CHAT.x + CHAT.w - 46, y: INPUT.y};

type Line = {k: 'h' | 't' | 'b' | 'c' | 'gap'; s?: string; label?: string; indent?: boolean};
const COLS: {start: number; lines: Line[]}[] = [
  {
    start: 8,
    lines: [
      {k: 'h', s: 'Course Map'},
      {k: 't', s: 'Unit: Databases'},
      {k: 't', s: 'Session: First Index'},
      {k: 't', s: 'Find users fast', indent: true},
      {k: 't', s: 'Read a query plan', indent: true},
      {k: 't', s: 'Know the trade-offs', indent: true},
      {k: 'h', s: 'The Problem'},
      {k: 'b', label: 'Seq Scan', s: 'reads all rows'},
      {k: 'b', label: '10M rows', s: '10M checks'},
    ],
  },
  {
    start: 40,
    lines: [
      {k: 'h', s: 'Create an Index'},
      {k: 'c', s: 'CREATE INDEX idx_email'},
      {k: 'c', s: '  ON users (email);'},
      {k: 'gap'},
      {k: 'c', s: 'SELECT * FROM users'},
      {k: 'c', s: "WHERE email = 'ada@…';"},
      {k: 'b', label: 'idx_email', s: 'a sorted B-tree'},
      {k: 'h', s: 'Query Plan'},
      {k: 'c', s: 'Index Scan using idx_email'},
    ],
  },
  {
    start: 92,
    lines: [
      {k: 'h', s: 'Behind the Scenes'},
      {k: 't', s: 'The Lookup Cycle'},
      {k: 'b', label: 'Query', s: 'asks for a row', indent: true},
      {k: 'b', label: 'B-tree', s: 'jumps root → leaf', indent: true},
      {k: 'b', label: 'Page', s: 'holds the match', indent: true},
      {k: 'b', label: 'Row', s: 'back in ~4 steps', indent: true},
      {k: 'h', s: 'Trade-off'},
      {k: 'b', label: 'Reads', s: 'much faster ⚡', indent: true},
      {k: 'b', label: 'Writes', s: 'a bit slower', indent: true},
    ],
  },
];
const LINE_FRAMES = 6; // handwriting speed

const MSG1 = 'An index is a sorted lookup table Postgres keeps next to your data — like the index at the back of a book.';
const MSG2 = "That's why the query on the board jumps straight to Ada's row instead of scanning all 10M.";
const QUESTION = 'Quick check: what do you think happens to write speed when you add an index?';
const REPLY = 'Writes get a bit slower, since the index updates too';

const Stream: React.FC<{text: string; from: number; to: number}> = ({text, from, to}) => {
  const frame = useCurrentFrame();
  return <>{text.slice(0, Math.floor(interpolate(frame, [from, to], [0, text.length], clamp)))}</>;
};

export const LearnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const circle = interpolate(frame, [72, 94], [0, 1], {...clamp, easing: EASE.out});
  const sent = frame >= LEARN.click + 2;
  const bubble = spring({frame: frame - (LEARN.click + 2), fps, config: {damping: 16, stiffness: 160}});
  const praise = spring({frame: frame - (LEARN.click + 14), fps, config: {damping: 14, stiffness: 160}});
  const typed = REPLY.slice(0, Math.floor(interpolate(frame, LEARN.type, [0, REPLY.length], clamp)));
  const q = spring({frame: frame - LEARN.question, fps, config: {damping: 16}});
  const boardHl = interpolate(frame, [LEARN.click + 16, LEARN.click + 32], [0, 1], {...clamp, easing: EASE.out});

  const cursor = cursorAt(frame, [
    {f: 216, x: 1720, y: 1080},
    {f: 238, x: INPUT.x, y: INPUT.y, arc: -40},
    {f: 276, x: INPUT.x, y: INPUT.y},
    {f: 286, x: SEND.x, y: SEND.y, arc: -20},
    {f: 330, x: SEND.x - 60, y: SEND.y - 120},
  ]);
  const press =
    interpolate(frame, [LEARN.inputClick - 3, LEARN.inputClick, LEARN.inputClick + 4], [0, 0.7, 0], clamp) +
    interpolate(frame, [LEARN.click - 4, LEARN.click, LEARN.click + 6], [0, 1, 0], clamp);

  const label = (icon: string, text: string, at: number) => {
    const p = interpolate(frame, [at, at + 10], [0, 1], clamp);
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: COLORS.muted, opacity: p}}>
        <span>{icon}</span>
        {text}
      </div>
    );
  };

  return (
    <AppFrame
      active=""
      sidebar={false}
      exitAt={338}
      cam={interpolate(frame, [0, 360], [1, 1.04])}
      overlay={
        <>
          <ClickRipple x={SEND.x + 4} y={SEND.y + 8} progress={interpolate(frame, [LEARN.click, LEARN.click + 20], [0, 1], clamp)} />
          <Cursor x={cursor.x} y={cursor.y} press={Math.min(press, 1)} opacity={interpolate(frame, [216, 224], [0, 1], clamp)} />
        </>
      }
    >
      {/* Whiteboard surface */}
      <div style={{position: 'absolute', left: 0, top: BAR_H, right: CHAT.w + 24, bottom: 0, background: '#FFFFFF'}} />

      {/* Session toolbar */}
      <div style={{position: 'absolute', left: 24, top: BAR_H + 22, display: 'flex', gap: 12}}>
        <ToolPill>✕</ToolPill>
        <ToolPill>
          <span style={{fontWeight: 600}}>Your First PostgreSQL Index</span>
        </ToolPill>
      </div>
      <div style={{position: 'absolute', left: 560, top: BAR_H + 22}}>
        <ToolPill>
          <span style={{color: COLORS.muted}}>–</span> 100% <span style={{color: COLORS.muted}}>+</span>
          <span style={{color: '#ddd', margin: '0 6px'}}>|</span>
          <span style={{color: COLORS.muted}}>‹</span> 1/1 <span style={{color: COLORS.muted}}>›</span>
          <span style={{marginLeft: 8, fontSize: 11, fontWeight: 700, color: COLORS.accent, background: '#EAF0FF', padding: '2px 6px', borderRadius: 6}}>BETA</span>
        </ToolPill>
      </div>

      {/* Handwritten board */}
      {COLS.map((col, ci) => {
        let y = BOARD_TOP;
        return col.lines.map((l, li) => {
          const top = y;
          y += l.k === 'h' ? LINE_H + 18 : l.k === 'gap' ? 20 : LINE_H;
          if (l.k === 'gap') return null;
          const at = col.start + li * LINE_FRAMES;
          const w = interpolate(frame, [at, at + LINE_FRAMES + 4], [0, 100], clamp);
          const isTradeoff = ci === 2 && l.label === 'Writes';
          return (
            <div
              key={`${ci}-${li}`}
              style={{
                position: 'absolute',
                left: COL_X[ci] + (l.indent ? 24 : 0) + (l.k === 'h' ? (ci === 2 ? 24 : 60) : 0),
                top: top + (l.k === 'h' ? 10 : 0),
                whiteSpace: 'nowrap',
                clipPath: `inset(-10px ${100 - w}% -10px -10px)`,
                fontFamily: l.k === 'c' ? monoFamily : handFamily,
                fontSize: l.k === 'h' ? 38 : l.k === 'c' ? 21 : 27,
                color: l.k === 'h' ? PURPLE : INK,
                ...(l.k === 'h' ? {backgroundImage: `linear-gradient(${MARKER}, ${MARKER})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 90%', backgroundSize: '100% 40%'} : {}),
                ...(isTradeoff ? {backgroundImage: `linear-gradient(${MARKER}, ${MARKER})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 80%', backgroundSize: `${boardHl * 100}% 50%`} : {}),
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
        });
      })}

      {/* Red marker circle on the key line */}
      <svg style={{position: 'absolute', left: COL_X[1] - 22, top: BOARD_TOP + LINE_H + 12, overflow: 'visible'}} width="320" height="56">
        <ellipse
          cx="160"
          cy="26"
          rx="166"
          ry="28"
          fill="none"
          stroke="#C2410C"
          strokeWidth="2.5"
          strokeDasharray="760"
          strokeDashoffset={760 * (1 - circle)}
          transform="rotate(-2 160 26)"
        />
      </svg>

      {/* Chat history */}
      <div
        style={{
          position: 'absolute',
          left: CHAT.x,
          top: BAR_H + 14,
          width: CHAT.w,
          bottom: 14,
          borderRadius: 18,
          background: '#fff',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 10px 30px rgba(17,17,17,0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{padding: '20px 22px', fontSize: 19, fontWeight: 600, display: 'flex', gap: 10, borderBottom: `1px solid ${COLORS.border}`}}>
          💬 Chat history <span style={{marginLeft: 'auto', color: COLORS.muted, fontWeight: 400}}>✕</span>
        </div>
        <div style={{flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14, overflow: 'hidden', fontSize: 17, lineHeight: 1.55, color: '#444'}}>
          {label('✎', 'Board note', 28)}
          <div>
            <Stream text={MSG1} from={30} to={78} />
          </div>
          {frame >= LEARN.highlight && label('✐', 'Highlight', LEARN.highlight)}
          {frame >= LEARN.answer[0] && (
            <div>
              <Stream text={MSG2} from={LEARN.answer[0]} to={LEARN.answer[1]} />
            </div>
          )}
          {frame >= LEARN.question && (
            <div style={{color: COLORS.text, fontWeight: 500, opacity: Math.min(q, 1), transform: `translateY(${(1 - Math.min(q, 1)) * 14}px)`}}>{QUESTION}</div>
          )}
          {sent && (
            <div style={{alignSelf: 'flex-end', maxWidth: 320, background: '#F2F2EF', color: COLORS.text, padding: '10px 14px', borderRadius: '14px 14px 4px 14px', opacity: Math.min(bubble, 1), transform: `translateY(${(1 - Math.min(bubble, 1)) * 14}px)`}}>
              {REPLY}
            </div>
          )}
          {frame >= LEARN.click + 14 && (
            <div style={{color: COLORS.text, opacity: Math.min(praise, 1), transform: `translateY(${(1 - Math.min(praise, 1)) * 14}px)`}}>
              <span style={{color: COLORS.success, fontWeight: 700}}>✓ You nailed it!</span> Writes pay a small cost so reads can fly — I've highlighted it on the board.
            </div>
          )}
        </div>
        <div style={{margin: '0 16px 16px', height: 56, borderRadius: 999, border: `1px solid ${frame >= LEARN.inputClick && !sent ? 'rgba(59,108,246,0.45)' : COLORS.borderHi}`, display: 'flex', alignItems: 'center', padding: '0 8px 0 18px', gap: 10, fontSize: 16}}>
          <span style={{color: COLORS.muted, fontSize: 20}}>＋</span>
          <span style={{flex: 1, color: typed && !sent ? COLORS.text : COLORS.muted, whiteSpace: 'nowrap', overflow: 'hidden'}}>{!sent && typed ? typed : 'Ask a question…'}</span>
          <span style={{fontSize: 18, color: '#E11D48'}}>🎙</span>
          <div style={{width: 40, height: 40, borderRadius: '50%', background: typed && !sent ? COLORS.text : '#E8E8E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18}}>↑</div>
        </div>
      </div>
    </AppFrame>
  );
};

const ToolPill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{height: 50, padding: '0 18px', borderRadius: 999, background: '#fff', border: `1px solid ${COLORS.borderHi}`, boxShadow: '0 4px 14px rgba(17,17,17,0.05)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 18}}>
    {children}
  </div>
);
