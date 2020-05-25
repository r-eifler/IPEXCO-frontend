import { Streets } from './world/streets';
import * as BABYLON from 'babylonjs';
import { PlanVisualization } from '../../integration/animation';
import { WorldPlane } from './world/world-plane';
import { NoMysteryTask } from '../nomystery/nomystery-task';
import { AnimationInfoNoMystery } from './animation-info-nomystery';

interface Pos2D {
  x: number;
  z: number;
}

const testLoc = new Map();
testLoc.set('l0', {x: -30, y: -30});
testLoc.set('l1', {x: 30, y: -30});
testLoc.set('l2', {x: 30, y: 0});
testLoc.set('l3', {x: 30, y: 30});
testLoc.set('l4', {x: -10, y: 10});
testLoc.set('l5', {x: -30, y: 30});
// testLoc.set('l6', {x: 20, z: 0});


function getRandomStreetsPositions(task: AnimationInfoNoMystery) {
  for (const loc of task.locations.values()) {
    // const pos: Pos2D = {x: randomInt(-30, 30), z: randomInt(-30, 30)};
    if (testLoc.has(loc.getName())) {
      console.log(loc.getName());
      const pos = testLoc.get(loc.getName());
      loc.x = pos.x;
      loc.y = pos.y;
    }
  }
}


export class NoMystery3DVisualization extends PlanVisualization {

  private animationTask: AnimationInfoNoMystery;

  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;

  constructor(protected task: NoMysteryTask) {
    super(task);
    this.animationTask = new AnimationInfoNoMystery(task);

    // Create canvas and engine.
    const canvasElement = 'plan-visualization-canvas';
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    console.log(this.canvas);
    this.engine = new BABYLON.Engine(this.canvas, true);

    this.createScene();
    this.doRender();
  }

    createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);

        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 60, -90), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.canvas, false);

        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);

        const worldPlane = new WorldPlane(this.scene);
        getRandomStreetsPositions(this.animationTask);
        const streets = new Streets(this.scene, this.animationTask);

    }

    doRender(): void {
        // Run the render loop.
        this.scene.render();
        // this.engine.runRenderLoop(() => {
        //     this.scene.render();
        // });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }


    animateAction(action: import('../../../interface/plan').Action): Promise<void> {
      throw new Error('Method not implemented.');
    }
    reverseAnimateAction(action: import('../../../interface/plan').Action): Promise<void> {
      throw new Error('Method not implemented.');
    }
    restart(): void {
      throw new Error('Method not implemented.');
    }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
