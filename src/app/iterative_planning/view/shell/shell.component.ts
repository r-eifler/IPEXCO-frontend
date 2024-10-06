import { Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { CreateIterationComponent } from '../create-iteration/create-iteration.component';
import { Store } from '@ngrx/store';
import { selectIterativePlanningNewStep } from '../../state/iterative-planning.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, CreateIterationComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private store = inject(Store);

  sidenav = viewChild.required<MatSidenav>('sidenav');

  constructor() {
    this.store.select(selectIterativePlanningNewStep).pipe(
      takeUntilDestroyed(),
    ).subscribe(step => step ? this.sidenav().open() : this.sidenav().close());
  }
}
