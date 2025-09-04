import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { uniqueValidation } from 'src/app/validators/unique.validator';



@Component({
  selector: 'app-branch-name-dialog',
  imports: [
    DialogModule,
    MatButtonModule,
    TranslocoModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './branch-name-dialog.component.html',
  styleUrl: './branch-name-dialog.component.scss'
})
export class BranchNameDialogComponent {

  readonly dialogRef = inject(MatDialogRef<BranchNameDialogComponent>);
  fb = inject(FormBuilder);

  data = inject<{existingBranchNames: string[]}>(MAT_DIALOG_DATA);

  control = this.fb.control('', [Validators.required, uniqueValidation(this.data.existingBranchNames)])

  onStart(){
    this.dialogRef.close({
      name: this.control.value
    })
  }

  onCancel(){
    this.dialogRef.close()
  }

}
