import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { Service } from 'src/app/global_specification/domain/services';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { PlanMethodType } from '../../domain/plan_method';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-section-plan-method-dialog',
  imports: [
    DialogModule,
    MatButtonModule,
    TranslocoModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './section-plan-method-dialog.component.html',
  styleUrl: './section-plan-method-dialog.component.scss'
})
export class SectionPlanMethodDialogComponent {

	fb = inject(FormBuilder)

	readonly types = PlanMethodType;

	readonly dialogRef = inject(MatDialogRef<SectionPlanMethodDialogComponent>);
	readonly data = inject<{planners: Service[]}>(MAT_DIALOG_DATA);

	planners  = this.data.planners;

	onStart(service: Service){
		this.dialogRef.close({
		method: {
			name: service.name,
			type: PlanMethodType.AUTOMATIC_SEARCH_PLANNER,
			serviceId: service._id ,
		}
		})
	}

	onCancel(){
		this.dialogRef.close()
	}

}
