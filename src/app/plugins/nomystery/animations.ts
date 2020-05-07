import { Task, Location, Truck, Package } from './task';
import * as d3 from 'd3';

interface Action {
  name: string;
  args: string[];
}

export interface Animation {
  id: string;
  transition: any;
}

const duration = 2;

export function animateAction(action: Action, task: Task): void {
  console.log('generate animation');
  switch (action.name) {
    case 'drive':
      return driveAnimation(action.args, task);
    case 'load':
      return loadAnimation(action.args, task);
    case 'unload':
      return unloadAnimation(action.args, task);
  }
}



function driveAnimation(args: string[], task: Task): void {
    const id = args[0];
    const truck: Truck = task.trucks.get(id);
    const targetLocation: Location = task.locations.get(args[2]);

    d3.select('#' + id).transition()
      .duration(1000 * duration)
      .attr('x', targetLocation.x)
      .attr('y', targetLocation.y)
      .on('end', () => {
        truck.x = targetLocation.x;
        truck.y = targetLocation.y;
        for (const link of task.truckLinks) {
          if (link.source.id === truck.id) {
            link.target = targetLocation;
          }
        }
      });

    for (const p of truck.loadedPackages) {
      d3.select('#' + p.id).transition()
        .duration(1000 * duration)
        .attr('x', targetLocation.x)
        .attr('y', targetLocation.y)
        .on('end', () => {
          p.x = targetLocation.x;
          p.y = targetLocation.y;
        });
    }

}

function loadAnimation(args: string[], task: Task) {
  const p = args[0];
  const t = args[1];
  const truck: Truck = task.trucks.get(t);
  const pack: Package = task.packages.get(p);

  d3.select('#' + pack.id).transition()
    .duration(1000 * duration)
    .attr('x', truck.x)
    .attr('y', truck.y);

  pack.x = truck.x;
  pack.y = truck.y;
  truck.loadedPackages.push(pack);
}

function unloadAnimation(args: string[], task: Task) {

}
