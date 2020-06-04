import * as BABYLON from 'babylonjs';
import { AnimationLocation } from './nomystery-animation-task';



export function angleBetweenLocations(loc1: AnimationLocation, loc2: AnimationLocation) {
  const dx = loc2.x - loc1.x;
  const dy = loc2.y - loc1.y;
  // console.log('Diff rotation: ' + dx + ' ' + dy);
  // console.log('Qu: ' + (dy / dx));

  let rt = 0;
  if (dy === 0) {
    rt = dx > 0 ? 0 : Math.PI;
  } else {
    rt = Math.atan(dy / dx);
    // if (rt < 0) {
    //   rt = (2 * Math.PI) + rt;
    // }
  }
  rt = rt % (2 * Math.PI);
  rt = (2 * Math.PI) - rt;
  rt = rt % (2 * Math.PI);

  return rt;
}
