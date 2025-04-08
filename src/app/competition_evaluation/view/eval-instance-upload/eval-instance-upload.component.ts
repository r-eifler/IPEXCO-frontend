import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EvaluationInstanceBase } from '../../domain/evaluation_instance';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { jsonValidator } from 'src/app/validators/json.validator';

@Component({
  selector: 'app-eval-instance-upload',
  imports: [
    DialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './eval-instance-upload.component.html',
  styleUrl: './eval-instance-upload.component.scss'
})
export class EvalInstanceUploadComponent {

  dialogRef = inject(MatDialogRef);
  
  fb = inject(FormBuilder);

  form = this.fb.group({
      name: this.fb.control<string | null>(null, Validators.required),
      model: this.fb.control<string | null>(null, [Validators.required,jsonValidator]),
      actions: this.fb.control<string | null>(null, [Validators.required,jsonValidator]),
      question: this.fb.control<string | null>(null, [Validators.required]),
      explanation: this.fb.control<string | null>(null, [Validators.required]),
  });

  onCancel(){
    this.dialogRef.close();
  }

  onCreate(){
    let instance: EvaluationInstanceBase = {
      name: this.form.controls.name.value ?? 'TODO',
      model: JSON.parse(this.form.controls.model.value ?? '{}') ,
      actions: JSON.parse(this.form.controls.actions.value ?? '[]'),
      question: this.form.controls.question.value ?? 'TODO',
      explanation: this.form.controls.explanation.value ?? 'TODO',
    }
    this.dialogRef.close(instance)
  }
}
