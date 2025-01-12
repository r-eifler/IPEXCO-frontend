import * as d3 from 'd3';

const constants = {
    rectWidth: 30,
    compressed: 10
}

function separateTicks(t, i, length, dim, separation = 1) {
    let skip = Math.round((length * separation) / (dim * 2));
    skip = Math.max(1, skip);
    return (i % skip === 0) ? t : null;
}

const decimals = 3;

const percentage = n => {
    const perc = n * 100;
    return (Number.isInteger(perc)) ? perc : perc.toFixed(decimals);
}

// tooltip for mouse events
const _tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("display", "none") // only visible on mouseover/hover
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("padding", "5px")

const tooltip = {
    html: function (html) {
        _tooltip.html(html)
    },
    mouseover: function (e) {
        _tooltip.style("display", "inline-block")
        e.classed("highlighted-hovered", true);
    },
    mousemove: function (e, pos) {
        _tooltip
            .style("left", pos.left + "px")
            .style("top", pos.top + "px")

    },
    mouseleave: function (e) {
        _tooltip.style("display", "none")
        e.classed("highlighted-hovered", false);
    },
    hide: function () {
        _tooltip.style("display", "none")
    }
}

export { separateTicks, percentage, decimals, tooltip, constants };
