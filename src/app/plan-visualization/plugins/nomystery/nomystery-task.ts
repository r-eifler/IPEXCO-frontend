import {TaskSchema} from '../../../interface/task-schema';
import {Task} from '../task';


export class Location {
  public group: number;

  constructor(public name: string) {}
}



export class Road {

  constructor(public source: Location, public target: Location, public fuelCost: number) {
  }
}


export class Truck {
  public startLocation?: Location;
  public startFuel?: number;

  constructor(public name: string) {}
}

export class Package {
  startLocation?: Location;
  goalLocation?: Location;

  constructor(public name: string) {}
}


export class NoMysteryTask extends Task {

  public trucks: Map<string, Truck> = new Map();
  public locations: Map<string, Location> = new Map();
  public roads: Road[] = [];
  public packages: Map<string, Package> = new Map();


  constructor(taskSchema: TaskSchema) {
    super(taskSchema);
    // console.log('Create NoMystery Task');
    this.parseObjects();
    this.parseInit();
    this.parseGoals();

  }

  parseObjects() {
    for (const o of this.taskSchema.objects) {
      if (o.type === 'location') {
        this.locations.set(o.name, new Location(o.name));
      }
      if (o.type === 'truck') {
        this.trucks.set(o.name, new Truck(o.name));
      }
      if (o.type === 'package') {
        this.packages.set(o.name, new Package(o.name));
      }
    }
  }

  parseInit() {
    const regexRoad = RegExp('fuelcost\\(level(\\d+),l(\\d+),l(\\d+)\\)');
    const regexInitTruck = RegExp('at\\(t(\\d),l(\\d+)\\)');
    const regexInitPackage = RegExp('at\\(p(\\d),l(\\d+)\\)');
    const regexInitFuel = RegExp('fuel\\(t(\\d),level(\\d+)\\)');

    for (const pred of this.taskSchema.init) {
      let match = regexRoad.exec(pred);
      if (match) {
        const souceName = 'l' + match[2];
        const targetName = 'l' + match[3];
        const fuelCost = Number(match[1]);
        this.roads.push(new Road(this.locations.get(souceName), this.locations.get(targetName), fuelCost));
        continue;
      }

      match = regexInitTruck.exec(pred);
      if (match) {
        const truckName = 't' + match[1];
        const loc = 'l' + match[2];

        const truck = this.trucks.get(truckName);
        truck.startLocation = this.locations.get(loc);
      }

      match = regexInitPackage.exec(pred);
      if (match) {
        const packageName = 'p' + match[1];
        const loc = 'l' + match[2];

        const p = this.packages.get(packageName);
        p.startLocation = this.locations.get(loc);
      }

      match = regexInitFuel.exec(pred);
      if (match) {
        const truckName = 't' + match[1];
        const fuellevel = Number(match[2]);

        const truck = this.trucks.get(truckName);
        truck.startFuel = fuellevel;
      }
    }
  }


  parseGoals() {
    const regexGoalPackage = RegExp('at\\(p(\\d),l(\\d+)\\)');

    for (const pred of this.taskSchema.goals) {

      const match = regexGoalPackage.exec(pred.name);
      if (match) {
        const packageName = 'p' + match[1];
        const loc = 'l' + match[2];

        const p = this.packages.get(packageName);
        p.goalLocation = this.locations.get(loc);
      }
    }
  }

}

export function nodeDegree(nodeName: string, roads: Road[]) {
  let d = 0;
  for (const l of roads) {
    if (l.source.name === nodeName || l.target.name === nodeName) {
      d += 1;
    }
  }
  return d;
}
