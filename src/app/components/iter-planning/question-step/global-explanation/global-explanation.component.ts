import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';
import {SelectedQuestionService} from '../../../../service/planner-runs/selected-question.service';
import {PlanPropertyMapService} from '../../../../service/plan-properties/plan-property-services';
import {RunningDemoService} from '../../../../service/demo/demo-services';
import {takeUntil} from 'rxjs/operators';
import {combineLatest, Subject} from 'rxjs';
import {PlanProperty} from '../../../../interface/plan-property/plan-property';
import { Node, Edge } from '@swimlane/ngx-graph';

interface CNode extends Node {
}

interface CEdge extends Edge {
}

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
  planProperties: PlanProperty[];

  edges: CEdge[] = [];
  nodes: CNode[] = [];

  constructor(
    private timeLogger: TimeLoggerService,
    private demoService: RunningDemoService,
    private selectedPlan: SelectedPlanRunService,
    private planPropertiesService: PlanPropertyMapService
  ) {

    combineLatest(
      [
        this.demoService.getSelectedObject(),
        this.planPropertiesService.getMap()])
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
          }
          this.initGrap();
        }
      );
  }

  initGrap(): void {
    console.log(this.MUGS);

    for(const p of this.planProperties){
      if(! p.globalHardGoal){
        this.nodes.push({id: p.name, label: p.naturalLanguageDescription})
      }
    }

    for(let M of this.MUGS){
      for(let i = 0; i < M.length; i++){
        const source = M[i];
        for(let j = i+1; j < M.length; j++){
          const target = M[j];
          this.edges.push({id: source.name + '_' + target.name, label: "", source: source.name, target: target.name})
        }
      }
    }

    console.log(this.nodes);
    console.log(this.edges);
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('global-explanation');

    this.selectedPlan.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(plan => {
        this.timeLogger.addInfo(this.loggerId, 'selected plan: ' + plan._id);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

  close() {
    this.finished.emit();
  }



}
