import {AnimationInfoNoMystery, AnimationLocation, AnimationNode, AnimationRoad} from './animation-info-nomystery';
import * as d3 from 'd3';
import {AnimationInitializer} from 'src/app/plan-visualization/integration/animation-initializer';

interface Action {
  name: string;
  args: string[];
}


export class AnimationInitializerNoMystery extends AnimationInitializer {

  width = 400;
  height = 600;

  trucksSVG;
  packagesSVG;


  constructor(svgContainerId: string, private animationInfo: AnimationInfoNoMystery) {
    super(svgContainerId);
    this.simulateMap();
  }

  restart() {
   this.resetObjectLocation();
  }

  private simulateMap() {

    const svg: any = d3.select(this.svgContainerId)
    .call(d3.zoom().on('zoom', () => {
        svg.attr('transform', d3.event.transform);
        // console.log(d3.event.transform);
      }
    ))
    .append('g');

    const nodes: AnimationNode[] = Array.from(this.animationInfo.locations.values());

    const simulation: any = d3.forceSimulation().nodes(nodes);
    simulation.stop();

    simulation
    .force('charge', d3.forceManyBody<AnimationNode>().strength( 300))
    .force('collide', d3.forceCollide().radius(10).strength(5))
    .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    simulation.force('linkRoad',
    d3.forceLink<AnimationLocation, AnimationRoad>()
    .id(d => d.id)
    .links(this.animationInfo.roads)
    .distance(200)
    .strength(l => 1));

    const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(Array.from(this.animationInfo.locations.values()))
        .enter()
        .append('circle')
        .attr('class', 'nodes')
        .attr('r', 10)
        .attr('fill', 'black');

    const links = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.animationInfo.roads)
      .enter()
      .append('line')
      .attr('class', 'links')
      .attr('stroke-width', 3)
      .attr('stroke', '#000000');

    this.trucksSVG = svg.append('g')
      .attr('class', 'trucks')
      .selectAll('image')
      .data(Array.from(this.animationInfo.trucks.values()))
      .enter()
      .append('image')
      .attr('class', 'trucks')
      .attr('id', t => t.id)
      .attr('xlink:href', t => 'assets/truck_' + t.id + '.svg')
      // .attr('height', 50)
      .attr('width', 100);

    this.packagesSVG = svg.append('g')
      .attr('class', 'packages')
      .selectAll('image')
      .data(Array.from(this.animationInfo.packages.values()))
      .enter()
      .append('image')
      .attr('class', 'packages')
      .attr('id', t => t.id)
      .attr('xlink:href', 'assets/package.svg')
      .attr('height', 20)
      .attr('width', 20);

    simulation.tick(400);
    this.tickActions(node, links);
    this.resetObjectLocation();

    // simulation.on('tick', ( ) => this.tickActions(node, links));
    // // simulation.on('end', () => this.buildAnimation(this.planActions, this.task, this.timeline, this.planAnimations));
    // simulation.on('end', () => this.initObjectLocation(trucks, packages));
    return simulation;
  }


  private strength(road: AnimationRoad) {
  const res = (1 / Math.min(road.source.degree, road.target.degree));
  // console.log(res);
  return res;
  }


  private tickActions(node, link) {
  node
    .attr('cx', d => d.fixed ? d.fx : d.x)
    .attr('cy', d => d.fixed ? d.fy : d.y);

  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  }


  public resetObjectLocation() {
    for (const loc of this.animationInfo.locations.values()) {
      loc.objects = 0;
    }
    for (const truck of this.animationInfo.trucks.values()) {
      truck.loadedPackages.splice(0, truck.loadedPackages.length);
      truck.currentFuel = truck.getInitFuel();
      const pos = truck.startLocation.getFreePosition();
      truck.x = pos.x;
      truck.y = pos.y;
      truck.startLocation.objects++;
      truck.currentLocation = truck.startLocation;
    }
    this.trucksSVG
    .attr('x', d => d.x)
    .attr('y', d => d.y);

    for (const p of this.animationInfo.packages.values()) {
      const pos = p.startLocation.getFreePosition();
      p.x = pos.x;
      p.y = pos.y;
      p.startLocation.objects++;
      p.currentLocation = p.startLocation;
    }
    this.packagesSVG
    .attr('x', d => d.x)
    .attr('y', d => d.y);
  }

}
