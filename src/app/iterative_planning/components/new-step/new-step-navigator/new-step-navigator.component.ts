
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { NewStepInterfaceStatus } from "src/app/interface/interface-status";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { selectIterativePlanningNewStep, selectIterativePlanningProject } from "src/app/iterative_planning/state/iterative-planning.selector";

@Component({
  selector: "app-new-step-navigator",
  templateUrl: "./new-step-navigator.component.html",
  styleUrls: ["./new-step-navigator.component.scss"],
})
export class NewStepNavigatorComponent implements OnInit {
  step$: Observable<IterationStep>;
  hardGoals$: Observable<string[]>;
  interfaceStatus$: Observable<NewStepInterfaceStatus>;
  settings$: Observable<GeneralSettings>;

  constructor(
    private store: Store,
  ) {
    this.step$ = this.store.select(selectIterativePlanningNewStep)
    this.hardGoals$ = this.step$.pipe(map(step => step?.hardGoals))

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
  }

  stepperChanged(event: StepperSelectionEvent): void {
    // this.newStepInterfaceStatusService.saveObject({
    //   _id: "0",
    //   stepperStep: event.selectedIndex,
    // });
  }
}
