import { Task, Road, Link, Package, Truck } from './../../../../plugins/nomystery/task';
import { TasktSchemaStore } from './../../../../store/stores.store';
import { TaskSchema } from './../../../../interface/schema';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {Location, Node} from './../../../../plugins/nomystery/task';

@Component({
  selector: 'app-nomystery-task-view',
  templateUrl: './nomystery-task-view.component.html',
  styleUrls: ['./nomystery-task-view.component.css']
})
export class NomysteryTaskViewComponent implements OnInit {

@ViewChild('mapSVG') mapSVG: ElementRef;
taskSchema: TaskSchema;
task: Task;


  constructor(private taskSchemaStore: TasktSchemaStore) {
    this.taskSchemaStore.item$.subscribe(ts => {
      this.taskSchema = ts;
      if (this.taskSchema) {
        this.task = new Task(this.taskSchema);
        this.initMap();
      }
    });
  }

  ngOnInit(): void {
  }

initMap() {

    const width = this.mapSVG.nativeElement.clientWidth;
    const height = this.mapSVG.nativeElement.clientHeight;

    const svg: any = d3.select('svg')
    .call(d3.zoom().on('zoom', () =>
        svg.attr('transform', d3.event.transform)
    ))
    .append('g');

    let nodes: Node[] = Array.from(this.task.locations.values());
    nodes = nodes.concat(Array.from(this.task.packages.values()));
    nodes = nodes.concat(Array.from(this.task.trucks.values()));

    console.log('Nodes: ');
    console.log(nodes);

    const simulation: any = d3.forceSimulation().nodes(nodes);

    simulation
    .force('charge', d3.forceManyBody<Node>().strength( d => d.strength))
    .force('collide', d3.forceCollide().radius(10).strength(5))
    .force('center', d3.forceCenter(width / 2, height / 2));

    simulation.force('linkRoad',
    d3.forceLink<Location, Road>()
    .id(d => d.id)
    .links(this.task.roads)
    .distance(100)
    .strength(l => 1 * strength(l)));

    simulation.force('linkPackage',
    d3.forceLink<Node, Link<Node>>()
    .id(d => d.id)
    .links(this.task.goalPackageLinks)
    .distance(15)
    .strength(1));

    simulation.force('linkTruck',
    d3.forceLink<Node, Link<Node>>()
    .id(d => d.id)
    .links(this.task.truckLinks)
    .distance(15)
    .strength(1));

    const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(Array.from(this.task.locations.values()))
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', 'black');

    const links = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.task.roads)
      .enter()
      .append('line')
      .attr('class', 'links')
      .attr('stroke-width', 3)
      .attr('stroke', '#000000');

    const packages = svg.append('g')
      .attr('class', 'packages')
      .selectAll('rect')
      .data(Array.from(this.task.packages.values()))
      .enter()
      .append('rect')
      .attr('class', 'packages')
      .attr('stroke-width', 3)
      .attr('stroke', '#FF0000')
      .attr('fill', '#FF0000')
      .attr('height', 10)
      .attr('width', 10);

    const trucks = svg.append('g')
      .attr('class', 'trucks')
      .selectAll('rect')
      .data(Array.from(this.task.trucks.values()))
      .enter()
      .append('rect')
      .attr('class', 'trucks')
      .attr('stroke-width', 3)
      .attr('stroke', '#FFAA00')
      .attr('fill', '#FFAA00')
      .attr('height', 15)
      .attr('width', 30);




    simulation.on('tick', ( ) => tickActions(node, links, packages, trucks));

}

}


function strength(road: Road) {
  const res = (1 / Math.min(road.source.degree, road.target.degree));
  // console.log(res);
  return res;
}

function tickActions(node, link, packages, trucks) {
  node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

  link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

  packages
      .attr('x', d => d.x)
      .attr('y', d => d.y);

  trucks
      .attr('x', d => d.x)
      .attr('y', d => d.y);

}
