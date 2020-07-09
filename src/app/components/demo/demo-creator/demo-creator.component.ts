import {DemosService} from './../../../service/demo-services';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Demo} from 'src/app/interface/demo';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-demo-creator',
  templateUrl: './demo-creator.component.html',
  styleUrls: ['./demo-creator.component.css']
})
export class DemoCreatorComponent implements OnInit {

  public currentProjectId: string;
  private readonly demo: Demo;
  public readonly update: boolean;

  demoForm: FormGroup;

  imageFileName = '';
  imageFile;

  constructor(
    private demosService: DemosService,
    private userService: UserService,
    public dialogRef: MatDialogRef<DemoCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    console.log(data);
    this.currentProjectId = data.projectId;
    this.demo = data.demo;
    this.update = data.update;

    this.demoForm = new FormGroup({
      name: new FormControl(this.demo ? this.demo.name : ''),
      description: new FormControl(this.demo ? this.demo.description : ''),
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
    };

    if (this.update) {
      this.demosService.updateDemo(newDemo);
    } else {
      this.demosService.generateDemo(this.currentProjectId, newDemo);
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
