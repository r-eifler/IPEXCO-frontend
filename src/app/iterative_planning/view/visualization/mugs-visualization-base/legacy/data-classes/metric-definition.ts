import {colorThreepiece, colorTwopiece} from '../helpers/colors.js';

const metricDefinitions = {
  occurr: {
    name: "Pairwise Occurrence",
    code: "occurr",
    colors: ["#deebf7", "#3182bd"],
    generator: colorTwopiece,
  },
  nOccurr: {
    name: "Normalized Pairwise Occurrence",
    code: "nOccurr",
    colors: ["#e5f5e0", "#31a354"],
    generator: colorTwopiece,
  },
  solvability: {
    name: "Solvability",
    code: "solvability",
    colors: ["#f7f0df", "#d9a22b"],
    generator: colorTwopiece,
  },
  "distance": {
    name: "Distance Correlation",
    code: "distance",
    colors: ["#efedf5", "#756bb1"],
    generator: colorTwopiece,
  },
  pearson: {
    name: "Pearson Correlation",
    code: "pearson",
    colors: [],
    generator: colorThreepiece,
  },
  jaccard: {
    name: "Jaccard Index",
    code: "jaccard",
    colors: ["#efedf5", "#756bb1"],
    generator: colorTwopiece,
  },
};

export {metricDefinitions};
