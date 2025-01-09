import { Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CreateIterationComponent } from '../create-iteration/create-iteration.component';
import {MatDialog} from '@angular/material/dialog';
import { selectIterativePlanningCreateStepInterfaceOpen } from '../../state/iterative-planning.selector';


@Component({
    selector: 'app-shell',
    imports: [RouterOutlet, MatSidenavModule, MatButtonModule, CreateIterationComponent],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  sidenav = viewChild<MatSidenav>('sidenav');

  constructor() {
    this.store.select(selectIterativePlanningCreateStepInterfaceOpen).pipe(
      takeUntilDestroyed(),
    ).subscribe(open => open ? this.sidenav()?.open() : this.sidenav()?.close());
  }
}
