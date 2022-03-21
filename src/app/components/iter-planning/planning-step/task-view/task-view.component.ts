import { CurrentProjectService } from 'src/app/service/project/project-services';
import {PlanPropertyMapService} from '../../../../service/plan-properties/plan-property-services';
import {takeUntil} from 'rxjs/operators';
import {PlanProperty} from '../../../../interface/plan-property/plan-property';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentRunStore} from '../../../../store/stores.store';
import {combineLatest, Subject} from 'rxjs';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  enforcedSatPlanProperties: PlanProperty[] = [];

  addSatPlanProperties: PlanProperty[] = [];
  notSatPlanProperties: PlanProperty[] = [];

  planValue = 0;
  hasPlan = false;

  constructor(
    private timeLogger: TimeLoggerService,
    private  currentRunStore: CurrentRunStore,
    public currentProjectService: CurrentProjectService,
    private planPropertyCollectionService: PlanPropertyMapService,
  ) {

    combineLatest([this.currentRunStore.item$, planPropertyCollectionService.getMap()])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(([run, planProperties]) => {
      this.enforcedSatPlanProperties = [];
      this.addSatPlanProperties = [];
      this.notSatPlanProperties = [];

      if (run && planProperties) {
        if (! this.loggerId) {
          this.loggerId = this.timeLogger.register('goal-view');
        }
        this.timeLogger.addInfo(this.loggerId, 'runId: ' + run._id);

        this.planValue = run.planValue();
        this.hasPlan = !!run.plan;

        // TODO
        // for (const propName of run.hardGoals) {
        //   this.enforcedSatPlanProperties.push(planProperties.get(propName));
        // }
        this.enforcedSatPlanProperties.sort((a, b) => a.globalHardGoal ? -1 : 0);

        if (this.hasPlan) {
          for (const satP of run.satPlanProperties) {
            if (!this.enforcedSatPlanProperties.find(p => p.name === satP.name)) {
              this.addSatPlanProperties.push(satP);
            }
          }
          for (const prop of planProperties.values()) {
            if (!this.enforcedSatPlanProperties.find(p => p.name === prop.name) &&
              !this.addSatPlanProperties.find(p => p.name === prop.name)) {
              this.notSatPlanProperties.push(prop);
            }
          }
        }
      }
    });

  }

  ngOnInit(): void {
    if (! this.loggerId) {
      this.loggerId = this.timeLogger.register('goal-view');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
