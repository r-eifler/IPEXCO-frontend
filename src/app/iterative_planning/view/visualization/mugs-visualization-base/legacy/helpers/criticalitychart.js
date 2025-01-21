import state from "../state.js"
import * as d3 from 'd3';

let where, svg, data, margin, width, height, y;

function draw(_data, _where, _dims) {
  where = _where;
  data = _data;
  margin = _dims.margin;
  width = _dims.width;
  height = _dims.height;

  // append the svg object to the body of the page
  svg = d3.select(where)
    .append("g")
    .attr("transform", `translate(${margin.right},${margin.top})`)

  resize();
}

function resize() {
  d3.select(where)
    .style("width", 70 + "px")
    .style("height", height + margin.top + margin.bottom + "px")

  y = d3.scaleBand()
    .range([0, height])
    .domain(data.elements.map((_, idx) => ""+idx))


  const length = Object.keys(data.elementsCriticality).length;
  const rectOffset = state.settings.compress ? 1.5:10;
  const radius = 8;
  const cx = 20;

  const goals = []
  if (length > 0) {

    data.elements.forEach((element, idx) => {
      goals.push({
        x: ""+idx,
        goal: element,
        criticality : data.elementsCriticality[element.name]
      });
    });

    svg.append("text")
      .attr("x", cx)
      .attr("y", y(goals[0].x) - radius - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "red")
      .style("font-weight", "bold")
      .text("C");

    svg.selectAll()
      .data(goals)
      .enter()
      .append("circle")
      .attr("cy", d => y(d.x) + (rectOffset+(rectOffset-radius)))
      .attr("cx", cx)
      .attr("r", radius)
      .attr("fill", d => d.criticality)
  }
}

export { draw, resize };
