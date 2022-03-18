import { PlanningTaskRelaxationSpace } from 'src/app/interface/planning-task-relaxation';
import { PlanningTaskRelaxationCreatorComponent } from './../planning-task-relaxation-creator/planning-task-relaxation-creator.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-planning-task-relaxations',
  templateUrl: './planning-task-relaxations.component.html',
  styleUrls: ['./planning-task-relaxations.component.scss']
})
export class PlanningTaskRelaxationsComponent implements OnInit {

  json=JSON;
  private ngUnsubscribe: Subject<any> = new Subject();

 relaxationSpaces : PlanningTaskRelaxationSpace[] = [];

  constructor(
    private relaxationService: PlanningTaskRelaxationService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.relaxationService.getList()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(spaces => {
      if(spaces)
        this.relaxationSpaces = spaces;
        console.log(spaces);
    });
  }

  new_relaxation_form(): void {
    this.dialog.open(PlanningTaskRelaxationCreatorComponent, {
      width: '80%',
      height: '80%',
      data: null
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }



  deleteRelaxation(space: PlanningTaskRelaxationSpace): void {
    this.relaxationService.deleteObject(space);
  }

  editRelaxation(space: PlanningTaskRelaxationSpace): void {
    this.dialog.open(PlanningTaskRelaxationCreatorComponent, {
      width: '80%',
      height: '80%',
      data: {space}
    });
  }

}
