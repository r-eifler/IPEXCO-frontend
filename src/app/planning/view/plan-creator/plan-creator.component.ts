import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Service, ServiceType } from 'src/app/global_specification/domain/services';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { PlanBase } from '../../domain/plan';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';

@Component({
  selector: 'app-plan-creator',
  imports: [
        DialogModule,
        MatButtonModule,
        MatFormField,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
  ],
  templateUrl: './plan-creator.component.html',
  styleUrl: './plan-creator.component.scss'
})
export class PlanCreatorComponent {

  dialogRef = inject(MatDialogRef);
  data: {planners: Service[]} = inject(MAT_DIALOG_DATA);

  fb = inject(FormBuilder);
  form = this.fb.group({
      name: this.fb.control<string | null>(null, Validators.required),
      planner: this.fb.control<string | null>(null, Validators.required),
  });

  onCancel(){
    this.dialogRef.close();
  }

  onCreate(){
    let plan: PlanBase = {
      name: this.form.controls.name.value ?? 'TODO',
      planner: this.form.controls.planner.value ?? 'TODO',
      project: '',
      status: PlanRunStatus.PENDING
    }
    this.dialogRef.close(plan)
  }

}
