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
  });

  imageFileName = '';
  imageFile;

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
    console.log(this.imageFile);

    const newDemo: Demo = {
      name: this.demoForm.controls.name.value,
      summaryImage: this.imageFile,
      introduction: this.demoForm.controls.description.value,
      project: this.currentProject._id
    };
    console.log('Create new Demo: ' + newDemo.name);
    this.demosService.generateDemo(newDemo);

    // this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

  onFileChanged(event) {
    this.imageFile = event.target.files[0];
    this.imageFileName = this.imageFile.name;
  }

}
