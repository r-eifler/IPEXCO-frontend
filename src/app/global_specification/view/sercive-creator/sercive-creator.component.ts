import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { Encoding, Service } from '../../domain/services';

@Component({
  selector: 'app-sercive-creator',
  imports: [
    DialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './sercive-creator.component.html',
  styleUrl: './sercive-creator.component.scss'
})
export class ServiceCreatorComponent {

  dialogRef = inject(MatDialogRef);
  data: {serviceType: string, domains: {_id: string, name: string}[]} = inject(MAT_DIALOG_DATA);

  encodings = [
    Encoding.DOMAIN_DEPENDENT,
    Encoding.PDDL_CLASSIC,
    Encoding.PDDL_NUMERIC
  ]

  fb = inject(FormBuilder);
  private urlRegex = /^http?:\/\/.+(:[0-9]{4,5})?.*$/;

  form = this.fb.group({
      name: this.fb.control(null, Validators.required),
      domainId: this.fb.control(null),
      url: this.fb.control(null, [Validators.required, Validators.pattern(this.urlRegex)]),
      encoding: this.fb.control(null, Validators.required),
  });

  onCancel(){
    this.dialogRef.close();
  }

  onCreate(){
    let service: Service = {
      name: this.form.controls.name.value,
      url: this.form.controls.url.value,
      encoding: this.form.controls.encoding.value,
      domainId: this.form.controls.domainId.value
    }
    this.dialogRef.close(service)
  }

}
