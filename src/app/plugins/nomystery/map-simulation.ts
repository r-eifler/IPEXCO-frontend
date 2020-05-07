import { Task, Road, Link, Node, Location } from './task';
import * as d3 from 'd3';
import { animateAction } from './animations';
import { Simulation } from 'd3';

interface Action {
  name: string;
  args: string[];
}


export function simulateMap(svgContainerId: string, task: Task, width: number, height: number): Simulation<Node, Link<Node>> {


  const svg: any = d3.select(svgContainerId)
  .call(d3.zoom().on('zoom', () =>
      svg.attr('transform', d3.event.transform)
  ))
  .append('g');

  let nodes: Node[] = Array.from(task.locations.values());
  nodes = nodes.concat(Array.from(task.packages.values()));
  nodes = nodes.concat(Array.from(task.trucks.values()));

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
  .links(task.roads)
  .distance(100)
  .strength(l => 1 * strength(l)));

  simulation.force('linkPackage',
  d3.forceLink<Node, Link<Node>>()
  .id(d => d.id)
  .links(task.startPackageLinks)
  .distance(15)
  .strength(1));

  simulation.force('linkTruck',
  d3.forceLink<Node, Link<Node>>()
  .id(d => d.id)
  .links(task.truckLinks)
  .distance(15)
  .strength(1));

  const node = svg.append('g')
      .selectAll('circle')
      .data(Array.from(task.locations.values()))
      .enter()
      .append('circle')
      .attr('class', 'nodes')
      .attr('r', 10)
      .attr('fill', 'black')
      .on('click', d => { d.fixed = true; });

  const links = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(task.roads)
    .enter()
    .append('line')
    .attr('class', 'links')
    .attr('stroke-width', 3)
    .attr('stroke', '#000000');

  const trucks = svg.append('g')
    .attr('class', 'trucks')
    .selectAll('rect')
    .data(Array.from(task.trucks.values()))
    .enter()
    .append('rect')
    .attr('class', 'trucks')
    .attr('id', t => t.id)
    .attr('stroke-width', 3)
    .attr('stroke', '#FFAA00')
    .attr('fill', '#FFAA00')
    .attr('height', 15)
    .attr('width', 30);

  const packages = svg.append('g')
    .attr('class', 'packages')
    .selectAll('rect')
    .data(Array.from(task.packages.values()))
    .enter()
    .append('rect')
    .attr('class', 'packages')
    .attr('id', t => t.id)
    .attr('stroke-width', 3)
    .attr('stroke', '#FF0000')
    .attr('fill', '#FF0000')
    .attr('height', 10)
    .attr('width', 10);


  simulation.on('tick', ( ) => tickActions(node, links, packages, trucks));
  // simulation.on('end', () => this.buildAnimation(this.planActions, this.task, this.timeline, this.planAnimations));
  simulation.on('end', () => fixNodes(node));
  return simulation;
}


function strength(road: Road) {
const res = (1 / Math.min(road.source.degree, road.target.degree));
// console.log(res);
return res;
}

function fixNodes(node) {
  node
  .attr('fx', d => d.fx = d.x)
  .attr('fy', d => d.fy = d.y)
  .attr('fixed', d => d.fixed = true);
}

function tickActions(node, link, packages, trucks) {
node
  .attr('cx', d => d.fixed ? d.fx : d.x)
  .attr('cy', d => d.fixed ? d.fy : d.y);

link
  .attr('x1', d => d.source.x)
  .attr('y1', d => d.source.y)
  .attr('x2', d => d.target.x)
  .attr('y2', d => d.target.y);

packages
  // .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')' );
  .attr('x', d => d.x)
  .attr('y', d => d.y);

trucks
  // .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')' );
  .attr('x', d => d.x)
  .attr('y', d => d.y);

}
