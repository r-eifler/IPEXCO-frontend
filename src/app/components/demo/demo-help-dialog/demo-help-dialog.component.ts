import { Component, Inject, OnInit } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";

@Component({
  selector: "app-demo-help-dialog",
  templateUrl: "./demo-help-dialog.component.html",
  styleUrls: ["./demo-help-dialog.component.css"],
})
export class DemoHelpDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DemoHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  ngOnInit(): void {}
}
