import { separateTicks } from "./utils.js";
import * as d3 from 'd3';

let where, svg, data, margin, width, height, x, y, dataElementColors;

function draw(_data, _where, _dims){
  where = _where;
  data = _data;
  data.elementsName = _data.elements.map(d => d.name);
  dataElementColors = _data.elements.map(d => ({ name: d.name, color: d.color }));
  margin = _dims.margin;
  width = _dims.width;
  height = _dims.height;

  // append the svg object to the body of the page
  svg = d3.select(where)
    .append("g")
    .attr("class", "mainG-gv")
    .attr("transform", `translate(${margin.right},${margin.top})`)

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
    .attr("id", d => d.x + ":" + d.goal)
    .attr("class", d => `mugs mugs_${d.x} ${d.goal}`)
    .attr("cx", d => x(d.x) + (rectOffset+(rectOffset-radius)/2))
    .attr("cy", d => y(d.goal)+rectOffset)
    .attr("r", radius)
    .style("fill", d => colorMapping(d.goal))

  svg.select("#setchart-x-axis").remove();
  svg.append("g")
    .attr("id", "setchart-x-axis")
    .attr("class", "x axis")
    .call(
      d3.axisTop(x)
        .tickFormat((t, i) => separateTicks(t, i, data.MUGS.length, width, 20))
        .tickSize(0)
    )
  svg.select("#setchart-x-axis")
    .selectAll("text")
    .style("font-size", "10px")

  svg.select("#setchart-x-axis path.domain").remove();

}

export {draw}
