import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Demo } from "../../../interface/demo";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-demo-task-info",
  templateUrl: "./demo-task-info.component.html",
  styleUrls: ["./demo-task-info.component.css"],
})
export class DemoTaskInfoComponent implements OnInit {
  srcUrl = environment.srcURL;
  demo$: Observable<Demo>;

  // constructor(runningDemoService: RunningDemoService) {
  //   this.demo$ = runningDemoService.getSelectedObject()  as BehaviorSubject<Demo>;
  // }

  ngOnInit(): void {}
}
