import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthenticationService} from './service/authentication/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'XPP IPL';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  constructor(
    private userService: AuthenticationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'questionmark',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/questionmark.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'no_map',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/no_map.svg')
    );
  }

  ngOnInit(): void {
    this.userService.loadUser();
  }


}
