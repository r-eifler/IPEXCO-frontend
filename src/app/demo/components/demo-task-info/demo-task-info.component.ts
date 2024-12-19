import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Demo } from "../../../project/domain/demo";
import { environment } from "../../../../environments/environment";
import { MarkedPipe } from "src/app/pipes/marked.pipe";
import { AsyncPipe } from "@angular/common";
import { MatLabel } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: "app-demo-task-info",
    imports: [
        MarkedPipe,
        AsyncPipe,
        MatTabsModule,
        MatCardModule,
    ],
    templateUrl: "./demo-task-info.component.html",
    styleUrls: ["./demo-task-info.component.css"]
})
export class DemoTaskInfoComponent implements OnInit {
  srcUrl = environment.srcURL;
  demo$: Observable<Demo>;

  // constructor(runningDemoService: RunningDemoService) {
  //   this.demo$ = runningDemoService.getSelectedObject()  as BehaviorSubject<Demo>;
  // }

  ngOnInit(): void {}
}
