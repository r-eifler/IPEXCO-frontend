import { PlanningTask } from "src/app/interface/plannig-task";
import { DomainSpecificationService } from "../../../service/files/domain-specification.service";
import { takeUntil } from "rxjs/operators";
import { MatStepper } from "@angular/material/stepper";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Action, ActionSet, PlanProperty } from "../../../interface/plan-property/plan-property";
import { Project } from "src/app/interface/project";
import { matchRegexValidator } from "../../../validators/match-regex-validator";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { DomainSpecification } from "src/app/interface/files/domain-specification";
import { PlanPropertyTemplate } from "src/app/interface/plan-property/plan-property-template";
import { MatAccordion } from "@angular/material/expansion";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Subject } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatSelectionListChange } from "@angular/material/list";

@Component({
  selector: "app-property-creator",
  templateUrl: "./property-creator.component.html",
  styleUrls: ["./property-creator.component.css"],
})
export class PropertyCreatorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

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

  currentProject: Project;

  task: PlanningTask;
  actionOptions: string[];

  domainSpec: DomainSpecification;
  propertyClassMap: Map<string, PlanPropertyTemplate[]>;
  selectedPropertyTemplate: PlanPropertyTemplate;
  sentenceTemplateParts: string[] = [];
  selectedVariableValue: Map<string, string> = new Map();
  possibleVariableValues: Map<string, Set<string>>;
  selectedVariablePlaceholder: string;

  constructor(
    private propertiesService: PlanPropertyMapService,
    private currentProjectService: CurrentProjectService,
    private domainSpecService: DomainSpecificationService,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>
  ) {
    this.currentProjectService
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((project) => {
        this.currentProject = project;
        this.task = project.baseTask;
        this.actionOptions = this.task.actions.map((elem) => elem.name);
      });

    this.domainSpecService
      .getSpec()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((ds) => {
        console.log("domainSpecService");
        console.log(ds);
        if (ds) {
          this.domainSpec = ds;
          this.propertyClassMap = this.domainSpec.getPropertyTemplateClassMap();
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  modeChange(event: MatSlideToggleChange) {
    this.expertMode = event.checked;
  }

  propTemplateSelect(event: MatSelectionListChange) {
    this.propertyTemplateAccordion.closeAll();
    this.selectedPropertyTemplate = event.options[0].value;
    this.selectedPropertyTemplate.initializeVariableConstraints(this.task);
    this.sentenceTemplateParts = this.selectedPropertyTemplate.getSentenceTemplateParts();
    this.possibleVariableValues =
      this.selectedPropertyTemplate.getPossibleVariableValues(
      this.task,
      this.selectedVariableValue
    );

    this.propertyTemplateStepper.selected.completed = true;
    this.propertyTemplateStepper.next();
  }

  onVariableIconClick(variable: string) {
    this.selectedVariablePlaceholder = variable;
  }

  selectVariableValue(value: string) {
    this.selectedVariableValue.set(this.selectedVariablePlaceholder, value);
    this.possibleVariableValues =
      this.selectedPropertyTemplate.getPossibleVariableValues(
        this.task,
        this.selectedVariableValue
      );
  }

  resetVariableValue(variable: string) {
    this.selectedVariableValue.delete(variable);
    this.possibleVariableValues =
      this.selectedPropertyTemplate.getPossibleVariableValues(
        this.task,
        this.selectedVariableValue
      );
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
    let planProperty: PlanProperty;
    if (this.expertMode) {
      planProperty = {
        name: this.propertyForm.controls.name.value,
        type: this.propertyForm.controls.type.value,
        formula: this.propertyForm.controls.formula.value,
        actionSets: this.actionSets,
        naturalLanguageDescription: "TODO",
        project: this.currentProject._id,
        isUsed: false,
        globalHardGoal: false,
        value: 1,
        color: "#696969",
        icon: "star",
        class: "main"
      };
    } else {
      planProperty = this.selectedPropertyTemplate.generatePlanProperty(
        this.selectedVariableValue,
        this.task,
        this.currentProject
      );
    }

    this.propertiesService.saveObject(planProperty);
    this.dialogRef.close();
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
    const file = changeEvent.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result as string;

      const newPlanProperties = JSON.parse(contents) as PlanProperty[];
      for (const planProp of newPlanProperties) {
        planProp._id = null;
        planProp.project = this.currentProject._id;
        planProp.isUsed = false;
        planProp.class = "main";
        planProp.icon = "star";
        planProp.color ="#696969";
        this.propertiesService.saveObject(planProp);
      }
    };
    reader.readAsText(file);
  }
}
