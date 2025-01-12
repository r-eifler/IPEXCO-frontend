import state from './state.js';
import * as matrix from './helpers/matrix.js';
import * as setchart from './helpers/setchart.js';
import * as d3 from 'd3';
import {IMetric, IMetrics} from './interfaces/IMetrics';
import {IDataObject} from './interfaces/IDataObject';
import {metricDefinitions} from './data-classes/metric-definition';
import {SolvabilityResult} from './types/solvability-result';
import {DataHandlerService} from './DataHandlerService';
import {PlanRunStatus} from '../../../../domain/plan';


export class UIControls {
  private metrics: IMetrics;
  private currentMetric: IMetric;
  protected data: IDataObject;
  private readonly _dataHandlerService: DataHandlerService;

  constructor(dataHandlerService: DataHandlerService, data: IDataObject) {
    this._dataHandlerService = dataHandlerService;
    this.data = Object.create(data);
    this.initializeMetrics();
    this.currentMetric = this.metrics.nOccurr;
    this.setMetrics();
  }

  private initializeMetrics(): void {
    this.metrics = Object.entries(metricDefinitions).reduce((acc, [key, definition]) => {
      acc[key as keyof IMetrics] = {
        name: definition.name,
        code: definition.code,
        color: definition.generator(this.data.extents[definition.code], definition.colors)
      };
      return acc;
    }, {} as IMetrics);
  }

  private setMetrics(): void {
    // Set lower triangular matrix.
    state.settings.lower  = this.currentMetric.code
    state.settings.lowerName = this.currentMetric.name;
    state.settings.lowerColor = this.currentMetric.color;

    // Set upper triangular matrix.
    state.settings.upper = this.currentMetric.code;
    state.settings.upperName = this.currentMetric.name;
    state.settings.upperColor = this.currentMetric.color;
  }

  // Sorting
  private sortElements(): void {
    this.data.elements.sort((a, b) => this.data.original[a] - this.data.original[b])
  }

  private sortSets(): void {
    this.data.MUGS.sort((a, b) => a.i - b.i);
  }

  private updateView() {
    this.sortElements();
    this.sortSets();

    this.setMetrics();

    matrix.remove();
    matrix.draw(this.data);
  }

  private updateEnforcementSection(): void{
    const enforcementSection = d3.select("#sec-enforcement")
    enforcementSection.selectChildren().remove();

    const remove = e => {
      const enforcedElements = this.data.selectedElements.filter(element => element !== e.currentTarget.dataset.element);

      this._dataHandlerService.restoreData(this.data);
      if(this._dataHandlerService.setElementSelection.length === 0) {
        this._dataHandlerService.computeOrderDependentValues(this.data);
      } else {
        this._dataHandlerService.setElementSelection(this.data, enforcedElements);
      }

      this.updateView();

      // Remove the button.
      e.currentTarget.remove();

      this.updateEnforcementSection();
      this.updateResultSection();
    }

    // TODO: Don't compute this twice (here and in updateResultSection)
    const { result, counts } = this._dataHandlerService.computeSolvability(this.data) as SolvabilityResult;

    const colorScale = d3.scaleSequential()
      .interpolator(
        d3.piecewise(d3.interpolateRgb.gamma(1.8), ["#9e9e9e", "#f44336"])
      ).domain([
        0,
        Object.keys(counts).length > 0 ? Math.max(...Object.values(counts)) : 1
      ]);

    this.data.selectedElements.forEach(element => {
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

  private updateResultSection(): void {
    const { result, mugs, msgs } = this._dataHandlerService.computeSolvability(this.data);

    let text = "No goals selected";
    let icon = null;
    let color = "";

    if(this.data.selectedElements.length > 0) {
      switch (result) {
        case "solvable":
          if (this._dataHandlerService.stepType == PlanRunStatus.not_solvable){
            text = "Selection is solvable";
          }else{
            text = "Remaining goal selection is solvable";
          }
          icon = "check_circle";
          color = "green";
          break;
        case "unsolvable":
          text = "Selection is unsolvable";
          icon = "cancel";
          color = "red";
          break;
        case "undecided":
          text = "Selection is undecided.";
          icon = "error";
          color = "orange";
          break;
        default:
          text = "Unknown selection state";
          icon = "help";
          color = "gray";
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

  public showUpperMatrix(value: boolean): void {
    state.settings["showUpper"] = value;
    matrix.resize();
  }

  public colorGoalsByTypes(value: boolean): void {
    state.settings["useGoalColor"] = value;
    setchart.resize()
  }

  public updateGoalSelectionView(): void {
    this.updateEnforcementSection();
    this.updateResultSection();
    this.updateView();
  }

  public addEventListener(): void{
    document.addEventListener("select-elements", async (e: CustomEvent) => {
      const { x, y } = e.detail.selected;

      const selection = Array.from(new Set([x, y]));

      this._dataHandlerService.setElementSelection(this.data, selection);
      this.updateGoalSelectionView();

    });

    document.addEventListener("on-visualization-load", async (e) => {
      // TODO: Make sure all visualization settings are applied.
      this.sortElements();
      this.sortSets();
      this._dataHandlerService.computeOrderDependentValues(this.data);
      matrix.resize();
    });
  }

}
