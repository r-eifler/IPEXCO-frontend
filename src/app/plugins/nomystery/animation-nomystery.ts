import {AnimationProviderNoMystery} from './animation-provider-nomystery';
import {AnimationInitializerNoMystery} from './animation-initializer-nomystery';
import {AnimationInfoNoMystery} from './animation-info-nomystery';
import {NoMysteryTask} from './nomystery-task';
import {Animation} from '../../plan-visualization/animation';
import {Action} from 'src/app/interface/plan';


export class AnimationNoMystery extends Animation {

  animationInfo: AnimationInfoNoMystery;
  animationInitializer: AnimationInitializerNoMystery;
  animationProvider: AnimationProviderNoMystery;

  constructor(task: NoMysteryTask) {
    super(task);
    this.animationInfo = new AnimationInfoNoMystery(task);
    this.animationInitializer = new AnimationInitializerNoMystery('#planSVG', this.animationInfo);
    this.animationProvider = new AnimationProviderNoMystery(this.animationInfo);
  }

  animateAction(action: Action): Promise<void> {
    return this.animationProvider.animateAction(action);
  }

  reverseAnimateAction(action: Action): Promise<void> {
    return this.animationProvider.reverseAnimateAction(action);
  }

  restart(): void {
    this.animationInitializer.restart();
  }

}
