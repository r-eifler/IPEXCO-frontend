import {NoMysteryTask} from './nomystery-task';
import {NoMysteryAnimationTask} from './nomystery-animation-task';
import {loadSVGFile} from './utils';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

export async function loadTrucks(task: NoMysteryAnimationTask, parentSVG: SVGElement) {
  for (const truck of task.trucks.values()) {
    const fileName = truck.id === 't0' ? 'truck_red.svg' : 'truck_blue.svg';
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', 'assets/' + fileName);
    image.style.height = '60';
    image.style.width = 'auto';
    truck.svg = image;
    truck.group = svgGroup;
    truck.parentSVG = parentSVG;
    svgGroup.appendChild(image);
    parentSVG.appendChild(svgGroup);
  }
}

export  function loadPackages(task: NoMysteryAnimationTask, parentSVG: SVGElement) {
  for (const pack of task.packages.values()) {
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', 'assets/package.svg');
    image.style.height = '20';
    image.style.width = 'auto';
    pack.svg = image;
    pack.parentSVG = parentSVG;
    parentSVG.appendChild(image);
  }
}
