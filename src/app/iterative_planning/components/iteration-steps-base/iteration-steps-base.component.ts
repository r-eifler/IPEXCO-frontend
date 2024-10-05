import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IterationStep } from "../../domain/iteration_step";
import { selectIterativePlanningNewStep, selectIterativePlanningSelectedStep } from "../../state/iterative-planning.selector";

@Component({
  selector: "app-iteration-steps-base",
  templateUrl: "./iteration-steps-base.component.html",
  styleUrls: ["./iteration-steps-base.component.css"],
})
export class ProjectIterativePlanningBaseComponent
  implements OnInit
{

  step$: Observable<IterationStep>;
  stepSelected$: Observable<boolean>;
  newStep$: Observable<IterationStep>;

  constructor(
    private store: Store,
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);
    this.stepSelected$ = this.step$.pipe(map(s => !!s));
    this.newStep$ = this.store.select(selectIterativePlanningNewStep);
  }

  ngOnInit(): void {}

}
