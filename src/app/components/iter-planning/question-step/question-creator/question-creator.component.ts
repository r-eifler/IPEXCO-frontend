import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PlanProperty} from '../../../../interface/plan-property';
import {Observable} from 'rxjs';
import {Project} from '../../../../interface/project';
import {PlannerService} from '../../../../service/planner.service';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PropertyCreatorComponent} from '../../../plan_properties/property-creator/property-creator.component';
import {ExplanationRun, PlanRun, RunType} from '../../../../interface/run';
import {CurrentRunStore} from '../../../../store/stores.store';
import {Goal} from '../../../../interface/goal';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { MatSelectionList } from '@angular/material/list/selection-list';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-creator',
  templateUrl: './question-creator.component.html',
  styleUrls: ['./question-creator.component.css']
})
export class QuestionCreatorComponent implements OnInit {

  @ViewChild('planPorpertiesList') questionSelectionList: MatSelectionList;
  question: PlanProperty[] = [];

  collection: PlanProperty[];
  private currentProject$: Observable<Project>;
  private currentRun: PlanRun;
  private hardGoals: Goal[];

  private currentProject: Project;

  constructor(
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    private plannerService: PlannerService,
    private currentRunStore: CurrentRunStore,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.currentProjectService.selectedObject$.subscribe(project => {
      this.currentProject = project;
      if (project) {
        this.propertiesService.findCollection([{param: 'projectId', value: this.currentProject._id}]);
      }
    });

    this.currentRunStore.item$.subscribe(run => {
      if (run != null) {
        this.currentRun = run;
        this.hardGoals = run.hardGoals;
        this.propertiesService.collection$.subscribe(properties => {
          this.collection = properties.filter(p => ! this.currentRun.satPlanProperties.includes(p.name));
        });
      }
    });
  }

  ngOnInit(): void {
  }

  onSelectionChange(event) {
    this.question = this.questionSelectionList.selectedOptions.selected.map(v => v.value);
  }


  // create a new mugs run with the currently selected properties
  compute_dependencies(): void {
    const expRun: ExplanationRun = {
      _id: null,
      name: 'Question ' + (this.currentRun.explanationRuns.length + 1),
      status: null,
      type: RunType.mugs,
      planProperties: this.collection,
      softGoals: this.collection.filter(p => ! this.question.includes(p)),
      hardGoals: this.currentRun.hardGoals.concat(this.question),
      result: null,
      log: null,
    };

    // console.log('Compute dependencies');
    // console.log(expRun);

    this.plannerService.execute_mugs_run(this.currentRun, expRun);
    this.router.navigate(['../../../run-overview-mobile'], { relativeTo: this.route });
  }

}
