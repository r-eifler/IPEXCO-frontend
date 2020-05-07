import { Graph, D3Link, D3Node} from './../../interface/d3types';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DomainSpecification } from './../../interface/domain-specification';
import { TaskSchema } from './../../interface/schema';
import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';


export class Node implements SimulationNodeDatum {
  public x: number;
  public y: number;
  public fx: number;
  public fy: number;
  public strength = -10;
  public fixed = false;

  constructor(public id: string) {}
}

export class Link<T> implements SimulationLinkDatum<T> {

  constructor(public source: T, public target: T) {}
}


export class Location extends Node {
  public name: string;
  public group: number;
  public degree: number;

  constructor(id: string) {
    super(id);
    this.strength = -300;
  }
}



export class Road extends Link<Location> {
  public fuelCost: number;

  constructor(source: Location, target: Location) {
    super(source, target);
  }
}


export class Truck extends Node {
  public startLocation?: Location;
  public fuel?: number;
  public loadedPackages: Package[] = [];

  constructor(id: string, public name: string) {
    super(id);
    this.strength = -50;
  }
}

export class Package extends Node {
  startLocation?: Location;
  goalLocation?: Location;

  constructor(id: string, public name: string) {
    super(id);
    this.strength = -50;
  }
}


export class Task {

  public trucks: Map<string, Truck> = new Map();
  public locations: Map<string, Location> = new Map();
  public roads: Road[] = [];
  public packages: Map<string, Package> = new Map();

  public startPackageLinks: Link<Node>[] = [];
  public goalPackageLinks: Link<Node>[] = [];

  public truckLinks: Link<Node>[] = [];


  constructor(private taskSchema: TaskSchema) {
    console.log('Create NoMystery Task');
    this.parseObjects();
    this.parseInit();
    for (const n of this.locations.values()) {
      n.degree = nodeDegree(n.id, this.roads);
    }
    this.parseGoals();

  }

  parseObjects() {
    for (const o of this.taskSchema.objects) {
      if (o.type === 'location') {
        this.locations.set(o.name, new Location(o.name));
      }
      if (o.type === 'truck') {
        this.trucks.set(o.name, new Truck(o.name, o.name));
      }
      if (o.type === 'package') {
        this.packages.set(o.name, new Package(o.name, o.name));
      }
    }
  }

  parseInit() {
    const regexRoad = RegExp('fuelcost\\(level(\\d+),l(\\d+),l(\\d+)\\)');
    const regexInitTruck = RegExp('at\\(t(\\d),l(\\d+)\\)');
    const regexInitPackage = RegExp('at\\(p(\\d),l(\\d+)\\)');

    for (const pred of this.taskSchema.init) {
      let match = regexRoad.exec(pred);
      if (match) {
        const souceName = 'l' + match[2];
        const targetName = 'l' + match[3];
        const fuelCost = Number(match[1]);
        this.roads.push(new Road(this.locations.get(souceName), this.locations.get(targetName)));
        continue;
      }

      match = regexInitTruck.exec(pred);
      if (match) {
        const truckName = 't' + match[1];
        const loc = 'l' + match[2];

        const truck = this.trucks.get(truckName);
        truck.startLocation = this.locations.get(loc);
        const link: Link<Node> = new Link<Node>(truck, truck.startLocation);
        this.truckLinks.push(link);
      }

      match = regexInitPackage.exec(pred);
      if (match) {
        const packageName = 'p' + match[1];
        const loc = 'l' + match[2];

        const p = this.packages.get(packageName);
        p.startLocation = this.locations.get(loc);
        this.startPackageLinks.push(new Link(p, p.startLocation));
      }
    }
  }


  parseGoals() {
    const regexGoalPackage = RegExp('at\\(p(\\d),l(\\d+)\\)');

    for (const pred of this.taskSchema.goal) {

      const match = regexGoalPackage.exec(pred);
      if (match) {
        const packageName = 'p' + match[1];
        const loc = 'l' + match[2];

        const p = this.packages.get(packageName);
        p.goalLocation = this.locations.get(loc);
        this.goalPackageLinks.push(new Link(p, p.goalLocation));
      }
    }
  }

  toD3Types() {
    const graph: Graph = {nodes: [], links: []};
    const nodeMap: Map<string, D3Node> = new Map();
    for (const l of this.locations.values()) {
      graph.nodes.push(l);
    }
    for (const r of this.roads) {
      if (r.source.id < r.target.id) {
        graph.links.push(new D3Link(nodeMap.get(r.source.id), nodeMap.get(r.target.id)));
      }
    }
    for (const n of this.locations.values()) {
      n.degree = nodeDegree(n.id, this.roads);
    }
    return graph;
  }
}

export function nodeDegree(nodeId: string, roads: Road[]) {
  let d = 0;
  for (const l of roads) {
    if (l.source.id === nodeId || l.target.id === nodeId) {
      d += 1;
    }
  }
  return d;
}
