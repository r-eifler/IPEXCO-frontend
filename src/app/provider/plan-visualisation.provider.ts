import { ProjectsService } from 'src/app/service/project-services';
import { AnimationSettings } from './../interface/animation-settings';
import { CurrentProjectService } from '../service/project-services';
import { NoMystery3DVisualization } from '../plan-visualization/plugins/nomystery3D/nomystery3d-visualization';
import { PlanVisualization } from '../plan-visualization/integration/plan-visualization';
import { TaskSchemaService } from '../service/schema.service';
import { CurrentRunService } from '../service/run-services';
import { AnimationSettingsNoMysteryVisu } from '../plan-visualization/plugins/nomystery3D/settings/animation-settings-nomystery-visu';

const planVisualizationFactory = (
    taskSchemaService: TaskSchemaService,
    currentRunService: CurrentRunService,
    projectService: CurrentProjectService) => {
      console.log('Provide plan Visualization');
      if (projectService.getSelectedObject().value.domainFile.domain === 'nomystery') {
        const visu = new NoMystery3DVisualization(projectService, taskSchemaService, currentRunService);
        return visu;
      }
      throw new Error('There exists no visualization for this domain.');
};


export let PlanVisualizationProvider =
  { provide: PlanVisualization,
    useFactory: planVisualizationFactory,
    deps: [TaskSchemaService, CurrentRunService, CurrentProjectService]
  };


const animationSettingsFactory = (
  taskSchemaService: TaskSchemaService,
  projectService: CurrentProjectService,
  projectsService: ProjectsService) => {
    console.log('Provide animation Settings');
    if (projectService.getSelectedObject().value.domainFile.domain === 'nomystery') {
      return new AnimationSettingsNoMysteryVisu(taskSchemaService, projectService, projectsService);
    }
    throw new Error('There exists no animation setting for this domain.');
};


export let AnimationSettingsProvider =
  { provide: AnimationSettings,
    useFactory: animationSettingsFactory,
    deps: [TaskSchemaService, CurrentProjectService, ProjectsService]
  };
