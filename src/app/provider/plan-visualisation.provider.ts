import { CurrentProjectService } from '../service/project-services';
import { NoMystery3DVisualization } from '../plan-visualization/plugins/nomystery3D/nomystery3d-visualization';
import { PlanVisualization } from '../plan-visualization/integration/plan-visualization';
import { TaskSchemaService } from '../service/schema.service';
import { CurrentRunService } from '../service/run-services';

const planVisualizationFactory = (
    taskSchemaService: TaskSchemaService,
    currentRunService: CurrentRunService,
    projectService: CurrentProjectService) => {
      console.log('Provide plan Visualization');
      if (projectService.getSelectedObject().value.domainFile.domain === 'nomystery') {
        console.log('Project has value in Factory.');
        const visu = new NoMystery3DVisualization(taskSchemaService, currentRunService);
        return visu;
      }
      throw new Error('There exists no visualization for this domain.');
};


export let PlanVisualizationProvider =
  { provide: PlanVisualization,
    useFactory: planVisualizationFactory,
    deps: [TaskSchemaService, CurrentRunService, CurrentProjectService]
  };
