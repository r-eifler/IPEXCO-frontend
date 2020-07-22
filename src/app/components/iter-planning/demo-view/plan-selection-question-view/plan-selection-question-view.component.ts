import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {PlanProperty} from '../../../../interface/plan-property/plan-property';
import {CurrentRunStore} from '../../../../store/stores.store';
import {ExecutionSettingsService} from '../../../../service/settings/execution-settings.service';
import {PlanPropertyMapService} from '../../../../service/plan-properties/plan-property-services';
import {takeUntil} from 'rxjs/operators';
import {PlanRun, RunType} from '../../../../interface/run';
import {CurrentProjectService} from '../../../../service/project/project-services';
import {TaskSchemaService} from '../../../../service/task-info/schema.service';
import {PlannerService} from '../../../../service/planner-runs/planner.service';
import {PlanRunsService} from '../../../../service/planner-runs/planruns.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DEMO_FINISHED_REDIRECT, PLANNER_REDIRECT, QUESTION_REDIRECT} from '../../../../app.tokens';
import {Project} from '../../../../interface/project';
import {Demo} from '../../../../interface/demo';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DemoCreatorComponent} from '../../../demo/demo-creator/demo-creator.component';
import {QuestionDialogComponent} from '../question-dialog/question-dialog.component';
import {DemoRunService} from '../../../../service/planner-runs/demo-planruns.service';
import {DemoPlannerService} from '../../../../service/planner-runs/demo-planner.service';

@Component({
  selector: 'app-plan-selection-question-view',
  templateUrl: './plan-selection-question-view.component.html',
  styleUrls: ['./plan-selection-question-view.component.css']
})
export class PlanSelectionQuestionViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  planProperties: PlanProperty[];

  enforcedSatPlanProperties: PlanProperty[] = [];

  addSatPlanProperties: PlanProperty[] = [];
  notSatPlanProperties: PlanProperty[] = [];

  selectedGoalFacts: PlanProperty[] = [];

  planValue = 0;
  currentRun: PlanRun;
  private project: Project;

  constructor(
    private  currentRunStore: CurrentRunStore,
    public settingsService: ExecutionSettingsService,
    private planPropertyCollectionService: PlanPropertyMapService,
    private currentProjectService: CurrentProjectService,
    private taskSchemaService: TaskSchemaService,
    private plannerService: PlannerService,
    private propertiesService: PlanPropertyMapService,
    private runService: PlanRunsService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLANNER_REDIRECT) private redirectURL: string
  ) {

    combineLatest([this.currentRunStore.item$, planPropertyCollectionService.getMap()])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([run, planProperties]) => {
        this.currentRun = run;
        this.planProperties = [...planProperties.values()];

        this.enforcedSatPlanProperties = [];
        this.addSatPlanProperties = [];
        this.notSatPlanProperties = [];

        if (run && planProperties) {
          this.planValue = run.planValue;

          for (const propName of run.hardGoals) {
            this.enforcedSatPlanProperties.push(planProperties.get(propName));
          }
          for (const propName of run.satPlanProperties) {
            if (! this.enforcedSatPlanProperties.find(p => p.name === propName)) {
              this.addSatPlanProperties.push(planProperties.get(propName));
            }
          }
          for (const prop of planProperties.values()) {
            if (! this.enforcedSatPlanProperties.find(p => p.name === prop.name) &&
              ! this.addSatPlanProperties.find(p => p.name === prop.name)) {
              this.notSatPlanProperties.push(prop);
            }
          }

        }
      });

    this.currentProjectService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(project => {
        if (project !== null) {
          this.project = project;
        }
      });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async computePlan() {

    const run: PlanRun = {
      _id: this.runService.getNumRuns().toString(),
      name: 'Plan ' + (this.runService.getNumRuns() + 1),
      type: RunType.plan,
      status: null,
      project: this.project,
      planProperties: this.selectedGoalFacts.concat(this.planProperties.filter(v => v.globalHardGoal)),
      hardGoals: this.selectedGoalFacts.concat(this.planProperties.filter(v => v.globalHardGoal)).map(value => (value.name)),
      log: null,
      explanationRuns: [],
      previousRun: this.currentRun._id,
    };

    this.plannerService.execute_plan_run(run);
    await this.router.navigate([this.redirectURL], {relativeTo: this.route});

  }

  showAnswer(planProperty: PlanProperty): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      planRun: this.currentRun,
      question: [planProperty]
    };

    const dialogRef = this.dialog.open(QuestionDialogComponent, dialogConfig);
  }

}

