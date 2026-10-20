import {interpolate} from 'remotion';
import {EASE} from '../theme';

export type CursorKey = {f: number; x: number; y: number; arc?: number};

// Eased, slightly arced travel between keyframes — reads as a human hand, not a tween
export const cursorAt = (frame: number, keys: CursorKey[]) => {
  if (frame <= keys[0].f) return {x: keys[0].x, y: keys[0].y};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], {easing: EASE.inOut});
      const arc = Math.sin(Math.PI * t) * (b.arc ?? -50);
      return {x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t + arc};
    }
  }
  const last = keys[keys.length - 1];
  return {x: last.x, y: last.y};
};

// press: 0 = idle, 1 = fully pressed
export const Cursor: React.FC<{x: number; y: number; press?: number; opacity?: number}> = ({
  x,
  y,
  press = 0,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      transform: `scale(${1 - press * 0.18})`,
      transformOrigin: '4px 4px',
      filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.25))',
      zIndex: 100,
    }}
  >
    <svg width="34" height="40" viewBox="0 0 34 40">
      <path
        d="M4 3 L4 31 L11.5 24.5 L16.5 36 L21.5 33.8 L16.6 22.6 L26.5 22.6 Z"
        fill="#111"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// Expanding ring on click
export const ClickRipple: React.FC<{x: number; y: number; progress: number}> = ({x, y, progress}) =>
  progress <= 0 || progress >= 1 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x - 40,
        top: y - 40,
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: '2px solid rgba(59,108,246,0.8)',
        transform: `scale(${0.2 + progress * 1.3})`,
        opacity: 1 - progress,
        zIndex: 99,
      }}
    />
  );
