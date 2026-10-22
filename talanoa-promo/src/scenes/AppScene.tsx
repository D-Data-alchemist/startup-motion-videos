import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClickRipple, Cursor, cursorAt} from '../components/Cursor';
import {Avatar, COLORS, EASE, Mark} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {msgs: [26, 40, 54], grab: 80, drop: 112, todoTab: 104, lock: 140, ai: 160};

const WIN = {x: 150, y: 90, w: 1620, h: 900};
const SIDE = 330;
const GROUPS: [string, [string, number?][]][] = [
  ['Teammates', [['Sarah Mitchell', 1], ['David Chen', 1], ['Priya Patel'], ['Alex Kim']]],
  ['Customers', [['Olivia Harper', 1], ['John Chambers'], ['Marcus Webb'], ['Emma Thompson']]],
  ['✨ Leads', []],
];
const MSGS = [
  {side: 'in' as const, t: 'Loved the new onboarding flow 🙌'},
  {side: 'out' as const, t: 'Thank you! Shipping it to everyone Monday.'},
  {side: 'in' as const, t: 'Can you send the deck by Thursday?'},
];
const CARD = {x: WIN.x + SIDE + 70, y: WIN.y + 520};

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 26});
  const exit = interpolate(frame, [180, 195], [0, 1], {...clamp, easing: EASE.in});
  const todo = frame >= APP.todoTab;
  const drag = interpolate(frame, [APP.grab, APP.drop], [0, 1], {...clamp, easing: EASE.inOut});
  const dropped = frame >= APP.drop;
  const land = spring({frame: frame - APP.drop, fps, config: {damping: 12, stiffness: 200}});
  const lock = spring({frame: frame - APP.lock, fps, config: {damping: 15, stiffness: 160}});
  const ai = spring({frame: frame - APP.ai, fps, config: {damping: 15, stiffness: 160}});
  const cam = interpolate(frame, [20, 60, 150, 180], [1, 1.05, 1.05, 1], {...clamp, easing: EASE.inOut});

  const bubbleStart = {x: CARD.x + 40, y: CARD.y + 30};
  const target = {x: WIN.x + SIDE + 110, y: WIN.y + 300};
  const cursor = cursorAt(frame, [
    {f: 50, x: 1700, y: 1080},
    {f: APP.grab - 4, x: bubbleStart.x + 300, y: bubbleStart.y + 10, arc: -40},
    {f: APP.grab, x: bubbleStart.x + 300, y: bubbleStart.y + 10},
    {f: APP.drop, x: target.x + 300, y: target.y + 10, arc: -60},
    {f: 140, x: target.x + 340, y: target.y + 60},
  ]);
  const press = frame >= APP.grab && frame < APP.drop ? 0.6 : 0;

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), filter: `blur(${exit * 10}px)`, transform: `scale(${cam * (1 - exit * 0.05)})`, transformOrigin: '900px 540px'}}>
      <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 20, overflow: 'hidden', background: COLORS.paper, border: `1px solid ${COLORS.line}`, boxShadow: '0 50px 120px rgba(0,0,0,0.18)', transform: `translateY(${(1 - enter) * 80}px) scale(${0.93 + 0.07 * enter})`, color: COLORS.text}}>
        {/* tab bar */}
        <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderBottom: `1px solid ${COLORS.line}`, background: '#FBFBFA'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c}} />
          ))}
          <div style={{display: 'flex', gap: 6, marginLeft: 24, fontSize: 18}}>
            {[
              ['Inbox', !todo],
              ['Todo', todo],
              ['Calendar', false],
            ].map(([t, on]) => (
              <span key={String(t)} style={{position: 'relative', padding: '8px 16px', borderRadius: 10, background: on ? '#fff' : 'transparent', border: `1px solid ${on ? COLORS.line : 'transparent'}`, fontWeight: on ? 600 : 400}}>
                {t}
                {t === 'Todo' && <span style={{position: 'absolute', top: -6, right: -4, minWidth: 20, height: 20, borderRadius: 10, background: COLORS.purple, color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${dropped ? 1 + 0.4 * Math.exp(-(frame - APP.drop) / 4) : 1})`}}>{dropped ? 7 : 6}</span>}
              </span>
            ))}
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: COLORS.muted}}>
            <Mark size={22} /> talanoa
          </div>
        </div>
        {/* people-first sidebar */}
        <div style={{position: 'absolute', left: 0, top: 56, bottom: 0, width: SIDE, borderRight: `1px solid ${COLORS.line}`, padding: '20px 18px', fontSize: 19}}>
          {GROUPS.map(([g, people], gi) => (
            <div key={g} style={{marginBottom: 18}}>
              <div style={{color: COLORS.muted, fontSize: 16, marginBottom: 8}}>{g}</div>
              {people.map(([n, c], i) => {
                const active = n === 'Sarah Mitchell' && !todo;
                return (
                  <div key={n} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: 10, background: active ? '#ECECEA' : 'transparent', fontWeight: active || c ? 600 : 400}}>
                    <Avatar name={n} size={30} i={gi * 4 + i} />
                    <span style={{flex: 1}}>{n}</span>
                    {c && <span style={{color: COLORS.muted, fontSize: 15}}>{c}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {/* Inbox: Sarah's thread as chat */}
        {!todo ? (
          <div style={{position: 'absolute', left: SIDE, right: 0, top: 56, bottom: 0, padding: '26px 44px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 18, borderBottom: `1px solid ${COLORS.line}`}}>
              <Avatar name="Sarah Mitchell" size={46} />
              <div>
                <div style={{fontSize: 22, fontWeight: 700}}>Sarah Mitchell</div>
                <div style={{fontSize: 15, color: COLORS.muted}}>sarah@acme.co · 3 messages</div>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
              {MSGS.map((m, i) => {
                const p = spring({frame: frame - APP.msgs[i], fps, config: {damping: 14, stiffness: 170}});
                const isDragged = i === 2;
                return (
                  <div key={i} style={{alignSelf: m.side === 'in' ? 'flex-start' : 'flex-end', padding: '16px 22px', borderRadius: m.side === 'in' ? '20px 20px 20px 6px' : '20px 20px 6px 20px', background: m.side === 'in' ? COLORS.bubbleIn : COLORS.purple, color: m.side === 'in' ? COLORS.text : '#fff', fontSize: 26, opacity: Math.min(1, p * 1.5) * (isDragged && drag > 0 ? 0.35 : 1), transform: `translateY(${(1 - Math.min(p, 1)) * 24}px)`, outline: isDragged && frame >= APP.grab - 6 ? `2px dashed ${COLORS.purple}` : 'none', outlineOffset: 4}}>
                    {m.t}
                  </div>
                );
              })}
            </div>
            <div style={{position: 'absolute', left: 44, right: 44, bottom: 26, height: 60, borderRadius: 16, border: `1px solid ${COLORS.line}`, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', color: COLORS.muted, fontSize: 19}}>Reply like a chat…</div>
          </div>
        ) : (
          <div style={{position: 'absolute', left: SIDE, right: 0, top: 56, bottom: 0, padding: '26px 34px', display: 'flex', gap: 22}}>
            {['To do', 'Doing', 'Done'].map((col, ci) => (
              <div key={col} style={{flex: 1, borderRadius: 16, background: '#EFEFED', padding: 16}}>
                <div style={{fontSize: 18, fontWeight: 700, marginBottom: 14}}>{col}</div>
                {ci === 0 && dropped && (
                  <div style={{padding: '16px 18px', borderRadius: 14, background: '#fff', border: `2px solid ${COLORS.purple}`, fontSize: 20, marginBottom: 12, transform: `scale(${Math.min(1.04, land)})`}}>
                    Send the deck to Sarah
                    <div style={{display: 'flex', gap: 10, marginTop: 10, fontSize: 15, color: COLORS.muted}}>
                      <span style={{padding: '3px 10px', borderRadius: 8, background: COLORS.purpleSoft, color: COLORS.purple, fontWeight: 600}}>Thu</span>
                      ✉ from email
                    </div>
                  </div>
                )}
                {[['Review Q4 budget', 'Mon'], ['Reply to Olivia', 'Today'], ['Sign NDA', 'Fri']].slice(ci, ci + (ci === 2 ? 1 : 2)).map(([t, d]) => (
                  <div key={t} style={{padding: '16px 18px', borderRadius: 14, background: '#fff', border: `1px solid ${COLORS.line}`, fontSize: 20, marginBottom: 12, opacity: ci === 2 ? 0.6 : 1}}>
                    {t}
                    <div style={{marginTop: 8, fontSize: 15, color: COLORS.muted}}>{d}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* bubble being dragged */}
      {frame >= APP.grab && frame < APP.drop + 2 && (
        <div style={{position: 'absolute', left: bubbleStart.x + (target.x - bubbleStart.x) * drag, top: bubbleStart.y + (target.y - bubbleStart.y) * drag - Math.sin(drag * Math.PI) * 80, padding: '16px 22px', borderRadius: '20px 20px 20px 6px', background: '#fff', border: `2px solid ${COLORS.purple}`, fontSize: 26, boxShadow: '0 30px 60px rgba(128,34,254,0.25)', transform: `rotate(${Math.sin(drag * Math.PI) * -4}deg) scale(1.04)`}}>
          Can you send the deck by Thursday?
        </div>
      )}

      {/* Feature chips */}
      <div style={{position: 'absolute', left: '50%', bottom: 36, transform: 'translateX(-50%)', display: 'flex', gap: 18}}>
        {[
          {p: lock, t: '🔒 Local-only. No tracking. No cloud sync.'},
          {p: ai, t: '✦ Private, on-device AI'},
        ].map((c) => (
          <div key={c.t} style={{padding: '16px 26px', borderRadius: 14, background: COLORS.ink, color: '#fff', fontSize: 24, fontWeight: 500, opacity: Math.min(1, c.p), transform: `translateY(${(1 - Math.min(c.p, 1)) * 40}px)`, boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
            {c.t}
          </div>
        ))}
      </div>
      <ClickRipple x={target.x + 304} y={target.y + 14} progress={interpolate(frame, [APP.drop, APP.drop + 18], [0, 1], clamp)} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [50, 58, 150, 160], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
