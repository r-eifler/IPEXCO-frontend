import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-explanation-process',
  templateUrl: './explanation-process.component.html',
  styleUrls: ['./explanation-process.component.css']
})
export class ExplanationProcessComponent implements OnInit, AfterViewInit {

  constructor() { }

  title = 'EXPLORE-CLI';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  @ViewChild('stepper') stepper: MatStepper;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log( this.stepper.selectedIndex);
    this.stepper.selectedIndex = 2;
  }

}
