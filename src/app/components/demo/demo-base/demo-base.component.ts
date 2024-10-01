import { LogEvent } from './../../../service/logger/time-logger.service';
import { CurrentProjectService } from "src/app/service/project/project-services";
import {
  DEMO_FINISHED_REDIRECT,
  QUESTION_REDIRECT,
} from "./../../../app.tokens";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { PLANNER_REDIRECT } from "src/app/app.tokens";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Demo } from "../../../interface/demo";
import {
  DemosService,
  RunningDemoService,
} from "../../../service/demo/demo-services";
import { Subject } from "rxjs";
import { PlanPropertyMapService } from "../../../service/plan-properties/plan-property-services";
import { TimeLoggerService } from "../../../service/logger/time-logger.service";

@Component({
  selector: "app-demo-base",
  templateUrl: "./demo-base.component.html",
  styleUrls: ["./demo-base.component.scss"],
  providers: [
    { provide: PLANNER_REDIRECT, useValue: "../" },
    { provide: QUESTION_REDIRECT, useValue: "../../../" },
    { provide: DEMO_FINISHED_REDIRECT, useValue: "/demos" },
  ],
})
export class DemoBaseComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  // Steps are help, task info and then the demo itself.
  step = 2;

  constructor(
    private timeLogger: TimeLoggerService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private propertiesService: PlanPropertyMapService,
    private currentProjectService: CurrentProjectService,
    private iterationStepsService: IterationStepsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.iterationStepsService.reset();

    this.route.params.subscribe((params) => {
      this.demosService
        .getObject(params.demoid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((demo: Demo) => {
          if (demo) {
            this.timeLogger.log(LogEvent.START_DEMO, {demoId:  demo._id});
            this.runningDemoService.saveObject(demo);
            this.currentProjectService.saveObject(demo);
            this.propertiesService.findCollection([{ param: "projectId", value: demo._id },]);
            this.startDemo()
          }
        });
    });
  }

  ngOnInit(): void {}

  startDemo(){
    console.log("start demo ....");
    // this.newIterationStepGenerationService.createInitialStep();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.iterationStepsService.reset();
  }

  async toDemoCollection() {
    this.timeLogger.reset();
    await this.router.navigate(["/demos"], { relativeTo: this.route });
  }

  nextStep() {
    this.step++;
  }
}
