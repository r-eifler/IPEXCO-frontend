import { ExecutionSettingsServiceService } from 'src/app/service/settings/ExecutionSettingsService.service';
import { ExecutionSettings } from './../../../../interface/settings/execution-settings';
import { Subject, Observable } from "rxjs";
import { IterationStep } from "../../../../interface/run";
import { SelectedIterationStepService } from "../../../../service/planner-runs/selected-iteration-step.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-iteration-step-overview",
  templateUrl: "./iteration-step-overview.component.html",
  styleUrls: ["./iteration-step-overview.component.scss"],
})
export class IterationStepOverviewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();

  step$: Observable<IterationStep>;
  settings$: Observable<ExecutionSettings>;

  constructor(
    selectedIterationStepService: SelectedIterationStepService,
    settingsService: ExecutionSettingsServiceService
    ) {

    this.settings$ = settingsService.getSelectedObject();

    this.step$ = selectedIterationStepService.findSelectedObject().pipe(
      filter((step) => !!step)
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
