import { MatStepper } from '@angular/material/stepper';
import { TaskUpdate } from './../../../interface/planning-task-relaxation';
import { PlanningTaskRelaxationSpace, TaskUpdates } from 'src/app/interface/planning-task-relaxation';
import { PlanningTaskRelaxationService } from './../../../service/planning-task/planning-task-relaxations-services';
import { MatCardModule } from '@angular/material/card';
import { logging } from 'protractor';
import { Fact, PlanningTask, Predicat } from 'src/app/interface/plannig-task';
import { AfterViewInit, Component, FactorySansProvider, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Project } from 'src/app/interface/project';
import { Subject } from 'rxjs';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { PropertyCreatorComponent } from '../../plan_properties/property-creator/property-creator.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChildActivationEnd } from '@angular/router';
import { max } from 'd3';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-planning-task-relaxation-creator',
  templateUrl: './planning-task-relaxation-creator.component.html',
  styleUrls: ['./planning-task-relaxation-creator.component.scss']
})
export class PlanningTaskRelaxationCreatorComponent implements OnInit, AfterViewInit, OnDestroy {

  math = Math;
  private ngUnsubscribe: Subject<any> = new Subject();

  isedit = false;
  step = 0;
  @ViewChild('stepper') stepper!: MatStepper;

  currentProject: Project;
  task: PlanningTask;

  relaxationForm = new FormGroup({
    name: new FormControl()
  });

  selctedInitialPredicate: Predicat = null;
  initialFacts: Fact[] = [];
  selectedInitialFacts: Fact[] = [];

  selctedPredicate: Predicat = null;
  possibleFacts: TaskUpdate[] = [];
  selectedFacts: TaskUpdate[] = [];

  relaxationSpace: PlanningTaskRelaxationSpace = new PlanningTaskRelaxationSpace("Relax Test" , null , []);

  constructor(
    private currentProjectService: CurrentProjectService,
    private relaxationService: PlanningTaskRelaxationService,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {

    if(data && data.space){
      console.log(data);
      this.isedit = true;
      this.relaxationSpace = data.space;
      this.relaxationForm.controls.name.setValue(this.relaxationSpace.name);
      this.selectedInitialFacts = this.relaxationSpace.taskUpdatList.map(e =>  e.orgFact);
    }

    this.currentProjectService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(project => {
      this.currentProject = project;
      this.task = project.baseTask;

      if(!this.isedit){
        this.relaxationSpace.project = this.currentProject._id;
      }
    });


  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.isedit && this.step == 0) {
      // this.stepper.selectedIndex = ++this.step;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // initEdit(stepper: MatStepper) {
  //   stepper.next();
  //   // if (stepper.selectedIndex === this.numSteps - 1) {
  //   // }
  // }

  initNextStep(): void {
    console.log(this.relaxationSpace);
    if (this.stepper.selectedIndex == 0) {
      this.updateFacts(this.selctedPredicate);
      this.initFactsSelected()
    }
  }

  updateInitialFacts(predicate: Predicat): void {
    this.selctedInitialPredicate = predicate;
    this.initialFacts = this.task.init.filter(f => f.name == this.selctedInitialPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  removeInitFact(fact: Fact){
    this.selectedInitialFacts = this.selectedInitialFacts.filter(f => f != fact);
    // this.selectedFacts = this.selectedFacts.filter(e => e != fact);
    this.initialFacts = this.task.init.filter(f => f.name == this.selctedPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  initFactsSelected(): void {
    for(let f of this.selectedInitialFacts){
      if (this.relaxationSpace.taskUpdatList.filter(u => u.orgFact.equals(f)).length == 0){
        let newTaskUpdate = new TaskUpdates(f, []);
        this.relaxationSpace.taskUpdatList.push(newTaskUpdate);
      }
    }
  }

  updateFacts(predicate: Predicat): void {
    if (predicate) {
      this.selctedPredicate = predicate;
      this.possibleFacts = this.selctedPredicate.instantiateAll(this.task.getObjectTypeMap()).map(e => {return {fact: e, value:0}});
      this.possibleFacts = this.possibleFacts.
      filter(f =>  ! this.selectedFacts.some(e => e.fact.equals(f.fact)));
    }
  }

  deleteFactFromRelax(update: TaskUpdate, updates: TaskUpdates){
    updates.newFacts = updates.newFacts.filter(e => e != update);
    this.selectedFacts = this.selectedFacts.filter(e => e != update);
    if (update.fact.name == this.selctedPredicate.name){
      this.possibleFacts.push(update);
      this.possibleFacts = this.possibleFacts.sort();
    }
  }

  updateValueChanged(event,  update: TaskUpdate): void {
    update.value = event.target.value;
  }

  onSave(): void {

    // let relaxationSpace = {name: "Relax", project: this.currentProject._id, taskUpdatList: []}
    // for(let relaxList of this.relaxationFactLists){
    //   relaxationSpace.taskUpdatList.push({orgFact: relaxList.init, newFacts: relaxList.facts.map(f => {return {fact:f, value: 1}})})
    // }
    this.relaxationSpace.name = this.relaxationForm.controls.name.value;
    this.relaxationService.saveObject(this.relaxationSpace);
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
    this.selectedFacts.push({fact: event.container.data[0], value: 0});
    // this.possibleFacts = this.possibleFacts.filter(f =>  ! this.selectedFacts.includes(f));
  }

}
