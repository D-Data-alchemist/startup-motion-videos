import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Deterministic grinding sparks: each particle is born on a loop, flies out of the emitter and falls with gravity
export const Sparks: React.FC<{x: number; y: number; count?: number; spread?: number; power?: number; opacity?: number; seed?: string}> = ({
  x,
  y,
  count = 90,
  spread = 1,
  power = 1,
  opacity = 1,
  seed = 's',
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'screen', pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const life = 18 + random(`${seed}l${i}`) * 26;
        const t = (frame + random(`${seed}o${i}`) * life) % life;
        const angle = -Math.PI / 2 + (random(`${seed}a${i}`) - 0.5) * 2.4 * spread;
        const speed = (14 + random(`${seed}v${i}`) * 26) * power;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const px = x + vx * t;
        const py = y + vy * t + 0.9 * t * t;
        const dirX = vx;
        const dirY = vy + 1.8 * t;
        const rot = (Math.atan2(dirY, dirX) * 180) / Math.PI;
        const fade = 1 - t / life;
        const len = 10 + Math.hypot(dirX, dirY) * 0.9;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: len,
              height: 2.5,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${COLORS.spark}, #FFF6D8)`,
              boxShadow: `0 0 10px ${COLORS.spark}`,
              opacity: fade,
              transform: `translate(-100%, -50%) rotate(${rot}deg)`,
              transformOrigin: 'right center',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
