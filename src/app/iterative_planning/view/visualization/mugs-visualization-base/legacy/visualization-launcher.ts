import state from './state.js';
import * as matrix from './helpers/matrix.js';
import * as setChart from './helpers/setchart.js';
import * as d3 from 'd3';
import {UIControls} from './ui-controls';
import {DataHandlerService} from './DataHandlerService';
import {PlanRunStatus} from '../../../../domain/plan';
import {PlanProperty} from '../../../../../shared/domain/plan-property/plan-property';


export class VisualizationLauncher {
  private readonly mugsData: string[][];
  private readonly msgsData: string[][];
  private readonly mugsTypes: Record<string, number>;
  private readonly dataHandlerService: DataHandlerService;
  private uiControls: UIControls;


  constructor(entryMugs: string[][], entryMsgs: string[][], entryMugTypes: Record<string, number>, statusType: PlanRunStatus) {
    this.mugsData = entryMugs;
    this.msgsData = entryMsgs;
    this.mugsTypes = entryMugTypes;
    this.dataHandlerService = new DataHandlerService();
    this.dataHandlerService.stepType = statusType;

    if (statusType == PlanRunStatus.not_solvable){
      setChart.setIsStepUnsolvable(true);
    }else {
      setChart.setIsStepUnsolvable(false);
    }
  }

  private initializeData(): void {
    state.sourceData.MUGS = this.mugsData;
    state.sourceData.MSGS = this.msgsData;
    state.sourceData.types = this.mugsTypes;
  }

  public getUIControlsInstance(): UIControls {
    return this.uiControls; // Return the instance of UIControls to the component
  }

  public initialize(containerId: string, planProperties: PlanProperty[], selectedPlanProperties: PlanProperty[]): void {
    const container = document.querySelector(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }

    this.initializeData();

    // Process and prepare data for visualization
    // state.sourceData.elements = this.dataHandlerService.getElements(state.sourceData.MUGS);
    state.sourceData.elements = planProperties;
    state.currentData = this.dataHandlerService.getDataObj(state.sourceData);
    state.currentData.selectedElements = selectedPlanProperties;
    this.dataHandlerService.computeOrderDependentValues(state.currentData);

    // Set up UI controls for visualization changes
    this.uiControls = new UIControls(this.dataHandlerService, state.currentData);
    this.uiControls.addEventListener();

    // Initialize the matrix visualization
    matrix.init(containerId);
    matrix.draw(state.currentData);

    this.uiControls.showUpperMatrix(false);
    this.uiControls.colorGoalsByTypes(true);

    d3.select(window).on('resize', () => {
      matrix.resize();
    });

    document.dispatchEvent(new CustomEvent("on-visualization-load", {}));

  }
}


