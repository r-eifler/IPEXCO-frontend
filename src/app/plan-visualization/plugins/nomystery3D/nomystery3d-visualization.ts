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
import { logDepthVertex } from 'babylonjs/Shaders/ShadersInclude/logDepthVertex';

const testLoc = new Map();
testLoc.set('l0', {x: -30, y: -30});
testLoc.set('l1', {x: 30, y: -30});
testLoc.set('l2', {x: 30, y: 0});
testLoc.set('l3', {x: 30, y: 30});
testLoc.set('l4', {x: -10, y: 10});
testLoc.set('l5', {x: -30, y: 30});
// testLoc.set('l6', {x: 20, z: 0});

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
    console.log('PlanVisualtion: NoMystery3DVisualization');

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
    if(this.animation){
      this.animation.initPositions();
    }
  }

  async init() {

    this.createScene();
    this.doRender();
  }

  getLocationPositions() {
    const xMax = worldWidth - 15;
    const yMax = worldHeight - 15;
    for (const loc of this.animationTask.locations.values()) {
      if (testLoc.has(loc.getName())) {
        const pos = this.animationSettings.locationPositions.get(loc.getName());
        const xScaled = (pos.x / refXMax) * xMax;
        const yScaled = ( pos.y / refYMax) * yMax;
        loc.x = xScaled < xMax / 2 ? -((xMax / 2) - xScaled) : xScaled - (xMax / 2);
        loc.y = - (yScaled < yMax / 2 ?  -((yMax / 2) - yScaled) : yScaled - (yMax / 2));
        loc.x += 10;
        loc.y += -10;
      }
    }
  }

  createScene(): void {
      this.scene = new BABYLON.Scene(this.engine);

      this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 60, -70), this.scene);
      // this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 60, 70), this.scene);
      this.camera.setTarget(BABYLON.Vector3.Zero());
      this.camera.attachControl(this.canvas, false);

      this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);

      // showAxis(10, this.scene);

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
        }
      });
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


function showAxis(size, scene) {
  var makeTextPlane = function(text, color, size) {
      var dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true);
      var plane = BABYLON.Mesh.CreatePlane('TextPlane', size, scene, true);
      plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene);
      plane.material.backFaceCulling = false;
      return plane;
   };

  var axisX = BABYLON.Mesh.CreateLines('axisX', [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
  axisX.color = new BABYLON.Color3(1, 0, 0);
  var xChar = makeTextPlane('X', 'red', size / 10);
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
  var axisY = BABYLON.Mesh.CreateLines('axisY', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
      ], scene);
  axisY.color = new BABYLON.Color3(0, 1, 0);
  var yChar = makeTextPlane('Y', 'green', size / 10);
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
  var axisZ = BABYLON.Mesh.CreateLines('axisZ', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
      ], scene);
  axisZ.color = new BABYLON.Color3(0, 0, 1);
  var zChar = makeTextPlane('Z', 'blue', size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};
