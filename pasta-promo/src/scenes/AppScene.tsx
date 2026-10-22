import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, EASE, Serif} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {talk: [8, 38], cards: [46, 54, 62, 70], lock: 90, voice1: [96, 140], set: 140, voice2: [146, 190], hr: 160};

const ASK = '“Thirty minutes, upper body, dumbbells only.”';
const WORKOUT = [
  ['One-Arm Dumbbell Row', '3 × 10 · 30 kg · 75s rest'],
  ['Dumbbell Bench Press', '3 × 12 · 22 kg · 60s rest'],
  ['Seated Shoulder Press', '3 × 10 · 16 kg · 60s rest'],
  ['Hammer Curl', '3 × 12 · 12 kg · 45s rest'],
];
// Pasta's real coaching lines (from pppasta.com)
const LINE1 = 'One-Arm Dumbbell Row! You’ve got 3 sets of 10 at 30 kilos, with 75 seconds of rest. Set 1. Let’s GO!';
const LINE2 = 'That’s set 1 of 3! Rest 75 seconds. Your heart rate’s at 136, vigorous zone. Right where you want it!';

const Karaoke: React.FC<{text: string; range: number[]}> = ({text, range}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const k = interpolate(frame, range, [0, words.length], clamp);
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 0.3em', fontSize: 44, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.02em'}}>
      {words.map((w, i) => (
        <span key={i} style={{color: i < k ? COLORS.cream : 'rgba(237,233,226,0.22)', transform: `translateY(${i < k && i > k - 1.5 ? -4 : 0}px)`, display: 'inline-block'}}>
          {w}
        </span>
      ))}
    </div>
  );
};

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 24});
  const exit = interpolate(frame, [194, 210], [0, 1], {...clamp, easing: EASE.in});
  const typed = ASK.slice(0, Math.floor(interpolate(frame, APP.talk, [0, ASK.length], clamp)));
  const lock = frame >= APP.lock;
  const lockP = spring({frame: frame - APP.lock, fps, config: {damping: 16}});
  const restLeft = Math.max(0, 75 - Math.floor(Math.max(0, frame - APP.set) / 1.2));
  const resting = frame >= APP.set;
  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  const bars = Array.from({length: 18}, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 7) / 3.2)) * (frame < APP.talk[1] || (frame > APP.voice1[0] && frame < APP.voice2[1]) ? 1 : 0.15));

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), filter: `blur(${exit * 10}px)`}}>
      {/* iPhone */}
      <div style={{position: 'absolute', left: 230, top: 80, width: 470, height: 940, borderRadius: 70, background: '#1A1816', padding: 16, boxShadow: '0 60px 120px rgba(0,0,0,0.8), 0 0 0 2px #3A3530', transform: `translateY(${(1 - enter) * 80}px)`}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 56, overflow: 'hidden', background: lock ? 'linear-gradient(180deg, #1B140B 0%, #0A0806 100%)' : '#0D0B09', color: COLORS.cream}}>
          {/* Dynamic Island */}
          <div style={{position: 'absolute', left: '50%', top: 16, transform: 'translateX(-50%)', height: 40, width: lock ? 300 : 130, borderRadius: 24, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 16, fontWeight: 600, transition: 'none'}}>
            {lock && (
              <>
                <span style={{color: COLORS.gold}}>● Row · {resting ? 'Rest' : 'Set 1/3'}</span>
                <span style={{fontVariantNumeric: 'tabular-nums'}}>{resting ? fmt(restLeft) : 'GO'}</span>
              </>
            )}
          </div>
          {!lock ? (
            <div style={{padding: '90px 26px 0'}}>
              <Serif size={46}>Pasta</Serif>
              <div style={{marginTop: 26, padding: '18px 20px', borderRadius: 20, background: 'rgba(243,198,108,0.12)', border: `1px solid rgba(243,198,108,0.35)`, fontSize: 22, minHeight: 90, lineHeight: 1.4}}>{typed || ' '}</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22}}>
                {WORKOUT.map(([n, d], i) => {
                  const p = spring({frame: frame - APP.cards[i], fps, config: {damping: 14, stiffness: 180}});
                  return (
                    <div key={n} style={{padding: '14px 18px', borderRadius: 16, background: '#1C1916', opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - Math.min(p, 1)) * 60}px)`}}>
                      <div style={{fontSize: 21, fontWeight: 700}}>{n}</div>
                      <div style={{fontSize: 16, color: COLORS.muted, marginTop: 4}}>{d}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{position: 'absolute', left: '50%', bottom: 50, transform: 'translateX(-50%)', width: 110, height: 110, borderRadius: '50%', background: COLORS.gold, color: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: `0 0 ${20 + 20 * bars[0]}px rgba(243,198,108,0.5)`}}>🎙</div>
            </div>
          ) : (
            <div style={{padding: '120px 26px 0', textAlign: 'center', opacity: Math.min(1, lockP)}}>
              <div style={{fontSize: 96, fontWeight: 300, letterSpacing: '-0.03em'}}>7:42</div>
              <div style={{fontSize: 20, color: COLORS.muted}}>Thursday, 23 October</div>
              <div style={{marginTop: 50, padding: '22px 20px', borderRadius: 26, background: 'rgba(30,26,22,0.85)', textAlign: 'left'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 18, color: COLORS.muted}}>
                  <span>PASTA</span>
                  <span>{frame >= APP.set ? 'Rest' : 'Set 1 of 3'}</span>
                </div>
                <div style={{fontSize: 26, fontWeight: 700, marginTop: 8}}>One-Arm Dumbbell Row</div>
                <div style={{fontSize: 64, fontWeight: 700, color: COLORS.gold, fontVariantNumeric: 'tabular-nums', marginTop: 4}}>{resting ? fmt(restLeft) : '10 reps'}</div>
                <div style={{height: 8, borderRadius: 8, background: '#2A2520', marginTop: 10, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${frame >= APP.set ? (restLeft / 75) * 100 : 33}%`, background: COLORS.gold}} />
                </div>
              </div>
              {frame >= APP.hr && (
                <div style={{marginTop: 18, display: 'inline-flex', gap: 10, alignItems: 'center', padding: '12px 18px', borderRadius: 16, background: 'rgba(142,42,34,0.35)', fontSize: 22, fontWeight: 600, transform: `scale(${spring({frame: frame - APP.hr, fps, config: {damping: 12}})})`}}>
                  ♥ 136 bpm <span style={{color: COLORS.muted, fontWeight: 400}}>· vigorous zone</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Right side: what's happening, voice */}
      <div style={{position: 'absolute', left: 820, top: 150, width: 960}}>
        {!lock ? (
          <>
            <div style={{fontSize: 22, letterSpacing: '0.3em', color: COLORS.gold}}>01 · ASK</div>
            <Serif size={96} color={COLORS.cream}>Say what you want.</Serif>
            <div style={{fontSize: 34, color: COLORS.muted, marginTop: 20, lineHeight: 1.4, opacity: interpolate(frame, [44, 56], [0, 1], clamp)}}>A full session in seconds: exercises, sets, reps and rest. Made fresh.</div>
          </>
        ) : (
          <>
            <div style={{fontSize: 22, letterSpacing: '0.3em', color: COLORS.gold, opacity: Math.min(1, lockP)}}>02 · TRAIN, HANDS FREE</div>
            <div style={{display: 'flex', gap: 6, alignItems: 'center', height: 60, margin: '22px 0 26px'}}>
              {bars.map((b, i) => (
                <span key={i} style={{width: 8, height: 60 * b, borderRadius: 4, background: COLORS.gold, opacity: 0.85}} />
              ))}
              <span style={{marginLeft: 16, fontSize: 22, color: COLORS.muted}}>Pasta is speaking</span>
            </div>
            {frame < APP.voice2[0] ? <Karaoke text={LINE1} range={APP.voice1} /> : <Karaoke text={LINE2} range={APP.voice2} />}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
