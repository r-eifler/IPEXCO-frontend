import { PlanningTaskRelaxationCreatorComponent } from './../planning-task-relaxation-creator/planning-task-relaxation-creator.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-planning-task-relaxations',
  templateUrl: './planning-task-relaxations.component.html',
  styleUrls: ['./planning-task-relaxations.component.scss']
})
export class PlanningTaskRelaxationsComponent implements OnInit {

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  new_relaxation_form(): void {
    this.dialog.open(PlanningTaskRelaxationCreatorComponent, {
      width: '80%',
      height: '80%'
    });
  }

}
