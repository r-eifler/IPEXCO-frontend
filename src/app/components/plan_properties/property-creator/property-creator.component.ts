import { MatStepper } from '@angular/material/stepper';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators, FormGroupName, FormArray} from '@angular/forms';
import {Action, ActionSet, PlanProperty} from '../../../interface/plan-property';
import {MatDialogRef} from '@angular/material/dialog';
import {GoalType} from '../../../interface/goal';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { Project } from 'src/app/interface/project';
import { TasktSchemaStore, DomainSpecStore } from 'src/app/store/stores.store';
import { matchRegexValidator } from '../../../validators/match-regex-validator';
import { TaskSchema } from 'src/app/interface/task-schema';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomainSpecification } from 'src/app/interface/domain-specification';
import { PlanPropertyTemplate } from "src/app/interface/plan-property-template";
import { MatSelectionListChange } from '@angular/material/list';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-property-creator',
  templateUrl: './property-creator.component.html',
  styleUrls: ['./property-creator.component.css']
})
export class PropertyCreatorComponent implements OnInit {

  expertMode = false;
  @ViewChild('accordion') propertyTemplateAccordion: MatAccordion;
  @ViewChild('stepper') propertyTemplateStepper: MatStepper;

  actionSets: ActionSet[];

  // planProperty: PlanProperty = {
  //   name: null,
  //   goalType: GoalType.planProperty,
  //   type: null,
  //   formula: null,
  //   actionSets: [],
  //   project: null
  // };

  // form fields
  propertyForm = new FormGroup({
    name: new FormControl(
      '', [
      Validators.required,
      Validators.minLength(3),
      matchRegexValidator(new RegExp('^\\w*$'))
    ]
    ),
    type: new FormControl(
      '', [
        Validators.required
      ]
    ),
    formula: new FormControl( '', [
      Validators.required
    ]),
    actionSetName: new FormControl(),
  });

  actionSetFromControls =  new Map<string, FormArray>();

  currentProject: Project;

  taskSchema: TaskSchema;
  actionOptions: string[];

  domainSpec: DomainSpecification;
  propertyClassMap: Map<string, PlanPropertyTemplate[]>;
  selectedPropertyTemplate: PlanPropertyTemplate;
  sentenceTemplateParts: string[] = [];
  selectedVariableValue: Map<string, string> = new Map();
  possibleVariableValues: Map<string, Set<string>>;
  selectedVariablePlaceholder: string;


  constructor(
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    private  taskSchemaStore: TasktSchemaStore,
    private domainSpecStore: DomainSpecStore,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>) {

      this.currentProjectService.selectedObject$.subscribe(project => {
        this.currentProject = project;
      });
      this.taskSchemaStore.item$.subscribe(ts => {
        if (ts) {
          this.taskSchema = ts;
          this.actionOptions = this.taskSchema.actions.map(elem => elem.name);
        }
      });
      this.domainSpecStore.item$.subscribe(ds => {
        if (ds) {
          this.domainSpec = ds;
          this.propertyClassMap = this.domainSpec.getPropertyTemplateClassMap();
        }
      });
     }


  ngOnInit(): void {
  }

  modeChange(event: MatSlideToggleChange) {
    this.expertMode = event.checked;
  }

  propTemplateSelect(event: MatSelectionListChange) {
    this.propertyTemplateAccordion.closeAll();
    this.selectedPropertyTemplate = event.option.value;
    this.selectedPropertyTemplate.initializeVariableConstraints(this.taskSchema);
    this.sentenceTemplateParts = this.selectedPropertyTemplate.getSentenceTemplateParts();
    this.possibleVariableValues = this.selectedPropertyTemplate.getPossibleVariableValues(this.taskSchema, this.selectedVariableValue);
    // console.log(this.possibleVariableValues);
    this.propertyTemplateStepper.selected.completed = true;
    this.propertyTemplateStepper.next();
  }

  onVariableIconClick(variable: string) {
    this.selectedVariablePlaceholder = variable;
  }

  selectVariableValue(value: string) {
    this.selectedVariableValue.set(this.selectedVariablePlaceholder, value);
    this.possibleVariableValues = this.selectedPropertyTemplate.getPossibleVariableValues(this.taskSchema, this.selectedVariableValue);
    console.log(this.possibleVariableValues);
  }

  resetVariableValue(variable: string) {
    this.selectedVariableValue.delete(variable);
    this.possibleVariableValues = this.selectedPropertyTemplate.getPossibleVariableValues(this.taskSchema, this.selectedVariableValue);
  }



  addActionSet(): void {
    const newName: string = this.propertyForm.controls.actionSetName.value;
    this.propertyForm.controls.actionSetName.setValue('');
    const newActionSet: ActionSet = {
      actions: [] as Action[],
      _id: null,
      name: newName,
    };

    const newFromControl = new FormControl();
    const newFormArray = new FormArray([newFromControl]);
    this.actionSetFromControls.set(newName, newFormArray);
    console.log('New FromControl for action set: ' + newName);

    this.actionSets.push(newActionSet);

  }

  onActionNameSelect(event: MatAutocompleteSelectedEvent, actionSet: ActionSet): void {
    console.log('Action name selected: ' + event.option.value);
  }

  createAction(actionSet: ActionSet): void {
    console.log('create action');
    const controlName = actionSet.name + 'control';
    const control = this.propertyForm.controls[controlName];
    const [name, ...params] = control.value.split(' ');
    const action: Action = {_id: null, name, params};
    control.setValue('');
    actionSet.actions.push(action);
    console.log('New Action');
    console.log(actionSet);
  }

  onSave(): void {
    console.log('Save property');
    let planProperty: PlanProperty;
    if (this.expertMode) {
      planProperty = {
        name: this.propertyForm.controls.name.value,
        goalType: GoalType.planProperty,
        type: this.propertyForm.controls.type.value,
        formula: this.propertyForm.controls.formula.value,
        actionSets: this.actionSets,
        naturalLanguageDescription: 'TODO',
        project: this.currentProject._id,
        isUsed: false,
      };
    } else {
      planProperty = this.selectedPropertyTemplate.generatePlanProperty(this.selectedVariableValue, this.taskSchema, this.currentProject);
    }

    console.log(planProperty);

    this.propertiesService.saveObject(planProperty);
    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

  disableSave() {
    if (this.expertMode) {
      return ! this.propertyForm.valid;
    } else {
      if (this.selectedPropertyTemplate) {
        return this.selectedVariableValue.size !== this.selectedPropertyTemplate.numSelectableVariables;
      }
    }
    return true;
  }

}
