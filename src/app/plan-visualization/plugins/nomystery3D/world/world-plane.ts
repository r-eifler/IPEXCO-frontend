import * as BABYLON from 'babylonjs';

export class WorldPlane {

  worldWidth = 100;
  worldHeight = 100;

  borderWidth = 10;

  constructor(private scene: BABYLON.Scene) {

    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: this.worldWidth, height: this.worldHeight, subdivisions: 2}, scene);

    this.createBorderStones();
  }

  createBorderStones() {
    const hw = this.worldWidth / 2;
    const hh = this.worldHeight / 2;
    for (let i = 0; i < 1000; i++) {
      let x = randomInt(-hw, hw);
      let z = randomInt(-hh, hh);
      while ((x < (hw - this.borderWidth) && x > -(hw - this.borderWidth)) &&
        (z < (hh - this.borderWidth) && z > -(hh - this.borderWidth))) {

          x = randomInt(-hw, hw);
          z = randomInt(-hh, hh);
      }

      const height = randomFloat(0.5, 1);
      const width = randomFloat(0.5, 3.5);
      const depth = randomFloat(0.5, 3.5);
      const box = BABYLON.MeshBuilder.CreateBox('borer_box', {width, height, depth}, this.scene);
      box.position.set(x, height / 2, z);
    }
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (+max - +min) + +min;
}

