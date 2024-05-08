import { PlanPropertyMapService } from './../../../service/plan-properties/plan-property-services';
import { defaultGeneralSetting } from '../../../interface/settings/general-settings';
import { DemosService } from "../../../service/demo/demo-services";
import { Component, Inject, OnInit } from "@angular/core";
import { Demo } from "src/app/interface/demo";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { environment } from 'src/environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "app-demo-creator",
  templateUrl: "./demo-creator.component.html",
  styleUrls: ["./demo-creator.component.scss"],
})
export class DemoCreatorComponent implements OnInit {
  public currentProjectId: string;
  public readonly demo: Demo;
  public readonly update: boolean;

  srcUrl = environment.srcURL;

  taskInfo: string;
  maxUtilityData: string;
  demoData: string;

  precomputedData = false;

  demoForm: UntypedFormGroup;

  imageFileName = "";
  imageFile;
  imageSelected = false;

  constructor(
    private demosService: DemosService,
    private userService: AuthenticationService,
    private planPropertiesService: PlanPropertyMapService,
    public dialogRef: MatDialogRef<DemoCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.currentProjectId = data.projectId;
    this.demo = data.demo;
    this.update = data.update;

    this.taskInfo = this.demo ? this.demo.taskInfo : "";
    this.demoData = this.demo ? JSON.stringify(this.demo.explanations) : "";
    this.maxUtilityData = this.demo && this.demo.maxUtility ? this.demo.maxUtility.toString() : "";

    this.demoForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.demo ? this.demo.name : ""),
      description: new UntypedFormControl(this.demo ? this.demo.description : ""),
      taskInfo: new UntypedFormControl(this.demo ? this.demo.taskInfo : ""),
      precomputeToggle: new UntypedFormControl(),
      demoData: new UntypedFormControl(this.demo ? JSON.stringify(this.demo.explanations) : ""),
      maxUtilityData: new UntypedFormControl(this.demo ? this.demo.maxUtility : ""),
    });

    if (this.update)
      planPropertiesService.findCollection([{ param: "projectId", value: this.demo._id }]);
  }

  ngOnInit(): void {}

  createOrUpdateDemo(): void {
    const newDemo: Demo = {
      _id: this.demo ? this.demo._id : null,
      updated: new Date().toLocaleString(),
      name: this.demoForm.controls.name.value,
      summaryImage: this.imageFile,
      description: this.demoForm.controls.description.value
        ? this.demoForm.controls.description.value
        : "TODO",
      taskInfo: this.demoForm.controls.taskInfo.value
        ? this.demoForm.controls.taskInfo.value
        : "TODO",
      public: false,
      completion: this.demo ? this.demo.completion : 0.0,
      explanations: this.demo ? this.demo.explanations : [],
      settings: this.demo ? this.demo.settings : defaultGeneralSetting
    };

    if (this.update) {
      this.demosService.updateDemo(newDemo, this.imageSelected);
    } else {
      if (this.precomputedData) {
        this.demosService.addPrecomputedDemo(
          this.currentProjectId,
          newDemo,
          this.demoData,
          this.maxUtilityData
        );
      } else {
        this.demosService.generateDemo(this.currentProjectId, newDemo);
      }
    }

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

  onFileChanged(event) {
    this.imageFile = event.target.files[0];
    this.imageFileName = this.imageFile.name;
  }
}
