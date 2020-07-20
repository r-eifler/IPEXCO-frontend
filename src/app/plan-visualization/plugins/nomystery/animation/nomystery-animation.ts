import {AnimationLocation, AnimationPackage, AnimationTruck, NoMysteryAnimationTask} from '../nomystery-animation-task';

interface Action {
  name: string;
  args: string[];
}

const duration = 1.5;

export class NoMysteryAnimation {

  constructor(protected animationTask: NoMysteryAnimationTask) {
  }

  initPositions() {
    for (const loc of this.animationTask.locations.values()) {
      loc.objects = 0;
    }
    for (const truck of this.animationTask.trucks.values()) {
      truck.setInitPosition();
    }
    for (const p of this.animationTask.packages.values()) {
      p.setInitPosition();
    }
  }


  animateAction(action: Action): Promise<void> {
    // console.log('generate animation');
    switch (action.name) {
      case 'drive':
        const fuelCost: number =  Number(action.args[4].replace('level', ''));
        return this.driveAnimation(action.args[0], action.args[1], action.args[2], fuelCost);
      case 'load':
        return this.loadAnimation(action.args[0], action.args[1], action.args[2]);
      case 'unload':
        return this.unloadAnimation(action.args[0], action.args[1], action.args[2]);
    }
  }

  reverseAnimateAction(action: Action): Promise<void> {
  // console.log('generate animation');
  switch (action.name) {
    case 'drive':
      const fuelCost: number = - Number(action.args[4].replace('level', ''));
      return this.driveAnimation(action.args[0], action.args[2], action.args[1], -5);
    case 'load':
      return this.unloadAnimation(action.args[0], action.args[1], action.args[2]);
    case 'unload':
      return this.loadAnimation(action.args[0], action.args[1], action.args[2]);
  }
}


  driveAnimation(truckId: string, sourceLocId: string, targetLocId: string, fuelDelta: number): Promise<void> {
    const truck: AnimationTruck = this.animationTask.trucks.get(truckId);
    const targetLocation: AnimationLocation = this.animationTask.locations.get(targetLocId);

    return truck.animateDriveTo(targetLocation);

  }


  loadAnimation(p: string, t: string, locId: string) {
    const truck: AnimationTruck = this.animationTask.trucks.get(t);
    const pack: AnimationPackage = this.animationTask.packages.get(p);

    return pack.animateLoad(truck);
  }

  unloadAnimation(p: string, t: string, locId: string) {
    const truck: AnimationTruck = this.animationTask.trucks.get(t);
    const pack: AnimationPackage = this.animationTask.packages.get(p);
    const loc: AnimationLocation = this.animationTask.locations.get(locId);

    return pack.animateUnLoad(truck, loc);
  }

}
