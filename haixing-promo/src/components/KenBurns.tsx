import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';

// Full-bleed photo with a slow cinematic push/pan and a dark grade
export const KenBurns: React.FC<{
  src: string;
  duration: number;
  from?: number;
  to?: number;
  panX?: number;
  panY?: number;
  shade?: number;
  style?: React.CSSProperties;
}> = ({src, duration, from = 1.05, to = 1.18, panX = 0, panY = 0, shade = 0.55, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${from + (to - from) * p}) translate(${panX * p}px, ${panY * p}px)`,
          filter: 'saturate(0.85) contrast(1.1)',
        }}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(5,7,12,${shade * 0.6}) 0%, rgba(5,7,12,${shade}) 60%, rgba(5,7,12,${Math.min(1, shade + 0.3)}) 100%)`}} />
    </AbsoluteFill>
  );
};
