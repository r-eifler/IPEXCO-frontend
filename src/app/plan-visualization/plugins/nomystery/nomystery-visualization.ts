import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {PlanVisualization} from '../../integration/plan-visualization';
import {TaskSchemaService} from 'src/app/service/task-info/schema.service';
import {Injectable} from '@angular/core';
import {SelectedPlanRunService} from '../../../service/planner-runs/selected-planrun.service';
import {AnimationSettingsNoMystery} from './settings/animation-settings-nomystery';
import {loadPackages, loadTrucks} from './world';
import {NoMysteryAnimationTask} from './nomystery-animation-task';
import {NoMysteryAnimation} from './animation/nomystery-animation';
import {NoMysteryTask} from './nomystery-task';
import {gsap} from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {Action} from '../../../interface/plan';


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

  private mainDomElement$: BehaviorSubject<Element> = new BehaviorSubject<Element>(null);
  private mainSVG: SVGElement;

  constructor(
    protected currentProjectService: CurrentProjectService,
    protected taskSchemaService: TaskSchemaService,
    protected  currentRunService: SelectedPlanRunService) {
    super(currentProjectService, taskSchemaService, currentRunService);

    this.currentProjectService.getSelectedObject().subscribe(
      project => {
        if (project) {
          this.backgroundImagePath = project.animationImage;
          this.animationSettings = new AnimationSettingsNoMystery(project.animationSettings);
          this.scaleDropPositions();
        }
      });

    this.currentRunService.getSelectedObject().subscribe(
      run => {
        this.newRunLoaded = true;
      }
    );

    this.init();
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

  async init() {

    this.mainSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.mainSVG.style.height = '100%';
    this.mainSVG.style.width = '100%';

    gsap.registerPlugin(Draggable);
    // tslint:disable-next-line:no-unused-expression
    new Draggable(this.mainSVG);

    await this.createScene();
    this.animation.initPositions();

    this.mainDomElement$.next(this.mainSVG);
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
        this.taskSchemaService.getSchema().subscribe(async (ts) => {
          if (ts && ! this.animationTask) {
            this.animationTask = new NoMysteryAnimationTask(new NoMysteryTask(ts), this.animationSettings.locationDropPositions);
            this.animation = new NoMysteryAnimation(this.animationTask);

            const backgroundImage: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            backgroundImage.style.height = '700px';
            backgroundImage.style.width = '700px';
            backgroundImage.setAttribute('href', 'assets/task1.svg');

            // svgBackground.appendChild(backgroundImage);
            this.mainSVG.appendChild(backgroundImage);

            this.updateLocationPositions();
            await loadTrucks(this.animationTask, this.mainSVG);
            await loadPackages(this.animationTask, this.mainSVG);
            resolve();
          }
        });
      });
  }


  animateAction(action: Action): Promise<void> {
    return this.animation.animateAction(action);
  }

  reverseAnimateAction(action: Action): Promise<void> {
    return this.animation.reverseAnimateAction(action);
  }

  restart(): void {
    this.animation?.initPositions();
  }

  update() {
    if (this.newRunLoaded) {
      this.animation?.initPositions();
      this.newRunLoaded = false;
    }
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
