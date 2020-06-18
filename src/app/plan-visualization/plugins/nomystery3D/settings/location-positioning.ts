import { NoMysteryTask, Location, Road } from './../../nomystery/nomystery-task';
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

interface Position {
  x: number;
  y: number;
}

const maxHeight = 700;
const maxWidth = 700;

const nodeWidth = 75;
const nodeHeight = 30;


interface MoveLocation {
  x: number;
  y: number;
  location: Location;
  svg: Element;
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

  constructor(private task: NoMysteryTask, private locationPositions: Map<string, Position>) {

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', maxWidth.toString());
    this.svg.setAttribute('height', maxHeight.toString());

    this.createLocations();
    this.createEdges();
    this.addNodeSVG();

    this.updateLocationPositions();
    this.updateEdgePositions();

    gsap.registerPlugin(Draggable);
    initDraggable(this);

    this.svg.addEventListener('load', () => initDraggable(this));
    this.svg.addEventListener('click', () => initDraggable(this));

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
    text.setAttribute('x', (nodeWidth / 2).toString());
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

    const moveLoc: MoveLocation = {
      x,
      y,
      location: loc,
      svg: group,
    };

    return moveLoc;
  }

  addNodeSVG() {
    for (const mn of this.moveLocations.values()) {
      this.svg.appendChild(mn.svg);
    }
  }

  updateLocationPositions() {
    for ( const mv of this.moveLocations.values()) {
      mv.svg.setAttribute('transform', `translate(${mv.x}, ${mv.y})`);
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

  getCurrentLocations(): Map<string, Position> {
    const rMap = new Map();
    for (const n of this.moveLocations.values()) {
      const pos: Position = getPosfromTransform(n.svg.getAttribute('transform'));
      rMap.set(n.location.name, pos);
    }
    return rMap;
  }

}

function initDraggable(settings: LocationPositioningSettings) {
  console.log('svg load');
  Draggable.create('.node', {
    bounds: 'svg',
    onDrag: () => settings.updateEdgePositions()
  });
}

function getPosfromTransform(transform: string): Position {
  const parts = transform.replace(')', '').replace('translate(', '').split(',');
  const x = parts[parts.length - 2];
  const y = parts[parts.length - 1];

  return {x: +x, y: +y};
}

function randomNumber(bound: number) {
  return Math.floor(Math.random() * bound) + 1;
}



