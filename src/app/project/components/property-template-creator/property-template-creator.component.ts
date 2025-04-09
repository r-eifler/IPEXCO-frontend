import { NgFor } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, input, Input, output, Output, Signal, signal } from '@angular/core';
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
import { jsonValidator } from 'src/app/validators/json.validator';

@Component({
    selector: 'app-property-template-creator',
    imports: [
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

  variablesTypes = input.required<PDDLType[]>();
  templates =  input.required<PlanPropertyTemplate[]>();
  templateString = computed(() => this.templates ? JSON.stringify(this.templates(), null, '\t') : null);

  updatedTemplates = output<PlanPropertyTemplate[]>();

  constructor(){

    effect(() => 
      this.form.controls.planPropertyTemplatesJSON.setValue(this.templateString())
    )

    effect(() => {

      if(!this.templates()){
        return;
      }

      this.form.controls.planPropertyTemplates.clear();

      for(const temp of this.templates()){
        this.form.controls.planPropertyTemplates.push(this.buildTemplateFormControl(temp))
      }
    });
  }

  buildTemplateFormControl(temp: PlanPropertyTemplate) {
    return this.fb.group({
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
    });
  }

  goalType = GoalType;


  addNewTemplate(){
    const newTemp: PlanPropertyTemplate= {
      class: '',
      color: '',
      icon: '',
      type: GoalType.goalFact,
      variables: {},
      nameTemplate: 'new template',
      formulaTemplate: '',
      actionSetsTemplates: [],
      sentenceTemplate: '',
      initVariableConstraints: [],
      goalVariableConstraints: []
    }
    // this.form.controls.planPropertyTemplates.push(this.buildTemplateFormControl(newTemp))
    let currentTemplates = JSON.parse(this.form.controls.planPropertyTemplatesJSON.value) as PlanPropertyTemplate[]
    currentTemplates.push(defaultPlanPropertyTemplate)
    this.form.controls.planPropertyTemplatesJSON.setValue(JSON.stringify(currentTemplates, null, '\t'));
  }

  save() {
    this.updatedTemplates.emit(JSON.parse(this.form.controls.planPropertyTemplatesJSON.value));
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
