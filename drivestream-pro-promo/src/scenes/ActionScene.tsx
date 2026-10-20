import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {Cursor, ClickRipple, cursorAt} from '../components/Cursor';
import {BRAND, COLORS, EASE, LogoMark, monoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// DriveStream Studio: library → program → channel. Geometry in screen px; cursor targets derive from it.
const WIN = {x: 160, y: 110, w: 1600, h: 860};
const BAR_H = 48;
const HEAD_H = 64;
const TOP = BAR_H + HEAD_H + 20; // content top (window-relative)
const LIB = {x: 24, w: 420};
const PROG = {x: 464, w: 500};
const SIDE = {x: 984, w: 592};
const PLAYER_H = 333;
const STATS_TOP = TOP + PLAYER_H + 18;
const DEST_TOP = STATS_TOP + 130 + 16;
const BTN = {top: DEST_TOP + 86 + 16, h: 70};
const GO_LIVE = {x: WIN.x + SIDE.x + SIDE.w / 2, y: WIN.y + BTN.top + BTN.h / 2};
const UPTIME = {x: WIN.x + SIDE.x + 140, y: WIN.y + STATS_TOP + 65};

// Key beats (local frames) — locked to the soundtrack
const CLICK = 58;
const LIVE_START = CLICK + 4;
const LIVE_RAMP = LIVE_START + 80;
const TOAST = 148;

const VIDEOS = [
  {t: 'Morning Worship Set', d: '1:02:14', g: ['#F59E0B', '#B45309']},
  {t: 'Prayer & Reflection', d: '45:30', g: ['#FDBA74', '#7C2D12']},
  {t: 'Evening Hymns', d: '58:12', g: ['#FB923C', '#1E3A8A']},
  {t: 'Scripture Reading Vol. 2', d: '32:08', g: ['#FCD34D', '#92400E']},
  {t: 'Instrumental Peace', d: '1:20:45', g: ['#93C5FD', '#1E40AF']},
  {t: 'Sunday Sermon', d: '52:19', g: ['#FCA5A5', '#7F1D1D']},
];

const pad2 = (n: number) => String(Math.floor(n)).padStart(2, '0');

export const ActionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, mass: 0.9}, durationInFrames: 32});
  const exit = interpolate(frame, [188, 212], [0, 1], {...clamp, easing: EASE.in});
  const cam = interpolate(frame, [22, 55, 120, 158], [1, 1.1, 1.1, 1], {...clamp, easing: EASE.inOut});

  const cursor = cursorAt(frame, [
    {f: 18, x: 1820, y: 1080},
    {f: 50, x: GO_LIVE.x + 70, y: GO_LIVE.y + 6, arc: -60},
    {f: 80, x: GO_LIVE.x + 70, y: GO_LIVE.y + 6},
    {f: 112, x: UPTIME.x + 120, y: UPTIME.y + 30, arc: 50},
    {f: 150, x: UPTIME.x + 120, y: UPTIME.y + 30},
    {f: 186, x: 1500, y: 1000, arc: -40},
  ]);
  const press = interpolate(frame, [CLICK - 4, CLICK, CLICK + 6], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [CLICK, CLICK + 20], [0, 1], clamp);
  const cardHover = interpolate(frame, [108, 116, 150, 160], [0, 1, 1, 0], clamp);

  const live = frame >= LIVE_START;
  const ramp = interpolate(frame, [LIVE_START, LIVE_RAMP], [0, 1], {...clamp, easing: EASE.inOut});
  const uptime = ramp * 72 * 3600 + Math.max(0, frame - LIVE_RAMP) * 1; // fast-forward 72h, then real time
  const viewers = Math.round(interpolate(frame, [LIVE_START, LIVE_RAMP], [0, 1284], {...clamp, easing: EASE.out}));
  const nowPlaying = live ? Math.min(VIDEOS.length - 1, Math.floor(ramp * VIDEOS.length)) : -1;
  const imported = Math.round(interpolate(frame, [10, 34], [0, VIDEOS.length], clamp));
  const toastIn = spring({frame: frame - TOAST, fps, config: {damping: 18, stiffness: 140}});
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin(frame / 7));

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(enter * 1.4, 1) * (1 - exit),
        filter: `blur(${exit * 14}px)`,
        transform: `scale(${(1 - exit * 0.08) * cam})`,
        transformOrigin: `${GO_LIVE.x - 200}px ${GO_LIVE.y - 260}px`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 20,
          overflow: 'hidden',
          background: COLORS.surfaceHi,
          border: `1px solid ${COLORS.borderHi}`,
          boxShadow: '0 50px 120px rgba(20,27,52,0.16), 0 8px 24px rgba(20,27,52,0.06)',
          transform: `perspective(2200px) rotateX(${(1 - enter) * 16}deg) translateY(${(1 - enter) * 90}px) scale(${0.86 + 0.14 * enter})`,
          color: COLORS.text,
        }}
      >
        {/* Browser bar */}
        <div style={{height: BAR_H, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 8, borderBottom: `1px solid ${COLORS.border}`, background: '#EFEBE4'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c}} />
          ))}
          <div style={{margin: '0 auto', width: 440, height: 28, borderRadius: 8, background: '#fff', border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            studio.{BRAND.url}
          </div>
          <div style={{width: 52}} />
        </div>

        {/* Studio header */}
        <div style={{height: HEAD_H, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, borderBottom: `1px solid ${COLORS.border}`, background: '#fff'}}>
          <LogoMark size={34} />
          <span style={{fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em'}}>
            {BRAND.name}
            <span style={{fontWeight: 400, color: COLORS.muted}}> Studio</span>
          </span>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 16}}>
            <span
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                fontWeight: 600,
                letterSpacing: '0.04em',
                background: live ? 'rgba(229,50,45,0.1)' : '#F1EFEA',
                color: live ? COLORS.live : COLORS.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{width: 9, height: 9, borderRadius: '50%', background: live ? COLORS.live : '#BBB', opacity: live ? pulse : 1}} />
              {live ? 'LIVE · 24/7' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Library */}
        <Panel x={LIB.x} w={LIB.w} title="Video library" frame={frame} delay={8}>
          <div style={{display: 'flex', gap: 8, marginBottom: 14}}>
            <Tag active>Google Drive</Tag>
            <Tag>This device</Tag>
            <span style={{marginLeft: 'auto', fontSize: 14, color: COLORS.muted, alignSelf: 'center', fontVariantNumeric: 'tabular-nums'}}>{imported}/6 imported</span>
          </div>
          {VIDEOS.map((v, i) => {
            const a = interpolate(frame, [10 + i * 4, 24 + i * 4], [0, 1], {...clamp, easing: EASE.out});
            return (
              <div key={v.t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 76, borderTop: `1px solid ${COLORS.border}`, opacity: a, transform: `translateX(${(1 - a) * -20}px)`}}>
                <Thumb g={v.g} w={88} h={50} />
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{v.t}.mp4</div>
                  <div style={{fontSize: 14, color: COLORS.muted, fontFamily: monoFamily}}>{v.d}</div>
                </div>
              </div>
            );
          })}
        </Panel>

        {/* Program */}
        <Panel x={PROG.x} w={PROG.w} title="Program" frame={frame} delay={12} right={<Tag active>↻ Loop · 24/7</Tag>}>
          {VIDEOS.map((v, i) => {
            const a = interpolate(frame, [26 + i * 4, 40 + i * 4], [0, 1], {...clamp, easing: EASE.out});
            const playing = i === nowPlaying;
            return (
              <div
                key={v.t}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  height: 76,
                  padding: '0 12px',
                  marginBottom: 6,
                  borderRadius: 12,
                  background: playing ? 'rgba(35,72,216,0.07)' : '#fff',
                  border: `1px solid ${playing ? 'rgba(35,72,216,0.35)' : COLORS.border}`,
                  opacity: a,
                  transform: `translateX(${(1 - a) * -60}px)`,
                }}
              >
                <span style={{fontFamily: monoFamily, fontSize: 14, color: COLORS.muted, width: 22}}>{pad2(i + 1)}</span>
                <Thumb g={v.g} w={64} h={36} />
                <span style={{flex: 1, fontSize: 17, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{v.t}</span>
                {playing ? (
                  <span style={{fontSize: 13, fontWeight: 700, color: COLORS.accent, letterSpacing: '0.04em'}}>NOW PLAYING</span>
                ) : (
                  <span style={{fontSize: 14, color: COLORS.muted, fontFamily: monoFamily}}>{v.d}</span>
                )}
              </div>
            );
          })}
          <div style={{fontSize: 14, color: COLORS.muted, marginTop: 6}}>Runs 5h 31m · then repeats forever</div>
        </Panel>

        {/* Player */}
        <div style={{position: 'absolute', left: SIDE.x, top: TOP, width: SIDE.w, height: PLAYER_H, borderRadius: 16, overflow: 'hidden', background: '#0B0F1E', opacity: interpolate(frame, [14, 30], [0, 1], clamp)}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 50% 100%, ${(VIDEOS[Math.max(0, nowPlaying)] ?? VIDEOS[0]).g[0]} 0%, ${(VIDEOS[Math.max(0, nowPlaying)] ?? VIDEOS[0]).g[1]} 45%, #0B0F1E 85%)`,
              opacity: live ? 0.9 : 0.25,
              transform: `scale(${1.05 + Math.sin(frame / 30) * 0.03})`,
            }}
          />
          <div style={{position: 'absolute', left: 20, top: 18, display: 'flex', alignItems: 'center', gap: 10}}>
            {live && (
              <span style={{padding: '5px 10px', borderRadius: 6, background: COLORS.live, color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', opacity: 0.75 + 0.25 * pulse}}>● LIVE</span>
            )}
            <span style={{color: '#fff', fontSize: 17, fontWeight: 600}}>{BRAND.channel}</span>
          </div>
          <div style={{position: 'absolute', left: 20, bottom: 18, right: 20, color: '#fff'}}>
            <div style={{fontSize: 22, fontWeight: 700}}>{live ? VIDEOS[nowPlaying].t : 'Ready to broadcast'}</div>
            <div style={{fontSize: 14, opacity: 0.7, marginTop: 4}}>YouTube · RTMP destination</div>
          </div>
        </div>

        {/* Stats */}
        {[
          {label: 'Uptime', value: live ? `${pad2(uptime / 3600)}:${pad2((uptime % 3600) / 60)}:${pad2(uptime % 60)}` : '--:--:--', hover: cardHover},
          {label: 'Watching now', value: live ? viewers.toLocaleString('en-US') : '0', hover: 0},
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              position: 'absolute',
              left: SIDE.x + i * (SIDE.w / 2 + 8),
              top: STATS_TOP,
              width: SIDE.w / 2 - 8,
              height: 130,
              borderRadius: 16,
              background: '#fff',
              border: `1px solid ${s.hover > 0 ? `rgba(35,72,216,${0.3 + s.hover * 0.5})` : COLORS.border}`,
              boxShadow: s.hover > 0 ? `0 0 0 ${s.hover * 4}px rgba(35,72,216,0.10)` : 'none',
              padding: '20px 22px',
              transform: `scale(${1 + s.hover * 0.02})`,
              opacity: interpolate(frame, [18 + i * 4, 34 + i * 4], [0, 1], clamp),
            }}
          >
            <div style={{fontSize: 15, color: COLORS.muted}}>{s.label}</div>
            <div style={{fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 8, fontFamily: i === 0 ? monoFamily : undefined, fontVariantNumeric: 'tabular-nums'}}>{s.value}</div>
          </div>
        ))}

        {/* Destination */}
        <div style={{position: 'absolute', left: SIDE.x, top: DEST_TOP, width: SIDE.w, height: 86, borderRadius: 16, background: '#fff', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14, opacity: interpolate(frame, [24, 40], [0, 1], clamp)}}>
          <div style={{width: 46, height: 32, borderRadius: 8, background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14}}>▶</div>
          <div>
            <div style={{fontSize: 17, fontWeight: 600}}>YouTube · {BRAND.channel}</div>
            <div style={{fontSize: 14, color: COLORS.muted}}>Schedule: always on · starts now</div>
          </div>
          <span style={{marginLeft: 'auto', fontSize: 14, color: COLORS.success, fontWeight: 600}}>✓ Connected</span>
        </div>

        {/* Go live */}
        <div
          style={{
            position: 'absolute',
            left: SIDE.x,
            top: BTN.top,
            width: SIDE.w,
            height: BTN.h,
            borderRadius: 999,
            background: live ? 'rgba(229,50,45,0.1)' : COLORS.accent,
            border: live ? `1.5px solid ${COLORS.live}` : '1.5px solid transparent',
            color: live ? COLORS.live : '#fff',
            fontSize: 22,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transform: `scale(${1 - press * 0.05})`,
            boxShadow: live ? 'none' : `0 14px 34px rgba(35,72,216,${0.3 + press * 0.2})`,
            opacity: interpolate(frame, [28, 44], [0, 1], clamp),
          }}
        >
          {live ? (
            <>
              <span style={{width: 12, height: 12, borderRadius: '50%', background: COLORS.live, opacity: pulse}} />
              Live on repeat
            </>
          ) : (
            'Go live 24/7'
          )}
        </div>

        {/* Toast */}
        <div
          style={{
            position: 'absolute',
            left: PROG.x,
            bottom: 28,
            width: PROG.w,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 20px',
            borderRadius: 14,
            background: COLORS.text,
            color: '#fff',
            boxShadow: '0 20px 50px rgba(20,27,52,0.25)',
            fontSize: 18,
            fontWeight: 500,
            opacity: Math.min(toastIn, 1),
            transform: `translateY(${(1 - toastIn) * 40}px)`,
          }}
        >
          <span style={{width: 26, height: 26, borderRadius: '50%', background: COLORS.live, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12}}>●</span>
          You're live — no laptop, no OBS, no all-nighters
        </div>
      </div>

      <ClickRipple x={GO_LIVE.x + 74} y={GO_LIVE.y + 10} progress={ripple} />
      <Cursor x={cursor.x} y={cursor.y} press={press} opacity={interpolate(frame, [16, 24], [0, 1], clamp)} />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{x: number; w: number; title: string; frame: number; delay: number; right?: React.ReactNode; children: React.ReactNode}> = ({x, w, title, frame, delay, right, children}) => {
  const a = interpolate(frame, [delay, delay + 18], [0, 1], {...clamp, easing: EASE.out});
  return (
    <div style={{position: 'absolute', left: x, top: TOP, width: w, bottom: 24, borderRadius: 16, background: '#fff', border: `1px solid ${COLORS.border}`, padding: '20px 20px', opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: 14}}>
        <span style={{fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em'}}>{title}</span>
        <span style={{marginLeft: 'auto'}}>{right}</span>
      </div>
      {children}
    </div>
  );
};

const Tag: React.FC<{active?: boolean; children: React.ReactNode}> = ({active, children}) => (
  <span style={{padding: '6px 12px', borderRadius: 999, fontSize: 14, fontWeight: 500, background: active ? 'rgba(35,72,216,0.08)' : '#F4F2EE', color: active ? COLORS.accent : COLORS.muted, border: `1px solid ${active ? 'rgba(35,72,216,0.25)' : 'transparent'}`}}>
    {children}
  </span>
);

const Thumb: React.FC<{g: string[]; w: number; h: number}> = ({g, w, h}) => (
  <div style={{width: w, height: h, borderRadius: 8, flexShrink: 0, background: `linear-gradient(160deg, ${g[0]}, ${g[1]})`, position: 'relative'}}>
    <span style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.85)', fontSize: h * 0.4}}>▶</span>
  </div>
);
