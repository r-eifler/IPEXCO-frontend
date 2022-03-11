import { Fact, PlanningTask, Predicat } from 'src/app/interface/plannig-task';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from 'src/app/interface/project';
import { Subject } from 'rxjs';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { PropertyCreatorComponent } from '../../plan_properties/property-creator/property-creator.component';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-planning-task-relaxation-creator',
  templateUrl: './planning-task-relaxation-creator.component.html',
  styleUrls: ['./planning-task-relaxation-creator.component.scss']
})
export class PlanningTaskRelaxationCreatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  currentProject: Project;
  task: PlanningTask;

  selctedPredicate: Predicat = null;
  possibleFacts: Fact[] = []
  selectedFacts: Fact[] = []

  constructor(
    private currentProjectService: CurrentProjectService,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>
  ) {
    this.currentProjectService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(project => {
      this.currentProject = project;
      this.task = project.baseTask;
    });

   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  updateFacts(predicate: Predicat): void {
    this.selctedPredicate = predicate;
    this.possibleFacts = this.selctedPredicate.instantiateAll(this.task.getObjectTypeMap());
    console.log(this.possibleFacts);
  }

  onSave(): void {

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
