import state from "../legacy/state.js";
import * as matrix from "../legacy/helpers/matrix.js";
import * as setchart from "../legacy/helpers/setchart.js";
import * as legend from '../legacy/helpers/legend.js';
import { colorThreepiece, colorTwopiece } from "../legacy/helpers/colors.js";
import { computeOrderDependentValues, restoreData, computeSolvability, enforceElements } from "./data.js";
import { tooltip } from "../legacy/helpers/utils.js";
import * as d3 from 'd3';


export class Controls {

  constructor() {}
}

function init() {

    const fabs = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(fabs, {
        direction: "bottom",
        hoverEnabled: false,
    });

    const modals = document.querySelectorAll(".modal");
    M.Modal.init(modals, {
        opacity: 0.49,
    });

    // const dropdowns = document.querySelectorAll(".dropdown");
    // M.Dropdown.init(dropdowns, {
    //     coverTrigger: false
    // });

    const selects = document.querySelectorAll("select");
    M.FormSelect.init(selects, {
        coverTrigger: false
    });

    const tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {
        enterDelay: 0,
        exitDelay: 0,
        inDuration: 100,
        outDuration: 100,
        position: 'left'
    });

    for (const toggle of document.getElementsByClassName('toggles-content')) {
        toggle.addEventListener('click', () => {
            const toggeable = document.getElementById(toggle.getAttribute('target'));

            const icon = toggle.querySelector("i");
            if (icon.textContent === "arrow_drop_down") {
                icon.textContent = "arrow_drop_up";
            } else {
                icon.textContent = "arrow_drop_down";
            }
            toggeable.classList.toggle('closed');
        });
    }

    // const sidebarToggles = document.getElementsByClassName("toggles-sidebar");
    const btnToggleSideBar = document.getElementById("btnToggleSideBar");

    // function slideIn() {
    //     const sidebar = document.getElementById("sidebar");
    //     sidebar.classList.remove("bar-sliding-out");
    //     sidebar.classList.add("bar-sliding-in");
    //
    //     const icon = document.getElementById("iconToggleSideBar");
    //     icon.classList.remove("icon-sliding-out");
    //     icon.classList.add("icon-sliding-in");
    //     btnToggleSideBar.classList.add("active");
    // }
    //
    // function slideOut() {
    //     const sidebar = document.getElementById("sidebar");
    //     sidebar.classList.remove("bar-sliding-in");
    //     sidebar.classList.add("bar-sliding-out");
    //
    //     const icon = document.getElementById("iconToggleSideBar");
    //     icon.classList.remove("icon-sliding-in");
    //     icon.classList.add("icon-sliding-out");
    //     btnToggleSideBar.classList.remove("active");
    // }
    //
    // function toggleSidebar() {
    //     if (btnToggleSideBar.classList.contains("active")) {
    //         slideOut();
    //     } else {
    //         slideIn();
    //     }
    // }
    //
    // for (const c of sidebarToggles) {
    //     c.addEventListener("click", toggleSidebar);
    // }
}

function initDataControls(data) {
    // Matrix metrics settings:
    const getMetrics = () => {
        return {
            "occurr": {
                name: "Pairwise Occurrence",
                color: colorTwopiece(data.extents["occurr"], ["#deebf7", "#3182bd"]),
                //legend: legend.drawTwopieceLegend
            },
            "nOccurr": {
                name: "Normalized Pairwise Occurrence",
                color: colorTwopiece(data.extents["nOccurr"], ["#e5f5e0", "#31a354"]),
                //legend: legend.drawTwopieceLegend
            },
            "solvability": {
                name: "Solvability",
                color: colorTwopiece(data.extents["solvability"], ["#f7f0df", "#d9a22b"]),
                //legend: legend.drawTwopieceLegend
            },
            // "distance": {
            //     name: "Distance Correlation",
            //     color: colorTwopiece(data.extents["distance"], ["#efedf5", "#756bb1"]),
            //     legend: legend.drawTwopieceLegend
            // },
            "pearson": {
                name: "Pearson Correlation",
                color: colorThreepiece(data.extents["pearson"]),
                //legend: legend.drawThreepieceLegend
            },
            "jaccard": {
                name: "Jaccard Index",
                color: colorTwopiece(data.extents["jaccard"], ["#efedf5", "#756bb1"]),
                //legend: legend.drawTwopieceLegend
            }
        }
    };

    //const lowerMetricSelect = document.getElementById("metric-lower-select");
    //const upperMetricSelect = document.getElementById("metric-upper-select");
    state.settings.lower = "nOccurr";
    state.settings.upper = "nOccurr";

    function setMetrics() {
        const metrics = getMetrics();

        // Set lower and upper triangular matrix to use selected metric.
        const lower = metrics[state.settings.lower];
        state.settings.lowerName = lower.name;
        state.settings.lowerColor = lower.color;

        const upper = metrics[state.settings.upper];
        state.settings.upperName = upper.name;
        state.settings.upperColor = upper.color;

        // Setup the corresponding metric legends.
        // legend.init("legend-lower");
        // legend.addTiTle(state.settings.lowerName)
        // lower.legend(data, state.settings.lower, state.settings.lowerColor);
        //
        // legend.init("legend-upper");
        // legend.addTiTle(state.settings.upperName)
        // upper.legend(data, state.settings.upper, state.settings.upperColor);
    }

    setMetrics();

    const handleMetricChange = () => {
        setMetrics();
        matrix.resize();
    };

    // lowerMetricSelect.addEventListener("change", e => {
    //     state.settings.lower = "nOccurr";
    //     handleMetricChange();
    // });
    //
    // upperMetricSelect.addEventListener("change", e => {
    //     state.settings.upper = "nOccurr";
    //     handleMetricChange();
    // });

    // Sort order settings:
    // const sortElementsSelect = document.getElementById("sort-goals-select");
    // const sortSetsSelect = document.getElementById("sort-subsets-select");
    // const reverseElementsToggle = document.getElementById("reverse-goals-toggle");
    // const reverseSubsetsToggle = document.getElementById("reverse-subsets-toggle");
    //
    // function sortElements() {
    //     const key = sortElementsSelect.value;
    //
    //     if (key === "original") {
    //         data.elements.sort((a, b) => data.original[a] - data.original[b])
    //     }
    //
    //     if (key === "type") {
    //         data.elements.sort((a, b) => data.types[a] - data.types[b])
    //     }
    //
    //     if (key === "frequency") {
    //         data.elements.sort((a, b) => data.counts[a] - data.counts[b])
    //     }
    //
    //     if (reverseElementsToggle.checked) {
    //         data.elements.reverse();
    //     }
    //
    //     //d3.selectAll(".pre-filtered").classed("pre-filtered", false);
    // }

    // function sortSets() {
    //     const key = sortSetsSelect.value;
    //
    //     if (key === "original") {
    //         data.MUGS.sort((a, b) => a.i - b.i);
    //     }
    //
    //     if (key === "cardinality") {
    //         data.MUGS.sort((a, b) => a.l.length - b.l.length);
    //     }
    //
    //     if (key === "hierarchy") {
    //         let list = data.MUGS;
    //
    //         function recursiveSort(listToSort, i) {
    //             if (listToSort.length <= 1) {
    //                 return listToSort
    //             } else {
    //                 listToSort.sort((a, b) => b.s.has(data.elements[i]) - a.s.has(data.elements[i]));
    //                 let split = listToSort.findIndex(m => !m.s.has(data.elements[i]));
    //                 let temp = listToSort.splice(0,split);
    //                 return recursiveSort(temp, i+1).concat(recursiveSort(listToSort, i+1));
    //             }
    //         }
    //
    //         data.MUGS = recursiveSort(list, 0);
    //     }
    //
    //     if (reverseSubsetsToggle.checked) {
    //         data.MUGS.reverse();
    //     }
    //
    //     //d3.selectAll(".pre-filtered").classed("pre-filtered", false);
    // }

    // const handleOrderChange = (elements, subsets) => {
    //     if(elements) {
    //         sortElements();
    //     }
    //     if(subsets) {
    //         sortSets();
    //     }
    //     computeOrderDependentValues(data);
    //     matrix.resize();
    // };
    //
    // sortElementsSelect.addEventListener("change", () => {
    //     handleOrderChange(true, true);
    // });
    //
    // sortSetsSelect.addEventListener("change", () => {
    //     handleOrderChange(false, true);
    // });
    //
    // reverseElementsToggle.addEventListener("change", () => {
    //     handleOrderChange(true, true);
    // });
    //
    // reverseSubsetsToggle.addEventListener("change", () => {
    //     handleOrderChange(false, true);
    // });

    // Toggles:
    // const connectToggle = (id, setting, onChange) => {
    //     const toggle = document.getElementById(id);
    //     state.settings[setting] = toggle.checked;
    //     toggle.addEventListener("change", e => {
    //         state.settings[setting] = toggle.checked;
    //         onChange();
    //     });
    // };

    // connectToggle("compress-subsets-toggle", "compress", () => matrix.resize());
    // connectToggle("use-matrix-cell-size", "useSize", () => matrix.resize());
    // connectToggle("use-goal-type-color", "useGoalColor", () => setchart.resize());
    // connectToggle("show-upper-matrix", "showUpper", () => matrix.resize());

    // Interaction:
    function updateView() {
        sortElements();
        sortSets();

        setMetrics();

        matrix.remove();
        matrix.draw(data);
    }

    function updateEnforcementSection(data){
        const enforcementSection = d3.select("#sec-enforcement")
        enforcementSection.selectChildren().remove();

        const remove = e => {
            const enforcedElements = data.enforcedElements.filter(element => element !== e.currentTarget.dataset.element);

            restoreData(data);
            if(enforceElements.length === 0) {
                computeOrderDependentValues(data);
            } else {
                enforceElements(data, enforcedElements);
            }

            updateView();

            // Remove the button.
            e.currentTarget.remove();

            updateEnforcementSection(data);
            updateResultSection(data);
        }

        // TODO: Don't compute this twice (here and in updateResultSection)
        const { result, counts } = computeSolvability(data);

        const colorScale = d3.scaleSequential()
            .interpolator(
                d3.piecewise(d3.interpolateRgb.gamma(1.8), ["#9e9e9e", "#f44336"])
            ).domain([
                0,
                Object.keys(counts).length > 0 ? Math.max(...Object.values(counts)) : 1
            ]);

        data.enforcedElements.forEach(element => {
            let count = 0;
            if(result === "unsolvable") {
                count = counts[element] || 0;
            }

            enforcementSection
                .append("a")
                .attr("class", "btn-small")
                .style("background", colorScale(count))
                .style("text-transform", "none")
                .attr("data-element", element)
                .on("click", remove)
                .text(element)
                .append("i")
                .attr("class", "small material-icons right")
                .text("close");
        });
    }

    function updateResultSection(data) {
        const { result, mugs, msgs } = computeSolvability(data);

        let text = "No goals selected";
        let icon = null;
        let color = "";

        if(data.enforcedElements.length > 0) {
            if(result === "solvable") {
                text = "Selection is solvable";
                icon = "check_circle";
                color = "green";
            } else if(result === "unsolvable") {
                text = "Selection is unsolvable";
                icon = "cancel";
                color = "red";
            } else if(result === "undecided") {
                text = "Selection is undecided.";
                icon = "error";
                color = "orange";
            }
        }

        const resultSection = d3.select("#sec-result");
        resultSection.selectChildren().remove();
        resultSection
            .text(text)

        if(icon !== null) {
            resultSection
                .append("i")
                .attr("class", `material-icons ${color}-text`)
                .text(icon);
        }

        if(mugs !== null && mugs.length > 0) {
            resultSection
                .append("div")
                .attr("class", "break");

            resultSection
                .append("div")
                .text(`Smallest MUGS: ${mugs.join(", ")}`);
        }

        if(msgs !== null && msgs.length > 0) {
            resultSection
                .append("div")
                .attr("class", "break");

            resultSection
                .append("div")
                .text(`Smallest MSGS: ${msgs.join(", ")}`);
        }
    }

    document.addEventListener("select-elements", async (e) => {
        const { x, y } = e.detail.selected;

        const selection = Array.from(new Set([x, y]));

        enforceElements(data, selection);

        updateEnforcementSection(data);
        updateResultSection(data);

        updateView();

        tooltip.hide();
    });

    document.addEventListener("on-visualization-load", async (e) => {
        // TODO: Make sure all visualization settings are applied.
        //sortElements();
        //sortSets();
        computeOrderDependentValues(data);
        matrix.resize();
    });
}

export { init, initDataControls };
