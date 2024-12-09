import { Component, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './user-study-execution-shell.component.html',
  styleUrl: './user-study-execution-shell.component.scss'
})
export class UserStudyExecutionShellComponent {

}
