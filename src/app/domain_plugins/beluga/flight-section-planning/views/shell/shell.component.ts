import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

@Component({
  selector: 'app-shell-flight-section-planning',
  imports: [
    RouterOutlet
  ],
  providers: [
    provideTranslocoScope({
      scope: "flight_section_planning",
      alias: "f",
    }),
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

}
