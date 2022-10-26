import { OnDestroy } from '@angular/core';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { Observable, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { RunningDemoService } from 'src/app/service/demo/demo-services';
import { Component, OnInit } from '@angular/core';
import { Demo, getSimpleConflicts } from 'src/app/interface/demo';
import { PPDependencies } from 'src/app/interface/explanations';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-conflict-graph',
  templateUrl: './conflict-graph.component.html',
  styleUrls: ['./conflict-graph.component.scss']
})
export class ConflictGraphComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  demo$: Observable<Demo>;
  conflicts$:  Observable<PPDependencies>;
  planProperties$: Observable<Map<string,PlanProperty>>;

  constructor(
    demoService: RunningDemoService,
    planPropertiesService: PlanPropertyMapService
  ) {

    this.demo$ = demoService.getSelectedObject();
    this.conflicts$ = this.demo$.pipe(
      takeUntil(this.unsubscribe$),
      filter(demo => !!demo),
      map(demo => getSimpleConflicts(demo))
    );
    this.planProperties$ = planPropertiesService.getMap();
  }

  ngOnInit(): void {

    this.conflicts$.subscribe( c => console.log(c));
    this.planProperties$.subscribe(p => console.log(p));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
