import * as d3 from 'd3';

const COLORS = {
    bars: "#bdbdbd",
    barsHighlight: "#ebebeb",
    types: ["#cbd5e8", "#fdcdac", "#b3e2cd", "#e8cbe5", "#f5b5b5"] // pastel color palette: blue, orange, green, pink, red

}

const colorThreepiece = function(values, colors) {
    return d3.scaleSequential()
        .interpolator(d3.piecewise(d3.interpolateRgb.gamma(1.8), [
            colors ? colors[0] : "#fc8d59",
            colors ? colors[1] : "#ffffbf",
            colors ? colors[2] : "#99d594",
        ]))
        .domain(values)
}

const colorTwopiece = function(values, colors) {
    return d3.scaleSequential()
        .interpolator(d3.piecewise(d3.interpolateRgb.gamma(1.8), [
            colors ? colors[0] : "#ffffff",
            colors ? colors[1] : "#ff9926"
        ]))
        .domain(values)
}

export { COLORS, colorTwopiece, colorThreepiece };
