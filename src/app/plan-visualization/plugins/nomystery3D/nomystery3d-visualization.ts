import { CurrentProjectService, ProjectsService } from 'src/app/service/project-services';
import { Streets } from './world/streets';
import * as BABYLON from 'babylonjs';
import { PlanVisualization } from '../../integration/plan-visualization';
import { WorldPlane } from './world/world-plane';
import { NoMysteryTask } from '../nomystery/nomystery-task';
import { NoMystery3DAnimationTask } from './nomystery-animation-task';
import { loadTruckMeshes } from './world/trucks';
import { loadPackagekMeshes } from './world/packages';
import { NoMystery3DAnimation } from './animations/nomystery3D-animation';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { CurrentRunService } from 'src/app/service/run-services';
import { Injectable, ElementRef } from '@angular/core';
import { AnimationSettingsNoMystery } from './settings/animation-settings-nomystery';

const refXMax = 700;
const refYMax = 700;

const worldWidth = 100;
const worldHeight = 100;


@Injectable({
  providedIn: 'root'
})
export class NoMystery3DVisualization extends PlanVisualization {

  private animationTask: NoMystery3DAnimationTask;
  private animation: NoMystery3DAnimation = null;

  private animationSettings: AnimationSettingsNoMystery;

  private canvas: HTMLCanvasElement = null;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;

  private view: BABYLON.EngineView = null;

  constructor(
    protected currentProjectService: CurrentProjectService,
    protected taskSchemaService: TaskSchemaService,
    protected  currentRunService: CurrentRunService) {
    super(currentProjectService, taskSchemaService, currentRunService);

    this.currentProjectService.getSelectedObject().subscribe(
      project => {
        if (project) {
          this.animationSettings = new AnimationSettingsNoMystery(project.animationSettings);
        }
    });
  }

  displayIn(canvas: ElementRef) {

    if (! this.canvas) {
      this.canvas = canvas.nativeElement as HTMLCanvasElement;
      this.engine = new BABYLON.Engine(this.canvas, true);
      this.init();
    } else {
      if (this.view) {
        this.engine.unRegisterView(this.canvas);
      }
      this.canvas = canvas.nativeElement as HTMLCanvasElement;
      this.view = this.engine.registerView(this.canvas);
    }
  }

  async init() {

    await this.createScene();
    this.animation.initPositions();
    this.doRender();
  }

  getLocationPositions() {
    const xMax = worldWidth - 15;
    const yMax = worldHeight - 15;
    for (const loc of this.animationTask.locations.values()) {
      const pos = this.animationSettings.locationPositions.get(loc.getName());
      const xScaled = (pos.x / refXMax) * xMax;
      const yScaled = ( pos.y / refYMax) * yMax;
      loc.x = xScaled < xMax / 2 ? -((xMax / 2) - xScaled) : xScaled - (xMax / 2);
      loc.y = - (yScaled < yMax / 2 ?  -((yMax / 2) - yScaled) : yScaled - (yMax / 2));
      loc.x += 10;
      loc.y += -10;
    }
  }

  createScene(): Promise<void> {
      this.scene = new BABYLON.Scene(this.engine);

      this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 60, -70), this.scene);
      // this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 50, 0), this.scene);
      this.camera.setTarget(BABYLON.Vector3.Zero());
      this.camera.attachControl(this.canvas, false);

      // const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 10, -50), this.scene);

      this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);

      const sceneLoadedPromise = new Promise<void>((resolve, reject) => {
        this.taskSchemaService.getSchema().subscribe(async (ts) => {
          if (ts) {
            this.animationTask = new NoMystery3DAnimationTask(new NoMysteryTask(ts));
            this.animation = new NoMystery3DAnimation(this.animationTask);

            const worldPlane = new WorldPlane(this.scene);
            this.getLocationPositions();
            const streets = new Streets(this.scene, this.animationTask);
            await loadTruckMeshes(this.animationTask, this.scene);
            await loadPackagekMeshes(this.animationTask, this.scene);

            this.animation.initPositions();
            resolve();
          }
        });
      });

      return sceneLoadedPromise;
  }

  doRender(): void {
      // Run the render loop.
      this.scene.render();
      this.engine.runRenderLoop(() => {
          this.scene.render();
      });

      // The canvas/window resize event handler.
      window.addEventListener('resize', () => {
          this.engine.resize();
      });
  }


  animateAction(action: import('../../../interface/plan').Action): Promise<void> {
    return this.animation.animateAction(action);
  }

  reverseAnimateAction(action: import('../../../interface/plan').Action): Promise<void> {
    return this.animation.reverseAnimateAction(action);
  }

  restart(): void {
    return this.animation.initPositions();
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
