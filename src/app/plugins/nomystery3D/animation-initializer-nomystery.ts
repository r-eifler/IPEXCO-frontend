import { AnimationInfoNoMystery, AnimationNode, AnimationRoad, AnimationLocation } from './animation-info-nomystery';
import { AnimationInitializer } from 'src/app/animation/animation-initializer';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Group } from 'three';

const spaceWidth = 100;
const spaceDepth = 100;
const border = 10;

export class AnimationInitializerNoMystery extends AnimationInitializer {

  truckObjects = new Map<string, any>();
  packageObjects = new Map<string, any>();

  camera;
  scene;
  renderer;
  controls;

  constructor(svgContainerId: string, private animationInfo: AnimationInfoNoMystery) {
    super(svgContainerId);
    this.initScene();
  }

  restart() {
   // TODO
  }

  async initScene() {
    const div = document.getElementById('mapContainer');

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xcce0ff );

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.x = 100;
    this.camera.position.y = 50;
    this.camera.position.z = 0;
    this.camera.rotation.x = -Math.PI / 2;
    this.camera.rotation.y = Math.PI;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    div.appendChild( this.renderer.domElement );

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 300;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.update();


    const ambientLight = new THREE.AmbientLight( 0x404040, 1 ); // soft white light
    this.scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0xdfebff, 0.8 );
    directionalLight.position.set( 2, 3, 2 );
    directionalLight.castShadow = true;
    this.scene.add( directionalLight );

    // Flore
    const geometryPlane = new THREE.PlaneGeometry(100, 100);
    const materialPlane = new THREE.MeshLambertMaterial( { color: 0xfefefe } );
    const plane = new THREE.Mesh( geometryPlane, materialPlane );
    plane.position.set(0, 0, 0);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.receiveShadow = true;
    this.scene.add( plane );

    // trucks
    for (const truck of this.animationInfo.trucks.values()) {
      const truckObject = await this.loadObj('assets/3D_models/truck.obj', 'assets/3D_models/truck.mtl');
      truckObject.position.y = 2;
      truckObject.position.x = randomInt(-30, 30);
      this.scene.add(truckObject);
      this.truckObjects.set(truck.id, truckObject);
    }

    // packages
    for (const pack of this.animationInfo.packages.values()) {
      const po = this.createPackage(0x826434, 1, 1);
      this.scene.add(po);
      this.packageObjects.set(pack.id, po);
      createMoveAnimation(po, new THREE.Vector3(5, 0, 5), new THREE.Vector3(-5, 0, -5));
    }

    this.createBorderStones();

    window.addEventListener( 'resize', () => onWindowResize(this), false );
    animate(this);

  }

  createTruck(color: number, x: number, z: number) {
    const geometryCube = new THREE.BoxGeometry(2, 1, 1);
    const materialCube = new THREE.MeshLambertMaterial( { color } );
    const cube = new THREE.Mesh( geometryCube, materialCube );
    cube.position.set(x, 0.5, z);
    cube.castShadow = true;
    return cube;
  }

  createPackage(color: number, x: number, z: number) {
    const geometryCube = new THREE.BoxGeometry(1, 1, 1);
    const materialCube = new THREE.MeshLambertMaterial( { color } );
    const cube = new THREE.Mesh( geometryCube, materialCube );
    cube.position.set(x, 0.5, z);
    cube.castShadow = true;
    return cube;
  }

  createBorderStones() {
    for (let i = 0; i < 1000; i++) {
      let x = randomInt(-50, 50);
      let z = randomInt(-50, 50);
      while ((x < 40 && x > -40) && (z < 40 && z > -40)) {
        x = randomInt(-50, 50);
        z = randomInt(-50, 50);
      }

      const height = randomFloat(0.5, 1);
      const width = randomFloat(0.5, 3.5);
      const depth = randomFloat(0.5, 3.5);
      const geometryCube = new THREE.BoxGeometry(width, height, depth);
      const materialCube = new THREE.MeshLambertMaterial( { color: 0xfefefe } );
      const cube = new THREE.Mesh( geometryCube, materialCube );
      cube.position.set(x, height / 2, z);
      this.scene.add(cube);
    }
  }

  loadObj(objPath, mtlPath): Promise<Group> {

    const promise: Promise<Group> = new Promise((resolve, reject) => {
        const  mtlLoader = new MTLLoader();

        mtlLoader.load(mtlPath,
          (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);

            objLoader.load(objPath,
              ( object: Group ) => {
                // object.position.y = 2;
                // this.scene.add( object );
                resolve(object);
              },
              ( xhr ) => {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); },
              ( error ) => {console.log( 'An error happened: ' + error.message ); reject(null); }
            );
          }
        );
        });

    return promise;
  }

}

function onWindowResize(ai: AnimationInitializerNoMystery) {

  ai.camera.aspect = window.innerWidth / window.innerHeight;
  ai.camera.updateProjectionMatrix();

  ai.renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(ai: AnimationInitializerNoMystery) {
  requestAnimationFrame(() => animate(ai));
  // ai.controls.update();
  threeRender(ai);
}

function threeRender(ai: AnimationInitializerNoMystery) {
  ai.renderer.render(ai.scene, ai.camera);

  ai.packageObjects.forEach((mesh, key) => {
    if (mesh.userData.clock && mesh.userData.mixer) {
      mesh.userData.mixer.update(mesh.userData.clock.getDelta());
    }
  });
}



function createMoveAnimation(mesh, startPosition, endPosition) {
  mesh.userData.mixer = new THREE.AnimationMixer(mesh);
  const track = new THREE.VectorKeyframeTrack(
    '.position',
    [0, 1],
    [
      startPosition.x,
      startPosition.y,
      startPosition.z,
      endPosition.x,
      endPosition.y,
      endPosition.z,
    ]
  );
  const animationClip = new THREE.AnimationClip(null, 200, [track]);
  const animationAction = mesh.userData.mixer.clipAction(animationClip);
  animationAction.setLoop(THREE.LoopOnce);
  animationAction.play();
  mesh.userData.clock = new THREE.Clock();
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (+max - +min) + +min;
}



