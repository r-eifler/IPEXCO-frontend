import state from "../state.js"
import { COLORS } from "./colors.js";
import { tooltip, separateTicks, constants } from "./utils.js";
import * as d3 from 'd3';

let where, svg, data, margin, width, height, x, y, isStepUnsolvable;

function setIsStepUnsolvable(value) {
  isStepUnsolvable = value
}

function draw(_data, _where, _dims) {
    where = _where;
    data = _data;
    data.elementsName = _data.elements.map(d => d.name);
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
                goal: g,
                type: data.types[g]
            });
        });
    });

    const color = d3.scaleOrdinal()
        .domain(Array.from(new Set(Object.values(data.types))))
        .range(COLORS.types)

    const colorMapping = state.settings.useGoalColor ?
        (type) => color(type) :
        () => COLORS.types[0];

    const rectOffset = state.settings.compress ? 1.5:10;

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
        .style("fill", COLORS.bars);

    // Uncomment to enable highlighting mugs columns with only a single goal.
    /*svg.selectAll("rect.seg-highlight")
        .attr("x", d => x(""+d.i) + 2)
        .attr("y", 0)
        .attr("width", constants.rectWidth - 2)
        .attr("height", height)
        .attr("rx", (constants.rectWidth - 2) / 2)
        .style("fill", COLORS.barsHighlight);*/



    // Find all elements where a unit MUGS exists that only contains this element.
    const singularElements = new Set();
    data.MUGS.forEach(mugs => {
        if(mugs.l.length === 1) {
          if (!isStepUnsolvable) {
            singularElements.add(mugs.l[0]);
          }
        }
    });

    // Highlight goal rows of singular elements.
    svg.selectAll()
        .data([...singularElements])
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => y(d) + 1)
        .attr("width", width)
        .attr("height", constants.rectWidth - 2)
        .attr("rx", (constants.rectWidth - 2) / 2)
        .style("fill", COLORS.barsHighlight);



    if (state.settings.compress) {
        svg.selectAll()
            .data(goals)
            .enter()
            .append("rect")
            .attr("id", d => d.x + ":" + d.goal)
            .attr("class", d => `mugs mugs_${d.x} ${d.goal}`)
            .attr("x", d => x(d.x))
            .attr("y", d => y(d.goal))
            .attr("width", constants.compressed)
            .attr("height", constants.rectWidth)
            .style("fill", d => colorMapping(d.type))
            // .on("mouseover", mouseover)
            // .on("mousemove", tooltip.mousemove)
            // .on("mouseleave", mouseleave);
    } else {
        const radius = 8;

        svg.selectAll()
            .data(goals)
            .enter()
            .append("circle")
            .attr("id", d => d.x + ":" + d.goal)
            .attr("class", d => `mugs mugs_${d.x} ${d.goal}`)
            .attr("cx", d => x(d.x) + (rectOffset+(rectOffset-radius)/2))
            .attr("cy", d => y(d.goal)+rectOffset)
            .attr("r", radius)
            .style("fill", d => colorMapping(d.type))
            // .on("mouseover", mouseover)
            // .on("mousemove", tooltip.mousemove)
            // .on("mouseleave", mouseleave);


        svg.select("#setchart-x-axis").remove();
        svg.append("g")
            .attr("id", "setchart-x-axis")
            .attr("class", "x axis")
            .call(
                d3.axisTop(x)
                    .tickFormat((t, i) => separateTicks(t, i, data.MUGS.length, width, 30))
                    .tickSize(0)
            )
        svg.select("#setchart-x-axis path.domain").remove();
    }
}

function mouseover(e, d, style) {
    if (d.x) {
        tooltip.html(
            data.MUGS.filter(mugs => mugs.i === +d.x)[0].l
                .sort((a, b) => y(a) - y(b)) // prints in the order that they appear on the matrix
                .join('<br>')
        );
    } else {
        tooltip.html(
            d.sort((a, b) => y(a) - y(b)) // prints in the order that they appear on the matrix
                .join('<br>')
        );
    }

    tooltip.mouseover(d3.selectAll(`#${d.id}, .${d.goal}, .mugs_${d.x}, #seg_${d.x}`));
}

function mouseleave(e, d) {
    tooltip.mouseleave(d3.selectAll(`#${d.id}, .${d.goal}, .mugs_${d.x}, #seg_${d.x}`));
}

export { draw, resize, setIsStepUnsolvable };

