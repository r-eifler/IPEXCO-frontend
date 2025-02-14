import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { PlanPropertyPanelComponent } from 'src/app/shared/components/plan-property-panel/plan-property-panel.component';
import { selectIterativePlanningProject, selectIterativePlanningPropertiesList, selectIterativePlanningSelectedStep } from '../../state/iterative-planning.selector';
import { Demo } from 'src/app/shared/domain/demo';


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
