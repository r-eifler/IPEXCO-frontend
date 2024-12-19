import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Demo } from "../../../project/domain/demo";
import { PlanProperty } from "../../../shared/domain/plan-property/plan-property";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RunStatus } from "src/app/iterative_planning/domain/run";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
    selector: "app-demo-info",
    imports: [
        MatIconModule,
        MatListModule,
        MatTabsModule,
    ],
    templateUrl: "./demo-info.component.html",
    styleUrls: ["./demo-info.component.css"]
})
export class DemoInfoComponent implements OnInit, AfterViewInit {

  runStatus = RunStatus;
  demo: Demo;
  mugs: string[][];
  planProperties: PlanProperty[];

  constructor(
    public dialogRef: MatDialogRef<DemoInfoComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.demo = data.demo;
    this.mugs = data.demo.data?.MUGS;
    this.mugs.sort((a, b) => a.length - b.length);
    // this.propertiesService.findCollection([
    //   { param: "projectId", value: this.demo._id },
    // ]);
  }

  ngOnInit(): void {
    // this.propertiesService
    //   .getMap()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((props) => {
    //     const propsList = [...props.values()];
    //     this.planProperties = propsList.filter((p: PlanProperty) => p.isUsed);
    //   });
  }


  downloadDemoData() {
    const jsonDemoData = "" // TODO JSON.stringify(this.demo.data);
    const jsonMaxUtilityData = JSON.stringify(this.demo.maxUtility);
    const file = new Blob([jsonDemoData, "\n\n", jsonMaxUtilityData], {
      type: "plain/json",
    });
    const a: any = document.getElementById("demo_download");
    a.href = URL.createObjectURL(file);
    a.download = "demo.json";
  }

  ngAfterViewInit(): void {
    this.downloadDemoData();
  }
}
