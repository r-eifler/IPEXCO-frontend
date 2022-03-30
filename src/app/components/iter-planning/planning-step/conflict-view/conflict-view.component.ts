import { PlanPropertyMapService } from './../../../../service/plan-properties/plan-property-services';
import { Observable } from 'rxjs';
import { PlanProperty } from './../../../../interface/plan-property/plan-property';
import { DepExplanationRun, RunStatus } from 'src/app/interface/run';
import { Component, Input, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-conflict-view',
  templateUrl: './conflict-view.component.html',
  styleUrls: ['./conflict-view.component.scss']
})
export class ConflictViewComponent implements OnInit {

  runStatus = RunStatus;

  @Input() question: PlanProperty;
  @Input() explanation: DepExplanationRun;

  dependencies$ : Observable<PlanProperty[][]>;


  constructor(
    planPropertiesService: PlanPropertyMapService
  ) {
    this.dependencies$ = planPropertiesService.getMap().pipe(
      map(planPropties => this.explanation.dependencies.conflicts.map(con => con.elems.map(e => planPropties.get(e))))
    );
  }

  ngOnInit(): void {
  }

}
