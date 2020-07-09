import {AnimationInfoNoMystery, AnimationLocation, AnimationPackage, AnimationTruck} from './animation-info-nomystery';
import * as d3 from 'd3';
import {AnimationProvider} from 'src/app/plan-visualization/integration/animation-provider';

interface Action {
  name: string;
  args: string[];
}

const duration = 1.5;

export class AnimationProviderNoMystery extends AnimationProvider {

  constructor(protected animationInfo: AnimationInfoNoMystery) {
    super();
  }

  animateAction(action: Action): Promise<void> {
    console.log('generate animation');
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
  console.log('generate animation');
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
    const truck: AnimationTruck = this.animationInfo.trucks.get(truckId);
    const targetLocation: AnimationLocation = this.animationInfo.locations.get(targetLocId);

    const tpos = targetLocation.getFreePosition();
    const dx = tpos.x -  truck.currentLocation.x;
    const dy = tpos.y -  truck.currentLocation.y;

    truck.currentFuel -= fuelDelta;
    truck.x = tpos.x;
    truck.y = tpos.y;
    targetLocation.addObject();
    truck.currentLocation.removeObject();
    truck.currentLocation = targetLocation;

    // gsap.to('#' + id, {duration, x: dx, y: dy});

    let numberAnimations = 0;
    numberAnimations = truck.loadedPackages.length + 1;

    let animationsEnded = 0;

    const animationPromise = new Promise<void>((resolve, reject) => {
      d3.select('#' + truckId).transition()
      .duration(1000 * duration)
      .attr('x', tpos.x)
      .attr('y', tpos.y)
      .on('end', () => this.resolveWhenCountReached(resolve, ++animationsEnded, numberAnimations));

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < truck.loadedPackages.length; i++){
        const p = truck.loadedPackages[i];
        const newPPos = truck.getPositionByIndex(i);
        p.x = newPPos.x;
        p.y = newPPos.y;
        d3.select('#' + p.id).transition()
          .duration(1000 * duration)
          .attr('x', newPPos.x)
          .attr('y', newPPos.y)
          .on('end', () => this.resolveWhenCountReached(resolve, ++animationsEnded, numberAnimations));
      }
    });

    return animationPromise;

  }

  private  resolveWhenCountReached(resolve: () => void, count: number, expectedCount: number) {
    if (count >= expectedCount)  {
      resolve();
    }
  }

  loadAnimation(p: string, t: string, locId: string) {
    const truck: AnimationTruck = this.animationInfo.trucks.get(t);
    const pack: AnimationPackage = this.animationInfo.packages.get(p);

    const newPos = truck.getFreePosition();

    truck.currentLocation.removeObject();
    pack.x = newPos.x;
    pack.y = newPos.y;
    truck.loadedPackages.push(pack);

    const animationPromise = new Promise<void>((resolve, reject) => {
      d3.select('#' + pack.id).transition()
        .duration(1000 * duration)
        .attr('x', newPos.x)
        .attr('y', newPos.y)
        .on('end', () => resolve());
    });

    return animationPromise;
  }

  unloadAnimation(p: string, t: string, locId: string) {
    const truck: AnimationTruck = this.animationInfo.trucks.get(t);
    const pack: AnimationPackage = this.animationInfo.packages.get(p);

    const pos = truck.currentLocation.getFreePosition();

    truck.currentLocation.addObject();
    pack.x = pos.x;
    pack.y = pos.y;
    truck.loadedPackages.splice(truck.loadedPackages.indexOf(pack), 1);

    const animationPromise = new Promise<void>((resolve, reject) => {
      d3.select('#' + pack.id).transition()
        .duration(1000 * duration)
        .attr('x', pos.x)
        .attr('y', pos.y)
        .on('end', () => resolve());
    });

    return animationPromise;
  }

}
