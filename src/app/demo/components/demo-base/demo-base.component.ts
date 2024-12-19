import { LogEvent } from '../../../user_study/service/time-logger.service';
import {
  DEMO_FINISHED_REDIRECT,
  QUESTION_REDIRECT,
} from "../../../app.tokens";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { PLANNER_REDIRECT } from "src/app/app.tokens";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Demo } from "../../../project/domain/demo";
import { Subject } from "rxjs";
import { TimeLoggerService } from "../../../user_study/service/time-logger.service";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DemoNavigatorComponent } from '../demo-navigator/demo-navigator.component';
import { DemoTaskIntroComponent } from '../demo-task-intro/demo-task-intro.component';
import { DemoHelpComponent } from '../demo-help/demo-help.component';

@Component({
    selector: "app-demo-base",
    imports: [
        DemoNavigatorComponent,
        DemoTaskIntroComponent,
        DemoHelpComponent,
    ],
    templateUrl: "./demo-base.component.html",
    styleUrls: ["./demo-base.component.scss"],
    providers: [
        { provide: PLANNER_REDIRECT, useValue: "../" },
        { provide: QUESTION_REDIRECT, useValue: "../../../" },
        { provide: DEMO_FINISHED_REDIRECT, useValue: "/demos" },
    ]
})
export class DemoBaseComponent implements OnInit, OnDestroy {

  // Steps are help, task info and then the demo itself.
  step = 2;

  constructor(
    private timeLogger: TimeLoggerService,
    // private demosService: DemosService,
    // private runningDemoService: RunningDemoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.iterationStepsService.reset();

    // this.route.params.subscribe((params) => {
    //   this.demosService
    //     .getObject(params.demoid)
    //     .pipe(takeUntilDestroyed())
    //     .subscribe((demo: Demo) => {
    //       if (demo) {
    //         this.timeLogger.log(LogEvent.START_DEMO, {demoId:  demo._id});
    //         this.runningDemoService.saveObject(demo);
    //         this.currentProjectService.saveObject(demo);
    //         this.propertiesService.findCollection([{ param: "projectId", value: demo._id },]);
    //         this.startDemo()
    //       }
    //     });
    // });
  }

  ngOnInit(): void {}

  startDemo(){
    console.log("start demo ....");
    // this.newIterationStepGenerationService.createInitialStep();
  }

  ngOnDestroy(): void {
    // this.iterationStepsService.reset();
  }

  async toDemoCollection() {
    this.timeLogger.reset();
    await this.router.navigate(["/demos"], { relativeTo: this.route });
  }

  nextStep() {
    this.step++;
  }
}
