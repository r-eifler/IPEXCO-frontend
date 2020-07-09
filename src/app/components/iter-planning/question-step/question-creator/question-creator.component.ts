import {PlanProperty} from 'src/app/interface/plan-property/plan-property';
import {takeUntil} from 'rxjs/operators';
import {QUESTION_REDIRECT} from '../../../../app.tokens';
import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Project} from '../../../../interface/project';
import {PlannerService} from '../../../../service/planner-runs/planner.service';
import {ExplanationRun, PlanRun, RunType} from '../../../../interface/run';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {MatSelectionList} from '@angular/material/list/selection-list';
import {ActivatedRoute, Router} from '@angular/router';
import {ExecutionSettingsService} from 'src/app/service/settings/execution-settings.service';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';

@Component({
  selector: 'app-question-creator',
  templateUrl: './question-creator.component.html',
  styleUrls: ['./question-creator.component.css']
})
export class QuestionCreatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  @ViewChild('planPropertiesList') questionSelectionList: MatSelectionList;
  question: PlanProperty[] = [];

  allPlanProperties: PlanProperty[];
  notSatPlanProperties: PlanProperty[];
  private currentProject$: Observable<Project>;
  private currentRun: PlanRun;
  private hardGoals: string[];

  private currentProject: Project;

  public maxSizeQuestionReached = false;

  constructor(
    public settingsService: ExecutionSettingsService,
    private propertiesService: PlanPropertyMapService,
    private currentProjectService: CurrentProjectService,
    private plannerService: PlannerService,
    private currentRunService: SelectedPlanRunService,
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
        this.propertiesService.getMap()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(properties => {
          this.allPlanProperties = [...properties.values()].filter(p => p.isUsed);
          console.log(this.currentRun.satPlanProperties);
          console.log(this.hardGoals);
          this.notSatPlanProperties = this.allPlanProperties.filter(
            p => ! this.currentRun.satPlanProperties.includes(p.name) && ! this.currentRun.hardGoals.includes(p.name));
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
      softGoals: this.allPlanProperties.filter(p => ! this.question.includes(p) && ! this.currentRun.hardGoals.find(hg => hg === p.name))
          .map(value => (value.name)),
      hardGoals: this.currentRun.hardGoals.concat(this.question.map(value => (value.name))),
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
