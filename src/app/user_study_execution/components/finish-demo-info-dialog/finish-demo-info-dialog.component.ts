import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { StepStatus } from 'src/app/iterative_planning/domain/iteration_step';
import { computeUtility } from 'src/app/iterative_planning/domain/plan';
import { selectIterativePlanningIterationSteps, selectIterativePlanningProject, selectIterativePlanningProperties } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog/dialog.component';
import { computeMaxPossibleUtility, Demo } from 'src/app/shared/domain/demo';

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

  demo = toSignal(this.store.select(selectIterativePlanningProject));
  planPropertiesMap = toSignal(this.store.select(selectIterativePlanningProperties)) ;
  planPropertiesList = computed(() => {
    const propMap =  this.planPropertiesMap();
    return propMap !== undefined ? 
    Object.values(propMap) : 
    undefined
  });
  steps = toSignal(this.store.select(selectIterativePlanningIterationSteps));
  
  
  maxOverallUtility = computed(() => {
    const demo  = this.demo();
    const properties = this.planPropertiesList();
    return demo !== undefined && properties ?
    computeMaxPossibleUtility(demo as Demo, properties) :
    0
})

  currentMaxUtility = computed(() => {

    const steps = this.steps();
    const properties = this.planPropertiesMap();

    if(steps === undefined || properties == undefined || steps.length === 0){
      return 0
    }
 
    const stepUtilities = steps.map(s => 
      s.status !== StepStatus.solvable || s.plan === undefined || s.plan === null ? 
      0 : 
      computeUtility(s.plan, properties)
    );
    return Math.max(...stepUtilities);
  })

  missingUtility = computed(() => {
    const maxOverallUtility = this.currentMaxUtility();
    const currentMaxUtility = this.currentMaxUtility();

    if(maxOverallUtility === undefined){
      return undefined;
    }
    if(currentMaxUtility == undefined){
      return maxOverallUtility;
    }
    return maxOverallUtility - currentMaxUtility;
  })


  onClose(nextUserStudyStep: boolean){
    this.dialogRef.close(nextUserStudyStep);
  }

}
