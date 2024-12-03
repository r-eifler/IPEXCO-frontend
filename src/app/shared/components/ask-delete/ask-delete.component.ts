import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface AskDeleteDialogData {
  name: string;
  text: string;
}

@Component({
  selector: 'app-ask-delete',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './ask-delete.component.html',
  styleUrl: './ask-delete.component.scss'
})
export class AskDeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<AskDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AskDeleteDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
