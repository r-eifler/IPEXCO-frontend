import { QUESTION_REDIRECT } from './../../../../app.tokens';
import { GoalType } from './../../../../interface/goal';
import { PlanProperty } from './../../../../interface/plan-property';
import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {Project} from '../../../../interface/project';
import {PlannerService} from '../../../../service/planner.service';
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

  allPlanProperties: PlanProperty[];
  notSatPlanProperties: PlanProperty[];
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
    private route: ActivatedRoute,
    @Inject(QUESTION_REDIRECT) private redirectURL: string
  ) {

    this.currentProjectService.selectedObject$.subscribe(project => {
      this.currentProject = project;
      // if (project) {
      //   this.propertiesService.findCollection([{param: 'projectId', value: this.currentProject._id}]);
      // }
    });

    this.currentRunStore.item$.subscribe(run => {
      if (run != null) {
        this.currentRun = run;
        this.hardGoals = run.hardGoals;
        this.propertiesService.getList().subscribe(properties => {
          // console.log(this.currentRun.satPlanProperties);
          this.allPlanProperties = properties.filter(p => p.isUsed);
          this.notSatPlanProperties = this.allPlanProperties.filter(p => ! this.currentRun.satPlanProperties.includes(p.name));
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
      _id: this.currentRun.explanationRuns.length.toString(),
      name: 'Question ' + (this.currentRun.explanationRuns.length + 1),
      status: null,
      type: RunType.mugs,
      planProperties: this.allPlanProperties,
      softGoals: this.allPlanProperties.filter(p => ! this.question.includes(p)),
      hardGoals: this.currentRun.hardGoals.filter(g => g.goalType === GoalType.goalFact).concat(this.question),
      result: null,
      log: null,
    };

    // console.log('Compute dependencies');
    // console.log(expRun);

    this.plannerService.execute_mugs_run(this.currentRun, expRun);
    console.log('Redirect to: ' + this.redirectURL);
    this.router.navigate([this.redirectURL], { relativeTo: this.route });
  }

}
