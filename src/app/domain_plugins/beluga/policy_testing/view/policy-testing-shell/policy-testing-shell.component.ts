import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

@Component({
  selector: 'app-builder-policy-testing-shell',
  imports: [
    RouterOutlet,
  ],
  providers: [
      provideTranslocoScope({
        scope: "flight_section_planning",
        alias: "f",
      }),
  ],
  templateUrl: './policy-testing-shell.component.html',
  styleUrl: './policy-testing-shell.component.scss'
})
export class PolicyTestingShellComponent {

}
