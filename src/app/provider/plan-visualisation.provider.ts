import {ProjectsService} from 'src/app/service/project/project-services';
import {AnimationSettings} from '../interface/settings/animation-settings';
import {CurrentProjectService} from '../service/project/project-services';
import {NoMysteryVisualization} from '../plan-visualization/plugins/nomystery/nomystery-visualization';
import {PlanVisualization} from '../plan-visualization/integration/plan-visualization';
import {TaskSchemaService} from '../service/task-info/schema.service';
import {AnimationSettingsNoMysteryVisu} from '../plan-visualization/plugins/nomystery3D/settings/animation-settings-nomystery-visu';
import {SelectedPlanRunService} from '../service/planner-runs/selected-planrun.service';

const planVisualizationFactory = (
    taskSchemaService: TaskSchemaService,
    currentRunService: SelectedPlanRunService,
    projectService: CurrentProjectService) => {
      console.log('Provide plan Visualization');
      if (projectService.getSelectedObject().value.domainFile.domain === 'nomystery') {
        const visu = new NoMysteryVisualization(projectService, taskSchemaService, currentRunService);
        return visu;
      }
      throw new Error('There exists no visualization for this domain.');
};


export let PlanVisualizationProvider = { provide: PlanVisualization,
    useFactory: planVisualizationFactory,
    deps: [TaskSchemaService, SelectedPlanRunService, CurrentProjectService]
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


export let AnimationSettingsProvider = { provide: AnimationSettings,
    useFactory: animationSettingsFactory,
    deps: [TaskSchemaService, CurrentProjectService, ProjectsService]
  };
