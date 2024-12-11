import { Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  selectIterativePlanningIsDemo,
  selectIterativePlanningNewStep,
  selectIterativePlanningProject
} from '../../state/iterative-planning.selector';
import { CreateIterationComponent } from '../create-iteration/create-iteration.component';
import {combineLatest} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {TimeOverDialogComponent} from '../../components/time-over-dialog/time-over-dialog.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, CreateIterationComponent ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  sidenav = viewChild<MatSidenav>('sidenav');
  project$ = this.store.select(selectIterativePlanningProject);
  isDemo$ = this.store.select(selectIterativePlanningIsDemo)

  constructor() {
    this.store.select(selectIterativePlanningNewStep).pipe(
      takeUntilDestroyed(),
    ).subscribe(step => step ? this.sidenav()?.open() : this.sidenav()?.close());

   combineLatest([this.isDemo$, this.project$]).pipe(
     takeUntilDestroyed(),
     filter(([_, project]) => !!project)
   ).subscribe(
     ([isDemo, project]) => {
        if(isDemo && project.settings.useTimer){
          console.log('set timeout: ' + (project.settings.maxTime * 1000))
          setTimeout(() => {
            this.dialog.open(TimeOverDialogComponent)
          }, project.settings.maxTime * 1000)
        }
     }
   );
  }
}
