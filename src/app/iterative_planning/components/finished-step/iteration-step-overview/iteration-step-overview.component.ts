import { GeneralSettings } from '../../../../interface/settings/general-settings';
import { Subject, Observable } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";
import { IterationStep } from 'src/app/iterative_planning/domain/iteration_step';
import { Store } from '@ngrx/store';
import { selectIterativePlanningProject, selectIterativePlanningSelectedStep } from 'src/app/iterative_planning/state/iterative-planning.selector';

@Component({
  selector: "app-iteration-step-overview",
  templateUrl: "./iteration-step-overview.component.html",
  styleUrls: ["./iteration-step-overview.component.scss"],
})
export class IterationStepOverviewComponent implements OnInit {

  step$: Observable<IterationStep>;
  settings$: Observable<GeneralSettings>;

  constructor(
    private store: Store,
  ) {

    this.settings$ = this.store.select(selectIterativePlanningProject).pipe(
      map(p => p?.settings)
    )

    this.step$ = this.store.select(selectIterativePlanningSelectedStep)
  }

  ngOnInit(): void {}

}
