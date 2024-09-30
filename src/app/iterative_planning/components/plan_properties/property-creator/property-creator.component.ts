import { PlanningTask } from "src/app/interface/planning-task";
import { map, take, takeUntil } from "rxjs/operators";
import { MatStepper } from "@angular/material/stepper";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { DomainSpecification, getPropertyTemplateClassMap } from "src/app/interface/files/domain-specification";
import { PlanPropertyTemplate } from "src/app/iterative_planning/domain/plan-property/plan-property-template";
import { MatAccordion } from "@angular/material/expansion";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Observable, Subject } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatSelectionListChange } from "@angular/material/list";
import { Project } from "src/app/project/domain/project";
import { Action, ActionSet, PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";
import { matchRegexValidator } from "src/app/validators/match-regex-validator";
import { Store } from "@ngrx/store";
import { selectIterativePlanningProject } from "src/app/iterative_planning/state/iterative-planning.selector";
import { createPlanProperty } from "src/app/iterative_planning/state/iterative-planning.actions";

@Component({
  selector: "app-property-creator",
  templateUrl: "./property-creator.component.html",
  styleUrls: ["./property-creator.component.css"],
})
export class PropertyCreatorComponent implements OnInit {

  expertMode = false;
  @ViewChild("accordion") propertyTemplateAccordion: MatAccordion;
  @ViewChild("stepper") propertyTemplateStepper: MatStepper;

  actionSets: ActionSet[];

  // form fields
  propertyForm = new UntypedFormGroup({
    name: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(3),
      matchRegexValidator(new RegExp("^\\w*$")),
    ]),
    type: new UntypedFormControl("", [Validators.required]),
    formula: new UntypedFormControl("", [Validators.required]),
    actionSetName: new UntypedFormControl(),
  });

  propertyType: string;
  actionSetFromControls = new Map<string, UntypedFormArray>();

  project$: Observable<Project>;
  task$:  Observable<PlanningTask>;
  actionOptions$:  Observable<string[]>;
  domainSpec$:  Observable<DomainSpecification>;
  propertyClassMap$:  Observable<Map<string, PlanPropertyTemplate[]>>;

  selectedPropertyTemplate: PlanPropertyTemplate;
  sentenceTemplateParts: string[] = [];
  selectedVariableValue: Map<string, string> = new Map();
  possibleVariableValues: Map<string, Set<string>>;
  selectedVariablePlaceholder: string;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>
  ) {

    this.project$ = this.store.select(selectIterativePlanningProject);

    this.task$ = this.project$.pipe(map(p => p?.baseTask));
    this.actionOptions$ = this.task$.pipe(map(t => t?.model.actions.map((elem) => elem.name)));
    this.domainSpec$ = this.project$.pipe(map(p => p?.domainSpecification))
    this.propertyClassMap$ = this.domainSpec$.pipe(map(ds => getPropertyTemplateClassMap(ds)))
  }

  ngOnInit(): void {}

  modeChange(event: MatSlideToggleChange) {
    this.expertMode = event.checked;
  }

  propTemplateSelect(event: MatSelectionListChange) {
    this.task$.pipe(take(1)).subscribe(task => {
      this.propertyTemplateAccordion.closeAll();
      this.selectedPropertyTemplate = event.options[0].value;
      this.selectedPropertyTemplate.initializeVariableConstraints(task);
      this.sentenceTemplateParts = this.selectedPropertyTemplate.getSentenceTemplateParts();
      this.possibleVariableValues =
        this.selectedPropertyTemplate.getPossibleVariableValues(
        task,
        this.selectedVariableValue
      );

      this.propertyTemplateStepper.selected.completed = true;
      this.propertyTemplateStepper.next();
    })
  }

  onVariableIconClick(variable: string) {
    this.selectedVariablePlaceholder = variable;
  }

  selectVariableValue(value: string) {
    this.task$.pipe(take(1)).subscribe(task => {
      this.selectedVariableValue.set(this.selectedVariablePlaceholder, value);
      this.possibleVariableValues =
        this.selectedPropertyTemplate.getPossibleVariableValues(
          task,
          this.selectedVariableValue
        );
    })
  }

  resetVariableValue(variable: string) {
    this.task$.pipe(take(1)).subscribe(task => {
      this.selectedVariableValue.delete(variable);
      this.possibleVariableValues =
        this.selectedPropertyTemplate.getPossibleVariableValues(
          task,
          this.selectedVariableValue
        );
    })
  }

  addActionSet(): void {
    const newName: string = this.propertyForm.controls.actionSetName.value;
    this.propertyForm.controls.actionSetName.setValue("");
    const newActionSet: ActionSet = {
      actions: [] as Action[],
      _id: null,
      name: newName,
    };

    const newFromControl = new UntypedFormControl();
    const newFormArray = new UntypedFormArray([newFromControl]);
    this.actionSetFromControls.set(newName, newFormArray);

    this.actionSets.push(newActionSet);
  }

  onActionNameSelect(
    event: MatAutocompleteSelectedEvent,
    actionSet: ActionSet
  ): void {
    // console.log('Action name selected: ' + event.option.value);
  }

  createAction(actionSet: ActionSet): void {
    const controlName = actionSet.name + "control";
    const control = this.propertyForm.controls[controlName];
    const [name, ...params] = control.value.split(" ");
    const action: Action = { _id: null, name, params };
    control.setValue("");
    actionSet.actions.push(action);
  }

  onSave(): void {
    this.project$.pipe(take(1)).subscribe(project => {
      let planProperty: PlanProperty;
      if (this.expertMode) {
        planProperty = {
          name: this.propertyForm.controls.name.value,
          type: this.propertyForm.controls.type.value,
          formula: this.propertyForm.controls.formula.value,
          actionSets: this.actionSets,
          naturalLanguageDescription: "TODO",
          project: project._id,
          isUsed: false,
          globalHardGoal: false,
          utility: 1,
          color: "#696969",
          icon: "star",
          class: "main"
        };
      } else {
        planProperty = this.selectedPropertyTemplate.generatePlanProperty(
          this.selectedVariableValue,
          project.baseTask,
          project
        );
      }

      this.store.dispatch(createPlanProperty({planProperty}));
      this.dialogRef.close();
    })
  }

  onBack(): void {
    this.dialogRef.close();
  }

  disableSave() {
    if (this.expertMode) {
      return !this.propertyForm.valid;
    } else {
      if (this.selectedPropertyTemplate) {
        return (
          this.selectedVariableValue.size !==
          this.selectedPropertyTemplate.numSelectableVariables
        );
      }
    }
    return true;
  }

  upload_properties(changeEvent) {
    // const file = changeEvent.target.files[0];
    // if (!file) {
    //   return;
    // }
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const contents = e.target.result as string;

    //   const newPlanProperties = JSON.parse(contents) as PlanProperty[];
    //   for (const planProp of newPlanProperties) {
    //     planProp._id = null;
    //     planProp.project = this.project._id;
    //     planProp.isUsed = false;
    //     planProp.class = "main";
    //     planProp.icon = "star";
    //     planProp.color ="#696969";
    //     this.propertiesService.saveObject(planProp);
    //   }
    // };
    // reader.readAsText(file);
  }
}

