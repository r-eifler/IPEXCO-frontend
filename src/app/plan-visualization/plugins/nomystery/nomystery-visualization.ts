import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {PlanVisualization} from '../../integration/plan-visualization';
import {Injectable} from '@angular/core';
import {SelectedPlanRunService} from '../../../service/planner-runs/selected-planrun.service';
import {AnimationSettingsNoMystery} from './settings/animation-settings-nomystery';
import {loadPackages, loadTrucks} from './world';
import {NoMysteryAnimationTask} from './animation/nomystery-animation-task';
import {NoMysteryAnimation} from './animation/nomystery-animation';
import {NoMysteryTask} from './nomystery-task';
import {gsap} from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {Demo} from '../../../interface/demo';
import { Action } from 'src/app/interface/plannig-task';


interface Position {
  x: number;
  y: number;
}

const refXMax = 700;
const refYMax = 700;

const worldWidth = 100;
const worldHeight = 100;


@Injectable({
  providedIn: 'root'
})
export class NoMysteryVisualization extends PlanVisualization {


  private animationTask: NoMysteryAnimationTask;
  private animation: NoMysteryAnimation = null;

  private animationSettings: AnimationSettingsNoMystery;
  private scaledDropPositions: Map<string, Position[]> = new Map();

  private backgroundImagePath: string;

  private newRunLoaded = false;
  private sceneLoaded = false;

  private mainDomElement$: BehaviorSubject<Element> = new BehaviorSubject<Element>(null);
  private mainSVG: SVGElement;
  private valuesDomElement$: BehaviorSubject<Element> = new BehaviorSubject<Element>(null);
  private valuesContainer: HTMLDivElement;

  constructor(
    protected currentProjectService: CurrentProjectService,
    protected  currentRunService: SelectedPlanRunService) {
    super(currentProjectService, currentRunService);

    this.currentProjectService.getSelectedObject().subscribe(
      async project => {
        if (project) {
          //console.log('New Project: ' + project.name);
          this.clear();
          this.backgroundImagePath = (project as Demo).summaryImage;
          this.animationSettings = new AnimationSettingsNoMystery(project.animationSettings);
          this.scaleDropPositions();
          await this.init();
        }
      });

    this.currentRunService.getSelectedObject().subscribe(
      run => {
        if (run) {
          this.newRunLoaded = true;
        }
      }
    );


  }

  clear() {
    this.backgroundImagePath = null;
    this.animationSettings = null;
    this.animationTask = null;
    this.animation = null;
    this.newRunLoaded = false;
    this.sceneLoaded = false;
    this.mainSVG = null;
    this.valuesContainer = null;
    this.mainDomElement$.next(null);
  }

  scaleDropPositions() {
    for (const elem of this.animationSettings.locationDropPositions) {
      const scaledPositions: Position[] = [];
      for (const pos of elem[1]) {
        scaledPositions.push({x: pos.x / refXMax * worldWidth , y: -(pos.y / refYMax * worldHeight)});
      }
      this.scaledDropPositions.set(elem[0], scaledPositions);
    }
  }

  getDisplayDOMElem(): Observable<Element> {

    return this.mainDomElement$;
  }

  getValueAttributesDisplayDOMElem(): Observable<Element> {

    return this.valuesDomElement$;
  }

  async init() {

    this.mainSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.mainSVG.style.height = '700px';
    this.mainSVG.style.width = '700px';
    this.mainSVG.setAttribute('transform', 'matrix(1,0,0,1,0,0)');

    gsap.registerPlugin(Draggable);
    // tslint:disable-next-line:no-unused-expression
    new Draggable(this.mainSVG);
    this.createValuesContainer();
    this.valuesDomElement$.next(this.valuesContainer);
    await this.createScene();
  }

  updateLocationPositions() {
    for (const loc of this.animationTask.locations.values()) {
      const pos = this.animationSettings.locationPositions.get(loc.getName());
      loc.x = pos.x;
      loc.y = pos.y;
    }
  }

  createScene(): Promise<void> {

      return new Promise<void>((resolve, reject) => {
        this.currentProjectService.findSelectedObject().subscribe(async (project) => {
          if (project && ! this.animationTask) {

            this.animationTask = new NoMysteryAnimationTask(new NoMysteryTask(project.baseTask), this.animationSettings.locationDropPositions);
            this.animation = new NoMysteryAnimation(this.animationTask);

            const backgroundImage: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            backgroundImage.style.height = '700px';
            backgroundImage.style.width = '700px';
            backgroundImage.setAttribute('href', this.backgroundImagePath);

            // svgBackground.appendChild(backgroundImage);
            this.mainSVG.appendChild(backgroundImage);

            this.updateLocationPositions();
            await loadTrucks(this.animationTask, this.mainSVG, this.valuesContainer);
            await loadPackages(this.animationTask, this.mainSVG);

            this.animation.initPositions();

            this.mainDomElement$.next(this.mainSVG);
            this.sceneLoaded = true;
            resolve();
          }
        });
      });
  }

  createValuesContainer() {
    this.valuesContainer = document.createElement('div');
    this.valuesContainer.style.height = '100px';
    this.valuesContainer.style.display = 'flex';
    this.valuesContainer.style.justifyContent = 'space-evenly';
    this.valuesContainer.style.alignItems = 'center';
  }


  animateAction(action: Action): Promise<void> {
    return this.animation.animateAction(action);
  }

  reverseAnimateAction(action: Action): Promise<void> {
    return this.animation.reverseAnimateAction(action);
  }

  restart(): void {
    if (this.sceneLoaded) {
      this.animation?.initPositions();
    }
  }

  update() {
    if (this.newRunLoaded && this.sceneLoaded) {
      this.animation?.initPositions();
      this.newRunLoaded = false;
    }
  }

  scale(factor: number): void {
    if (factor + this.mainScale > 2 || factor + this.mainScale < 0.4) {
      return;
    }
    this.mainScale += factor;
    gsap.to(this.mainSVG, {duration: 0.5, scale: this.mainScale});
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
