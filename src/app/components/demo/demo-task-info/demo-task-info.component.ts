import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Demo } from "../../../interface/demo";
import { TaskSchema } from "../../../interface/task-schema";
import { PlanProperty } from "../../../interface/plan-property/plan-property";
import { ExecutionSettings } from "../../../interface/settings/execution-settings";
import { RunningDemoService } from "../../../service/demo/demo-services";
import { PlanPropertyMapService } from "../../../service/plan-properties/plan-property-services";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-demo-task-info",
  templateUrl: "./demo-task-info.component.html",
  styleUrls: ["./demo-task-info.component.css"],
})
export class DemoTaskInfoComponent implements OnInit {
  srcUrl = environment.srcURL;
  demo$: Observable<Demo>;

  constructor(runningDemoService: RunningDemoService) {
    this.demo$ = runningDemoService.getSelectedObject();
  }

  ngOnInit(): void {}
}
