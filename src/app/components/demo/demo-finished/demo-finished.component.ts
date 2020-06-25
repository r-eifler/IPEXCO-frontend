import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Demo } from 'src/app/interface/demo';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-demo-finished',
  templateUrl: './demo-finished.component.html',
  styleUrls: ['./demo-finished.component.css']
})
export class DemoFinishedComponent implements OnInit {

  demo: Demo;
  timesUp = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<DemoFinishedComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.timesUp = data.timesUp;
    this.demo = data.demo;
  }

  ngOnInit(): void {
  }

  backToDemoOverview() {
    this.router.navigate(['/demos'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
