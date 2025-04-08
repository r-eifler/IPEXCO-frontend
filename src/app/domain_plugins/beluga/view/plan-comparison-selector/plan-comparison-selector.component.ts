import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Plan } from 'src/app/planning/domain/plan';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';

@Component({
  selector: 'app-plan-comparison-selector',
  imports: [
    MatButtonModule,
    DialogModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './plan-comparison-selector.component.html',
  styleUrl: './plan-comparison-selector.component.scss'
})
export class PlanComparisonSelectorComponent {

  dialogRef = inject(MatDialogRef);
  data: {plans: Plan[]} = inject(MAT_DIALOG_DATA)

  fb = inject(FormBuilder);

  form = this.fb.group({
      reference: this.fb.control<string | null>(null, Validators.required),
      comparison: this.fb.control<string | null>(null, Validators.required),
  });

  onCancel(){
    this.dialogRef.close();
  }

  onCompare(){
    this.dialogRef.close([this.form.controls.reference.value, this.form.controls.comparison.value])
  }

}
