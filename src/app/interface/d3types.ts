import {SimulationLinkDatum, SimulationNodeDatum} from 'd3';

export class D3Node implements SimulationNodeDatum {

  public group: number;
  public x: number;
  public y: number;
  public degree: number;

  constructor(public id: string) {}

}

export class D3Link implements SimulationLinkDatum<D3Node> {
  constructor(public source: D3Node, public target: D3Node) {}
}

export interface Graph {
  nodes: SimulationNodeDatum[];
  links: SimulationLinkDatum<SimulationNodeDatum>[];
}

