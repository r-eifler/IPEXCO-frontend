import { DemosService } from './../../../service/demo-services';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/interface/project';
import { Demo } from 'src/app/interface/demo';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-demo-creator',
  templateUrl: './demo-creator.component.html',
  styleUrls: ['./demo-creator.component.css']
})
export class DemoCreatorComponent implements OnInit {

  public currentProject: Project;

  demoForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    maxRuns: new FormControl(10),
    maxQuestionSize: new FormControl('1'),
    public: new FormControl(false),
  });

  constructor(
    private demosService: DemosService,
    public dialogRef: MatDialogRef<DemoCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.currentProject = data.project;
  }

  ngOnInit(): void {
  }


  createDemo(): void {
    const newDemo: Demo = {
      name: this.demoForm.controls.name.value,
      summaryImage: 'none',
      introduction: this.demoForm.controls.description.value,
      project: this.currentProject._id,
      maxRuns: this.demoForm.controls.maxRuns.value,
      maxQuestionSize: Number.parseInt(this.demoForm.controls.maxQuestionSize.value, 10),
      public: this.demoForm.controls.public.value,
    };
    console.log('Create new Demo: ' + newDemo.name);
    this.demosService.saveObject(newDemo);

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
