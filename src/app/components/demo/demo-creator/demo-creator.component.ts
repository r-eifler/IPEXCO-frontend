import {DemosService} from '../../../service/demo/demo-services';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Demo} from 'src/app/interface/demo';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../../service/authentication/authentication.service';

@Component({
  selector: 'app-demo-creator',
  templateUrl: './demo-creator.component.html',
  styleUrls: ['./demo-creator.component.css']
})
export class DemoCreatorComponent implements OnInit {

  public currentProjectId: string;
  private readonly demo: Demo;
  public readonly update: boolean;

  taskInfo: string;
  maxUtilityData: string;
  demoData: string;

  precomputedData = false;

  demoForm: FormGroup;

  imageFileName = '';
  imageFile;

  constructor(
    private demosService: DemosService,
    private userService: AuthenticationService,
    public dialogRef: MatDialogRef<DemoCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    // console.log(data);
    this.currentProjectId = data.projectId;
    this.demo = data.demo;
    this.update = data.update;

    this.taskInfo = this.demo ? this.demo.taskInfo : '';
    this.demoData = this.demo ? this.demo.data.toString() : '';
    this.maxUtilityData = this.demo ? this.demo.maxUtility.toString() : '';

    this.demoForm = new FormGroup({
      name: new FormControl(this.demo ? this.demo.name : ''),
      description: new FormControl(this.demo ? this.demo.description : ''),
      taskInfo: new FormControl(this.demo ? this.demo.taskInfo : ''),
      precomputeToggle: new FormControl(),
      demoData: new FormControl(this.demo ? this.demo.data : ''),
      maxUtilityData: new FormControl(this.demo ? this.demo.maxUtility : ''),
    });
  }

  ngOnInit(): void {
  }


  createOrUpdateDemo(): void {

    const newDemo: Demo = {
      _id: this.demo ? this.demo._id : null,
      name: this.demoForm.controls.name.value,
      summaryImage: this.imageFile,
      description: this.demoForm.controls.description.value ? this.demoForm.controls.description.value : '',
      taskInfo: this.demoForm.controls.taskInfo.value ? this.demoForm.controls.taskInfo.value : '',
      public: false,
    };

    if (this.update) {
      this.demosService.updateDemo(newDemo);
    } else {
      if (this.precomputedData) {
        this.demosService.addPrecomputedDemo(this.currentProjectId, newDemo, this.demoData, this.maxUtilityData);
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
