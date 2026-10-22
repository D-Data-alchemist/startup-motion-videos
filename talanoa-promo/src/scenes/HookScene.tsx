import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Avatar, COLORS, EASE, serifFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const HOOK = {title: 0, line2: 24, strip: [56, 82], bubbles: [70, 80, 90], punch: 96};

// The old-fashioned thread: real words buried under quotes, signatures and disclaimers
const THREAD: {t: string; keep?: number; quote?: number}[] = [
  {t: 'Re: Re: Fwd: Design sign-off', quote: 0},
  {t: 'Sounds good — let’s ship it Friday.', keep: 0},
  {t: '> On Tue, Oct 20, 2026 at 9:14 AM Sarah Mitchell <sarah@acme.co> wrote:', quote: 1},
  {t: '> Can you confirm the final colors before we send?', keep: 1},
  {t: '> > On Mon, Oct 19, 2026, David Chen <david@acme.co> wrote:', quote: 2},
  {t: '> > Final palette attached. Let me know!', keep: 2},
  {t: '--', quote: 3},
  {t: 'David Chen | Senior Designer | Acme Inc. | +1 (555) 010-0199', quote: 4},
  {t: 'Sent from my iPhone', quote: 5},
  {t: 'CONFIDENTIALITY NOTICE: This e-mail and any attachments are intended solely for the…', quote: 6},
];
const BUBBLES = [
  {who: 'David Chen', text: 'Final palette attached. Let me know!', side: 'in' as const},
  {who: 'Sarah Mitchell', text: 'Can you confirm the final colors before we send?', side: 'in' as const},
  {who: 'You', text: 'Sounds good — let’s ship it Friday.', side: 'out' as const},
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = interpolate(frame, [HOOK.title, HOOK.title + 6], [0, 1], {...clamp, easing: EASE.out});
  const line2 = interpolate(frame, [HOOK.line2, HOOK.line2 + 14], [0, 1], {...clamp, easing: EASE.out});
  const card = spring({frame: frame - 6, fps, config: {damping: 18}});
  const strip = interpolate(frame, HOOK.strip, [0, 1], {...clamp, easing: EASE.inOut});
  const punch = interpolate(frame, [HOOK.punch, HOOK.punch + 12], [0, 1], {...clamp, easing: EASE.out});
  const exit = interpolate(frame, [112, 125], [0, 1], {...clamp, easing: EASE.in});

  return (
    <AbsoluteFill style={{opacity: 1 - exit, filter: `blur(${exit * 10}px)`}}>
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center', fontFamily: serifFamily, color: '#fff'}}>
        <div style={{fontSize: 84, fontWeight: 300, opacity: title * (1 - punch), transform: `translateY(${(1 - title) * 20}px)`}}>Email was always a conversation.</div>
        <div style={{fontSize: 52, fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,0.6)', opacity: line2 * (1 - punch)}}>We just forgot what one looks like.</div>
      </div>
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center', fontFamily: serifFamily, color: '#fff', opacity: punch, transform: `translateY(${(1 - punch) * 20}px)`}}>
        <div style={{fontSize: 92, fontWeight: 300}}>Same email.</div>
        <div style={{fontSize: 92, fontWeight: 300, fontStyle: 'italic', color: '#C7A6FF'}}>Just the conversation.</div>
      </div>

      {/* Old thread card */}
      <div style={{position: 'absolute', left: 360, top: 330, width: 1200, padding: '30px 40px', borderRadius: 18, background: '#fff', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', opacity: Math.min(1, card) * (1 - interpolate(strip, [0.75, 1], [0, 1], clamp)), transform: `translateY(${(1 - Math.min(card, 1)) * 60}px) scale(${1 - strip * 0.05})`}}>
        {THREAD.map((l, i) => {
          const isClutter = l.keep === undefined;
          const go = isClutter ? interpolate(strip, [l.quote! * 0.08, l.quote! * 0.08 + 0.35], [0, 1], clamp) : 0;
          return (
            <div
              key={i}
              style={{
                fontSize: l.keep !== undefined ? 24 : 20,
                lineHeight: 1.6,
                fontWeight: l.keep !== undefined ? 500 : 400,
                color: l.keep !== undefined ? COLORS.text : '#8A8A90',
                fontFamily: isClutter ? 'Inter' : 'Inter',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                opacity: 1 - go,
                transform: `translateX(${go * (i % 2 ? 500 : -500)}px)`,
                filter: `blur(${go * 8}px)`,
                textDecoration: go > 0.05 ? 'line-through' : 'none',
              }}
            >
              {l.t}
            </div>
          );
        })}
      </div>

      {/* Clean chat bubbles */}
      <div style={{position: 'absolute', left: 460, top: 360, width: 1000, display: 'flex', flexDirection: 'column', gap: 22}}>
        {BUBBLES.map((b, i) => {
          const p = spring({frame: frame - HOOK.bubbles[i], fps, config: {damping: 14, stiffness: 170}});
          return (
            <div key={i} style={{alignSelf: b.side === 'in' ? 'flex-start' : 'flex-end', display: 'flex', alignItems: 'flex-end', gap: 14, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - Math.min(p, 1)) * 30}px) scale(${0.9 + 0.1 * Math.min(p, 1)})`}}>
              {b.side === 'in' && <Avatar name={b.who} size={48} i={i} />}
              <div style={{padding: '18px 24px', borderRadius: b.side === 'in' ? '22px 22px 22px 6px' : '22px 22px 6px 22px', background: b.side === 'in' ? '#fff' : COLORS.purple, color: b.side === 'in' ? COLORS.text : '#fff', fontSize: 30, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>{b.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
