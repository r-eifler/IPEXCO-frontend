import { NoMysteryTask, Location, Road } from './../../nomystery/nomystery-task';
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { logDepthVertex } from 'babylonjs/Shaders/ShadersInclude/logDepthVertex';

interface Position {
  x: number;
  y: number;
}

const maxHeight = 700;
const maxWidth = 700;

const nodeWidth = 30;
const nodeHeight = 30;


interface MoveLocation {
  location: Location;
  svg: Element;
  draggable: any;
  dropLocations: MoveDropLocation[];
}

interface MoveDropLocation {
  location: Location;
  svg: Element;
  draggable: any;
}

interface MoveEdge {
  source: Element;
  target: Element;
  svg: Element;
}


export class LocationPositioningSettings {

  private svg: SVGSVGElement;

  moveLocations: Map<string, MoveLocation> = new Map();
  moveEdges: MoveEdge[] = [];

  dropLocations: MoveDropLocation[] = [];

  constructor(
    private task: NoMysteryTask,
    private locationPositions: Map<string, Position>,
    private locationDropPositions: Map<string, Position[]>) {

    gsap.registerPlugin(Draggable);

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', maxWidth.toString());
    this.svg.setAttribute('height', maxHeight.toString());

    this.createLocations();
    this.createEdges();
    this.addNodeSVG();
    this.createPackageDropLocations();

    this.updateEdgePositions();

    this.disableDraggableDropLocations();
    // initDraggable(this);

    // this.svg.addEventListener('load', () => initDraggable(this));
    // this.svg.addEventListener('click', () => initDraggable(this));

  }



  display(): Element {
    return this.svg;
  }

  createLocations() {

    for (const loc of this.task.locations.values()) {
      this.moveLocations.set(loc.name, this.createNode(loc));
    }

  }

  createNode(loc: Location): MoveLocation {
    const group = document.createElementNS(this.svg.namespaceURI, 'g');
    group.setAttribute('class', 'node');
    group.setAttribute('id', loc.name);

    const rect = document.createElementNS(this.svg.namespaceURI, 'rect');
    rect.setAttribute('width', nodeWidth.toString());
    rect.setAttribute('height', nodeHeight.toString());
    rect.setAttribute('stroke', '#000000');
    rect.setAttribute('fill', '#FFFFFF');
    rect.setAttribute('stroke-width', '4');

    group.appendChild(rect);

    const text = document.createElementNS(this.svg.namespaceURI, 'text');
    text.textContent = loc.name;
    text.setAttribute('x', (nodeWidth / 2 - 5).toString());
    text.setAttribute('y', (nodeHeight / 2 + 5).toString());

    group.appendChild(text);

    let x = 0;
    let y = 0;
    if (this.locationPositions) {
      const pos = this.locationPositions.get(loc.name);
      x = pos.x;
      y = pos.y;
    } else {
      x = randomNumber(maxWidth);
      x = Math.min(Math.max(nodeWidth + 20, x), maxWidth - nodeWidth - 20);
      y = randomNumber(maxWidth);
      y = Math.min(Math.max(nodeHeight + 20, y), maxHeight - nodeHeight - 20);
    }

    group.setAttribute('transform', `translate(${x}, ${y})`);
    const moveLoc: MoveLocation = {
      location: loc,
      svg: group,
      draggable: Draggable.create(group, {bound: this.svg, onDrag: () => this.updateEdgePositions()})[0],
      dropLocations: [],
    };

    return moveLoc;
  }

  addNodeSVG() {
    for (const mn of this.moveLocations.values()) {
      this.svg.appendChild(mn.svg);
    }
  }

  createPackageDropLocations() {
    const numPackages = this.task.packages.size;
    for (const loc of this.moveLocations.values()) {
      for (let i = 0; i < numPackages; i++) {
        const group = document.createElementNS(this.svg.namespaceURI, 'g');

        const rect = document.createElementNS(this.svg.namespaceURI, 'rect');
        rect.setAttribute('width', '20');
        rect.setAttribute('height', '20');
        rect.setAttribute('stroke', '#000000');
        rect.setAttribute('fill', '#000000');

        group.appendChild(rect);

        const text = document.createElementNS(this.svg.namespaceURI, 'text');
        text.textContent = i.toString();
        text.setAttribute('x', '6');
        text.setAttribute('y', '15');
        text.setAttribute('stroke', '#FFFFFF');

        group.appendChild(text);

        loc.svg.appendChild(group);

        let x = 0;
        let y = 0;
        if (this.locationDropPositions){
          const pos = this.locationDropPositions.get(loc.location.name)[i];
          x = pos.x;
          y = pos.y;
        } else {
          const alpha = i / numPackages * 2 * Math.PI;
          const dx = Math.cos(alpha) * 60;
          const dz = Math.sin(alpha) * 60;
          x = dx + nodeWidth / 2 - 10;
          y = dz + nodeHeight / 2 - 10;
        }


        group.setAttribute('transform', `translate(${x}, ${y})`);
        const moveLoc: MoveDropLocation = {
          location: loc.location,
          svg: group,
          draggable: Draggable.create(group, {bound: this.svg})[0]
        };

        loc.dropLocations.push(moveLoc);

        this.dropLocations.push(moveLoc);
      }
    }
  }

  createEdges() {
    for ( const r of this.task.roads) {
      if (r.source.name < r.target.name) {
        continue;
      }
      this.moveEdges.push(this.createEdge(r));
    }
  }

  createEdge(road: Road): MoveEdge {
    const line = document.createElementNS(this.svg.namespaceURI, 'line');
    line.setAttribute('stroke', '#000000');
    line.setAttribute('stroke-width', '4');

    this.svg.appendChild(line);

    const newEdge: MoveEdge = {
      source: this.moveLocations.get(road.source.name).svg,
      target: this.moveLocations.get(road.target.name).svg,
      svg: line
    };

    // console.log(road.source.name + ' -> ' + road.target.name);
    // console.log(newEdge);

    return newEdge;
  }

  updateEdgePositions() {
    for ( const e of this.moveEdges) {
      const sPos: Position = getPosfromTransform(e.source.getAttribute('transform'));
      const tPos: Position = getPosfromTransform(e.target.getAttribute('transform'));

      e.svg.setAttribute('x1', (+sPos.x + nodeWidth / 2).toString());
      e.svg.setAttribute('y1', (+sPos.y + nodeHeight / 2).toString());
      e.svg.setAttribute('x2', (+tPos.x + nodeWidth / 2).toString());
      e.svg.setAttribute('y2', (+tPos.y + nodeHeight / 2).toString());
    }
  }

  getCurrentLocationsPositions(): Map<string, Position> {
    const rMap = new Map();
    for (const n of this.moveLocations.values()) {
      const pos: Position = getPosfromTransform(n.svg.getAttribute('transform'));
      rMap.set(n.location.name, pos);
    }
    return rMap;
  }

  getCurrentLocationsDropPositions(): Map<string, Position[]> {
    const rMap = new Map();
    for (const n of this.moveLocations.values()) {
      const positions = []
      for (const dropPos of n.dropLocations){
        positions.push(getPosfromTransform(dropPos.svg.getAttribute('transform')));
      }
      rMap.set(n.location.name, positions);
    }
    return rMap;
  }

  enableDraggableLocations() {
    for (const loc of this.moveLocations.values()) {
      loc.draggable.enable();
    }
  }

  disableDraggableLocations() {
    for (const loc of this.moveLocations.values()) {
      loc.draggable.disable();
    }
  }

  enableDraggableDropLocations() {
    for (const loc of this.dropLocations) {
      loc.draggable.enable();
    }
  }

  disableDraggableDropLocations() {
    for (const loc of this.dropLocations) {
      loc.draggable.disable();
    }
  }

}

// function initDraggable(settings: LocationPositioningSettings) {
//   console.log('svg load');
//   settings.draggableNodes = Draggable.create('.node', {
//     bounds: 'svg',
//     onDrag: () => settings.updateEdgePositions()
//   });
//   settings.draggableDropLocations = Draggable.create('.dropLoc', {
//     bounds: 'svg',
//   });
// }

function getPosfromTransform(transform: string): Position {
  const parts = transform.replace(')', '').replace('translate(', '').split(',');
  const x = parts[parts.length - 2];
  const y = parts[parts.length - 1];

  return {x: +x, y: +y};
}

function randomNumber(bound: number) {
  return Math.floor(Math.random() * bound) + 1;
}



