import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';
import {SelectedQuestionService} from '../../../../service/planner-runs/selected-question.service';
import {PlanPropertyMapService} from '../../../../service/plan-properties/plan-property-services';
import {RunningDemoService} from '../../../../service/demo/demo-services';
import {takeUntil} from 'rxjs/operators';
import {combineLatest, Subject} from 'rxjs';
import {PlanProperty} from '../../../../interface/plan-property/plan-property';

@Component({
  selector: 'app-global-explanation',
  templateUrl: './global-explanation.component.html',
  styleUrls: ['./global-explanation.component.css']
})
export class GlobalExplanationComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() finished = new EventEmitter();

  MUGS: PlanProperty[][] = [];
  filteredMUGS: PlanProperty[][] = [];
  planProperties: PlanProperty[];

  selectedFilterPropertyName: string;

  constructor(
    private timeLogger: TimeLoggerService,
    private  demoService: RunningDemoService,
    private planPropertiesService: PlanPropertyMapService
  ) {

    combineLatest(
      [
        this.demoService.getSelectedObject(),
        this.planPropertiesService.getMap()])
      .pipe(takeUntil(this.ngUnsubscribe))
    .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        ([demo, planPropertiesMap]) => {
          if (demo && planPropertiesMap) {
            this.planProperties = Array.from(planPropertiesMap.values());
            for (const ms of demo.data.MUGS) {
              const ppList = [];
              for (const pName of ms) {
                ppList.push(planPropertiesMap.get(pName));
              }
              this.MUGS.push(ppList);
            }
            this.filteredMUGS = [...this.MUGS];
          }
        }
      );
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('global-explanation');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

  close() {
    this.finished.emit();
  }

  filterMUGSWith() {
    this.timeLogger.addInfo(this.loggerId, 'filter: ' + this.selectedFilterPropertyName);
    this.filteredMUGS = [];
    for (const ms of this.MUGS) {
      if (ms.filter(pp => pp.name === this.selectedFilterPropertyName).length > 0) {
        this.filteredMUGS.push([...ms]);
      }
    }
  }

  resetFilter() {
    this.selectedFilterPropertyName = null;
    this.timeLogger.addInfo(this.loggerId, 'filter: reset');
    this.filteredMUGS = [...this.MUGS];
  }

}
