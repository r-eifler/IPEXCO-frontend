import { PlanningTaskRelaxationService } from './../../../service/planning-task/planning-task-relaxations-services';
import { MatCardModule } from '@angular/material/card';
import { logging } from 'protractor';
import { Fact, PlanningTask, Predicat } from 'src/app/interface/plannig-task';
import { Component, FactorySansProvider, OnDestroy, OnInit } from '@angular/core';
import { Project } from 'src/app/interface/project';
import { Subject } from 'rxjs';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { PropertyCreatorComponent } from '../../plan_properties/property-creator/property-creator.component';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntil, map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChildActivationEnd } from '@angular/router';
import { max } from 'd3';

interface Node {
  id: number;
  pos?: number;
  level: number;
  parents: Node[];
  children: Node[];
  facts: Fact[];
}

interface RelaxationFactList {
  init: Fact;
  facts: Fact[];
}

@Component({
  selector: 'app-planning-task-relaxation-creator',
  templateUrl: './planning-task-relaxation-creator.component.html',
  styleUrls: ['./planning-task-relaxation-creator.component.scss']
})
export class PlanningTaskRelaxationCreatorComponent implements OnInit, OnDestroy {

  math = Math;
  private ngUnsubscribe: Subject<any> = new Subject();

  currentProject: Project;
  task: PlanningTask;

  selctedInitialPredicate: Predicat = null;
  initialFacts: Fact[] = [];
  selectedInitialFacts: Fact[] = [];

  selctedPredicate: Predicat = null;
  possibleFacts: Fact[] = [];
  selectedFacts: Fact[] = [];

  relaxationFactLists : RelaxationFactList[] = [];

  constructor(
    private currentProjectService: CurrentProjectService,
    private relaxationService: PlanningTaskRelaxationService,
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

  updateInitialFacts(predicate: Predicat): void {
    this.selctedInitialPredicate = predicate;
    this.initialFacts = this.task.init.filter(f => f.name == this.selctedInitialPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  removeInitFact(fact: Fact){
    this.selectedInitialFacts = this.selectedInitialFacts.filter(f => f != fact);
    this.selectedFacts = this.selectedFacts.filter(e => e != fact);
    this.initialFacts = this.task.init.filter(f => f.name == this.selctedPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  initFactsSelected(): void {
    for(let f of this.selectedInitialFacts){
      this.relaxationFactLists.push({init: f, facts: []})
    }
  }

  updateFacts(predicate: Predicat): void {
    this.selctedPredicate = predicate;
    this.possibleFacts = this.selctedPredicate.instantiateAll(this.task.getObjectTypeMap());
    this.possibleFacts = this.possibleFacts.
    filter(f =>  ! this.selectedFacts.some(e => e.name == f.name && JSON.stringify(e.arguments) === JSON.stringify(f.arguments)));
  }

  deleteFactFromRelax(fact: Fact, list: RelaxationFactList){
    console.log("deleteFactFromRelax");
    list.facts = list.facts.filter(e => e != fact);
    this.selectedFacts = this.selectedFacts.filter(e => e != fact);
    if (fact.name == this.selctedPredicate.name){
      this.possibleFacts.push(fact);
      this.possibleFacts = this.possibleFacts.sort();
    }
  }

  onSave(): void {

    let relaxationSpace = {name: "Relax", project: this.currentProject._id, taskUpdatList: []}
    for(let relaxList of this.relaxationFactLists){
      relaxationSpace.taskUpdatList.push({orgFact: relaxList.init, newFacts: relaxList.facts.map(f => {return {fact:f, value: 1}})})
    }
    this.relaxationService.saveObject(relaxationSpace);
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

  updateSelectedFacts(event: {container: {data: Fact[]}}){
    this.selectedFacts.push(event.container.data[0]);
    this.possibleFacts = this.possibleFacts.filter(f =>  ! this.selectedFacts.includes(f));
  }

}
