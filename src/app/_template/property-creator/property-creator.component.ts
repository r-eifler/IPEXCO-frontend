import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActionSet, PlanProperty} from '../../_interface/plan-property';

@Component({
  selector: 'app-property-creator',
  templateUrl: './property-creator.component.html',
  styleUrls: ['./property-creator.component.css']
})
export class PropertyCreatorComponent implements OnInit {

  constructor() { }

  propertyTypes = ['AS', 'LTL'];

  actionSets: ActionSet[] = [];
  planProperty: PlanProperty;

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
      _id: '',
      name: newName,
    };
    this.actionSets.push(newActionSet);
    console.log(newActionSet);
    const newFromControl = new FormControl();
    const controlName = newName + 'control';
    this.propertyForm.addControl(controlName, newFromControl);
    return controlName;
  }

  createAction(actionSet: ActionSet): void {
    const controlName = actionSet.name + 'control';
    const control = this.propertyForm.controls[controlName];
    const action = control.value;
    control.setValue('');
    actionSet.actions.push(action);
  }


  onSave(): void {
    console.log('Save property');
    // plan property
    this.planProperty.name = this.propertyForm.controls.name.value;
    this.planProperty.type = this.propertyForm.controls.type.value;
    this.planProperty.formula = this.propertyForm.controls.formula.value;

    // action sets
    this.planProperty.actionSets = this.actionSets;


  }
}
