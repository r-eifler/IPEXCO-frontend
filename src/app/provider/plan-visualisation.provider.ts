import {ProjectsService} from 'src/app/service/project/project-services';
import {AnimationSettings} from '../interface/settings/animation-settings';
import {CurrentProjectService} from '../service/project/project-services';
import {NoMysteryVisualization} from '../plan-visualization/plugins/nomystery/nomystery-visualization';
import {PlanVisualization} from '../plan-visualization/integration/plan-visualization';
import {AnimationSettingsNoMysteryVisu} from '../plan-visualization/plugins/nomystery/settings/animation-settings-nomystery-visu';
import {SelectedPlanRunService} from '../service/planner-runs/selected-planrun.service';

const planVisualizationFactory = (
    currentRunService: SelectedPlanRunService,
    projectService: CurrentProjectService) => {
      if (projectService.getSelectedObject().value.domainFile.domain === 'nomystery') {
        const visu = new NoMysteryVisualization(projectService, currentRunService);
        return visu;
      }
      throw new Error('There exists no visualization for this domain.');
};


export let PlanVisualizationProvider = { provide: PlanVisualization,
    useFactory: planVisualizationFactory,
    deps: [SelectedPlanRunService, CurrentProjectService]
  };


const animationSettingsFactory = (
  projectService: CurrentProjectService,
  projectsService: ProjectsService) => {
    if (projectService.getSelectedObject().value.domainFile.domain === 'nomystery') {
      return new AnimationSettingsNoMysteryVisu(projectService, projectsService);
    }
    throw new Error('There exists no animation setting for this domain.');
};


export let AnimationSettingsProvider = { provide: AnimationSettings,
    useFactory: animationSettingsFactory,
    deps: [CurrentProjectService, ProjectsService]
  };
