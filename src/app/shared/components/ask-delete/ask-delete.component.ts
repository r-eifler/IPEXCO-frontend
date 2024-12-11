import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogModule } from '../dialog/dialog.module';

export interface AskDeleteDialogData {
  name: string;
  text: string;
  buttonAgree?: string;
  buttonDisagree?: string
}

@Component({
  selector: 'app-ask-delete',
  standalone: true,
  imports: [
    MatButtonModule,
    DialogModule,
  ],
  templateUrl: './ask-delete.component.html',
  styleUrl: './ask-delete.component.scss'
})
export class AskDeleteComponent {

  buttonAgree = 'Delete';
  buttonDisagree =  'Cancel';

  constructor(
    public dialogRef: MatDialogRef<AskDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AskDeleteDialogData,
  ) {
    if(data.buttonAgree){
      this.buttonAgree = data.buttonAgree;
    }
    if(data.buttonDisagree){
      this.buttonDisagree = data.buttonDisagree;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }

}
