import { DemosService } from './../../../service/demo-services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Demo } from 'src/app/interface/demo';
import { ExecutionSettings } from 'src/app/interface/execution-settings';
import { ExecutionSettingsService } from 'src/app/service/execution-settings.service';

@Component({
  selector: 'app-demo-settings',
  templateUrl: './demo-settings.component.html',
  styleUrls: ['./demo-settings.component.css']
})
export class DemoSettingsComponent implements OnInit {

  demoSettingsForm = new FormGroup({
    maxRuns: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
    allowQuestions: new FormControl(),
    maxQuestionSize: new FormControl('', [Validators.required, Validators.min(1), Validators.max(3)]),
    public: new FormControl()
  });

  settings: ExecutionSettings;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<DemoSettingsComponent>,
    private settingsService: ExecutionSettingsService) {

      const demo: Demo = data;
      this.settingsService.load(demo.settings);
      this.settingsService.getSelectedObject().subscribe(s => {

        if (s) {
          this.settings = s;
          this.demoSettingsForm.controls.maxRuns.setValue(this.settings.maxRuns);
          this.demoSettingsForm.controls.allowQuestions.setValue(this.settings.allowQuestions);
          this.demoSettingsForm.controls.maxQuestionSize.setValue(this.settings.maxQuestionSize.toString());
          this.demoSettingsForm.controls.public.setValue(this.settings.public);
        }
      });

    }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit(): void {

  }

  onSave() {
    console.log('save demo settings');
    this.settings.maxRuns = this.demoSettingsForm.controls.maxRuns.value;
    this.settings.allowQuestions = this.demoSettingsForm.controls.allowQuestions.value;
    this.settings.maxQuestionSize = +this.demoSettingsForm.controls.maxQuestionSize.value;
    this.settings.public = this.demoSettingsForm.controls.public.value;

    this.settingsService.saveObject(this.settings);

    this.bottomSheetRef.dismiss();
  }

}
