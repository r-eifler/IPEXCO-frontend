import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Demo } from "../../../interface/demo";
import {
  DemosService,
  RunningDemoService,
} from "../../../service/demo/demo-services";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { PLANNER_REDIRECT, QUESTION_REDIRECT } from "../../../app.tokens";
import { IterationStepsService } from "../../../service/planner-runs/iteration-steps.service";
import { PlannerService } from "../../../service/planner-runs/planner.service";
import { UserStudyPlannerService } from "../../../service/planner-runs/user-study-planner.service";
import { PlanPropertyMapService } from "../../../service/plan-properties/plan-property-services";
import { LogEvent, TimeLoggerService } from "../../../service/logger/time-logger.service";
import { NewIterationStepGenerationService } from "src/app/service/planner-runs/new-iteration-step-generation-service.service";
import { PlanningTaskRelaxationService } from "src/app/service/planning-task/planning-task-relaxations-services";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { DemoNewIterationStepGenerationService } from "src/app/service/planner-runs/demo-new-iteration-step-generation-service.service";

@Component({
  selector: "app-user-study-demo-view",
  templateUrl: "./user-study-demo-view.component.html",
  styleUrls: ["./user-study-demo-view.component.css"],
  providers: [
    { provide: IterationStepsService, useClass: IterationStepsService },
    { provide: PlannerService, useClass: UserStudyPlannerService },
    {
      provide: NewIterationStepGenerationService,
      useClass: DemoNewIterationStepGenerationService,
    },
    { provide: PLANNER_REDIRECT, useValue: "../" },
    { provide: QUESTION_REDIRECT, useValue: "../../../" },
  ],
})
export class UserStudyDemoViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<any> = new Subject();

  @Input() demoId: string;
  @Output() next = new EventEmitter<void>();

  step = 0;

  demo: Demo;

  constructor(
    private timeLogger: TimeLoggerService,
    private demosService: DemosService,
    private selectedDemoService: RunningDemoService,
    private propertiesService: PlanPropertyMapService,
    private relaxationService: PlanningTaskRelaxationService,
    private currentProjectService: CurrentProjectService,
    private iterationStepsService: IterationStepsService,
    private newIterationStepGenerationService: NewIterationStepGenerationService,
  ) {
  }

  ngOnInit(): void {
    console.log("USER STUDY DEMO VIEW");
    this.iterationStepsService.reset();

    this.demosService
      .getObject(this.demoId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((demo) => {
        if (demo) {

          this.timeLogger.log(LogEvent.START_DEMO, {demoId: demo._id});
          this.selectedDemoService.saveObject(demo);
          this.currentProjectService.saveObject(demo);
          this.propertiesService.findCollection([
            { param: "projectId", value: demo._id },
          ]);
          this.relaxationService.findCollection([
            { param: "projectId", value: demo._id },
          ]);

          this.newIterationStepGenerationService.createInitialStep();

          this.demo = demo;
        }
      });
  }

  nextInternalStep() {
    this.step++;
  }

  nextStep() {
    this.next.emit();
  }

  ngOnDestroy(): void {
    this.timeLogger.store();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
