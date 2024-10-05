import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { DemoHelpDialogComponent } from 'src/app/components/demo/demo-help-dialog/demo-help-dialog.component';
import { loadProject } from '../../state/iterative-planning.actions';

@Component({
  selector: 'app-iterative-planning-base',
  templateUrl: './iterative-planning-base.component.html',
  styleUrl: './iterative-planning-base.component.scss'
})

export class IterativePlanningBaseComponent {

  constructor(
    store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {

    this.route.paramMap
      .pipe(
        tap((params) => console.log(params.get("projectid"))),
        tap((params: ParamMap) => store.dispatch(loadProject({id: params.get("projectid")}))),
        takeUntilDestroyed()
      ).subscribe();
  }

  showHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = {};

     this.dialog.open(DemoHelpDialogComponent, dialogConfig);
  }
}
