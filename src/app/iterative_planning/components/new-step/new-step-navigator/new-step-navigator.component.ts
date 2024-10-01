
import { NewStepInterfaceStatus } from "src/app/interface/interface-status";
import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { map, take } from "rxjs/operators";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { Store } from "@ngrx/store";
import { selectIterativePlanningNewStep, selectIterativePlanningProject, selectIterativePlanningSelectedStep } from "src/app/iterative_planning/state/iterative-planning.selector";
import { createIterationStep } from "src/app/iterative_planning/state/iterative-planning.actions";

@Component({
  selector: "app-new-step-navigator",
  templateUrl: "./new-step-navigator.component.html",
  styleUrls: ["./new-step-navigator.component.scss"],
})
export class NewStepNavigatorComponent implements OnInit {
  step$: Observable<IterationStep>;
  interfaceStatus$: Observable<NewStepInterfaceStatus>;
  settings$: Observable<GeneralSettings>;

  constructor(
    private store: Store,
  ) {
    this.step$ = this.store.select(selectIterativePlanningNewStep)

    this.settings$ = this.store.select(selectIterativePlanningProject).pipe(
      map(p => p?.settings)
    )

    // this.interfaceStatus$ = this.newStepInterfaceStatusService
    //   .getSelectedObject()
    //   .pipe((status) => {
    //     if (status) {
    //       return status;
    //     }
    //     let newStatus: NewStepInterfaceStatus = { _id: "0", stepperStep: 0 };
    //     this.newStepInterfaceStatusService.saveObject(newStatus);
    //   });
  }

  ngOnInit(): void {}

  addNewStep(): void {
    this.step$.pipe(take(1)).subscribe( step =>
      this.store.dispatch(createIterationStep({iterationStep: step}))
    );
    
  }

  stepperChanged(event: StepperSelectionEvent): void {
    // this.newStepInterfaceStatusService.saveObject({
    //   _id: "0",
    //   stepperStep: event.selectedIndex,
    // });
  }
}
