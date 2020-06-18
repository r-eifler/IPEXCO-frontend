import * as BABYLON from 'babylonjs';
import * as BABYLONLOADER from 'babylonjs-loaders';
import { Scene, AbstractMesh } from 'babylonjs';
import { NoMystery3DAnimationTask, AnimationTruck } from '../nomystery-animation-task';


export async function loadTruckMeshes(taskInfo: NoMystery3DAnimationTask, scene: Scene) {
  for (const truck of taskInfo.trucks.values()) {
    const size = 5;
    const mesh = await loadTruckMesh(scene, truck);
    // const axisX = BABYLON.Mesh.CreateLines('axisX',
    //   [BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    //     new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)],
    //   scene);
    // axisX.position.y = 2;
    // axisX.color = new BABYLON.Color3(1, 0, 0);
    truck.transformNode = new BABYLON.TransformNode(truck.id, scene);
    truck.mesh = mesh;
    truck.mesh.parent = truck.transformNode;
  }
}

function loadTruckMesh(scene: Scene, truck: AnimationTruck): Promise<BABYLON.AbstractMesh> {
  BABYLONLOADER.GLTFFileLoader.IncrementalLoading = false;

  const loadedPromise = new Promise<BABYLON.AbstractMesh>((resolve, reject) => {

      BABYLON.SceneLoader.ImportMesh('', './assets/3D_models/', `truck_${truck.id}.gltf`, scene,
        (meshes, particleSystems, skeletons) => {
          for (const obj of meshes) {
            obj.position.set(0, 2, 0);
            obj.rotation.set(0, 0, 0);
          }
          resolve(meshes[0]);
        },
        undefined,
        () => reject());
  });

  return loadedPromise;
}



