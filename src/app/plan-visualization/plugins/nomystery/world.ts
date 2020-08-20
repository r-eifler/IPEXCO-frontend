import {NoMysteryAnimationTask} from './nomystery-animation-task';


export async function loadTrucks(task: NoMysteryAnimationTask, parentSVG: SVGElement) {
  console.log('Load Trucks');
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
    truck.initParentSVG = parentSVG;
    svgGroup.appendChild(image);
    svgGroup.style.zIndex = '20';
    parentSVG.appendChild(svgGroup);
  }
}

export  function loadPackages(task: NoMysteryAnimationTask, parentSVG: SVGElement) {
  for (const pack of task.packages.values()) {
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', 'assets/package.svg');
    image.style.height = '20';
    image.style.width = 'auto';
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.innerHTML = pack.id.replace('p', '');
    text.setAttribute('x', '20');
    text.setAttribute('y', '15');

    svgGroup.appendChild(image);
    svgGroup.appendChild(text);
    svgGroup.style.zIndex = '100';

    pack.svg = svgGroup;
    pack.parentSVG = parentSVG;
    pack.initParentSVG = parentSVG;
    parentSVG.appendChild(svgGroup);
  }
}
