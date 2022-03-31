import { PlanProperty } from './../../../../interface/plan-property/plan-property';
import { IterationStep } from 'src/app/interface/run';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { Observable, combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-explanations-select-preference-view',
  templateUrl: './explanations-select-preference-view.component.html',
  styleUrls: ['./explanations-select-preference-view.component.scss']
})
export class ExplanationsSelectPreferenceViewComponent implements OnInit {

  private unsubscribe$: Subject<any> = new Subject();

  @Input()
  set step(step : IterationStep){
    this.step$.next(step);
  }
  @Output() selectedPP = new EventEmitter<string>();
  selectedPPId : string;

  possiblePP$: Observable<PlanProperty[]>;
  private step$ = new BehaviorSubject<IterationStep>(null);

  constructor(
    private planpropertiesService: PlanPropertyMapService,
  ) {

    this.possiblePP$ = combineLatest([this.step$, planpropertiesService.getMap()]).pipe(
        filter(([step, properties] ) => step && properties && properties.size > 0),
        map(([step, properties]) => {
          const props = [];
          for (let property of properties.values()) {
            if (property.isUsed && !step.hardGoals.includes(property._id))
              props.push(property);
          }

          return props
        }),
      )
      .pipe(takeUntil(this.unsubscribe$));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectPP(pp : PlanProperty): void {
    this.selectedPPId = pp._id
    this.selectedPP.emit(pp._id);
  }

}
