import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'EXPLORE';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'questionmark',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/questionmark.svg')
    );
  }

  ngOnInit(): void {
  }


}
