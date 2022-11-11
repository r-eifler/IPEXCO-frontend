import { CurrentProjectService } from 'src/app/service/project/project-services';
import { GeneralSettings } from '../../../../interface/settings/general-settings';
import { Subject, Observable } from "rxjs";
import { IterationStep } from "../../../../interface/run";
import { SelectedIterationStepService } from "../../../../service/planner-runs/selected-iteration-step.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-iteration-step-overview",
  templateUrl: "./iteration-step-overview.component.html",
  styleUrls: ["./iteration-step-overview.component.scss"],
})
export class IterationStepOverviewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();

  step$: Observable<IterationStep>;
  settings$: Observable<GeneralSettings>;

  constructor(
    selectedIterationStepService: SelectedIterationStepService,
    selectedProject: CurrentProjectService,
  ) {

    this.settings$ = selectedProject.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    );

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
