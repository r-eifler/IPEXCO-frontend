import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActionSet, PlanProperty} from '../../../_interface/plan-property';
import {PlanPropertyCollectionService} from '../../../_service/general-services';
import {MatDialogRef} from '@angular/material/dialog';
import {GoalType} from '../../../_interface/goal';

@Component({
  selector: 'app-property-creator',
  templateUrl: './property-creator.component.html',
  styleUrls: ['./property-creator.component.css']
})
export class PropertyCreatorComponent implements OnInit {

  constructor(private propertiesService: PlanPropertyCollectionService, public dialogRef: MatDialogRef<PropertyCreatorComponent>) { }

  propertyTypes = ['AS', 'LTL'];
  planProperty: PlanProperty = {_id: null, name: null, goalType: GoalType.planProperty, type: null, formula: null, actionSets: []};

  // form fields
  propertyForm = new FormGroup({
    name: new FormControl(),
    type: new FormControl(),
    formula: new FormControl(),
    actionSetName: new FormControl(),
  });



  ngOnInit(): void {
  }

  addActionSet(): string {
    const newName: string = this.propertyForm.controls.actionSetName.value;
    this.propertyForm.controls.actionSetName.setValue('');
    const newActionSet: ActionSet = {
      actions: [] as string[],
      _id: null,
      name: newName,
    };
    this.planProperty.actionSets.push(newActionSet);
    console.log('New Action Set');
    console.log(newActionSet);
    const newFromControl = new FormControl();
    const controlName = newName + 'control';
    this.propertyForm.addControl(controlName, newFromControl);
    return controlName;
  }

  createAction(actionSet: ActionSet): void {
    console.log('create action');
    const controlName = actionSet.name + 'control';
    const control = this.propertyForm.controls[controlName];
    const action = control.value;
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

    console.log(this.planProperty);

    this.propertiesService.saveObject(this.planProperty);
    // this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
