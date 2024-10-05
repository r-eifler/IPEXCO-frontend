import { Component, EventEmitter, OnDestroy, Output } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatStepper } from "@angular/material/stepper";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { ResponsiveService } from "src/app/service/responsive/responsive.service";

import { LogEvent, TimeLoggerService } from "../../../service/logger/time-logger.service";

@Component({
  selector: "app-demo-help",
  templateUrl: "./demo-help.component.html",
  styleUrls: ["./demo-help.component.css"],
})
export class DemoHelpComponent implements OnDestroy {

  isMobile: boolean;
  canUseQuestions = false;
  numSteps = 0;
  seenEverything = false;

  settings$: Observable<GeneralSettings>;

  @Output() next = new EventEmitter<void>();

  constructor(
    private timeLogger: TimeLoggerService,
    private responsiveService: ResponsiveService,
    currentProjectService: CurrentProjectService
  ) {
    this.settings$ = currentProjectService.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    );
    console.log("DEMO HELP");

    this.timeLogger.log(LogEvent.START_USE_HELP);

    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntilDestroyed())
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();

    this.settings$
      .pipe(
        filter(s => !!s),
        takeUntilDestroyed()
        ).subscribe((settings) => {
          console.log(settings);
          this.canUseQuestions = settings.allowQuestions;
          this.numSteps = settings.allowQuestions ? 4 : 2;
      });
  }

  ngOnDestroy(): void {;
    this.timeLogger.log(LogEvent.END_USE_HELP);
  }

  nextStep() {
    this.next.emit();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
    if (stepper.selectedIndex === this.numSteps - 1) {
      this.seenEverything = true;
    }
  }
}
