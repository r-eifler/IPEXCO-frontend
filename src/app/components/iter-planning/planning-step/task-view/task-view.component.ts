import {PlanPropertyMapService} from './../../../../service/plan-property-services';
import {takeUntil} from 'rxjs/operators';
import {PlanProperty} from './../../../../interface/plan-property';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentRunStore} from '../../../../store/stores.store';
import {combineLatest, Subject} from 'rxjs';
import {ExecutionSettingsService} from '../../../../service/execution-settings.service';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  enforcedSatPlanProperties: PlanProperty[] = [];

  addSatPlanProperties: PlanProperty[] = [];
  notSatPlanProperties: PlanProperty[] = [];

  planValue = 0;

  constructor(
    private  currentRunStore: CurrentRunStore,
    public settingsService: ExecutionSettingsService,
    private planPropertyCollectionService: PlanPropertyMapService,
  ) {

    combineLatest([this.currentRunStore.item$, planPropertyCollectionService.getMap()])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(([run, planProperties]) => {
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

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
