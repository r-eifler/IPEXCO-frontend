import * as d3 from 'd3';

let legend;

function init(id) {
    document.getElementById(id).innerHTML = "";
    legend = d3.select('#'+ id);
}

function addTiTle(text) {
    legend.append("svg")
    .attr("height", 40)
    .append("text")
    .attr("x", 0)
    .attr("y", 30)
    .text(text);
}

function drawThreepieceLegend(data, prop, color) {
    const id = 'linear-gradient-three-parts-' + prop;
    const legendLinear = legend.append('svg');
    const defs = legendLinear.append('defs');
    const linearGradient = defs.append('linearGradient').attr('id', id);

    legendLinear.attr("width", 500).attr("height", 40);
    // horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    const extent = data.extents[prop];

    // append multiple color stops by using D3's data/enter step
    linearGradient.selectAll("stop")
        .data([
            { offset: "0%", color: color(extent[0]) },
            { offset: "10%", color: color(extent[0]*.8) },
            { offset: "20%", color: color(extent[0]*.6) },
            { offset: "30%", color: color(extent[0]*.4) },
            { offset: "40%", color: color(extent[0]*.2) },
            { offset: "50%", color: color(0) },
            { offset: "60%", color: color(extent[1]*.2) },
            { offset: "70%", color: color(extent[1]*.4) },
            { offset: "80%", color: color(extent[1]*.6) },
            { offset: "90%", color: color(extent[1]*.8) },
            { offset: "100%", color: color(extent[1]) }
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);


    // draw the rectangle and fill with gradient
    legendLinear.append("rect").attr("x", 20).attr("y", 0)
        .attr("width", 280)
        .attr("height", 15)
        .style("fill", `url(#${id})`);

    //create tick marks
    const scale = d3.scaleLinear()
        .domain(extent)
        .range([0, 280]);

    legendLinear
        .attr("class", "axis")
        .append("g")
        .attr("transform", "translate(20, 20)")
        .call(d3.axisBottom(scale).ticks(6));
}

function drawTwopieceLegend(data, prop, color) {
    const id = 'linear-gradient-two-parts-' + prop;
    const legendLinear = legend.append('svg');
    const defs = legendLinear.append('defs');
    const linearGradient = defs.append('linearGradient').attr('id',id);

    legendLinear.attr("width", 500).attr("height", 40);
    // horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    const extent = data.extents[prop];

    // append multiple color stops by using D3's data/enter step
    linearGradient.selectAll("stop")
        .data([
            { offset: "0%", color: color(extent[0]) },
            { offset: "100%", color: color(extent[1]) }
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    // draw the rectangle and fill with gradient
    legendLinear.append("rect").attr("x", 20).attr("y", 0)
        .attr("width", 280)
        .attr("height", 15)
        .style("fill", `url(#${id})`);

    //create tick marks
    const scale = d3.scaleLinear()
        .domain(extent)
        .range([0, 280]);

    legendLinear
        .attr("class", "axis")
        .append("g")
        .attr("transform", "translate(20, 20)")
        .call(d3.axisBottom(scale).ticks(6));
}


export { init, addTiTle, drawTwopieceLegend, drawThreepieceLegend };
