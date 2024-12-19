import state from './state.js';
import * as matrix from './helpers/matrix.js';
import * as d3 from 'd3';
import {UIControls} from './ui-controls';
import {DataHandlerService} from './DataHandlerService';


export class VisualizationLauncher {
  private readonly mugsData: string[][];
  private readonly msgsData: string[][];
  private readonly mugsTypes: Record<string, number>;
  private readonly dataHandlerService: DataHandlerService;


  constructor(entryMugs: string[][], entryMsgs: string[][], entryMugTypes: Record<string, number>) {
    this.mugsData = entryMugs;
    this.msgsData = entryMsgs;
    this.mugsTypes = entryMugTypes;
    this.dataHandlerService = new DataHandlerService();
  }

  private initializeData(): void {
    state.sourceData.MUGS = this.mugsData;
    state.sourceData.MSGS = this.msgsData;
    state.sourceData.types = this.mugsTypes;
  }

  public initialize(containerId: string): void {
    this.initializeData();

    const container = document.querySelector(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }

    // Process and prepare data for visualization
    state.sourceData.elements = this.dataHandlerService.getElements(state.sourceData.MUGS);
    state.currentData = this.dataHandlerService.getDataObj(state.sourceData);
    this.dataHandlerService.computeOrderDependentValues(state.currentData);

    // Set up UI controls for visualization changes
    const uiControls = new UIControls(this.dataHandlerService, state.currentData);
    uiControls.addEventListener();

    // Initialize the matrix visualization
    matrix.init(containerId);
    matrix.draw(state.currentData);

    uiControls.showUpperMatrix(false);
    uiControls.colorGoalsByTypes(true); //TODO: fetch and add goal types (See plAN propertyInterface)

    d3.select(window).on('resize', () => {
      matrix.resize();
    });

    document.dispatchEvent(new CustomEvent("on-visualization-load", {}));
  }
}


