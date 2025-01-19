import { COLORS } from "./colors.js";
import { tooltip, separateTicks } from "./utils.js";
import * as d3 from 'd3';

const opacity = { default: 1, highlight: 1 }
const OFFSET = 2;
let where, svg, data, margin, width, height;

function draw(_data, _where, _dims) {
    where = _where;
    data = _data;
    data.elementsName = _data.elements.map(d => d.name);
    margin = _dims.margin;
    width = _dims.width;
    height = _dims.height;

    // append the svg object to the body of the page
    svg = d3.select(where)
        .append("svg")
        .attr("id", where.replace('#', '') + "-svg")
        .append("g")
        .attr("class", "mainG-av")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    resize();
}

function resize() {
    d3.select(where + "-svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    svg.select("mainG-av")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // scales and axes
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.elementsName);

    const y = d3.scaleLinear()
        .range([0, height])
        .domain([Math.max(...Object.values(data.counts)), 0]);

    svg.select("#barchart-y-axis").remove();
    svg.append("g")
        .attr("id", "barchart-y-axis")
        .attr("class", "y axis")
        .call(
            d3.axisLeft(y)
                .ticks(Math.ceil(Math.max(...Object.values(data.counts))))
                .tickFormat((t, i) => t === 0 ? null : separateTicks(t, i, Object.values(data.counts).length, height, 30))
                .tickSize(0)
        );
    svg.select("#barchart-y-axis path.domain").remove();

    // bars
    svg.selectAll()
        .data(data.elementsName.map(d => {
            return {
                value: data.counts[d],
                name: d,
                id: "bar-"+d
            }
        }))
        .enter()
        .append("g")
        .attr("id", d => d.id)
        .attr("class", d => d.name)
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth()-OFFSET)
        .attr("height", d => height - y(d.value))
        .attr("fill", COLORS.bars)
        .style("opacity", opacity.default)
        .on("mouseover", mouseover)
        .on("mousemove", tooltip.mousemove)
        .on("mouseleave", mouseleave);
}

function mouseover(e, d, style) {
    tooltip.html(
        d.name + ": " + d.value
    );

    tooltip.mouseover(d3.selectAll(`#${d.id}, .${d.name}`), opacity.highlight);
}

function mouseleave(e, d) {
    tooltip.mouseleave(d3.selectAll(`#${d.id}, .${d.name}`), opacity.default);
}

export { draw, resize };

