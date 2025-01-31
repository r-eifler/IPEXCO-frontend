import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DomainSpecification } from '../../domain/domain_specification';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';

@Component({
  selector: 'app-domain-spec-creator',
  imports: [
        DialogModule,
        MatButtonModule,
        MatFormField,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
  ],
  templateUrl: './domain-spec-creator.component.html',
  styleUrl: './domain-spec-creator.component.scss'
})
export class DomainSpecCreatorComponent {

    dialogRef = inject(MatDialogRef);
  
    fb = inject(FormBuilder);
  
    form = this.fb.group({
        name: this.fb.control<string>(null, Validators.required),
    });
  
    onCancel(){
      this.dialogRef.close();
    }
  
    onCreate(){
      let spec: DomainSpecification = {
        name: this.form.controls.name.value,
        planPropertyTemplates: [],
        description: 'TODO'
      }
      this.dialogRef.close(spec)
    }

}
