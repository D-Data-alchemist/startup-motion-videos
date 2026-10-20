import {Composition} from 'remotion';
import {Main} from './Main';
import {Light} from './light/Light';
import {LIGHT} from './light/timeline';
import {Journey} from './journey/Journey';
import {J} from './journey/timeline';
import {VIDEO} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Dark cinematic cut */}
    <Composition id="SaaSPromo" component={Main} durationInFrames={VIDEO.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* Light, continuous cut modelled on the client's reference films */}
    <Composition id="HaixingLight" component={Light} durationInFrames={LIGHT.total} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* "The 24-Hour Part" — demonstration film built from top industrial-marketing principles */}
    <Composition id="HaixingJourney" component={Journey} durationInFrames={J.total} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  </>
);
