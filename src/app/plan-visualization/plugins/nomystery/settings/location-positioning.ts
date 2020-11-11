import {Location, NoMysteryTask, Road} from '../nomystery-task';
import {gsap} from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {AnimationSettingsNoMystery} from './animation-settings-nomystery';

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
  draggable: Draggable;
  dropLocations: MoveDropLocation[];
}

interface MoveDropLocation {
  location: Location;
  svg: Element;
  draggable: Draggable;
}

interface MoveEdge {
  source: Element;
  target: Element;
  svg: Element;
}


export class LocationPositioningSettings {

  private svg: SVGSVGElement;
  private borderBox: Element;

  moveLocations: Map<string, MoveLocation> = new Map();
  moveEdges: MoveEdge[] = [];

  dropLocations: MoveDropLocation[] = [];

  constructor(
    private backgroundImagePath: string,
    private task: NoMysteryTask,
    private animationSettings: AnimationSettingsNoMystery) {

    gsap.registerPlugin(Draggable);

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', maxWidth.toString());
    this.svg.setAttribute('height', maxHeight.toString());

    this.creatBorderBox();

    const backgroundImage: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    backgroundImage.style.height = '700px';
    backgroundImage.style.width = '700px';
    backgroundImage.setAttribute('href', backgroundImagePath);
    this.svg.appendChild(backgroundImage);

    this.createLocations();
    this.createEdges();
    this.addNodeSVG();
    this.createPackageDropLocations();

    this.updateEdgePositions();

    this.disableDraggableDropLocations();

  }

  display(): Element {
    return this.svg;
  }

  creatBorderBox() {
    this.borderBox = document.createElementNS(this.svg.namespaceURI, 'rect');
    this.borderBox.setAttribute('width', maxWidth.toString());
    this.borderBox.setAttribute('height', maxHeight.toString());
    this.borderBox.setAttribute('stroke', '#000000');
    this.borderBox.setAttribute('fill', '#FFFFFF');
    this.borderBox.setAttribute('stroke-width', '4');

    this.svg.appendChild(this.borderBox);
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
    if (this.animationSettings.locationPositions.has(loc.name)) {
      const pos = this.animationSettings.locationPositions.get(loc.name);
      x = pos.x;
      y = pos.y;
    } else {
      x = randomNumber(maxWidth);
      x = Math.min(Math.max(nodeWidth + 60, x), maxWidth - nodeWidth - 60);
      y = randomNumber(maxWidth);
      y = Math.min(Math.max(nodeHeight + 60, y), maxHeight - nodeHeight - 60);
    }

    group.setAttribute('transform', `translate(${x}, ${y})`);
    const moveLoc: MoveLocation = {
      location: loc,
      svg: group,
      draggable: new Draggable(group, {bound: this.borderBox, onDrag: () => this.updateEdgePositions()}),
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
        if (this.animationSettings.locationDropPositions.has(loc.location.name)){
          const pos = this.animationSettings.locationDropPositions.get(loc.location.name)[i];
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
          draggable: new Draggable(group, {bound: this.borderBox})
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
      const sPos: Position = getPosFromTransform(e.source.getAttribute('transform'));
      const tPos: Position = getPosFromTransform(e.target.getAttribute('transform'));

      e.svg.setAttribute('x1', (+sPos.x + nodeWidth / 2).toString());
      e.svg.setAttribute('y1', (+sPos.y + nodeHeight / 2).toString());
      e.svg.setAttribute('x2', (+tPos.x + nodeWidth / 2).toString());
      e.svg.setAttribute('y2', (+tPos.y + nodeHeight / 2).toString());
    }
  }

  getCurrentLocationsPositions(): Map<string, Position> {
    const rMap = new Map();
    for (const n of this.moveLocations.values()) {
      const pos: Position = getPosFromTransform(n.svg.getAttribute('transform'));
      rMap.set(n.location.name, pos);
    }
    return rMap;
  }

  getCurrentLocationsDropPositions(): Map<string, Position[]> {
    const rMap = new Map();
    for (const n of this.moveLocations.values()) {
      const positions = []
      for (const dropPos of n.dropLocations){
        positions.push(getPosFromTransform(dropPos.svg.getAttribute('transform')));
      }
      rMap.set(n.location.name, positions);
    }
    return rMap;
  }

  enableDraggableLocations() {
    for (const loc of this.moveLocations.values()) {
      loc.draggable.applyBounds(this.svg);
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
      loc.draggable.applyBounds(this.svg);
      loc.draggable.enable();
    }
  }

  disableDraggableDropLocations() {
    for (const loc of this.dropLocations) {
      loc.draggable.disable();
    }
  }

}

function getPosFromTransform(transform: string): Position {
  const parts = transform.replace(')', '').replace('translate(', '').split(',');
  const x = parts[parts.length - 2];
  const y = parts[parts.length - 1];

  return {x: +x, y: +y};
}

function randomNumber(bound: number) {
  return Math.floor(Math.random() * bound) + 1;
}



