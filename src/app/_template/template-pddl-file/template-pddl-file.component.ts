import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-template-pddl-file',
  templateUrl: './template-pddl-file.component.html',
  styleUrls: ['./template-pddl-file.component.css']
})
export class TemplatePddlFileComponent implements OnInit {

  selectedFile;
  files$: any;

  constructor() { }

  ngOnInit(): void {
  }

  setFileChanged(file) {
    this.selectedFile = file;
    console.log('File changed');
  }

  navigateToFile($event: any) {
    console.log('Naviagte to file');
  }
}
