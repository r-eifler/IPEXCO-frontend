import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormGroupName, FormArray} from '@angular/forms';
import {Action, ActionSet, PlanProperty} from '../../../interface/plan-property';
import {MatDialogRef} from '@angular/material/dialog';
import {GoalType} from '../../../interface/goal';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { Project } from 'src/app/interface/project';
import { CurrentSchemaStore } from 'src/app/store/stores.store';
import { matchRegexValidator } from '../../../validators/match-regex-validator';
import { TaskSchema } from 'src/app/interface/schema';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-property-creator',
  templateUrl: './property-creator.component.html',
  styleUrls: ['./property-creator.component.css']
})
export class PropertyCreatorComponent implements OnInit {



  propertyTypes = ['AS', 'LTL'];
  planProperty: PlanProperty = {
    name: null,
    goalType: GoalType.planProperty,
    type: null,
    formula: null,
    actionSets: [],
    project: null
  };

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

  constructor(
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    private  taskSchemaStore: CurrentSchemaStore,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>) {

      this.currentProjectService.selectedObject$.subscribe(project => {
        this.currentProject = project;
      });
      this.taskSchemaStore.item$.subscribe(ts => {
        if (ts) {
          console.log(ts);
          this.taskSchema = ts;
          this.actionOptions = this.taskSchema.actions.map(elem => elem.name);
        }
      });
     }


  ngOnInit(): void {
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

    this.planProperty.actionSets.push(newActionSet);

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
    // plan property
    this.planProperty.name = this.propertyForm.controls.name.value;
    this.planProperty.type = this.propertyForm.controls.type.value;
    this.planProperty.formula = this.propertyForm.controls.formula.value;
    this.planProperty.project = this.currentProject._id;

    console.log(this.planProperty);

    this.propertiesService.saveObject(this.planProperty);
    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
