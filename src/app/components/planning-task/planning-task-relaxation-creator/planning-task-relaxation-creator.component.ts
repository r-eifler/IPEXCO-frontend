import { FactUpdate, PossibleInitFactUpdates } from './../../../interface/planning-task-relaxation';
import { MatStepper } from '@angular/material/stepper';
import { PlanningTaskRelaxationSpace, MetaFact } from 'src/app/interface/planning-task-relaxation';
import { PlanningTaskRelaxationService } from './../../../service/planning-task/planning-task-relaxations-services';
import { Fact, PlanningTask, Predicat } from 'src/app/interface/plannig-task';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Project } from 'src/app/interface/project';
import { Subject, BehaviorSubject } from 'rxjs';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { PropertyCreatorComponent } from '../../plan_properties/property-creator/property-creator.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-planning-task-relaxation-creator',
  templateUrl: './planning-task-relaxation-creator.component.html',
  styleUrls: ['./planning-task-relaxation-creator.component.scss']
})
export class PlanningTaskRelaxationCreatorComponent implements OnInit, OnDestroy {

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
  possibleMetaFacts: MetaFact[] = [];
  selectedFacts: Fact[] = [];

  relaxationSpace: PlanningTaskRelaxationSpace = new PlanningTaskRelaxationSpace("Relaxation X" , null , []);

  public initFactUpdates$ = new BehaviorSubject<FactUpdate[]>([]);

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
      this.selectedInitialFacts = this.relaxationSpace.possibleInitFactUpdates.map(e =>  e.orgFact.fact);
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initNextStep(): void {
    console.log(this.relaxationSpace);
    if (this.stepper.selectedIndex == 0) {
      this.updateFacts(this.selctedPredicate);
      this.initFactsSelected()
    }
  }

  updateInitialFacts(predicate: Predicat): void {
    this.selctedInitialPredicate = predicate;
    this.initialFacts = this.task.initial.filter(f => f.name == this.selctedInitialPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  removeInitFact(fact: Fact){
    this.selectedInitialFacts = this.selectedInitialFacts.filter(f => f != fact);
    // this.selectedFacts = this.selectedFacts.filter(e => e != fact);
    this.initialFacts = this.task.initial.filter(f => f.name == this.selctedPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  initFactsSelected(): void {
    for(let f of this.selectedInitialFacts){
      if (this.relaxationSpace.possibleInitFactUpdates.filter(u => u.orgFact.fact.equals(f)).length == 0){
        let newMetaFact = new MetaFact(f, 0, f.toString())
        let newTaskUpdate = new PossibleInitFactUpdates(newMetaFact, []);
        this.relaxationSpace.possibleInitFactUpdates.push(newTaskUpdate);
      }
    }
  }

  updateFacts(predicate: Predicat): void {
    if (predicate) {
      this.selctedPredicate = predicate;
      this.possibleMetaFacts = this.selctedPredicate.instantiateAll(this.task.getObjectTypeMap()).map(f => ({fact: f, value: 0, display: f.toString()}));
      this.possibleMetaFacts = this.possibleMetaFacts.
      filter(f =>  ! this.selectedFacts.some(e => e.equals(f.fact)));
    }
  }

  deleteFactFromRelax(fact : Fact, possibleUpdates: PossibleInitFactUpdates){
    possibleUpdates.updates = possibleUpdates.updates.filter(e => ! e.fact.equals(fact));
    this.selectedFacts = this.selectedFacts.filter(e => ! e.equals(fact));
    if (fact.name == this.selctedPredicate.name){
      this.possibleMetaFacts.push(new MetaFact(fact, 0, fact.toString()));
      this.possibleMetaFacts = this.possibleMetaFacts.sort();
    }
  }

  updateValueChanged(event, metaFact: MetaFact): void {
    metaFact.value = event.target.value;
  }

  updateDisplayChanged(event, metaFact: MetaFact): void {
    metaFact.display = event.target.value;
  }

  onSave(): void {
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
    this.selectedFacts.push(event.container.data[0]);
    // this.possibleFacts = this.possibleFacts.filter(f =>  ! this.selectedFacts.includes(f));
  }

  getAllMetaFacts(possibleUpdates: PossibleInitFactUpdates): MetaFact[] {
    return [possibleUpdates.orgFact, ...possibleUpdates.updates]
  }

}
