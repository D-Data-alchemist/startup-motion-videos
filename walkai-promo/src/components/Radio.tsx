import {COLORS, mono} from '../theme';

// A generic handheld two-way radio, drawn in code
export const Radio: React.FC<{
  scale?: number;
  tx?: boolean; // transmitting (PTT held)
  rx?: boolean; // receiving
  lcd: string;
  ptt?: number; // 0..1 press depth
}> = ({scale = 1, tx = false, rx = false, lcd, ptt = 0}) => (
  <div style={{position: 'relative', width: 300 * scale, height: 760 * scale}}>
    {/* antenna */}
    <div style={{position: 'absolute', left: 64 * scale, top: 0, width: 34 * scale, height: 240 * scale, borderRadius: 17 * scale, background: 'linear-gradient(90deg,#1b1d22,#3a3e47,#1b1d22)'}} />
    <div style={{position: 'absolute', left: 190 * scale, top: 120 * scale, width: 40 * scale, height: 44 * scale, borderRadius: 8 * scale, background: '#2a2d34'}} />
    {/* PTT on the side */}
    <div style={{position: 'absolute', left: -18 * scale + ptt * 8 * scale, top: 330 * scale, width: 26 * scale, height: 130 * scale, borderRadius: 10 * scale, background: tx ? COLORS.orange : '#2f333b', boxShadow: tx ? `0 0 ${30 * scale}px ${COLORS.orange}` : 'none'}} />
    {/* body */}
    <div style={{position: 'absolute', left: 0, top: 200 * scale, width: 300 * scale, height: 560 * scale, borderRadius: 46 * scale, background: 'linear-gradient(160deg,#30343d 0%,#1a1c21 60%,#121317 100%)', boxShadow: `inset 0 2px 0 rgba(255,255,255,0.08), 0 ${40 * scale}px ${80 * scale}px rgba(0,0,0,0.5)`}}>
      {/* status LED */}
      <div style={{position: 'absolute', right: 34 * scale, top: 26 * scale, width: 18 * scale, height: 18 * scale, borderRadius: 9 * scale, background: tx ? '#FF3B30' : rx ? COLORS.emerald : '#3a3e47', boxShadow: tx ? `0 0 ${18 * scale}px #FF3B30` : rx ? `0 0 ${18 * scale}px ${COLORS.emerald}` : 'none'}} />
      {/* speaker grille */}
      <div style={{position: 'absolute', left: 40 * scale, top: 60 * scale, width: 220 * scale, height: 170 * scale, borderRadius: 20 * scale, backgroundImage: 'radial-gradient(#0a0b0e 34%, transparent 36%)', backgroundSize: `${16 * scale}px ${16 * scale}px`, opacity: 0.9}} />
      {/* LCD */}
      <div style={{position: 'absolute', left: 36 * scale, top: 256 * scale, width: 228 * scale, height: 104 * scale, borderRadius: 12 * scale, background: tx || rx ? COLORS.lcdBg : '#121a16', border: `${2 * scale}px solid #0b0d10`, padding: `${12 * scale}px ${16 * scale}px`, fontFamily: mono, color: tx || rx ? COLORS.lcd : '#4c6b5a', boxShadow: tx || rx ? `inset 0 0 ${24 * scale}px rgba(126,240,196,0.18)` : 'none'}}>
        <div style={{fontSize: 18 * scale, display: 'flex', justifyContent: 'space-between'}}>
          <span>CH 01</span>
          <span>{tx ? 'TX' : rx ? 'RX' : 'STBY'}</span>
        </div>
        <div style={{fontSize: 34 * scale, fontWeight: 700, marginTop: 4 * scale, letterSpacing: '0.04em'}}>{lcd}</div>
      </div>
      {/* keypad */}
      <div style={{position: 'absolute', left: 44 * scale, top: 390 * scale, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 * scale, width: 212 * scale}}>
        {Array.from({length: 9}, (_, i) => (
          <div key={i} style={{height: 34 * scale, borderRadius: 8 * scale, background: '#262930', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'}} />
        ))}
      </div>
    </div>
  </div>
);
