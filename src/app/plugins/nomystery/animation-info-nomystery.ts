import { Road, Location, Package, Truck } from './nomystery-task';
import { NoMysteryTask } from './nomystery-task';
import { AnimationInfo } from './../../animation/animation-info';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';


const maxPositionLocation = 6;
const radius = 20;
const maxPositionsTruck = 6;
const packageSize = 20;


export class AnimationNode implements SimulationNodeDatum {
  public x = 0;
  public y = 0;
  public strength = -10;
  public objects = 0;

  constructor(public id: string) {}

  getFreePosition(): {x: number, y: number} {
    const alpha = this.objects / maxPositionLocation * 2 * Math.PI;
    const dx = Math.cos(alpha) * radius;
    const dy = Math.sin(alpha) * radius;
    console.log('free position');
    return {x: this.x + dx, y: this.y + dy};
  }

  addObject() {
    this.objects++;
  }

  removeObject() {
    this.objects--;
  }
}

export class AnimationLink<T> implements SimulationLinkDatum<T> {

  constructor(public source: T, public target: T) {}
}


export class AnimationLocation extends AnimationNode {
  public degree: number;

  constructor(private loc: Location) {
    super(loc.name);
    this.strength = -300;
  }
}

export class AnimationRoad extends AnimationLink<AnimationLocation> {

  constructor(source: AnimationLocation, target: AnimationLocation, private road: Road) {
    super(source, target);
  }
}

export class AnimationTruck extends AnimationNode {
  public currentLocation?: AnimationLocation;
  public currentFuel?: number;
  public loadedPackages: AnimationPackage[] = [];

  constructor(private truck: Truck, public startLocation: AnimationLocation) {
    super(truck.name);
    this.strength = -50;
  }

  getInitFuel(): number {
    return this.truck.startFuel;
  }

  getFreePosition(): {x: number, y: number} {
    return this.getPositionByIndex(this.loadedPackages.length);
  }

  getPositionByIndex(index: number): {x: number, y: number} {
    const dx = index % (maxPositionsTruck / 2) * (packageSize + 5) + 28;
    let dy = 5;
    if (index > maxPositionsTruck / 2) {
      dy = packageSize + 5;
    }
    return {x: this.x + dx, y: this.y + dy};
  }
}

export class AnimationPackage extends AnimationNode {
  public currentLocation?: AnimationLocation;

  constructor(private pack: Package, public startLocation: AnimationLocation, public goalLocation: AnimationLocation) {
    super(pack.name);
    this.strength = -50;
  }
}



export class AnimationInfoNoMystery extends AnimationInfo {

  public trucks: Map<string, AnimationTruck> = new Map();
  public locations: Map<string, AnimationLocation> = new Map();
  public roads: AnimationRoad[] = [];
  public packages: Map<string, AnimationPackage> = new Map();

  constructor(protected task: NoMysteryTask) {
    super(task);
    this.buildFromTask();
  }

  buildFromTask(): void {
    for (const loc of this.task.locations.values()) {
      this.locations.set(loc.name, new AnimationLocation(loc));
    }
    for (const road of this.task.roads) {
      this.roads.push(new AnimationRoad(this.locations.get(road.source.name), this.locations.get(road.target.name), road));
    }
    for (const truck of this.task.trucks.values()) {
      this.trucks.set(truck.name, new AnimationTruck(truck, this.locations.get(truck.startLocation.name)));
    }
    for (const pack of this.task.packages.values()) {
      this.packages.set(pack.name,
        new AnimationPackage(pack, this.locations.get(pack.startLocation.name), this.locations.get(pack.goalLocation.name)));
    }
  }
}
