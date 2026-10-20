import {interpolate} from 'remotion';
import {monoFamily} from '../theme';
import {BLUE, clamp, INK, RED} from './kit';

// Side-view drawing of the hero part (flange shaft), drawn in blue ink. viewBox 0 0 400 520.
const OUTLINE = [
  'M110 40 H290 V108 H110 Z',
  'M144 108 H256 V248 H144 Z',
  ...[0, 1, 2, 3, 4, 5].map((i) => `M124 ${260 + i * 28} H276 V${276 + i * 28} H124 Z`),
  'M160 432 H240 V484 H160 Z',
];
// Right-half cutting path (offset from the profile) for the toolpath animation
const TOOLPATH: [number, number][] = [
  [200, 26], [302, 26], [302, 120], [268, 120], [268, 254],
  ...[0, 1, 2, 3, 4, 5].flatMap((i) => [[288, 254 + i * 28], [288, 282 + i * 28], [268, 282 + i * 28]] as [number, number][]),
  [252, 426], [252, 494], [200, 494],
];
const SEG = TOOLPATH.slice(1).map((p, i) => Math.hypot(p[0] - TOOLPATH[i][0], p[1] - TOOLPATH[i][1]));
const TOTAL = SEG.reduce((a, b) => a + b, 0);

const pointAt = (t: number): [number, number] => {
  let d = t * TOTAL;
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i]) {
      const k = d / SEG[i];
      return [TOOLPATH[i][0] + (TOOLPATH[i + 1][0] - TOOLPATH[i][0]) * k, TOOLPATH[i][1] + (TOOLPATH[i + 1][1] - TOOLPATH[i][1]) * k];
    }
    d -= SEG[i];
  }
  return TOOLPATH[TOOLPATH.length - 1];
};

export const PartDrawing: React.FC<{draw: number; dims?: number; tool?: number; height: number}> = ({draw, dims = 1, tool = -1, height}) => {
  const tp = Math.max(0, tool);
  const [tx, ty] = pointAt(tp);
  return (
    <svg height={height} width={(height * 400) / 520} viewBox="0 0 400 520" style={{overflow: 'visible'}}>
      <line x1="200" y1="10" x2="200" y2="510" stroke={BLUE} strokeWidth="1" strokeDasharray="10 4 2 4" opacity={0.6 * draw} />
      <g fill="none" stroke={BLUE} strokeWidth="2.4" strokeLinejoin="round">
        {OUTLINE.map((d, i) => (
          <path key={i} d={d} strokeDasharray="700" strokeDashoffset={700 * (1 - interpolate(draw, [i * 0.06, 0.45 + i * 0.06], [0, 1], clamp))} />
        ))}
      </g>
      <g stroke={INK} strokeWidth="1.2" fill={INK} fontFamily={monoFamily} fontSize="15" opacity={dims}>
        <line x1="110" y1="22" x2="290" y2="22" />
        <path d="M110 22 l10 -4 v8 z M290 22 l-10 -4 v8 z" stroke="none" />
        <text x="178" y="14" stroke="none">Ø48</text>
        <line x1="340" y1="40" x2="340" y2="484" />
        <path d="M340 40 l-4 10 h8 z M340 484 l-4 -10 h8 z" stroke="none" />
        <text x="350" y="268" stroke="none">86</text>
        <line x1="70" y1="260" x2="70" y2="424" />
        <text x="18" y="348" stroke="none">M30</text>
      </g>
      {tool >= 0 && (
        <g>
          <polyline points={TOOLPATH.map((p) => p.join(',')).join(' ')} fill="none" stroke={RED} strokeWidth="2" strokeDasharray={`${TOTAL}`} strokeDashoffset={TOTAL * (1 - tp)} />
          <circle cx={tx} cy={ty} r="7" fill={RED} />
          <circle cx={tx} cy={ty} r="14" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.5" />
        </g>
      )}
    </svg>
  );
};
