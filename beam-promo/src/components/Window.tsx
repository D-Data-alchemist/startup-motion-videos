import {COLORS} from '../theme';

// A macOS window whose ring "wears the Mac it came from" (as on beam.win)
export const Win: React.FC<{
  title: string;
  from?: string;
  ring?: string;
  w: number;
  h: number;
  children?: React.ReactNode;
  glow?: number;
}> = ({title, from, ring, w, h, children, glow = 0}) => (
  <div style={{width: w, height: h, borderRadius: 14, background: '#1C1C1E', overflow: 'hidden', boxShadow: `0 0 0 ${ring ? 2.5 : 1}px ${ring ?? 'rgba(255,255,255,0.12)'}, 0 0 ${40 * glow}px ${ring ?? 'transparent'}, 0 30px 80px rgba(0,0,0,0.55)`}}>
    <div style={{height: 38, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', background: '#2A2A2D', borderBottom: '1px solid rgba(0,0,0,0.4)'}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />)}
      <span style={{flex: 1, textAlign: 'center', fontSize: 15, color: '#C9CDD1', fontWeight: 500}}>{title}</span>
      {from && (
        <span style={{fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: ring, color: '#08110D'}}>{from}</span>
      )}
    </div>
    <div style={{position: 'relative', height: h - 38}}>{children}</div>
  </div>
);
