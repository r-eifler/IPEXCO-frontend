import { NgFor } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, Signal, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { color } from 'd3';
import { PDDLType, PlanningModel } from 'src/app/shared/domain/planning-task';
import { GoalType } from 'src/app/shared/domain/plan-property/plan-property';
import { defaultPlanPropertyTemplate, PlanPropertyTemplate } from 'src/app/shared/domain/plan-property/plan-property-template';

const jsonValidator: ValidatorFn = (control) => {
  const value = control.value;

  try{
    JSON.parse(value);
  } catch(e) {
    return { invalidJson: true };
  }

  return null;
}

@Component({
  selector: 'app-property-template-creator',
  standalone: true,
  imports: [
    NgFor, 
    MatCardModule, 
    MatTabsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatDivider,
    MatIcon,
    MatButtonToggleModule,
    MatSelectModule
  ],
  templateUrl: './property-template-creator.component.html',
  styleUrl: './property-template-creator.component.scss'
})
export class PropertyTemplateCreatorComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    planPropertyTemplatesJSON: this.fb.control<string>('', [jsonValidator]),
    planPropertyTemplates: this.fb.array<FormGroup<{
      class: FormControl,
      color: FormControl,
      icon: FormControl,
      type: FormControl,
      variables: FormArray<FormGroup<{
        name: FormControl,
        types: FormControl
      }>>,
      nameTemplate: FormControl,
      sentenceTemplate: FormControl,
      formulaTemplate: FormControl,
      initVariableConstraints: FormArray<FormControl<string>>,
      actionSetsTemplates: FormArray<FormGroup<{
        name: FormControl,
        actionTemplates: FormArray
      }>>
  }>>([]),
  });

  variablesTypes: PDDLType[] = [];

  @Input({required: true}) set planning_task(task: PlanningModel) {
    if (!task){
      return
    }
    this.variablesTypes = task.types;
  }

  @Input({required: true}) set templates(templates: PlanPropertyTemplate[]) {
    if (!templates){
      return
    }
    console.log(templates)

    const templateString = JSON.stringify(templates, null, '\t');
    this.form.controls.planPropertyTemplatesJSON.setValue(templateString);

    for(const temp of templates){
      const tempForm = this.fb.group({
        class: [temp.class, Validators.required],
        color: [temp.color, Validators.required],
        icon: [temp.icon, Validators.required],
        type: [temp.type, Validators.required],
        variables: this.fb.array<FormGroup<{
          name: FormControl,
          types: FormControl
        }>>(Object.keys(temp.variables).map(
          n => this.fb.group<{
            name: FormControl,
            types: FormControl
          }>({
            name: this.fb.control(n, Validators.required),
            types: this.fb.control(temp.variables[n])
        }))),
        nameTemplate: [temp.nameTemplate, Validators.required],
        sentenceTemplate: [temp.sentenceTemplate, Validators.required],
        formulaTemplate: [temp.formulaTemplate, Validators.required],
        initVariableConstraints: this.fb.array(temp.initVariableConstraints.map(c => this.fb.control(c))),
        actionSetsTemplates: this.fb.array<FormGroup<{
          name: FormControl,
          actionTemplates: FormArray
        }>>(temp.actionSetsTemplates.map(
          t => this.fb.group<{
            name: FormControl,
            actionTemplates: FormArray
          }>({
            name: this.fb.control(t.name, Validators.required),
            actionTemplates: this.fb.array(t.actionTemplates.map(at => this.fb.control(at)))
        }))),
      })
      this.form.controls.planPropertyTemplates.push(tempForm)
    }
  }

  goalType = GoalType;

  @Output() updatedTemplates = new EventEmitter<PlanPropertyTemplate[]>();

  constructor( ){
  }

  addNewTemplate(){
    let currentTemplates = JSON.parse(this.form.controls.planPropertyTemplatesJSON.value) as PlanPropertyTemplate[]
    currentTemplates.push(defaultPlanPropertyTemplate)
    // this.form.controls.planPropertyTemplates.setValue(currentTemplates);
    this.form.controls.planPropertyTemplatesJSON.setValue(JSON.stringify(currentTemplates, null, '\t'));
  }

  save() {
    console.log('Save template');
    console.log(JSON.parse(this.form.controls.planPropertyTemplatesJSON.value));
    this.updatedTemplates.next(JSON.parse(this.form.controls.planPropertyTemplatesJSON.value));
  }
}

// [
// 	{
// 		"class": "stack",
// 		"type": "G",
// 		"variables": [
//                     {
//                       "name": "$B1",
//                       "type": "block"
//                     },
//                     {
//                       "name": "$B2",
//                       "type": "block"
//                     }
//                ],
// 		"nameTemplate": "stack$B1on$B2",
// 		"formulaTemplate": "on($B1,$B2",
// 		"actionSetsTemplates": [],
// 		"sentenceTemplate": "Block $B1 is on block $B2.",
// 		"initVariableConstraints": [],
// 		"goalVariableConstraints": []
// 	}
// ]
