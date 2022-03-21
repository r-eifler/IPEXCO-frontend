import { RunStatus } from 'src/app/interface/run';
import {CurrentProjectService} from '../../../../service/project/project-services';
import {PlanProperty} from '../../../../interface/plan-property/plan-property';
import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {Project} from '../../../../interface/project';
import {PlanRun} from '../../../../interface/run';
import {PlannerService} from '../../../../service/planner-runs/planner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {IterationStepsService} from 'src/app/service/planner-runs/iteration-steps.service';
import {takeUntil} from 'rxjs/operators';
import {PLANNER_REDIRECT} from 'src/app/app.tokens';
import {Subject} from 'rxjs';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.scss']
})
export class TaskCreatorComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() finished = new EventEmitter<boolean>();

  public project: Project;
  private readonly previousRun: PlanRun;

  public hasGlobalHardGoals = true;

  planProperties: PlanProperty[];

  selectedGoalFacts: PlanProperty[] = [];

  completed = false;

  constructor(
    private timeLogger: TimeLoggerService,
    private currentProjectService: CurrentProjectService,
    private plannerService: PlannerService,
    private propertiesService: PlanPropertyMapService,
    private runService: IterationStepsService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLANNER_REDIRECT) private redirectURL: string) {

    //TODO
    // this.previousRun = this.runService.getLastRun();

    this.propertiesService.getMap()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      props => {
        const propsList = [...props.values()];
        this.planProperties = propsList.filter((p: PlanProperty) => p.isUsed);
        this.hasGlobalHardGoals = this.planProperties.filter(v => v.globalHardGoal).length > 0;
        this.completed = this.hasGlobalHardGoals;

        // TODO
        // if (this.previousRun) {
        //   this.selectedGoalFacts = propsList.filter(
        //     (p: PlanProperty) => {
        //       return p.isUsed && ! p.globalHardGoal && this.previousRun.hardGoals.find(v => v === p.name);
        //     });
        //   this.checkComplete();
        // }
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
    this.loggerId = this.timeLogger.register('task-creator');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

  checkComplete() {
    this.completed = this.hasGlobalHardGoals || this.selectedGoalFacts.length > 0;
  }


  async computePlan() {

    // TODO
    const run: PlanRun = new PlanRun('Plan ' + (this.runService.getNumRuns() + 1), RunStatus.pending);
    run._id = this.runService.getNumRuns().toString();

    this.plannerService.execute_plan_run(run);
    this.finished.emit(true);
    this.timeLogger.addInfo(this.loggerId, 'hard goals selected');
    // await this.router.navigate([this.redirectURL], { relativeTo: this.route });
  }

  abortWithoutPlan() {
    this.finished.emit(false);
    this.timeLogger.addInfo(this.loggerId, 'abort');
  }
}
