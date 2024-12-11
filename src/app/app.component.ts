import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'IPEXCO';
  editorOptions = { theme: 'vs-dark', language: 'javascript' };

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'questionmark',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/questionmark.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'no_map',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/no_map.svg')
    );
  }

}
