import {
  FactUpdate,
  RelaxationDimension,
} from "./../../../interface/planning-task-relaxation";
import { MatStepper } from "@angular/material/stepper";
import {
  PlanningTaskRelaxationSpace,
  MetaFact,
} from "src/app/interface/planning-task-relaxation";
import { PlanningTaskRelaxationService } from "./../../../service/planning-task/planning-task-relaxations-services";
import {
  PDDLFact,
  factEquals,
  getObjectTypeMap,
  instantiatePredicateAll,
  PlanningTask,
  PDDLPredicate,
  predicateToString,
  FactToString,
} from "src/app/interface/planning-task";
import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { PropertyCreatorComponent } from "../../plan_properties/property-creator/property-creator.component";
import { takeUntil, map } from "rxjs/operators";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Project } from "src/app/project/domain/project";

@Component({
  selector: "app-planning-task-relaxation-creator",
  templateUrl: "./planning-task-relaxation-creator.component.html",
  styleUrls: ["./planning-task-relaxation-creator.component.scss"],
})
export class PlanningTaskRelaxationCreatorComponent
  implements OnInit, OnDestroy
{
  math = Math;
  predicatOut = predicateToString;
  factOut = FactToString;
  private ngUnsubscribe: Subject<any> = new Subject();

  isedit = false;
  step = 0;
  @ViewChild("stepper") stepper!: MatStepper;

  currentProject: Project;
  task: PlanningTask;

  relaxationForm = new UntypedFormGroup({
    name: new UntypedFormControl(),
  });

  selctedInitialPredicate: PDDLPredicate = null;
  initialFacts: PDDLFact[] = [];
  selectedInitialFacts: PDDLFact[] = [];

  selctedPredicate: PDDLPredicate = null;
  possibleMetaFacts: MetaFact[] = [];
  selectedFacts: PDDLFact[] = [];

  relaxationSpace: PlanningTaskRelaxationSpace = {
    name: "Relaxation X",
    project: null,
    dimensions: [],
  };

  public initFactUpdates$ = new BehaviorSubject<FactUpdate[]>([]);

  constructor(
    private currentProjectService: CurrentProjectService,
    private relaxationService: PlanningTaskRelaxationService,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if (data && data.space) {
      console.log(data);
      this.isedit = true;
      this.relaxationSpace = data.space;
      this.relaxationForm.controls.name.setValue(this.relaxationSpace.name);
      this.selectedInitialFacts = this.relaxationSpace.dimensions.map(
        (e) => e.orgFact.fact
      );
      let index = 0;
      for (let dim of this.relaxationSpace.dimensions) {
        let newControl = new UntypedFormControl();
        this.relaxationForm.addControl("dim" + index++, newControl);
      }
    }

    this.currentProjectService
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((project) => {
        this.currentProject = project;
        this.task = project.baseTask;

        if (!this.isedit) {
          this.relaxationSpace.project = this.currentProject._id;
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initNextStep(): void {
    console.log(this.relaxationSpace);
    if (this.stepper.selectedIndex == 0) {
      this.updateFacts(this.selctedPredicate);
      this.initFactsSelected();
    }
  }

  updateInitialFacts(predicate: PDDLPredicate): void {
    this.selctedInitialPredicate = predicate;
    this.initialFacts = this.task.model.initial.filter(
      (f) =>
        f.name == this.selctedInitialPredicate.name &&
        !this.selectedInitialFacts.includes(f)
    );
  }

  removeInitFact(fact: PDDLFact) {
    this.selectedInitialFacts = this.selectedInitialFacts.filter(
      (f) => f != fact
    );
    // this.selectedFacts = this.selectedFacts.filter(e => e != fact);
    this.initialFacts = this.task.model.initial.filter(
      (f) =>
        f.name == this.selctedPredicate.name &&
        !this.selectedInitialFacts.includes(f)
    );
  }

  initFactsSelected(): void {
    let index = 0;
    for (let f of this.selectedInitialFacts) {
      if (
        this.relaxationSpace.dimensions.filter((u) =>
          factEquals(u.orgFact.fact, f)
        ).length == 0
      ) {
        let newMetaFact: MetaFact = {
          fact: f,
          value: 0,
          display: FactToString(f),
        };
        let newTaskUpdate: RelaxationDimension = {
          name: "",
          orgFact: newMetaFact,
          updates: [],
        };
        let newControl = new UntypedFormControl();
        this.relaxationForm.addControl("dim" + index++, newControl);
        this.relaxationSpace.dimensions.push(newTaskUpdate);
      }
    }
  }

  updateFacts(predicate: PDDLPredicate): void {
    if (predicate) {
      this.selctedPredicate = predicate;
      this.possibleMetaFacts = instantiatePredicateAll(
        this.selctedPredicate,
        getObjectTypeMap(this.task)
      ).map((f) => ({ fact: f, value: 0, display: FactToString(f) }));
      this.possibleMetaFacts = this.possibleMetaFacts.filter(
        (f) => !this.selectedFacts.some((e) => factEquals(e, f.fact))
      );
    }
  }

  deleteFactFromRelax(
    metaFact: MetaFact,
    possibleUpdates: RelaxationDimension
  ) {
    possibleUpdates.updates = possibleUpdates.updates.filter(
      (e) => !factEquals(e.fact, metaFact.fact)
    );
    this.selectedFacts = this.selectedFacts.filter(
      (e) => !factEquals(e, metaFact.fact)
    );
    if (
      this.selctedPredicate &&
      metaFact.fact.name == this.selctedPredicate.name
    ) {
      this.possibleMetaFacts.push(metaFact);
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
    console.log(this.relaxationSpace);
    this.relaxationSpace.name = this.relaxationForm.controls.name.value;
    this.relaxationService.saveObject(this.relaxationSpace);
    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  updateSelectedFacts(event: { container: { data: PDDLFact[] } }) {
    this.selectedFacts.push(event.container.data[0]);
    // this.possibleFacts = this.possibleFacts.filter(f =>  ! this.selectedFacts.includes(f));
  }

  getAllMetaFacts(possibleUpdates: RelaxationDimension): MetaFact[] {
    return [possibleUpdates.orgFact, ...possibleUpdates.updates];
  }
}
