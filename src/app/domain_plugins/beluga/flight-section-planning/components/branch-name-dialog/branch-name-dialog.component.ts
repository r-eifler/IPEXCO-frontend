import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';

@Component({
  selector: 'app-branch-name-dialog',
  imports: [
    DialogModule,
    MatButtonModule,
    TranslocoModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './branch-name-dialog.component.html',
  styleUrl: './branch-name-dialog.component.scss'
})
export class BranchNameDialogComponent {

  readonly dialogRef = inject(MatDialogRef<BranchNameDialogComponent>);

  name: WritableSignal<string | null> = signal(null);

  nameSet = computed(() => this.name() != null)

  onStart(){
    this.dialogRef.close({
      name: this.name()
    })
  }

  onCancel(){
    this.dialogRef.close()
  }

}
