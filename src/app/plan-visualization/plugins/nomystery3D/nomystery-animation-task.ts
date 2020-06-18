import { AnimationSettingsNoMysteryVisu } from './settings/animation-settings-nomystery-visu';
import { Road, Location, Package, Truck } from '../nomystery/nomystery-task';
import { NoMysteryTask } from '../nomystery/nomystery-task';
import { AnimationInfo } from '../../integration/animation-info';
import * as BABYLON from 'babylonjs';
import { angleBetweenLocations } from './utils';
import { AnimationSettingsNoMystery } from './settings/animation-settings-nomystery';


const maxPositionLocation = 6;
const radius = 5;
const maxPositionsTruck = 4;
const packageSize = 20;

interface Position {
  x: number;
  y: number;
}



export class AnimationNode {
  public x = 0;
  public y = 0;
  public rotation = 0;
  public objects = 0;

  public mesh: BABYLON.AbstractMesh;
  public transformNode: BABYLON.TransformNode;

  private freePositions = null;

  constructor(public id: string) {
    // this.mesh = new BABYLON.TransformNode(id);
  }

  setFreePsoition(pos: Position[]) {
    console.log(pos);
    this.freePositions = pos;
  }

  getFreePosition(): BABYLON.Vector3 {

    console.log('Get free position');
    let dx = 0;
    let dz = 0;
    if (! this.freePositions) {
      const alpha = this.objects / maxPositionLocation * 2 * Math.PI;
      dx = Math.cos(alpha) * radius;
      dz = Math.sin(alpha) * radius;
    } else {
      dx = this.freePositions[this.objects].x;
      dz = this.freePositions[this.objects].y;
    }


    return new BABYLON.Vector3(this.x + dx, 0, this.y + dz);
  }

  addObject() {
    this.objects++;
  }

  removeObject() {
    this.objects--;
  }

}

export class AnimationLink<T> {

  constructor(public source: T, public target: T) {}
}


export class AnimationLocation extends AnimationNode {
  public degree: number;

  constructor(private loc: Location) {
    super(loc.name);
  }

  getName() {
    return this.loc.name;
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
  }

  setInitPosition() {
    this.loadedPackages = [];
    this.rotation = 0;
    this.transformNode.rotation.set(0, 0, 0);
    BABYLON.Animation.CreateAndStartAnimation('rotate', this.transformNode, 'rotation', 30, 1,
      this.transformNode.rotation, this.transformNode.rotation, 0);
    this.currentLocation = this.startLocation;
    this.transformNode.position.x = this.startLocation.x;
    this.transformNode.position.z = this.startLocation.y;
  }

  getInitFuel(): number {
    return this.truck.startFuel;
  }

  getFreePosition(): BABYLON.Vector3 {
    return this.getPositionByIndex(this.loadedPackages.length - 1);
  }

  getPositionByIndex(index: number): BABYLON.Vector3 {
    // console.log('Get truck free position');
    const o = this.mesh.position.scale(1);
    o.y = 5;
    // console.log('Origin: ' + o);
    const x = new BABYLON.Vector3(1, 0, 0);
    const y = new BABYLON.Vector3(0, 1, 0);
    // console.log('Rotation: ' + r + ' ' + this.rotation);

    const p = o.add(x.scale(-6)).add(y.scale((index) * 2));
    // console.log('Position on truck: ' + p);
    return p;
  }

  animateDriveTo(targetLocation: AnimationLocation): Promise<any> {

    // console.log('Drive from ' + this.currentLocation.getName() + ' to ' + targetLocation.getName());

    let rt = angleBetweenLocations(this.currentLocation, targetLocation);
    // console.log('Rotate from ' + this.rotation);
    // console.log('Rotate to ' + rt);

    // rotate smaller angle
    const alternativeRT = - ((2 * Math.PI) - rt);
    rt = Math.abs(rt - this.rotation) > Math.abs(alternativeRT - this.rotation) ? alternativeRT : rt;

    const startRotation = new BABYLON.Vector3(0, this.rotation, 0);
    const targetRotation = new BABYLON.Vector3(0, rt, 0);


    const startPosition = new BABYLON.Vector3(this.currentLocation.x, 0, this.currentLocation.y);
    const targetPosition = new BABYLON.Vector3(targetLocation.x, 0, targetLocation.y);

    const finishedAnimationPromise = new Promise((resolve, reject) => {

      BABYLON.Animation.CreateAndStartAnimation('rotate', this.transformNode,
      'rotation', 30, 30, startRotation, targetRotation, 0, undefined, () => {
        this.rotation = rt;
      });

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

      BABYLON.Animation.CreateAndStartAnimation('drive', this.transformNode, 'position', 30, 120,
        startPosition, targetPosition, 0, easingFunction,
        () => {
          targetLocation.addObject();
          this.currentLocation.removeObject();
          this.currentLocation = targetLocation;
          resolve();
        });
    });

    return finishedAnimationPromise;
  }

}

export class AnimationPackage extends AnimationNode {
  public currentLocation?: AnimationLocation;

  constructor(private pack: Package, public startLocation: AnimationLocation, public goalLocation: AnimationLocation) {
    super(pack.name);
  }

  setInitPosition() {
    this.currentLocation = this.startLocation;
    this.transformNode.position = this.currentLocation.getFreePosition();
    this.transformNode.position.y = 1.25;
    this.currentLocation.addObject();
  }

  animateLoad(truck: AnimationTruck): Promise<any> {

    truck.currentLocation.removeObject();
    truck.loadedPackages.push(this);

    // console.log('position to global origin: ' + this.mesh.position);
    // this.mesh.position = this.mesh.position.subtract(truck.transformNode.position);
    this.transformNode.parent = truck.transformNode;
    truck.transformNode.computeWorldMatrix();
    const wMatrix = truck.transformNode.getWorldMatrix().clone();
    wMatrix.invert();
    this.transformNode.position = BABYLON.Vector3.TransformCoordinates(this.transformNode.position, wMatrix);
    // console.log('position relative to truck: ' + this.mesh.position);

    const startPosition = this.transformNode.position;
    const target1Position = startPosition.clone();
    target1Position.y = 10;
    const target3Position = truck.getFreePosition();
    const target2Position = target3Position.clone();
    target2Position.y = 10;

    const finishedAnimationPromise = new Promise((resolve, reject) => {

      BABYLON.Animation.CreateAndStartAnimation('load', this.transformNode, 'position', 30, 20,
        startPosition, target1Position, 0, undefined,
        () => {
          BABYLON.Animation.CreateAndStartAnimation('load', this.transformNode, 'position', 30, 20,
            target1Position, target2Position, 0, undefined,
            () => {
              BABYLON.Animation.CreateAndStartAnimation('load', this.transformNode, 'position', 30, 20,
                target2Position, target3Position, 0, undefined,
                () => {
                  resolve();
                });
            });
        });
    });

    return finishedAnimationPromise;
  }


  animateUnLoad(truck: AnimationTruck, loc: AnimationLocation): Promise<any> {

    // console.log('Loaded packages: ' + truck.loadedPackages.length);
    // console.log('pack index: ' + truck.loadedPackages.indexOf(this));
    truck.loadedPackages.splice(truck.loadedPackages.indexOf(this), 1);
    // console.log('Loaded packages: ' + truck.loadedPackages.length);

    // console.log('position: ' + this.mesh.position);
    this.transformNode.parent = null;
    truck.transformNode.computeWorldMatrix();
    const wMatrix = truck.transformNode.getWorldMatrix().clone();
    this.transformNode.position = BABYLON.Vector3.TransformCoordinates(this.transformNode.position, wMatrix);
    // console.log('position: ' + this.mesh.position);

    const startPosition = this.transformNode.position;
    const target1Position = startPosition.clone();
    target1Position.y = 10;
    const target3Position = loc.getFreePosition();
    target3Position.y = 1.25;
    const target2Position = target3Position.clone();
    target2Position.y = 10;

    loc.addObject();

    const finishedAnimationPromise = new Promise((resolve, reject) => {

      BABYLON.Animation.CreateAndStartAnimation('load', this.transformNode, 'position', 30, 20,
        startPosition, target1Position, 0, undefined,
        () => {
          BABYLON.Animation.CreateAndStartAnimation('load', this.transformNode, 'position', 30, 20,
            target1Position, target2Position, 0, undefined,
            () => {
              BABYLON.Animation.CreateAndStartAnimation('load', this.transformNode, 'position', 30, 20,
                target2Position, target3Position, 0, undefined,
                () => {
                  for (let i = 0; i < truck.loadedPackages.length; i++) {
                      const p = truck.loadedPackages[i];
                      p.transformNode.position = truck.getPositionByIndex(i);
                  }
                  resolve();
                });
            });
        });
    });

    return finishedAnimationPromise;
  }
}



export class NoMystery3DAnimationTask extends AnimationInfo {

  public trucks: Map<string, AnimationTruck> = new Map();
  public locations: Map<string, AnimationLocation> = new Map();
  public roads: AnimationRoad[] = [];
  public packages: Map<string, AnimationPackage> = new Map();

  constructor(protected task: NoMysteryTask, private dropPositions: Map<string, Position[]>) {
    super(task);
    this.buildFromTask();
  }

  buildFromTask(): void {
    for (const loc of this.task.locations.values()) {
      const animationLoc =  new AnimationLocation(loc);
      animationLoc.setFreePsoition(this.dropPositions.get(loc.name));
      this.locations.set(loc.name, animationLoc);
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
