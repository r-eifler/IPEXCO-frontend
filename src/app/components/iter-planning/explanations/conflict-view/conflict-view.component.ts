import { PPConflict } from './../../../../interface/explanations';
import { PlanPropertyMapService } from '../../../../service/plan-properties/plan-property-services';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { PlanProperty } from '../../../../interface/plan-property/plan-property';
import { DepExplanationRun, RunStatus } from 'src/app/interface/run';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-conflict-view',
  templateUrl: './conflict-view.component.html',
  styleUrls: ['./conflict-view.component.scss']
})
export class ConflictViewComponent implements OnInit {

  runStatus = RunStatus;


  @Input() question: PlanProperty;
  @Input()
  set explanation(explanation : DepExplanationRun){
    console.log(explanation);
    this.explanation$.next(explanation);
  }

  @Output() selectedConflict = new EventEmitter<PPConflict>();

  explanation$ = new BehaviorSubject<DepExplanationRun>(null);

  dependencies$ : Observable<PlanProperty[][]>;
  planProperties$ : Observable<Map<string,PlanProperty>>;


  constructor(
    planPropertiesService: PlanPropertyMapService
  ) {
    this.planProperties$ = planPropertiesService.getMap();

    this.dependencies$ = combineLatest([this.explanation$, this.planProperties$]).pipe(
      filter(([exp, planProperties]) => !!exp && exp.status == RunStatus.finished && !!planProperties),
      map(([exp, planProperties]) =>  exp.dependencies.conflicts.map(con => con.elems.map(e => planProperties.get(e))))
    );
  }

  ngOnInit(): void {
  }

  selectConflict(c : PlanProperty[]) {
    this.selectedConflict.emit(new PPConflict(c.map(pp => pp._id)));
  }

}
