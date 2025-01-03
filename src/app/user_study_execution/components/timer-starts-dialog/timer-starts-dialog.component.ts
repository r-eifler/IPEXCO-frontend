
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog/dialog.component';

@Component({
  selector: 'app-timer-starts-dialog',
  imports: [
    DialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './timer-starts-dialog.component.html',
  styleUrl: './timer-starts-dialog.component.scss'
})
export class TimerStartsDialogComponent {

  store = inject(Store);
  data: {timeout: number} = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.disableClose = true;
    console.log("New timer start Dialog!")
  }

  onContinue(){
    console.log("Close timer start Dialog!")
    this.dialogRef.close();
  }

}
