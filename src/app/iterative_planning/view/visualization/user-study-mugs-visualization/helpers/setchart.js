import * as d3 from 'd3';

let where, svg, data, margin, width, height, x, y, dataElementColors;

const OFFSET = 2
const margins = { top: 150, right: 0, bottom: 0, left: 300 }
const constants = { rectWidth: 30, compressed: 10 }
const rectOffset =  10;
const radius = 8;

function init(parent, mugsLength, elementsLength){
  where = parent
  width = mugsLength * constants.rectWidth;
  height = elementsLength * constants.rectWidth;
  margin = {
    top: margins.top,
    right: 0,
    bottom: OFFSET,
    left: 0
  }
}

function draw(_data) {
    data = _data;
    data.elementsName = _data.elements.map(d => d.name);
    dataElementColors = _data.elements.map(d => ({ name: d.name, color: d.color }));

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
    .domain(data.MUGS.map(d => "" + d.i));

  y = d3.scaleBand()
    .range([0, height])
    .domain(data.elementsName);

  const goals = []
  data.MUGS.forEach((ugs) => {
    ugs.l.forEach(g => {
      goals.push({
        x: "" + ugs.i,
        goal: g
      });
    });
  });

  const colorMapping = (name) => {
    const match = dataElementColors.find(el => el.name === name);
    return match ? match.color : "";
  };

  svg.selectAll()
    .data(goals)
    .enter()
    .append("circle")
    .attr("id", d => d.x + ":" + d.goal)
    .attr("class", d => `mugs mugs_${d.x} ${d.goal}`)
    .attr("cx", d => x(d.x) + (rectOffset + (rectOffset - radius) / 2))
    .attr("cy", d => y(d.goal) + rectOffset)
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
    .style("font-size", "16px")

  svg.select("#setchart-x-axis path.domain").remove();

}

export { init, draw, resize };

