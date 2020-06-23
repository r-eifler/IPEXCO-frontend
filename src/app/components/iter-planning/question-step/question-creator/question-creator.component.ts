import { takeUntil } from 'rxjs/operators';
import { QUESTION_REDIRECT } from './../../../../app.tokens';
import { GoalType } from './../../../../interface/goal';
import { PlanProperty } from './../../../../interface/plan-property';
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Project} from '../../../../interface/project';
import {PlannerService} from '../../../../service/planner.service';
import {ExplanationRun, PlanRun, RunType} from '../../../../interface/run';
import {CurrentRunStore} from '../../../../store/stores.store';
import {Goal} from '../../../../interface/goal';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { MatSelectionList } from '@angular/material/list/selection-list';
import { Router, ActivatedRoute } from '@angular/router';
import { ExecutionSettingsService } from 'src/app/service/execution-settings.service';
import { CurrentRunService } from 'src/app/service/run-services';

@Component({
  selector: 'app-question-creator',
  templateUrl: './question-creator.component.html',
  styleUrls: ['./question-creator.component.css']
})
export class QuestionCreatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  @ViewChild('planPorpertiesList') questionSelectionList: MatSelectionList;
  question: PlanProperty[] = [];

  allPlanProperties: PlanProperty[];
  notSatPlanProperties: PlanProperty[];
  private currentProject$: Observable<Project>;
  private currentRun: PlanRun;
  private hardGoals: Goal[];

  private currentProject: Project;

  public maxSizeQuestionReached = false;

  constructor(
    private settingsService: ExecutionSettingsService,
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    private plannerService: PlannerService,
    private currentRunService: CurrentRunService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(QUESTION_REDIRECT) private redirectURL: string
  ) {

    this.currentProjectService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(project => {
      this.currentProject = project;
    });

    this.currentRunService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(run => {
      if (run != null) {
        this.currentRun = run;
        this.hardGoals = run.hardGoals;
        this.propertiesService.getList()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(properties => {
          this.allPlanProperties = properties.filter(p => p.isUsed);
          this.notSatPlanProperties = this.allPlanProperties.filter(p => ! this.currentRun.satPlanProperties.includes(p.name));
        });
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectionChange(event) {
    this.question = this.questionSelectionList.selectedOptions.selected.map(v => v.value);
    if (this.questionSelectionList.selectedOptions.selected.length >= this.settingsService.getSelectedObject().getValue().maxQuestionSize) {
      this.maxSizeQuestionReached = true;
    } else {
      this.maxSizeQuestionReached = false;
    }
  }


  // create a new mugs run with the currently selected properties
  compute_dependencies(): void {
    const expRun: ExplanationRun = {
      _id: this.currentRun.explanationRuns.length.toString(),
      name: 'Question ' + (this.currentRun.explanationRuns.length + 1),
      status: null,
      type: RunType.mugs,
      planProperties: this.allPlanProperties,
      // only plan properties soft goals
      softGoals: this.allPlanProperties.filter(p => ! this.question.includes(p)),
      hardGoals: this.currentRun.hardGoals.filter(g => g.goalType === GoalType.goalFact).concat(this.question),
      result: null,
      log: null,
    };

    console.log('Compute dependencies');
    console.log(expRun);

    this.plannerService.execute_mugs_run(this.currentRun, expRun);
    console.log('Redirect to: ' + this.redirectURL);
    this.router.navigate([this.redirectURL], { relativeTo: this.route });
  }

}
