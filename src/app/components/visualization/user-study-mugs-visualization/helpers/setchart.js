import * as d3 from 'd3';
import {onmousehover, onmouseleave} from "./visualization-drawer";

let where, svg, data, idSet, margin, width, height, x, y, dataElementColors;

const getId = (name) => {
  const match = idSet.find(el => el.name === name);
  return match ? match.id : "";
};

function draw(_data, _where, _dims){
  where = _where;
  data = _data;
  idSet = _data.elements.map(d => ({ name: d.name, id: d._id }));
  data.elementsName = _data.elements.map(d => d.name);
  dataElementColors = _data.elements.map(d => ({ name: d.name, color: d.color }));
  margin = _dims.margin;
  width = _dims.width;
  height = _dims.height;

  // append the svg object to the body of the page
  svg = d3.select(where)
    .append("g")
    .attr("class", "mainG-gv")
    .attr("transform", `translate(${margin.right},${58})`)

  resize();
}

function resize() {
  d3.select(where)
    .style("width", width + margin.left + margin.right + "px")
    .style("height", height + margin.top + margin.bottom + "px")

  // scales and axes
  x = d3.scaleBand()
    .range([0, width])
    .domain(data.MUGS.map(d => ""+d.i));

  y = d3.scaleBand()
    .range([0, height])
    .domain(data.elementsName);

  const goals = []
  data.MUGS.forEach((ugs) => {
    ugs.l.forEach(g => {
      goals.push({
        x: ""+ugs.i,
        goal: g
      });
    });
  });

  const rectOffset = 10;
  const radius = 8;

  const colorMapping = (name) => {
    const match = dataElementColors.find(el => el.name === name);
    return match ? match.color : "";
  };

  svg.selectAll()
    .data(data.MUGS)
    .enter()
    .append("rect")
    .attr("id", d => "seg_" + d.i)
    .classed("seg-highlight", d => d.l.length === 1);

  svg.selectAll("rect:not(.seg-highlight)")
    .attr("x", d => x(""+d.i) + rectOffset)
    .attr("y", d => Math.min(...d.l.map(g=>y(g))) + rectOffset)
    .attr("width", 2)
    .attr("height", d => Math.max(...d.l.map(g=>y(g))) - Math.min(...d.l.map(g=>y(g))))
    .style("fill", "#bdbdbd");

  svg.selectAll()
    .data(goals)
    .enter()
    .append("circle")
    .attr("id", d => getId(d.goal))
    .attr("class", d => `mugs mugs_${d.x} ${d.goal}`)
    .attr("cx", d => x(d.x) + (rectOffset+(rectOffset-radius)/2))
    .attr("cy", d => y(d.goal)+rectOffset)
    .attr("r", radius)
    .style("fill", d => colorMapping(d.goal))
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
}

function appearanceCount(goal) {
  let count = 0;

  data.MUGS.forEach(mug => {
    if (mug.l.includes(goal.goal)){
      count++;
    }
  });

  return count>0 ? count++ : count;
}

function mouseover(event, d) {
  const id = getId(d.goal);
  const count = appearanceCount(d);
  console.log(count);
  const escapedId = CSS.escape(id);

  const elements = svg.selectAll(`#${escapedId}, .mugs_${d.x}, #seg_${d.i}`);

  elements.classed("highlighted-hovered", true);
  elements.style("stroke", "black");
  elements.style("stroke-width", "2px");

  onmousehover(escapedId)
}

function mouseleave(event, d) {
  svg.selectAll("circle")
    .style("stroke", "none")
    .style("stroke-width", "0px")

  onmouseleave()
}




export {draw}
