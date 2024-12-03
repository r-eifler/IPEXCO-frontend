import { Component, EventEmitter, OnDestroy, Output } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { LogEvent, TimeLoggerService } from "../../../user_study/service/time-logger.service";
import { GeneralSettings } from "src/app/project/domain/general-settings";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-demo-help",
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatStepperModule,
    MatListModule,
  ],
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
  ) {
    // this.settings$ = currentProjectService.getSelectedObject().pipe(
    //   filter(p => !!p),
    //   map(p => p.settings)
    // );
    console.log("DEMO HELP");

    this.timeLogger.log(LogEvent.START_USE_HELP);

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
