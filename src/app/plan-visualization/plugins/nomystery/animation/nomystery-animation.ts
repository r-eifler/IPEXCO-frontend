import { Action } from "src/app/interface/plannig-task";
import {
  AnimationLocation,
  AnimationPackage,
  AnimationTruck,
  NoMysteryAnimationTask,
} from "./nomystery-animation-task";

const duration = 1.5;

export class NoMysteryAnimation {
  constructor(protected animationTask: NoMysteryAnimationTask) {}

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
      case "drive":
        const fuelCost: number = Number(
          action.parameters[4].name.replace("level", "")
        );
        return this.driveAnimation(
          action.parameters[0].name,
          action.parameters[1].name,
          action.parameters[2].name,
          fuelCost
        );
      case "load":
        return this.loadAnimation(
          action.parameters[0].name,
          action.parameters[1].name,
          action.parameters[2].name
        );
      case "unload":
        return this.unloadAnimation(
          action.parameters[0].name,
          action.parameters[1].name,
          action.parameters[2].name
        );
    }
  }

  reverseAnimateAction(action: Action): Promise<void> {
    // console.log('generate animation');
    switch (action.name) {
      case "drive":
        const fuelCost: number = -Number(
          action.parameters[4].name.replace("level", "")
        );
        return this.driveAnimation(
          action.parameters[0].name,
          action.parameters[1].name,
          action.parameters[2].name,
          fuelCost
        );
      case "load":
        return this.unloadAnimation(
          action.parameters[0].name,
          action.parameters[1].name,
          action.parameters[2].name
        );
      case "unload":
        return this.loadAnimation(
          action.parameters[0].name,
          action.parameters[1].name,
          action.parameters[2].name
        );
    }
  }

  driveAnimation(
    truckId: string,
    sourceLocId: string,
    targetLocId: string,
    fuelDelta: number
  ): Promise<void> {
    const truck: AnimationTruck = this.animationTask.trucks.get(truckId);
    const targetLocation: AnimationLocation =
      this.animationTask.locations.get(targetLocId);

    return truck.animateDriveTo(targetLocation, fuelDelta);
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
