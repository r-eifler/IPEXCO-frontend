import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogModule} from '../../../shared/components/dialog/dialog.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Store} from '@ngrx/store';
import {DialogComponent} from '../../../shared/components/dialog/dialog/dialog.component';

@Component({
    selector: 'app-time-over-dialog',
    imports: [
        DialogModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './time-over-dialog.component.html',
    styleUrl: './time-over-dialog.component.scss'
})
export class TimeOverDialogComponent {

  store = inject(Store);
  data: any = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.disableClose = true;
  }

  onContinue(){
    this.dialogRef.close();
  }
}
