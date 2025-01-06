import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { StepStatus } from 'src/app/iterative_planning/domain/iteration_step';
import { computeUtility } from 'src/app/iterative_planning/domain/plan';
import { selectIterativePlanningIterationSteps, selectIterativePlanningProject, selectIterativePlanningProperties } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { Demo, maxUtility } from 'src/app/project/domain/demo';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog/dialog.component';

@Component({
  selector: 'app-finish-demo-info-dialog',
  imports: [
    DialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './finish-demo-info-dialog.component.html',
  styleUrl: './finish-demo-info-dialog.component.scss'
})
export class FinishDemoInfoDialogComponent {

  store = inject(Store);
  dialogRef = inject(MatDialogRef<DialogComponent>);

  demo = toSignal(this.store.select(selectIterativePlanningProject)) as Signal<Demo>;
  planPropertiesMap = toSignal(this.store.select(selectIterativePlanningProperties));
  steps = toSignal(this.store.select(selectIterativePlanningIterationSteps));
  
  
  maxOverallUtility = computed(() => maxUtility(this.demo(), this.planPropertiesMap() ? Object.values(this.planPropertiesMap()) : null))

  currentMaxUtility = computed(() => {
    if(!this.steps() || this.steps().length === 0){
      return 0;
    } 
    const stepUtilities = this.steps()?.map(s => s.status !== StepStatus.solvable ? 0 : computeUtility(s.plan, this.planPropertiesMap()));
    return Math.max(...stepUtilities);
  })

  missingUtility = computed(() => {
    if(!this.maxOverallUtility()){
      return null;
    }
    if(!this.currentMaxUtility()){
      return this.maxOverallUtility();
    }
    return this.maxOverallUtility() - this.currentMaxUtility();
  })


  onClose(nextUserStudyStep: boolean){
    this.dialogRef.close(nextUserStudyStep);
  }

}
