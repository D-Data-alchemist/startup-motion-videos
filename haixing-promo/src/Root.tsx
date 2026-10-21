import {Composition} from 'remotion';
import {Main} from './Main';
import {Light} from './light/Light';
import {LIGHT} from './light/timeline';
import {Journey} from './journey/Journey';
import {J} from './journey/timeline';
import {CREDIT_FRAMES, withCredit} from './components/Credit';
import {VIDEO} from './theme';

const Cinematic = withCredit(Main, VIDEO.durationInFrames);
const LightFilm = withCredit(Light, LIGHT.total);
const JourneyFilm = withCredit(Journey, J.total);

export const RemotionRoot: React.FC = () => (
  <>
    {/* Dark cinematic cut */}
    <Composition id="SaaSPromo" component={Cinematic} durationInFrames={VIDEO.durationInFrames + CREDIT_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* Light, continuous cut modelled on the client's reference films */}
    <Composition id="HaixingLight" component={LightFilm} durationInFrames={LIGHT.total + CREDIT_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* "The 24-Hour Part" — demonstration film built from top industrial-marketing principles */}
    <Composition id="HaixingJourney" component={JourneyFilm} durationInFrames={J.total + CREDIT_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  </>
);
