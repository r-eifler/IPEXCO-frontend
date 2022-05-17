import { ExecutionSettingsServiceService } from 'src/app/service/settings/ExecutionSettingsService.service';
import { ExecutionSettings } from 'src/app/interface/settings/execution-settings';
import { filter, takeUntil } from "rxjs/operators";
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { Observable, Subject } from "rxjs";
import { MatStepper } from "@angular/material/stepper";
import { TimeLoggerService } from "../../../service/logger/time-logger.service";

@Component({
  selector: "app-demo-help",
  templateUrl: "./demo-help.component.html",
  styleUrls: ["./demo-help.component.css"],
})
export class DemoHelpComponent implements OnInit, OnDestroy {
  private loggerId: number;

  isMobile: boolean;
  canUseQuestions = false;
  numSteps = 0;
  seenEverything = false;

  private ngUnsubscribe$: Subject<any> = new Subject();
  settings$: Observable<ExecutionSettings>;

  @Output() next = new EventEmitter<void>();

  constructor(
    private timeLogger: TimeLoggerService,
    private settingsService: ExecutionSettingsServiceService,
    private responsiveService: ResponsiveService
  ) {
    this.settings$ = this.settingsService.getSelectedObject();
    console.log("DEMO HELP");
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register("demo-help");

    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();

    this.settings$
      .pipe(
        filter(s => !!s),
        takeUntil(this.ngUnsubscribe$)
        ).subscribe((settings) => {
          console.log(settings);
          this.canUseQuestions = settings.allowQuestions;
          this.numSteps = settings.allowQuestions ? 4 : 2;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.timeLogger.deregister(this.loggerId);
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
