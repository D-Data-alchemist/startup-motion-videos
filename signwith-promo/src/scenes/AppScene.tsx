import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClickRipple, Cursor, cursorAt} from '../components/Cursor';
import {COLORS, displayFamily, EASE, Logo, Signature} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {upload: 30, field: [52, 72], send: 88, phone: 96, sign: [116, 150], done: 160, credit: 168};

const WIN = {x: 120, y: 90, w: 1180, h: 880};
const DOCS = [
  ['Freelance Services Agreement', 'Completed'],
  ['Mutual NDA', 'Pending'],
  ['Office Lease Renewal', 'Completed'],
  ['Offer Letter – J. Ellis', 'Pending'],
];
// doc preview rect (window-relative) where the signature field lands
const SIG = {x: 640, y: 640, w: 360, h: 90};
const FIELD_FROM = {x: WIN.x + 1000, y: WIN.y + 250};
const FIELD_TO = {x: WIN.x + SIG.x, y: WIN.y + SIG.y};
const SEND = {x: WIN.x + 1040, y: WIN.y + 820};

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 24});
  const exit = interpolate(frame, [192, 208], [0, 1], {...clamp, easing: EASE.in});
  const up = spring({frame: frame - APP.upload, fps, config: {damping: 15, stiffness: 150}});
  const fieldP = interpolate(frame, APP.field, [0, 1], {...clamp, easing: EASE.inOut});
  const placed = frame >= APP.field[1];
  const sent = frame >= APP.send;
  const phone = spring({frame: frame - APP.phone, fps, config: {damping: 16, stiffness: 120}});
  const sign = interpolate(frame, APP.sign, [0, 1], {...clamp, easing: EASE.inOut});
  const done = frame >= APP.done;
  const doneP = spring({frame: frame - APP.done, fps, config: {damping: 12, stiffness: 200}});
  const credits = frame >= APP.credit ? 2 : 3;

  const cursor = cursorAt(frame, [
    {f: 10, x: 1600, y: 1080},
    {f: APP.field[0] - 2, x: FIELD_FROM.x + 60, y: FIELD_FROM.y + 30, arc: -50},
    {f: APP.field[0], x: FIELD_FROM.x + 60, y: FIELD_FROM.y + 30},
    {f: APP.field[1], x: FIELD_TO.x + 60, y: FIELD_TO.y + 30, arc: -40},
    {f: APP.send - 4, x: SEND.x + 30, y: SEND.y + 4, arc: -30},
    {f: APP.send + 10, x: SEND.x + 30, y: SEND.y + 4},
    {f: 120, x: 1100, y: 1060},
  ]);
  const press = Math.max(frame >= APP.field[0] && frame < APP.field[1] ? 0.6 : 0, interpolate(frame, [APP.send - 4, APP.send, APP.send + 6], [0, 1, 0], clamp));

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), filter: `blur(${exit * 10}px)`}}>
      <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 20, overflow: 'hidden', background: '#fff', border: `1px solid ${COLORS.line}`, boxShadow: '0 50px 120px rgba(37,42,74,0.16)', transform: `translateY(${(1 - enter) * 70}px) scale(${0.93 + 0.07 * enter})`, color: COLORS.ink}}>
        <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', background: COLORS.soft, borderBottom: `1px solid ${COLORS.line}`}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c}} />
          ))}
          <div style={{margin: '0 auto', width: 360, height: 26, borderRadius: 8, background: '#fff', border: `1px solid ${COLORS.line}`, fontSize: 14, color: COLORS.muted, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>app.signwith.co</div>
          <div style={{width: 52}} />
        </div>
        <div style={{height: 64, display: 'flex', alignItems: 'center', padding: '0 28px', borderBottom: `1px solid ${COLORS.line}`, gap: 30, fontSize: 18}}>
          <Logo width={70} />
          <span style={{fontWeight: 600}}>Dashboard</span>
          <span style={{color: COLORS.muted}}>Library</span>
          <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: COLORS.muted}}>
            Free docs this month
            {[0, 1, 2].map((i) => (
              <span key={i} style={{width: 14, height: 14, borderRadius: '50%', background: i < credits ? COLORS.navy : COLORS.line, transform: `scale(${i === 2 && frame >= APP.credit ? 1 + 0.4 * Math.exp(-(frame - APP.credit) / 4) : 1})`}} />
            ))}
          </span>
        </div>
        {/* left: stats + list */}
        <div style={{position: 'absolute', left: 28, top: 140, width: 520}}>
          <div style={{fontSize: 28, fontWeight: 700}}>Welcome Alex Carter!</div>
          <div style={{display: 'flex', gap: 14, marginTop: 18}}>
            {[
              ['Total documents', 4 + (sent ? 1 : 0)],
              ['Awaiting signature', 2 + (sent && !done ? 1 : 0)],
              ['Completed', 2 + (done ? 1 : 0)],
            ].map(([k, v], i) => (
              <div key={String(k)} style={{flex: 1, padding: '16px 16px', borderRadius: 14, border: `1px solid ${i === 2 && done ? COLORS.green : COLORS.line}`, background: i === 2 && done ? '#EAF7F0' : '#fff'}}>
                <div style={{fontSize: 14, color: COLORS.muted}}>{k}</div>
                <div style={{fontSize: 40, fontWeight: 800, fontFamily: displayFamily, marginTop: 4, transform: `scale(${i === 2 && done ? 1 + 0.15 * Math.exp(-(frame - APP.done) / 5) : 1})`, transformOrigin: 'left'}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop: 26, fontSize: 18, fontWeight: 700}}>Jump back in…</div>
          {[...(sent ? [['Lease-agreement.pdf', done ? 'Completed' : 'Sent']] : []), ...DOCS].slice(0, 5).map(([n, s], i) => (
            <div key={n} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 4px', borderBottom: `1px solid ${COLORS.line}`, fontSize: 18, opacity: n.startsWith('Lease') ? Math.min(1, up) : 1}}>
              <span style={{fontWeight: n.startsWith('Lease') ? 700 : 400}}>📄 {n}</span>
              <span style={{fontSize: 14, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: s === 'Completed' ? '#EAF7F0' : s === 'Sent' ? '#E7EEF7' : '#FFF4E5', color: s === 'Completed' ? COLORS.green : s === 'Sent' ? COLORS.navy : COLORS.amber}}>{s}</span>
            </div>
          ))}
        </div>
        {/* right: document editor */}
        <div style={{position: 'absolute', left: 580, top: 120, width: 570, bottom: 30, borderRadius: 16, background: COLORS.soft, padding: 20, opacity: Math.min(1, up), transform: `translateY(${(1 - Math.min(up, 1)) * 40}px)`}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16}}>
            <span style={{fontWeight: 700}}>📄 Lease-agreement.pdf</span>
            <span style={{padding: '6px 12px', borderRadius: 8, border: `1px dashed ${COLORS.navy}`, color: COLORS.navy, fontWeight: 600}}>✍ Signature</span>
          </div>
          <div style={{marginTop: 16, height: 560, background: '#fff', borderRadius: 8, padding: '30px 34px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)'}}>
            <div style={{fontFamily: displayFamily, fontSize: 24, fontWeight: 700}}>RESIDENTIAL LEASE AGREEMENT</div>
            {[92, 80, 96, 70, 88, 60, 94, 76].map((w, i) => (
              <div key={i} style={{height: 9, width: `${w}%`, background: '#E9ECEF', borderRadius: 4, marginTop: i % 3 === 0 ? 22 : 12}} />
            ))}
            <div style={{position: 'absolute', left: 54, top: 470, fontSize: 15, color: COLORS.muted}}>Tenant signature</div>
          </div>
          <div style={{position: 'absolute', left: 20, right: 20, bottom: 20, height: 54, borderRadius: 12, background: sent ? COLORS.green : COLORS.navy, color: '#fff', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - interpolate(frame, [APP.send - 4, APP.send, APP.send + 6], [0, 0.05, 0], clamp)})`}}>
            {sent ? '✓ Sent to jordan@email.com' : 'Send for signature →'}
          </div>
        </div>
      </div>
      {/* signature field being dragged / placed */}
      {frame >= APP.field[0] && (
        <div style={{position: 'absolute', left: FIELD_FROM.x + (FIELD_TO.x - FIELD_FROM.x) * fieldP, top: FIELD_FROM.y + (FIELD_TO.y - FIELD_FROM.y) * fieldP, width: SIG.w * 0.9, height: SIG.h, border: `2px dashed ${COLORS.navy}`, borderRadius: 8, background: 'rgba(43,83,130,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.navy, fontWeight: 600, fontSize: 18, boxShadow: placed ? 'none' : '0 20px 40px rgba(43,83,130,0.2)'}}>
          {done ? <Signature draw={1} width={260} /> : 'Sign here'}
        </div>
      )}
      {/* signer's phone */}
      <div style={{position: 'absolute', left: 1380, top: 130, width: 400, height: 820, borderRadius: 54, background: COLORS.logo, padding: 14, boxShadow: '0 50px 100px rgba(37,42,74,0.35)', opacity: Math.min(1, phone), transform: `translateX(${(1 - Math.min(phone, 1)) * 500}px) rotate(${(1 - Math.min(phone, 1)) * 10}deg)`}}>
        <div style={{width: '100%', height: '100%', borderRadius: 42, background: '#fff', overflow: 'hidden', position: 'relative', padding: '50px 22px'}}>
          <div style={{fontSize: 15, color: COLORS.muted}}>From Alex Carter · via SignWith</div>
          <div style={{fontSize: 24, fontWeight: 700, marginTop: 8}}>Lease-agreement.pdf</div>
          <div style={{marginTop: 10, display: 'inline-block', padding: '5px 12px', borderRadius: 999, background: '#EAF7F0', color: COLORS.green, fontSize: 14, fontWeight: 600}}>No account needed</div>
          {[88, 70, 92, 64, 80].map((w, i) => (
            <div key={i} style={{height: 8, width: `${w}%`, background: '#E9ECEF', borderRadius: 4, marginTop: 14}} />
          ))}
          <div style={{marginTop: 40, fontSize: 15, color: COLORS.muted}}>Sign below</div>
          <div style={{marginTop: 10, height: 170, borderRadius: 14, border: `2px dashed ${COLORS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Signature draw={sign} width={320} />
          </div>
          <div style={{position: 'absolute', left: 22, right: 22, bottom: 40, height: 60, borderRadius: 14, background: done ? COLORS.green : COLORS.navy, color: '#fff', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${done ? 1 + 0.06 * Math.exp(-(frame - APP.done) / 4) : 1})`}}>
            {done ? '✓ Signed' : 'Finish signing'}
          </div>
        </div>
      </div>
      {done && (
        <div style={{position: 'absolute', left: WIN.x + 40, bottom: 34, padding: '16px 24px', borderRadius: 14, background: COLORS.logo, color: '#fff', fontSize: 22, fontWeight: 600, transform: `translateY(${(1 - Math.min(doneP, 1)) * 40}px)`, opacity: Math.min(1, doneP)}}>
          ✓ Submission completed · <span style={{color: '#9EC5FF'}}>1 doc used. No monthly bill.</span>
        </div>
      )}
      <ClickRipple x={SEND.x + 34} y={SEND.y + 8} progress={interpolate(frame, [APP.send, APP.send + 18], [0, 1], clamp)} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [10, 18, 112, 122], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
