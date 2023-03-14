import { NewStepInterfaceStatusService } from "./../../../../service/user-interface/interface-status-services";
import { NewStepInterfaceStatus } from "src/app/interface/interface-status";
import { PlanProperty } from "./../../../../interface/plan-property/plan-property";
import { PlanPropertyMapService } from "./../../../../service/plan-properties/plan-property-services";
import { IterationStep } from "src/app/interface/run";
import { Observable } from "rxjs";
import { NewIterationStepStoreService } from "./../../../../service/planner-runs/selected-iteration-step.service";
import { Component, OnInit } from "@angular/core";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { NewIterationStepGenerationService } from "../../../../service/planner-runs/new-iteration-step-generation-service.service";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { filter, map } from "rxjs/operators";

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
    private newIterationStepService: NewIterationStepStoreService,
    private newStepInterfaceStatusService: NewStepInterfaceStatusService,
    private newIterationStepGenerationService: NewIterationStepGenerationService,
    private selectedProject: CurrentProjectService,
  ) {
    this.step$ = this.newIterationStepService.getSelectedObject();

    this.settings$ = selectedProject.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    );

    this.interfaceStatus$ = this.newStepInterfaceStatusService
      .getSelectedObject()
      .pipe((status) => {
        if (status) {
          return status;
        }
        let newStatus: NewStepInterfaceStatus = { _id: "0", stepperStep: 0 };
        this.newStepInterfaceStatusService.saveObject(newStatus);
      });
  }

  ngOnInit(): void {}

  addNewStep(): void {
    this.newIterationStepGenerationService.finishNewStep();
    this.newStepInterfaceStatusService.removeCurrentObject();
  }

  stepperChanged(event: StepperSelectionEvent): void {
    this.newStepInterfaceStatusService.saveObject({
      _id: "0",
      stepperStep: event.selectedIndex,
    });
  }
}
