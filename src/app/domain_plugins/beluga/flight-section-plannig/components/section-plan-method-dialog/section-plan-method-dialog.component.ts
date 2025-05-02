import { Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { Flight } from '../../../shared/domain/beluga_problem';
import { FlightSection } from '../../domain/flight-section';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { PlanMethodType } from '../../domain/plan_method';
import { Service } from 'src/app/global_specification/domain/services';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, MinValidator, MaxValidator, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section-plan-method-dialog',
  imports: [
    DialogModule,
    MatButtonModule,
    TranslocoModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './section-plan-method-dialog.component.html',
  styleUrl: './section-plan-method-dialog.component.scss'
})
export class SectionPlanMethodDialogComponent {

  readonly types = PlanMethodType;

  readonly dialogRef = inject(MatDialogRef<SectionPlanMethodDialogComponent>);
  readonly data = inject<{maxNumFlights: number, planners: Service[]}>(MAT_DIALOG_DATA);

  planners  = this.data.planners;
  maxNumFlights = this.data.maxNumFlights;

  selectedMethodType: WritableSignal<PlanMethodType | null> = signal(null); 
  selectedPlanner: WritableSignal<Service | null> = signal(null); 
  numOptimizedFlights = 1;

  finished = computed(() => this.selectedMethodType() !== null && ( this.selectedMethodType() === PlanMethodType.MANUAL || this.selectedPlanner() !== null))

  onAutomatic(){
    this.selectedMethodType.set(PlanMethodType.AUTOMATIC_SEARCH_PLANNER);
  }

  onManual(){
    this.selectedMethodType.set(PlanMethodType.MANUAL);
  }

  onSelectPlanner(planner: Service){
    this.selectedPlanner.set(planner)
  }

  onStart(){
    this.dialogRef.close({
      method: {
        name: this.selectedMethodType() === PlanMethodType.MANUAL  ? 'Human Planner' : this.selectedPlanner()?.name,
        type: this.selectedMethodType(),
        serviceId: this.selectedMethodType() !== PlanMethodType.MANUAL ? this.selectedPlanner()?._id : undefined
      },
      numFlights: this.numOptimizedFlights
    })
  }

  onCancel(){
    this.dialogRef.close()
  }

}
