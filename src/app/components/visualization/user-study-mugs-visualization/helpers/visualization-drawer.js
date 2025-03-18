import * as d3 from "d3";
import * as setchart from "./setchart";
import {constants, separateTicks} from "./utils";

let parentId, svgId, idSet, uId, svg, matrixGroup, data, x, y;
const OFFSET = 2
const margin = { top: 50, right: 0, bottom: 0, left: 350 }

function init(parent, uid) {
  parentId = parent;
  svgId = parentId + "-svg";
  uId = uid;
}

function remove() {
  d3.select(svgId).remove();
}

function draw(_data){
  data = _data;
  data.elementsName = _data.elements.map(d => d.name);
  idSet = _data.elements.map(d => ({ name: d.name, id: d._id }));

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
    .attr("width", size >= 360 ? size : 360)
    .attr("height", size + margin.top + margin.bottom)

  // build scales and axes:
  x = d3.scaleBand()
    .range([0, size])
    .domain(data.elementsName);

  y = d3.scaleBand()
    .range([0, size])
    .domain(data.elementsName);

  const getId = (name) => {
    const match = idSet.find(el => el.name === name);
    return match ? match.id : "";
  };

  //matrixGroup.select("#matrix-y-axis").remove();
  matrixGroup.append("g")
    .attr("id", "matrix-y-axis")
    .attr("class", "y axis")
    .call(d3
      .axisLeft(y)
      .tickFormat((t, i) => separateTicks(t, i, data.elementsName.length, size, 30))
      .tickSize(0)
    )
    .selectAll("text").attr("class", d => `${getId(d)}`);

  matrixGroup.select("#matrix-y-axis")
    .selectAll("text")
    .style("font-size", "14px")

  matrixGroup.select("#matrix-y-axis path.domain").remove();

  const setchartId = "mugs-helpers-setchart" + uId;
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

function onmousehover(id){
  const elements = svg.selectAll(`.${id}`);
  elements.style("color", "red");
}

function onmouseleave(){
  matrixGroup.select("#matrix-y-axis")
    .selectAll("text")
    .style("color", "black")
}


export { init, remove, draw, onmousehover, onmouseleave };
