import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'EXPLORE';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  ngOnInit(): void {
  }


}
