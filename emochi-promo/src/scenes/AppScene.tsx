import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EMOTION_COLORS, Emotions, lerpEmotions, mixHue, Mochi, NEUTRAL, sample} from '../components/Mochi';
import {COLORS, EASE, serif} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Beats (local frames) — mirrored in scripts/compose_soundtrack.py
export const APP = {rec: 0, words: [6, 50], edit: 56, pick: 64, fix: 74, save: 90, shape: 100, morph: [102, 120], caption: 124, marks: [130, 136, 142], week: 150, minis: (i: number) => 154 + i * 3, chips: 168, trend: 174, streak: 180};

const STEPS = [
  {at: 0, title: <>Talk, don't type.</>, sub: 'Tap the mic and say what happened.'},
  {at: APP.edit, title: <>Edit before you save.</>, sub: 'Clean up the transcript in a tap.'},
  {at: APP.shape, title: <>See the <span style={{color: '#D99A3C'}}>shape</span> of your day.</>, sub: 'Mochi takes the colours of the day. Intensity, never a score.'},
  {at: APP.week, title: <>Notice what repeats.</>, sub: 'Patterns surface over weeks. No grades, no guilt.'},
];
const WORDS = 'Work was a lot today. Then I called my system on the way home and laughed for the first time all week.'.split(' ');
const ENTRY: Emotions = {joy: 82, love: 64, anxiety: 48, gratitude: 40, sadness: 14, anger: 10, disgust: 10, guilt: 12, hope: 30};
const MARKS = [
  {k: 'Joy', v: 4, c: EMOTION_COLORS.joy},
  {k: 'Love', v: 3, c: EMOTION_COLORS.love},
  {k: 'Anxiety', v: 2, c: EMOTION_COLORS.anxiety},
];
const WEEK = [
  ['M', 'anxiety'], ['T', 'sadness'], ['W', 'hope'], ['T', 'gratitude'], ['F', 'joy'], ['S', 'love'], ['S', 'joy'],
] as const;

const Phone: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 1150, top: 50, width: 480, height: 980, borderRadius: 76, background: '#1d1d1f', padding: 14, boxShadow: '0 50px 120px rgba(51,52,53,0.25)'}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 64, background: COLORS.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 14, left: '50%', marginLeft: -62, width: 124, height: 36, borderRadius: 20, background: '#000'}} />
      <div style={{position: 'absolute', top: 20, left: 40, fontSize: 18, fontWeight: 700}}>9:41</div>
      {children}
    </div>
  </div>
);

export const AppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 22});
  const exit = interpolate(frame, [196, 210], [0, 1], {...clamp, easing: EASE.in});
  const mode = frame < APP.edit ? 0 : frame < APP.shape ? 1 : frame < APP.week ? 2 : 3;
  const fadeIn = (at: number) => interpolate(frame, [at, at + 8], [0, 1], clamp);
  const fadeOut = (at: number) => 1 - interpolate(frame, [at - 6, at], [0, 1], clamp);

  // Mochi state on the phone
  // Mochi passes through the day's feelings (work stress → my sister → laughing) and settles on the entry
  const m = interpolate(frame, APP.morph, [0, 3], clamp);
  const k = Math.min(2, Math.floor(m));
  const kt = EASE.inOut(m - k);
  const states = [NEUTRAL, sample('anxiety'), sample('love'), ENTRY];
  const tints = [EMOTION_COLORS.gratitude, EMOTION_COLORS.anxiety, EMOTION_COLORS.love, EMOTION_COLORS.joy];
  const emotions = lerpEmotions(states[k], states[k + 1], kt);
  const color = mixHue(tints[k], tints[k + 1], kt);
  const squish = Math.sin(Math.PI * (m / 3)) * 0.06;
  const bounce = spring({frame: frame - APP.morph[1], fps, config: {damping: 8, stiffness: 200}});
  const listening = frame < APP.edit ? 1 + Math.sin(frame / 3) * 0.03 : 1;
  const mochiSize = interpolate(frame, [APP.shape - 4, APP.shape + 8], [200, 300], {...clamp, easing: EASE.out});
  const mochiTop = interpolate(frame, [APP.shape - 4, APP.shape + 8], [100, 130], {...clamp, easing: EASE.out});
  const blink = [30, 84, 140].some((b) => frame >= b && frame < b + 5) ? 1 : 0;

  const wordsShown = Math.floor(interpolate(frame, APP.words, [0, WORDS.length], clamp));
  const fixed = frame >= APP.fix;
  const pick = frame >= APP.pick && !fixed;

  return (
    <AbsoluteFill style={{opacity: Math.min(1, enter * 1.3) * (1 - exit), color: COLORS.fg}}>
      {/* captions */}
      {STEPS.map((s, i) => {
        const next = STEPS[i + 1]?.at ?? 999;
        const o = interpolate(frame, [s.at, s.at + 10, next - 6, next], [0, 1, 1, 0], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 150, top: 330, width: 900, opacity: o, transform: `translateY(${(1 - o) * 30}px)`}}>
            <div style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.14em', color: COLORS.tealDeep}}>0{i + 1}</div>
            <div style={{fontFamily: serif, fontWeight: 700, fontSize: 96, lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: 14}}>{s.title}</div>
            <div style={{fontSize: 34, color: COLORS.muted, marginTop: 24, lineHeight: 1.4}}>{s.sub}</div>
          </div>
        );
      })}

      <div style={{transform: `translateY(${(1 - enter) * 120}px)`}}>
        <Phone>
          <div style={{position: 'absolute', top: 72, width: '100%', textAlign: 'center'}}>
            <div style={{fontFamily: serif, fontWeight: 700, fontSize: 30}}>{mode === 3 ? 'This week' : 'Today'}</div>
            <div style={{fontSize: 16, color: COLORS.muted, marginTop: 2}}>{mode === 3 ? 'Oct 16 – 22' : 'Wednesday, Oct 22'}</div>
          </div>
          {mode < 3 && (
            <div style={{position: 'absolute', top: mochiTop + 40, left: '50%', marginLeft: -mochiSize / 2, transform: `scale(${listening * (1 - squish + (frame >= APP.morph[1] ? 0.06 * (1 - Math.min(1, bounce)) : 0))})`}}>
              <Mochi id="app-mochi" emotions={emotions} color={color} size={mochiSize} blink={blink} wobble={frame / 9} />
            </div>
          )}

          {/* 1 · recording */}
          {mode === 0 && (
            <div style={{opacity: fadeOut(APP.edit)}}>
              <div style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center', fontSize: 17, color: COLORS.muted}}>Mochi is listening… <b style={{color: COLORS.fg}}>0:{String(Math.floor(frame / 3) % 60).padStart(2, '0')}</b></div>
              <div style={{position: 'absolute', top: 400, left: 40, right: 40, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5}}>
                {Array.from({length: 26}, (_, i) => {
                  const h = 8 + Math.abs(Math.sin(frame / 2.3 + i * 0.9) * Math.cos(frame / 5 + i * 0.4)) * 48;
                  return <div key={i} style={{width: 6, height: h, borderRadius: 3, background: COLORS.teal}} />;
                })}
              </div>
              <div style={{position: 'absolute', top: 490, left: 36, right: 36, fontSize: 22, lineHeight: 1.5, fontWeight: 500}}>
                {WORDS.slice(0, wordsShown).join(' ')}
              </div>
              <div style={{position: 'absolute', bottom: 60, left: '50%', marginLeft: -48, width: 96, height: 96, borderRadius: 48, background: COLORS.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 ${10 + Math.sin(frame / 4) * 6}px rgba(78,205,196,0.35)`}}>
                <div style={{width: 30, height: 30, borderRadius: 8, background: '#FF706D'}} />
              </div>
            </div>
          )}

          {/* 2 · edit */}
          {mode === 1 && (
            <div style={{opacity: fadeIn(APP.edit) * fadeOut(APP.shape)}}>
              <div style={{position: 'absolute', top: 340, left: 28, right: 28, borderRadius: 24, background: COLORS.surface, padding: '24px 24px', boxShadow: '0 1px 2px rgba(0,0,0,.05)'}}>
                <div style={{fontSize: 14, fontWeight: 700, color: COLORS.faint, letterSpacing: '0.1em'}}>TRANSCRIPT · EDITABLE</div>
                <div style={{fontSize: 23, lineHeight: 1.55, fontWeight: 500, marginTop: 10}}>
                  {WORDS.map((w, i) =>
                    w === 'system' ? (
                      <span key={i} style={{padding: '0 4px', borderRadius: 6, background: pick ? 'rgba(78,205,196,0.3)' : fixed ? 'rgba(78,205,196,0.12)' : 'transparent', color: fixed ? COLORS.tealDeep : COLORS.fg}}>{fixed ? 'sister' : 'system'} </span>
                    ) : (
                      <span key={i}>{w} </span>
                    ),
                  )}
                </div>
              </div>
              <div style={{position: 'absolute', bottom: 70, left: 28, right: 28, height: 70, borderRadius: 999, background: COLORS.fg, color: COLORS.bg, fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 rgba(0,0,0,.25)', transform: `scale(${1 - 0.05 * interpolate(frame, [APP.save - 3, APP.save, APP.save + 5], [0, 1, 0], clamp)})`}}>
                Save reflection
              </div>
            </div>
          )}

          {/* 3 · shape of the day */}
          {mode === 2 && (
            <div style={{opacity: fadeOut(APP.week)}}>
              <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center', fontFamily: serif, fontWeight: 700, fontSize: 34, opacity: fadeIn(APP.caption)}}>A bright one.</div>
              <div style={{position: 'absolute', top: 580, left: 36, right: 36}}>
                {MARKS.map((mk, i) => (
                  <div key={mk.k} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', marginBottom: 12, borderRadius: 16, background: COLORS.surface, opacity: fadeIn(APP.marks[i]), transform: `translateY(${(1 - fadeIn(APP.marks[i])) * 20}px)`}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 20, fontWeight: 600}}>
                      <span style={{width: 14, height: 14, borderRadius: 7, background: mk.c}} />
                      {mk.k}
                    </span>
                    <span style={{display: 'flex', gap: 6}}>
                      {Array.from({length: 5}, (_, d) => (
                        <span key={d} style={{width: 12, height: 12, borderRadius: 6, background: d < mk.v ? mk.c : COLORS.border}} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4 · weekly patterns */}
          {mode === 3 && (
            <div style={{opacity: fadeIn(APP.week)}}>
              <div style={{position: 'absolute', top: 160, left: 24, right: 24, display: 'flex', justifyContent: 'space-between'}}>
                {WEEK.map(([d, emo], i) => {
                  const p = spring({frame: frame - APP.minis(i), fps, config: {damping: 10, stiffness: 200}});
                  return (
                    <div key={i} style={{textAlign: 'center', transform: `scale(${p})`}}>
                      <Mochi id={`wk-${i}`} emotions={sample(emo)} size={58} face={false} wobble={frame / 9 + i} />
                      <div style={{fontSize: 15, fontWeight: 700, color: COLORS.muted, marginTop: 4}}>{d}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{position: 'absolute', top: 270, left: 28, right: 28, borderRadius: 20, background: COLORS.surface, padding: '18px 22px', opacity: fadeIn(APP.minis(2))}}>
                <div style={{fontSize: 14, fontWeight: 700, color: COLORS.faint, letterSpacing: '0.1em'}}>MOCHI NOTICED</div>
                <div style={{fontFamily: serif, fontWeight: 700, fontSize: 25, marginTop: 6, lineHeight: 1.25}}>Tuesdays run heavier than you thought.</div>
              </div>
              <div style={{position: 'absolute', top: 420, left: 28, right: 28, opacity: fadeIn(APP.chips)}}>
                <div style={{fontSize: 14, fontWeight: 700, color: COLORS.faint, letterSpacing: '0.1em', marginBottom: 12}}>WHAT KEPT COMING BACK</div>
                <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                  {['work', 'my sister', 'sleep'].map((c, i) => (
                    <span key={c} style={{padding: '10px 18px', borderRadius: 999, background: COLORS.surface, border: `1px solid ${COLORS.border}`, fontSize: 19, fontWeight: 600, opacity: fadeIn(APP.chips + i * 2)}}>{c}</span>
                  ))}
                </div>
              </div>
              <div style={{position: 'absolute', top: 540, left: 28, right: 28, borderRadius: 20, background: COLORS.surface, padding: '18px 22px', opacity: fadeIn(APP.trend)}}>
                <div style={{fontSize: 14, fontWeight: 700, color: COLORS.faint, letterSpacing: '0.1em'}}>EMOTION TRENDS · 28 DAYS</div>
                <svg width={352} height={110} viewBox="0 0 380 110" preserveAspectRatio="none" style={{marginTop: 8}}>
                  {[
                    {c: EMOTION_COLORS.joy, f: (x: number) => 60 - 30 * Math.sin(x / 70) - x / 14},
                    {c: EMOTION_COLORS.anxiety, f: (x: number) => 40 + 24 * Math.sin(x / 55 + 1) + x / 16},
                  ].map((ln, li) => (
                    <path key={li} d={Array.from({length: 39}, (_, k) => `${k ? 'L' : 'M'}${k * 10} ${ln.f(k * 10).toFixed(1)}`).join(' ')} stroke={ln.c} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - interpolate(frame, [APP.trend, APP.trend + 16], [0, 1], {...clamp, easing: EASE.out}))} />
                  ))}
                </svg>
              </div>
              <div style={{position: 'absolute', top: 730, left: 28, right: 28, borderRadius: 20, background: COLORS.fg, color: COLORS.bg, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: fadeIn(APP.streak)}}>
                <span style={{fontSize: 20, fontWeight: 600}}>Day streak</span>
                <span style={{fontFamily: serif, fontWeight: 700, fontSize: 40}}>7 days</span>
              </div>
            </div>
          )}
        </Phone>
      </div>
    </AbsoluteFill>
  );
};
