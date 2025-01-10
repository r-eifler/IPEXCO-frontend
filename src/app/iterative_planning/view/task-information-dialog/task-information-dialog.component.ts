import { Component, inject } from '@angular/core';
import { selectIterativePlanningProject, selectIterativePlanningPropertiesList, selectIterativePlanningSelectedStep } from '../../state/iterative-planning.selector';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Demo } from 'src/app/project/domain/demo';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { PlanPropertyPanelComponent } from 'src/app/shared/components/plan-property-panel/plan-property-panel.component';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-task-information-dialog',
  imports: [
    PageModule,
    BreadcrumbModule,
    AsyncPipe,
    MarkedPipe,
    PlanPropertyPanelComponent,
    DialogModule,
    MatButtonModule
  ],
  templateUrl: './task-information-dialog.component.html',
  styleUrl: './task-information-dialog.component.scss'
})
export class TaskInformationDialogComponent {

  host = window.location.protocol + "//" + window.location.host;

  store = inject(Store);
  dialogRef = inject(MatDialogRef<TaskInformationDialogComponent>);

  demo$ = this.store.select(selectIterativePlanningProject) as Observable<Demo>;
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  planProperties$ = this.store.select(selectIterativePlanningPropertiesList);

  onClose(){
    this.dialogRef.close();
  }
}
