import {Composition} from 'remotion';
import {Main} from './Main';
import {Explainer, EXPLAINER} from './explainer/Explainer';
import {CREDIT_FRAMES, withCredit} from './components/Credit';
import {VIDEO} from './theme';

const Promo = withCredit(Main, VIDEO.durationInFrames);
const ExplainerFilm = withCredit(Explainer, EXPLAINER.total);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SaaSPromo"
      component={Promo}
      durationInFrames={VIDEO.durationInFrames + CREDIT_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Explainer"
      component={ExplainerFilm}
      durationInFrames={EXPLAINER.total + CREDIT_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
