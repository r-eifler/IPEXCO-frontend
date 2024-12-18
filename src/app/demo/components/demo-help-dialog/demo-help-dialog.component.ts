import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DemoHelpComponent } from "../demo-help/demo-help.component";

@Component({
    selector: "app-demo-help-dialog",
    imports: [
        DemoHelpComponent,
    ],
    templateUrl: "./demo-help-dialog.component.html",
    styleUrls: ["./demo-help-dialog.component.css"]
})
export class DemoHelpDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DemoHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  ngOnInit(): void {}
}
