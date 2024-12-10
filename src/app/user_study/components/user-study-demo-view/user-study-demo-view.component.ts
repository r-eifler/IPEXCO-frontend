import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Demo } from "../../../demo/domain/demo";
import { PLANNER_REDIRECT, QUESTION_REDIRECT } from "../../../app.tokens";
import { LogEvent, TimeLoggerService } from "../../service/time-logger.service";
import { DemoNavigatorComponent } from "../../../demo/components/demo-navigator/demo-navigator.component";
import { DemoTaskIntroComponent } from "../../../demo/components/demo-task-intro/demo-task-intro.component";
import { DemoHelpComponent } from "../../../demo/components/demo-help/demo-help.component";




@Component({
  selector: "app-user-study-demo-view",
  standalone: true,
  imports: [
    DemoNavigatorComponent,
    DemoTaskIntroComponent,
    DemoHelpComponent,
  ],
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
