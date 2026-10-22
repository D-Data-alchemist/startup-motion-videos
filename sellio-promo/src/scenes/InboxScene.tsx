import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChannelBadge, Channel, COLORS, EASE, Icon, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const INBOX = {new1: 24, msg1: 32, typing: [40, 52], ai1: [52, 80], cite: 82, resolved: 92, new2: 104, msg2: 112, ai2: 124, handoff: 138, human: 150, toast: 172};

const WIN = {x: 150, y: 90, w: 1620, h: 900};
const RAIL = 72;
const SIDE = 250;
const LIST = 440;

const AV = ['#F4C9A8', '#C9D6FF', '#D7F0E2', '#F5D0E0', '#E9DDFB', '#FDE7B0'];
type Row = {name: string; ch: Channel; text: string; time: string; status: 'ai' | 'done' | 'open'; c: number};
const BASE: Row[] = [
  {name: 'William Chen', ch: 'web', text: 'I’m glad to hear you’re excited!', time: '1m', status: 'done', c: 0},
  {name: 'Khalid Nouri', ch: 'whatsapp', text: 'Nothing thank you!', time: '2d', status: 'done', c: 1},
  {name: 'Hyun Korama', ch: 'telegram', text: 'hi', time: '2d', status: 'open', c: 2},
  {name: 'Nicole Taylor', ch: 'email', text: 'Khalid Nouri took control of the chat', time: '1w', status: 'done', c: 3},
  {name: 'Matthew Jackson', ch: 'instagram', text: 'Hi', time: '2w', status: 'open', c: 4},
  {name: 'Ryan Miller', ch: 'web', text: 'Thanks so much', time: '4w', status: 'done', c: 5},
];
const NEW1: Row = {name: 'Amara Okafor', ch: 'whatsapp', text: 'Hi! Do you ship to Lagos?', time: 'now', status: 'ai', c: 2};
const NEW2: Row = {name: 'Daniel Miller', ch: 'instagram', text: 'I want a refund for order #4821', time: 'now', status: 'open', c: 4};
const AI1 = 'Yes! We ship to Lagos in 3–5 business days, and shipping is free on orders over $50.';

const Avatar: React.FC<{row: Row; size?: number}> = ({row, size = 46}) => (
  <div style={{position: 'relative', width: size, height: size, flexShrink: 0}}>
    <div style={{width: size, height: size, borderRadius: '50%', background: AV[row.c], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.4, color: COLORS.text}}>{row.name[0]}</div>
    <span style={{position: 'absolute', right: -4, bottom: -4}}>
      <ChannelBadge ch={row.ch} size={20} />
    </span>
  </div>
);

const Bubble: React.FC<{side: 'in' | 'out'; who?: string; children: React.ReactNode; p: number; color?: string}> = ({side, who, children, p, color}) => (
  <div style={{alignSelf: side === 'in' ? 'flex-start' : 'flex-end', maxWidth: 560, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - Math.min(p, 1)) * 18}px)`}}>
    {who && <div style={{fontSize: 15, color: COLORS.muted, margin: side === 'in' ? '0 0 6px 4px' : '0 4px 6px 0', textAlign: side === 'in' ? 'left' : 'right'}}>{who}</div>}
    <div style={{padding: '14px 18px', borderRadius: side === 'in' ? '18px 18px 18px 6px' : '18px 18px 6px 18px', background: color ?? (side === 'in' ? COLORS.soft : COLORS.orange), color: side === 'in' ? COLORS.text : '#fff', fontSize: 21, lineHeight: 1.45}}>{children}</div>
  </div>
);

export const InboxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 26});
  const exit = interpolate(frame, [194, 210], [0, 1], {...clamp, easing: EASE.in});
  const cam = interpolate(frame, [30, 60, 160, 190], [1, 1.07, 1.07, 1.0], {...clamp, easing: EASE.inOut});
  const sp = (at: number) => spring({frame: frame - at, fps, config: {damping: 15, stiffness: 160}});
  const second = frame >= INBOX.msg2 - 4;
  const aiText = AI1.slice(0, Math.floor(interpolate(frame, INBOX.ai1, [0, AI1.length], clamp)));
  const aiResolved = 28 + (frame >= INBOX.resolved ? 1 : 0);
  const aiRouted = 29 + (frame >= INBOX.handoff ? 1 : 0);
  const rows: Row[] = [
    ...(frame >= INBOX.new2 ? [NEW2] : []),
    ...(frame >= INBOX.new1 ? [{...NEW1, status: frame >= INBOX.resolved ? ('done' as const) : ('ai' as const)}] : []),
    ...BASE,
  ].slice(0, 7);
  const toast = sp(INBOX.toast);

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), filter: `blur(${exit * 12}px)`, transform: `scale(${cam * (1 - exit * 0.06)})`, transformOrigin: '1300px 520px'}}>
      <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 22, overflow: 'hidden', background: '#fff', border: `1px solid ${COLORS.line}`, boxShadow: '0 50px 120px rgba(25,25,25,0.16)', transform: `translateY(${(1 - enter) * 80}px) scale(${0.92 + 0.08 * enter})`, display: 'flex', color: COLORS.text}}>
        {/* icon rail */}
        <div style={{width: RAIL, borderRight: `1px solid ${COLORS.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, paddingTop: 18, background: '#FCFCFC'}}>
          <Icon size={42} style={{borderRadius: 11}} />
          {['▤', '▥', '☺', '⚙', '✦'].map((g, i) => (
            <span key={i} style={{fontSize: 22, color: i === 0 ? COLORS.orange : '#9AA0AC'}}>{g}</span>
          ))}
        </div>
        {/* sidebar */}
        <div style={{width: SIDE, borderRight: `1px solid ${COLORS.line}`, padding: '20px 14px', fontSize: 18}}>
          <div style={{fontSize: 24, fontWeight: 700, marginBottom: 14, paddingLeft: 8}}>Inbox</div>
          {[
            ['Your inbox', 44],
            ['All', 61 + (frame >= INBOX.new1 ? 1 : 0) + (frame >= INBOX.new2 ? 1 : 0)],
            ['Unread', 16],
            ['Unassigned', 17],
            ['Mentions', ''],
            ['Resolved', 4],
          ].map(([k, v], i) => (
            <div key={k} style={{display: 'flex', justifyContent: 'space-between', padding: '9px 10px', borderRadius: 10, background: i === 1 ? COLORS.soft : 'transparent', fontWeight: i === 1 ? 600 : 400}}>
              <span>{k}</span>
              <span style={{color: COLORS.muted}}>{v}</span>
            </div>
          ))}
          <div style={{fontSize: 14, color: COLORS.muted, margin: '22px 10px 8px'}}>AI agent</div>
          {[
            ['AI resolved', aiResolved, frame >= INBOX.resolved && frame < INBOX.resolved + 30],
            ['AI routed', aiRouted, frame >= INBOX.handoff && frame < INBOX.handoff + 30],
            ['AI spam', '', false],
          ].map(([k, v, hot]) => (
            <div key={String(k)} style={{display: 'flex', justifyContent: 'space-between', padding: '9px 10px', borderRadius: 10, background: hot ? COLORS.orangeSoft : 'transparent', color: hot ? COLORS.orangeDeep : COLORS.text, fontWeight: hot ? 700 : 400}}>
              <span>{k}</span>
              <span style={{fontVariantNumeric: 'tabular-nums'}}>{v}</span>
            </div>
          ))}
        </div>
        {/* conversation list */}
        <div style={{width: LIST, borderRight: `1px solid ${COLORS.line}`, padding: '20px 12px'}}>
          <div style={{fontSize: 24, fontWeight: 700, padding: '0 10px 12px'}}>All</div>
          {rows.map((r, i) => {
            const isNew = r === NEW2 || r.name === NEW1.name;
            const inP = isNew ? sp(r === NEW2 ? INBOX.new2 : INBOX.new1) : 1;
            const active = (r.name === NEW1.name && !second) || (r === NEW2 && second);
            return (
              <div key={r.name} style={{display: 'flex', gap: 14, alignItems: 'center', padding: '12px 10px', borderRadius: 14, background: active ? COLORS.orangeSoft : 'transparent', borderLeft: `3px solid ${active ? COLORS.orange : 'transparent'}`, opacity: Math.min(1, inP), transform: `translateX(${(1 - Math.min(inP, 1)) * -60}px)`, marginBottom: 2}}>
                <Avatar row={r} />
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600}}>
                    {r.name}
                    <span style={{fontWeight: 400, color: COLORS.muted, fontSize: 15}}>{r.time}</span>
                  </div>
                  <div style={{fontSize: 16, color: COLORS.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2}}>{r.text}</div>
                </div>
                <span style={{width: 22, height: 22, borderRadius: '50%', fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.status === 'done' ? COLORS.green : r.status === 'ai' ? COLORS.orange : COLORS.red}}>{r.status === 'done' ? '✓' : r.status === 'ai' ? '✦' : '→'}</span>
              </div>
            );
          })}
        </div>
        {/* thread */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <div style={{height: 76, borderBottom: `1px solid ${COLORS.line}`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px'}}>
            {frame >= INBOX.new1 && <Avatar row={second ? NEW2 : NEW1} size={40} />}
            <div style={{fontSize: 20, fontWeight: 700}}>{frame >= INBOX.new1 ? (second ? NEW2.name : NEW1.name) : ''}</div>
            {frame >= INBOX.resolved && !second && <span style={{marginLeft: 'auto', padding: '6px 14px', borderRadius: 999, background: '#E7F8EF', color: COLORS.green, fontWeight: 700, fontSize: 16, transform: `scale(${sp(INBOX.resolved)})`}}>✓ AI resolved</span>}
            {second && frame >= INBOX.handoff && <span style={{marginLeft: 'auto', padding: '6px 14px', borderRadius: 999, background: COLORS.orangeSoft, color: COLORS.orangeDeep, fontWeight: 700, fontSize: 16, transform: `scale(${sp(INBOX.handoff)})`}}>↪ AI routed to Nicole</span>}
          </div>
          <div style={{flex: 1, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'flex-start'}}>
            {!second ? (
              <>
                {frame >= INBOX.msg1 && <Bubble side="in" who="Amara · WhatsApp" p={sp(INBOX.msg1)}>Hi! Do you ship to Lagos? 🇳🇬</Bubble>}
                {frame >= INBOX.typing[0] && frame < INBOX.typing[1] && (
                  <div style={{alignSelf: 'flex-end', display: 'flex', gap: 6, padding: '16px 20px', borderRadius: 18, background: COLORS.orangeSoft}}>
                    {[0, 1, 2].map((d) => (
                      <span key={d} style={{width: 9, height: 9, borderRadius: '50%', background: COLORS.orange, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame - d * 4) / 5))}} />
                    ))}
                  </div>
                )}
                {frame >= INBOX.ai1[0] && (
                  <Bubble side="out" who="✦ AI agent · answered in 4s" p={sp(INBOX.ai1[0])}>
                    {aiText}
                    {frame >= INBOX.cite && <div style={{marginTop: 10, display: 'inline-block', fontSize: 15, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.25)', transform: `scale(${sp(INBOX.cite)})`}}>📄 Source: Shipping FAQ</div>}
                  </Bubble>
                )}
              </>
            ) : (
              <>
                <Bubble side="in" who="Daniel · Instagram" p={sp(INBOX.msg2)}>I want a refund for order #4821</Bubble>
                {frame >= INBOX.ai2 && <Bubble side="out" who="✦ AI agent" p={sp(INBOX.ai2)}>Refunds need a teammate — bringing one in now, with the full context.</Bubble>}
                {frame >= INBOX.handoff && <div style={{alignSelf: 'center', fontSize: 16, color: COLORS.muted, fontFamily: monoFamily, opacity: Math.min(1, sp(INBOX.handoff))}}>— Nicole Taylor took control of the chat —</div>}
                {frame >= INBOX.human && <Bubble side="out" who="Nicole · Support" p={sp(INBOX.human)} color={COLORS.ink}>Hi Daniel! Your refund for #4821 is on its way 💸</Bubble>}
              </>
            )}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: '50%', bottom: 40, transform: `translateX(-50%) translateY(${(1 - Math.min(toast, 1)) * 40}px)`, opacity: Math.min(1, toast), padding: '18px 30px', borderRadius: 16, background: COLORS.ink, color: '#fff', fontSize: 26, fontWeight: 600, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 20px 50px rgba(25,25,25,0.3)'}}>
        <span style={{display: 'flex', gap: 6}}>
          {(['web', 'whatsapp', 'instagram', 'telegram', 'email'] as Channel[]).map((c) => (
            <ChannelBadge key={c} ch={c} size={30} />
          ))}
        </span>
        Every channel. One inbox.
      </div>
    </AbsoluteFill>
  );
};
