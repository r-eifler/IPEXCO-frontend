import {Location, NoMysteryTask, Package, Truck} from '../nomystery-task';
import {AnimationInfo} from '../../../integration/animation-info';
import {gsap} from 'gsap';


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
  public objects = 0;

  public svg: SVGElement;
  public group: SVGElement;
  public initParentSVG: SVGElement;
  public parentSVG: SVGElement;

  private freePositions = null;

  constructor(public id: string) {
  }

  setFreePosition(pos: Position[]) {
    this.freePositions = pos;
  }

  getFreePosition(): Position {

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


    return {x: this.x + dx, y: this.y + dz};
  }

  addObject() {
    this.objects++;
  }

  removeObject() {
    this.objects--;
  }

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


export class AnimationTruck extends AnimationNode {
  public currentLocation?: AnimationLocation;
  public currentFuel?: number;
  public loadedPackages: AnimationPackage[] = [];

  public displayName: string;
  public fuelDisplay: HTMLParagraphElement;

  constructor(private truck: Truck, public startLocation: AnimationLocation) {
    super(truck.name);
  }

  setInitPosition() {
    this.loadedPackages = [];
    this.x = this.startLocation.x;
    this.y = this.startLocation.y;
    gsap.to(this.group, {duration: 0, x: this.x, y: this.y, ease: 'power4. out'});
    this.currentLocation = this.startLocation;
    this.currentFuel = this.truck.startFuel;
    this.updateFuelDisplay();
  }

  updateFuelDisplay() {
    this.fuelDisplay.innerText = this.displayName + ' fuel: ' + this.currentFuel;
  }

  getFreePosition(): Position {
    return this.getPositionByIndex(this.loadedPackages.length - 1);
  }

  getPositionByIndex(index: number): Position {
    return {x: 60, y: 10 - index * 20};
  }

  animateDriveTo(targetLocation: AnimationLocation, fuelConsumption: number): Promise<void> {

    const startPosition = {x: this.currentLocation.x, y: this.currentLocation.y};
    const targetPosition = {x: targetLocation.x, y: targetLocation.y};

    return new Promise((resolve, reject) => {

      this.currentLocation = targetLocation;
      this.x = targetPosition.x;
      this.y = targetPosition.y;
      this.currentFuel -= fuelConsumption;
      const tween = gsap.to(this.group, {duration: 0.5, x: this.x, y: this.y, ease: 'power4. out'});
      tween.then(() => {
        this.updateFuelDisplay();
        resolve();
      });
    });
  }

}

export class AnimationPackage extends AnimationNode {
  public currentLocation?: AnimationLocation;

  constructor(private pack: Package, public startLocation: AnimationLocation, public goalLocation: AnimationLocation) {
    super(pack.name);
  }

  setInitPosition() {
    this.currentLocation = this.startLocation;
    this.parentSVG.removeChild(this.svg);
    this.parentSVG = this.initParentSVG;
    this.parentSVG.appendChild(this.svg);
    const pos = this.currentLocation.getFreePosition();
    gsap.to(this.svg, {duration: 0, x: pos.x, y: pos.y, ease: 'power4. out'});
    this.currentLocation.addObject();
  }

  animateLoad(truck: AnimationTruck): Promise<void> {

    truck.currentLocation.removeObject();
    truck.loadedPackages.push(this);

    const startPosition = {x: this.x, y: this.y};
    const relTargetPosition = truck.getFreePosition();
    const targetPosition = {x: truck.x + relTargetPosition.x, y: truck.y + relTargetPosition.y};
    this.x = targetPosition.x;
    this.y = targetPosition.y;

    return new Promise((resolve, reject) => {

      const tween = gsap.to(this.svg, {duration: 1, x: this.x, y: this.y, ease: 'power4. out'});
      tween.then(() => {
        this.parentSVG.removeChild(this.svg);
        this.x = relTargetPosition.x;
        this.y = relTargetPosition.y;
        // this.svg.setAttribute('transform', `translate(${relTargetPosition.x} ${relTargetPosition.y})`);
        truck.group.appendChild(this.svg);
        this.parentSVG = truck.group;
        gsap.to(this.svg, {duration: 0, x: relTargetPosition.x, y: relTargetPosition.y, ease: 'power4. out'});
        resolve();
      });

    });
  }


  animateUnLoad(truck: AnimationTruck, loc: AnimationLocation): Promise<void> {

    const targetPosition = loc.getFreePosition();

    truck.loadedPackages.splice(truck.loadedPackages.indexOf(this), 1);
    loc.addObject();

    truck.group.removeChild(this.svg);
    // this.svg.setAttribute('transform', `translate(${truck.x - this.x} ${truck.y - this.y})`);
    this.parentSVG = truck.parentSVG;
    this.parentSVG.appendChild(this.svg);
    gsap.to(this.svg, {duration: 0, x: truck.x + this.x, y: truck.y + this.y, ease: 'power4. out'});
    this.x = targetPosition.x;
    this.y = targetPosition.y;

    return new Promise((resolve, reject) => {
      const tween = gsap.to(this.svg, {duration: 1, x: this.x, y: this.y, ease: 'power4. out'});
      tween.then(() => {
        resolve();
      });
    });
  }
}



export class NoMysteryAnimationTask extends AnimationInfo {

  public trucks: Map<string, AnimationTruck> = new Map();
  public locations: Map<string, AnimationLocation> = new Map();
  public packages: Map<string, AnimationPackage> = new Map();

  constructor(protected task: NoMysteryTask, private dropPositions: Map<string, Position[]>) {
    super(task);
    this.buildFromTask();
  }

  buildFromTask(): void {
    for (const loc of this.task.locations.values()) {
      const animationLoc =  new AnimationLocation(loc);
      animationLoc.setFreePosition(this.dropPositions.get(loc.name));
      this.locations.set(loc.name, animationLoc);
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
