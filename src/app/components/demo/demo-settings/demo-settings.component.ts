import { Demo } from "src/app/interface/demo";
import { Component, Inject, OnInit } from "@angular/core";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GeneralSettings } from "src/app/project/domain/general-settings";
import { SettingsComponent } from "src/app/project/components/settings/settings.component";

@Component({
  selector: "app-demo-settings",
  standalone: true,
  imports: [
    SettingsComponent,
  ],
  templateUrl: "./demo-settings.component.html",
  styleUrls: ["./demo-settings.component.css"],
})
export class DemoSettingsComponent implements OnInit {

  name: string;
  settings: GeneralSettings;
  demo: Demo;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private demosService: DemosService
  ) {
    this.name = data.name;
    this.demo = data.demo;
    this.settings = { ...data.demo.settings };
    console.log(this.settings);
  }

  ngOnInit(): void {}

  onSave(settings: GeneralSettings) {
    console.log("Save Settings ...")
    this.demo.settings = settings;
    // this.demosService.saveObject(this.demo);
  }
}
