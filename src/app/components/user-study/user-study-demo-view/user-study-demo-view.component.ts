import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Demo } from "../../../interface/demo";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PLANNER_REDIRECT, QUESTION_REDIRECT } from "../../../app.tokens";
import { IterationStepsService } from "../../../service/planner-runs/iteration-steps.service";
import { PlannerService } from "../../../service/planner-runs/planner.service";
import { LogEvent, TimeLoggerService } from "../../../service/logger/time-logger.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";



@Component({
  selector: "app-user-study-demo-view",
  templateUrl: "./user-study-demo-view.component.html",
  styleUrls: ["./user-study-demo-view.component.css"],
  providers: [
    { provide: PLANNER_REDIRECT, useValue: "../" },
    { provide: QUESTION_REDIRECT, useValue: "../../../" },
  ],
})
export class UserStudyDemoViewComponent implements OnInit {

  @Input() demoId: string;
  @Output() next = new EventEmitter<void>();

  step = 0;

  demo: Demo;

  constructor(
    private timeLogger: TimeLoggerService,
    // private demosService: DemosService,
    // private selectedDemoService: RunningDemoService,
  ) {
  }

  ngOnInit(): void {
    console.log("USER STUDY DEMO VIEW");

    // this.demosService
    //   .getObject(this.demoId)
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((demo) => {
    //     if (demo) {

    //       this.timeLogger.log(LogEvent.START_DEMO, {demoId: demo._id});
    //       this.selectedDemoService.saveObject(demo);
    //       // this.currentProjectService.saveObject(demo);
    //       // this.propertiesService.findCollection([
    //       //   { param: "projectId", value: demo._id },
    //       // ]);

    //       // this.newIterationStepGenerationService.createInitialStep();

    //       this.demo = demo;
    //     }
    //   });
  }

  nextInternalStep() {
    this.step++;
  }

  nextStep() {
    this.next.emit();
  }

}
