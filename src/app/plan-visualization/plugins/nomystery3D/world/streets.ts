import * as BABYLON from 'babylonjs';
import { Vector3 } from 'babylonjs';
import { AnimationInfoNoMystery, AnimationRoad } from '../animation-info-nomystery';

export class Streets {

  constructor(private scene: BABYLON.Scene, task: AnimationInfoNoMystery) {

    console.log('create street');
    const bc = new BABYLON.Color4(0.5, 0.5, 0.5, 1);
    const boxColor: BABYLON.Color4[] = [bc, bc, bc, bc, bc, bc];

    for (const loc of task.locations.values()) {
      const cylinder1 = BABYLON.MeshBuilder.CreateCylinder('location-marker', {diameter: 5, height: 1, faceColors: boxColor}, scene);
      cylinder1.position.set(loc.x, 0, loc.y);
    }

    for (const s of task.roads) {
      const l = getStreetLength(s);
      const street = BABYLON.MeshBuilder.CreateBox('street', {width: 5, depth: l, height: 1, faceColors: boxColor}, this.scene);
      setPositionRotation(s, street);
    }
  }
}

function setPositionRotation(roadInfo: AnimationRoad, roadObejct: BABYLON.Mesh) {
  console.log('compute position');
  const x1 = roadInfo.source.x;
  const z1 = roadInfo.source.y;
  const x2 = roadInfo.target.x;
  const z2 = roadInfo.target.y;

  const dx = x2 - x1;
  const dz = z2 - z1;
  // console.log('dx: ' + dx);
  // console.log('dz: ' + dz);

  const l = Math.sqrt(dx * dx + dz * dz);
  // console.log('length: ' + l);

  let ry = Math.atan(dz / dx);
  // ry = ry < 0 ? (Math.PI + ry) : ry;

  const Dx = Math.abs(Math.cos(ry) * (l / 2));
  const Mx = x1 + (dx < 0 ? - Dx : Dx);
  const Dz = Math.abs(Math.sin(ry) * (l / 2));
  const Mz = z1 + (dz < 0 ? - Dz : Dz);

  // console.log('rotation: ' + ry);
  ry = -ry;
  ry += (Math.PI / 2);
  // console.log('position diff: ' + Dx + ' ' +  Dz);
  // console.log('position: ' + Mx + ' ' +  Mz);
  // console.log('rotation: ' + ry);

  roadObejct.position.set(Mx, 0, Mz);
  roadObejct.rotation.set(0, ry, 0);
  // street.scaling.set(0, 0, 2);
}

function getStreetLength(roadInfo: AnimationRoad) {
  const x1 = roadInfo.source.x;
  const z1 = roadInfo.source.y;
  const x2 = roadInfo.target.x;
  const z2 = roadInfo.target.y;

  const dx = x2 - x1;
  const dz = z2 - z1;

  const l = Math.sqrt(dx * dx + dz * dz);
  return l;
}
