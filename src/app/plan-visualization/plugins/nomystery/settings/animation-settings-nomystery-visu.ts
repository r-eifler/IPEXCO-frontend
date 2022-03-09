import {BehaviorSubject} from 'rxjs';
import {NoMysteryTask} from '../nomystery-task';
import {LocationPositioningSettings} from 'src/app/plan-visualization/plugins/nomystery/settings/location-positioning';
import {Project} from 'src/app/interface/project';
import {CurrentProjectService, ProjectsService} from 'src/app/service/project/project-services';
import {AnimationSettingsNoMystery} from './animation-settings-nomystery';
import {Demo} from '../../../../interface/demo';


interface Position {
  x: number;
  y: number;
}

export class AnimationSettingsNoMysteryVisu {

  private displayObservable: BehaviorSubject<Element[]> = new BehaviorSubject([]);

  private locationPosSettings: LocationPositioningSettings;
  private animationSettings: AnimationSettingsNoMystery;

  private currentProject: Project;

  constructor(
    private projectService: CurrentProjectService,
    private projectsService: ProjectsService,
  ) {

    // console.log('New Animation Settings Visu');
    projectService.getSelectedObject().subscribe(
      project => {
        if (project) {
          this.currentProject = project;
          this.animationSettings = new AnimationSettingsNoMystery(project.animationSettings);

          let backgroundImagePath = '';
          backgroundImagePath = (project as Demo).summaryImage;

          const task = new NoMysteryTask(project.baseTask);
          this.locationPosSettings = new LocationPositioningSettings(backgroundImagePath, task, this.animationSettings);
          this.displayObservable.next([this.locationPosSettings.display()]);
        }
      }
    );


  }

  displayElemObservable(): BehaviorSubject<Element[]> {
    return this.displayObservable;
  }



  save() {
    this.animationSettings.locationPositions = this.locationPosSettings.getCurrentLocationsPositions();
    this.animationSettings.locationDropPositions = this.locationPosSettings.getCurrentLocationsDropPositions();
    this.currentProject.animationSettings = this.animationSettings.toJSON();

    // console.log(this.currentProject);

    this.projectsService.saveObject(this.currentProject);
    this.projectService.saveObject(this.currentProject);
  }

  moveLocations() {
    this.locationPosSettings.enableDraggableLocations();
    this.locationPosSettings.disableDraggableDropLocations();
  }

  moveDropLocations() {
    this.locationPosSettings.disableDraggableLocations();
    this.locationPosSettings.enableDraggableDropLocations();
  }
}
