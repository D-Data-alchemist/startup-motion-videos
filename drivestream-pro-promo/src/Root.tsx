import {Composition} from 'remotion';
import {Main} from './Main';
import {CREDIT_FRAMES, withCredit} from './components/Credit';
import {VIDEO} from './theme';

const Promo = withCredit(Main, VIDEO.durationInFrames);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SaaSPromo"
    component={Promo}
    durationInFrames={VIDEO.durationInFrames + CREDIT_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
