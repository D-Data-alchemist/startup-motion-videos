import {Composition} from 'remotion';
import {Main} from './Main';
import {Explainer, EXPLAINER} from './explainer/Explainer';
import {VIDEO} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SaaSPromo"
      component={Main}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Explainer"
      component={Explainer}
      durationInFrames={EXPLAINER.total}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
