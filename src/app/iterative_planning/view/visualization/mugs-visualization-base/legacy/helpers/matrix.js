import state from "../state.js";
import { separateTicks, tooltip, constants } from "./utils.js";
import * as barchart from './barchart.js';
import * as setchart from './setchart.js';
import * as criticalitychart from './criticalitychart.js'
import * as d3 from 'd3';

let parentId, svgId, svg, matrixGroup, bgSquares, fgSquares, data, x, y, isStepUnsolvable;
const OFFSET = 2
const margin = { top: 150, right: 0, bottom: 0, left: 200 }

const minimalSize = 5;

function setIsStepUnsolvable(value) {
  isStepUnsolvable = value
}

function init(parent) {
    parentId = parent;
    svgId = parentId + "-svg";
    console.log(`ParentID:${parentId}`);
    console.log(`SvgID:${svgId}`);
}

function draw(_data) {
  data = _data;
  data.elementsName = _data.elements.map(d => d.name);

  console.log(_data);
    // append the svg object to the body of the page
    svg = d3.select(parentId)
        .append("svg")
        .attr("id", svgId.slice(1));

    console.log(svg)
    matrixGroup = svg.append("g")
        .attr("class", "mainG-cv")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // size the squares
    matrixGroup.selectAll()
        .data(data.matrix)
        .enter()
        .append("g")
        .attr("class", d => "corr")

    fgSquares = svg.selectAll("g.corr")
        .append("rect")
        .attr("class", d => "fg v_" + d.x + " v_" + d.y)

    bgSquares = svg.selectAll("g.corr")
        .append("rect")
        .attr("id", d => d.x + "" + d.y)
        .attr("class", d => "bg v_" + d.x + " v_" + d.y)
        // .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        // .on("mouseleave", mouseleave)
        .on("click", (e, d) => document.dispatchEvent(new CustomEvent("select-elements", { detail: { selected: d, event: e } })))
        .style("fill-opacity", 0)

    resize();
}

function remove() {
    d3.select(svgId).remove();
}

function resize() {

    // set the dimensions and margins of the graph
    const width = data.elementsName.length * constants.rectWidth;
    const height = width;

    d3.select(parentId)
        .style("height", height + margin.top + margin.bottom + "px") // includes barchart above
        .style("width", width + margin.left + margin.right + (data.MUGS.length * 30) + "px") // include the chart to the right

    d3.select(svgId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // build scales and axes:
    x = d3.scaleBand()
        .range([0, width])
        .domain(data.elementsName);
    y = d3.scaleBand()
        .range([0, height])
        .domain(data.elementsName);

    const squareSize = d3.scaleLinear()
        .range([minimalSize, x.bandwidth()])
        .domain([0, x.bandwidth()]);

    matrixGroup.select("#matrix-y-axis").remove();
    matrixGroup.append("g")
        .attr("id", "matrix-y-axis")
        .attr("class", "y axis")
        .call(d3
            .axisLeft(y)
            .tickFormat((t, i) => separateTicks(t, i, data.elementsName.length, height, 30))
            .tickSize(0)
        )
        .selectAll("text").attr("class", d => d);

    // hide the axis line
    matrixGroup.select("#matrix-y-axis path.domain").remove();

    // resize and locate the squares
    bgSquares = matrixGroup.selectAll("rect.bg")
        .attr("x", d => x(d.x))
        .attr("width", x.bandwidth() - OFFSET)
        .attr("y", d => y(d.y))
        .attr("height", y.bandwidth() - OFFSET)
        .style("fill", _ => "white");

    fgSquares = matrixGroup.selectAll("rect.fg")
        .attr("width", d => getSquareWidth(d))
        .attr("height", d => getSquareHeight(d))
        .attr("x", d => {
            const _width = getSquareWidth(d);
            const _fullWidth = x.bandwidth() - OFFSET
            return x(d.x) + (_fullWidth / 2 - _width / 2);
        })
        .attr("y", d => {
            const _height = getSquareHeight(d);
            const _fullHeight = x.bandwidth() - OFFSET
            return y(d.y) + (_fullHeight / 2 - _height / 2);
        })
        .style("fill", d => {
            if (x(d.x) === y(d.y)) {
                if(state.settings.upper === "solvability") {
                    return state.settings.upperColor(d.corr[state.settings.upper]);
                } else if(state.settings.lower === "solvability") {
                    return state.settings.lowerColor(d.corr[state.settings.lower]);
                } else {
                    return "pink";
                }
            } else if (x(d.x) > y(d.y)) {
                return state.settings.upperColor(d.corr[state.settings.upper])
            } else {
                return state.settings.lowerColor(d.corr[state.settings.lower])
            }
        });

    function getSquareWidth(d) {
        if (x(d.x) === y(d.y)) {
            return x.bandwidth() - OFFSET;
        } else if (x(d.x) < y(d.y) || state.settings.showUpper) {
            if (state.settings.useSize) {
                d.width = squareSize(Math.max(0, ((x.bandwidth() * d.corr["nOccurr"]) - OFFSET)))
            } else {
                d.width = x.bandwidth() - OFFSET;
            }
            return d.width;
        } else if (!state.settings.showUpper) {
            return 0; // hides the upper triangle of the matrix
        }
    }

    function getSquareHeight(d) {
        if (x(d.x) === y(d.y)) {
            return y.bandwidth() - OFFSET;
        } else if (x(d.x) < y(d.y) || state.settings.showUpper) {
            if (state.settings.useSize) {
                d.height = squareSize(Math.max(0, ((y.bandwidth() * d.corr["nOccurr"]) - OFFSET)));
            } else {
                d.height = y.bandwidth() - OFFSET;
            }
            return d.height;
        } else if (!state.settings.showUpper) {
            return 0; // hides the upper triangle of the matrix
        }
    }

    // add count barchart
    d3.select("#mugs-helpers-barchart").remove();
    svg.append("g").attr("id", "mugs-helpers-barchart")
        .attr("transform", `translate(${0}, ${-OFFSET})`);
    barchart.draw(
        data,
        "#mugs-helpers-barchart",
        {
            width: data.elementsName.length * constants.rectWidth,
            height: 100,
            margin: {
                top: 50,
                right: 0,
                bottom: 0,
                left: margin.left
            }
        }
    );

    // add mugs helpers
  d3.select("#charts-container").remove()
  d3.select(parentId)
    .style("display", "flex")
    .style("width", "100%")
    .style("gap", "0px")
    .append("div")
    .attr("id", "charts-container")

  if (isStepUnsolvable) {
    d3.select("#charts-container").append("svg").attr("id", "mugs-helpers-criticalitychart").style("margin-right", "-10px");
    criticalitychart.draw(
      data,
      "#mugs-helpers-criticalitychart",
      {
        width: data.MUGS.length * (state.settings.compress ? constants.compressed : constants.rectWidth),
        height: data.elementsName.length * constants.rectWidth,
        margin: {
          top: margin.top,
          right: 0,
          bottom: OFFSET,
          left: 0
        },
        compress: state.settings.compress
      }
    );
  }

  d3.select("#charts-container").append("svg").attr("id", "mugs-helpers-setchart");
  setchart.draw(
    data,
    "#mugs-helpers-setchart",
    {
      width: data.MUGS.length * (state.settings.compress ? constants.compressed : constants.rectWidth),
      height: data.elementsName.length * constants.rectWidth,
      margin: {
        top: margin.top,
        right: 0,
        bottom: OFFSET,
        left: 0
      },
      compress: state.settings.compress
    }
  );
}

function mouseover(e, d) {
    if (d.x === d.y) {
        tooltip.html(d.x + ": " + data.counts[d.x]);
    } else {
        tooltip.html("x: " + d.x + "<br>y: " + d.y +
            "<br>" + state.settings.lowerName + " " + d.corr[state.settings.lower] +
            "<br>" + state.settings.upperName + " " + d.corr[state.settings.upper]);
    }

    if (x(d.x) < y(d.y) && !state.settings.showUpper) {
        tooltip.mouseover(d3.selectAll(`#${d.x}${d.y}, .${d.x}, .${d.y}`));
    } else {
        tooltip.mouseover(d3.selectAll(`#${d.x}${d.y}, .${d.x}, .${d.y}`));
        tooltip.mouseover(d3.selectAll(`#${d.y}${d.x}, .${d.x}, .${d.y}`));
    }
}

function mousemove(e, d) {
    tooltip.mousemove(e, {
        top: margin.top + data.elementsName.length * constants.rectWidth + 10,
        left: margin.left - OFFSET
    })
}

function mouseleave(e, d) {
    tooltip.mouseleave(d3.selectAll(`#${d.x}${d.y}, .${d.x}, .${d.y}`));
    tooltip.mouseleave(d3.selectAll(`#${d.y}${d.x}, .${d.x}, .${d.y}`));
}

export { init, draw, remove, resize, setIsStepUnsolvable };
