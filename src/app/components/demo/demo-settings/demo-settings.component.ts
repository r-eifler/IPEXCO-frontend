import { DemosService } from "src/app/service/demo/demo-services";
import { Demo } from "src/app/interface/demo";
import {
  CurrentProjectService,
  ProjectsService,
} from "src/app/service/project/project-services";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { ExecutionSettings } from "src/app/interface/settings/execution-settings";
import { Subject } from "rxjs";

@Component({
  selector: "app-demo-settings",
  templateUrl: "./demo-settings.component.html",
  styleUrls: ["./demo-settings.component.css"],
})
export class DemoSettingsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  name: string;
  settings: ExecutionSettings;
  demo: Demo;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<DemoSettingsComponent>,
    private demosService: DemosService
  ) {
    this.name = data.name;
    this.demo = data.demo;
    this.settings = { ...data.demo.settings };
    console.log(this.settings);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave(settings: ExecutionSettings) {
    this.demo.settings = settings;
    this.demosService.saveObject(this.demo);
    this.bottomSheetRef.dismiss();
  }
}
