import { Task } from '../plugins/nomystery/task';


export abstract class AnimationInitializer {

  constructor(protected svgContainerId: string, protected task: Task) {}

  abstract restart();
}
