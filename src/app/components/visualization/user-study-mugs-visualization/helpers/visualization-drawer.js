import * as d3 from "d3";
import * as setchart from "./setchart";
import {constants, separateTicks} from "./utils";

let parentId, svgId, svg, matrixGroup, data, x, y;
const OFFSET = 2
const margin = { top: 50, right: 0, bottom: 0, left: 275 }

function init(parent) {
  parentId = parent;
  svgId = parentId + "-svg";
}

function remove() {
  d3.select(svgId).remove();
}

function draw(_data){
  data = _data;
  data.elementsName = _data.elements.map(d => d.name);

  svg = d3.select(parentId)
    .append("svg")
    .attr("id", svgId.slice(1));

  matrixGroup = svg.append("g")
    .attr("class", "mainG-cv")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  resize()
}

function resize() {
  const size = data.elementsName.length * constants.rectWidth;

  d3.select(parentId)
    .style("width", size + margin.left + margin.right + (data.MUGS.length * 30) + "px") // include the chart to the right

  d3.select(svgId)
    .attr("width", size >= 350 ? size : 350)
    .attr("height", size + margin.top + margin.bottom)

  // build scales and axes:
  x = d3.scaleBand()
    .range([0, size])
    .domain(data.elementsName);

  y = d3.scaleBand()
    .range([0, size])
    .domain(data.elementsName);

  //matrixGroup.select("#matrix-y-axis").remove();
  matrixGroup.append("g")
    .attr("id", "matrix-y-axis")
    .attr("class", "y axis")
    .call(d3
      .axisLeft(y)
      .tickFormat((t, i) => separateTicks(t, i, data.elementsName.length, size, 30))
      .tickSize(0)
    )
    .selectAll("text").attr("class", d => d);

  matrixGroup.select("#matrix-y-axis")
    .selectAll("text")
    .style("font-size", "14px")

  matrixGroup.select("#matrix-y-axis path.domain").remove();

  const setchartId = "mugs-helpers-setchart"
  d3.select(`#${setchartId}`).remove()
  d3.select(parentId).append("svg").attr("id", setchartId);
  setchart.draw(
    data,
    `#${setchartId}`,
    {
      width: data.MUGS.length * (constants.rectWidth),
      height: data.elementsName.length * constants.rectWidth,
      margin: {
        top: margin.top,
        right: 0,
        bottom: OFFSET,
        left: 0
      }
    }
  )
}


export { init, remove, draw };
