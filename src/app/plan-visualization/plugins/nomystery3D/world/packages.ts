import { AnimationPackage } from './../nomystery-animation-task';
import * as BABYLON from 'babylonjs';
import * as BABYLONLOADER from 'babylonjs-loaders';
import { Scene, TransformNode } from 'babylonjs';
import { NoMystery3DAnimationTask } from '../nomystery-animation-task';

export async function loadPackagekMeshes(taskInfo: NoMystery3DAnimationTask, scene: Scene){
  for (const p of taskInfo.packages.values()) {
    const node = await loadPackageMesh(scene, p);
    p.transformNode = node;
  }
}

function loadPackageMesh(scene: Scene, pack: AnimationPackage): Promise<BABYLON.TransformNode> {
  BABYLONLOADER.GLTFFileLoader.IncrementalLoading = false;
  // 181, 134, 67
  const bc = new BABYLON.Color4(0.72, 0.53, 0.26, 1);
  const boxColor: BABYLON.Color4[] = [bc, bc, bc, bc, bc, bc];

  const loadedPromise = new Promise<BABYLON.TransformNode>((resolve, reject) => {

    const p = BABYLON.MeshBuilder.CreateBox('package', {width: 2, depth: 2, height: 2, faceColors: boxColor}, scene);
    p.position.set(0, 0, 0);

    const sign = BABYLON.MeshBuilder.CreatePlane('sign', {size: 5}, scene);
    sign.position.set(0, 4, 0);
    sign.rotate(BABYLON.Axis.X, 0, BABYLON.Space.LOCAL);

    const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', {width: 128, height: 128}, scene, false);
    const mat = new BABYLON.StandardMaterial('mat', scene);
    mat.diffuseTexture = dynamicTexture;
    dynamicTexture.drawText(pack.id, null, null, 'bold 80px arial', '#000000', '#ffffff', true);
    sign.material = mat;

    const parent = new TransformNode('package-parent');

    p.parent = parent;
    sign.parent = parent;

    resolve(parent);
  });

  return loadedPromise;
}

function makeTextPlane(text: string, color: string, size: number, scene: BABYLON.Scene) {
  const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, scene, true);
  dynamicTexture.hasAlpha = true;
  dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true);
  const plane = BABYLON.Mesh.CreatePlane('TextPlane', size, scene, true);
  plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene);
  plane.material.backFaceCulling = false;
  return plane;
}
