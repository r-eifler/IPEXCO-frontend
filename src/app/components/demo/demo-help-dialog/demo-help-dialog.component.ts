import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-demo-help-dialog',
  templateUrl: './demo-help-dialog.component.html',
  styleUrls: ['./demo-help-dialog.component.css']
})
export class DemoHelpDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DemoHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { }

  ngOnInit(): void {
  }

}
