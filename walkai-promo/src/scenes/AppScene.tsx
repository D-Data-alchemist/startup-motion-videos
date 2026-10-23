import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Radio} from '../components/Radio';
import {COLORS, EASE, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {keyUp: 0, words: [4, 34], transcribe: 36, dispatch: 56, enter: 76, work: [86, 100, 114], reply: 128, vox: [150, 156, 162], speak: [168, 196], roger: 198};
const STEPS = ['Key up', 'Transcribe', 'Dispatch', 'Reply', 'Broadcast'];
const STEP_AT = [APP.keyUp, APP.transcribe, APP.dispatch, APP.reply, APP.vox[0]];
const ASK = 'Hey, the buy button doesn’t do anything when I click it. Can you take a look?';
const ANSWER = 'Fixed. The buy button works again. Over.';
const CAPTIONS = [
  {at: 0, text: <>Press PTT. <b style={{color: COLORS.orange}}>Say what’s wrong.</b></>},
  {at: APP.dispatch, text: <>Your Mac types it into <b style={{color: COLORS.orange}}>your agent.</b></>},
  {at: APP.reply, text: <>The answer comes back <b style={{color: COLORS.green}}>over the radio.</b></>},
];

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 22});
  const exit = interpolate(frame, [198, 210], [0, 1], {...clamp, easing: EASE.in});
  const f = (at: number, d = 8) => interpolate(frame, [at, at + d], [0, 1], {...clamp, easing: EASE.out});
  const tx = frame < APP.transcribe;
  const rx = frame >= APP.vox[0];
  const step = STEP_AT.filter((s) => frame >= s).length - 1;
  const askWords = ASK.split(' ');
  const said = Math.ceil(interpolate(frame, APP.words, [0, askWords.length], clamp));
  const typed = Math.floor(interpolate(frame, [APP.dispatch, APP.enter], [0, ASK.length], clamp));
  const ansWords = ANSWER.split(' ');
  const spoken = Math.ceil(interpolate(frame, APP.speak, [0, ansWords.length], clamp));

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), color: COLORS.text}}>
      {/* the radio loop */}
      <div style={{position: 'absolute', left: 700, top: 64, display: 'flex', gap: 12}}>
        {STEPS.map((s, i) => (
          <div key={s} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, background: i === step ? COLORS.orange : i < step ? 'rgba(255,107,43,0.14)' : COLORS.panel, color: i === step ? '#fff' : i < step ? COLORS.orangeLit : COLORS.muted, fontSize: 19, fontWeight: 600}}>
            <span style={{fontFamily: mono, fontSize: 15, opacity: 0.8}}>0{i + 1}</span>
            {s}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: 230, top: 250, transform: `translateY(${(1 - enter) * 80}px) rotate(-4deg)`}}>
        <Radio scale={0.95} tx={tx} rx={rx} lcd={tx ? 'TX ▮▮▮' : rx ? 'RX ▮▮▮' : '146.520'} ptt={tx ? 1 : 0} />
      </div>
      {/* what you said, from the radio */}
      {frame < APP.dispatch + 6 && (
        <div style={{position: 'absolute', left: 60, top: 92, width: 560, padding: '16px 20px', borderRadius: 18, background: 'rgba(30,34,42,0.92)', border: `1px solid ${COLORS.line}`, fontSize: 24, lineHeight: 1.4, opacity: f(APP.words[0]) * (1 - f(APP.dispatch, 6))}}>
          <span style={{color: COLORS.green}}>●</span> “{askWords.slice(0, said).join(' ')}”
        </div>
      )}
      {/* what the agent said back, out of the radio */}
      {rx && (
        <div style={{position: 'absolute', left: 60, top: 92, width: 560, padding: '16px 20px', borderRadius: 18, background: 'rgba(255,107,43,0.14)', border: `1px solid rgba(255,107,43,0.35)`, fontSize: 26, lineHeight: 1.4, opacity: f(APP.speak[0])}}>
          <span style={{color: COLORS.orange}}>◀︎</span> “{ansWords.slice(0, spoken).join(' ')}” {frame >= APP.roger && <b style={{color: COLORS.orange, fontFamily: mono, fontSize: 20}}>ROGER ⟂</b>}
        </div>
      )}

      {/* the Mac: Station + agent */}
      <div style={{position: 'absolute', left: 700, top: 150, width: 1110, height: 740, borderRadius: 22, background: COLORS.bg2, border: `1px solid ${COLORS.line}`, boxShadow: '0 50px 120px rgba(0,0,0,0.5)', overflow: 'hidden', transform: `translateY(${(1 - enter) * 60}px)`}}>
        <div style={{height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', borderBottom: `1px solid ${COLORS.line}`}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />)}
          <span style={{marginLeft: 14, fontSize: 16, color: COLORS.muted}}>walkai-talkai — Station</span>
          <span style={{marginLeft: 'auto', fontFamily: mono, fontSize: 15, padding: '4px 12px', borderRadius: 999, background: tx ? 'rgba(126,240,196,0.15)' : rx ? 'rgba(255,107,43,0.18)' : COLORS.panel, color: tx ? COLORS.green : rx ? COLORS.orange : COLORS.muted}}>{tx ? 'LISTENING' : rx ? 'TX · VOX' : 'STANDBY'}</span>
        </div>
        {/* live spectrum: incoming in green, reply in orange */}
        <div style={{height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderBottom: `1px solid ${COLORS.line}`}}>
          {Array.from({length: 48}, (_, i) => {
            const live = tx || (rx && frame >= APP.speak[0] && frame < APP.roger);
            const h = live ? 10 + Math.abs(Math.sin(frame / 2.1 + i * 0.7) * Math.cos(frame / 4.3 + i * 0.31)) * 100 : 6 + Math.abs(Math.sin(i)) * 6;
            return <div key={i} style={{width: 10, height: h, borderRadius: 4, background: rx ? COLORS.orange : COLORS.emerald, opacity: live ? 1 : 0.35}} />;
          })}
        </div>
        <div style={{display: 'flex', gap: 14, padding: '14px 20px', borderBottom: `1px solid ${COLORS.line}`, fontFamily: mono, fontSize: 16, color: COLORS.muted}}>
          <span style={{opacity: f(APP.transcribe)}}>Whisper · on your Mac</span>
          <span style={{opacity: f(APP.transcribe)}}>· EN</span>
          {[880, 1100, 1400].map((hz, i) => (
            <span key={hz} style={{marginLeft: i === 0 ? 'auto' : 0, padding: '2px 10px', borderRadius: 6, background: frame >= APP.vox[i] ? COLORS.orange : COLORS.panel, color: frame >= APP.vox[i] ? '#fff' : COLORS.muted}}>{hz} Hz</span>
          ))}
        </div>
        {/* agent terminal */}
        <div style={{padding: '18px 24px', fontFamily: mono, fontSize: 20, lineHeight: 1.75}}>
          <div style={{color: COLORS.muted, fontSize: 16}}>Claude Code — app.tsx</div>
          <div style={{minHeight: 70, opacity: f(APP.dispatch, 4)}}>
            <span style={{color: COLORS.orange}}>❯ </span>
            <span style={{color: COLORS.orangeLit}}>[radio command]</span> {ASK.slice(0, typed)}
            {frame >= APP.dispatch && frame < APP.enter && <span style={{display: 'inline-block', width: 10, height: 22, background: COLORS.text, verticalAlign: 'middle', marginLeft: 2}} />}
            {frame >= APP.enter && frame < APP.enter + 10 && <span style={{marginLeft: 12, padding: '2px 8px', borderRadius: 6, background: COLORS.panel2, fontSize: 15}}>↵ Enter</span>}
          </div>
          {[
            ['● Reading src/components/BuyButton.tsx', COLORS.text],
            ['● onClick was never wired to checkout()', COLORS.text],
            ['✓ Edited BuyButton.tsx · tests pass', COLORS.green],
          ].map(([t, c], i) => (
            <div key={t} style={{color: c, opacity: f(APP.work[i], 6)}}>{t}</div>
          ))}
          <div style={{marginTop: 10, padding: '12px 16px', borderRadius: 10, background: '#0B0C10', fontSize: 17, color: '#C9D1D9', opacity: f(APP.reply, 8)}}>
            <span style={{color: COLORS.green}}>$</span> curl -X POST 127.0.0.1:1988/api/reply -d <span style={{color: COLORS.orangeLit}}>'{`{"text": "${ANSWER}"}`}'</span>
          </div>
        </div>
      </div>

      {CAPTIONS.map((c, i) => {
        const next = CAPTIONS[i + 1]?.at ?? 999;
        const o = interpolate(frame, [c.at, c.at + 8, next - 5, next], [0, 1, 1, 0], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 700, top: 920, fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', opacity: o, transform: `translateY(${(1 - o) * 18}px)`}}>{c.text}</div>
        );
      })}
    </AbsoluteFill>
  );
};
