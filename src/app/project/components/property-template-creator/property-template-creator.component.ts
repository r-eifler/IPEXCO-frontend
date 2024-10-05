import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ValidatorFn } from '@angular/forms';
import { defaultPlanPropertyTemplate, PlanPropertyTemplate } from 'src/app/iterative_planning/domain/plan-property/plan-property-template';

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
  templateUrl: './property-template-creator.component.html',
  styleUrl: './property-template-creator.component.scss'
})
export class PropertyTemplateCreatorComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    planPropertyTemplates: this.fb.control<string>('', [jsonValidator]),
  });

  @Input({required: true}) set templates(templates: PlanPropertyTemplate[]) {
    const templateString = JSON.stringify(templates, null, '\t');
    this.form.controls.planPropertyTemplates.setValue(templateString);
  }

  @Output() updatedTemplates = new EventEmitter<PlanPropertyTemplate[]>();

  constructor( ){
  }

  addNewTemplate(){
    let currentTemplates = JSON.parse(this.form.controls.planPropertyTemplates.value) as PlanPropertyTemplate[]
    currentTemplates.push(defaultPlanPropertyTemplate)
    this.form.controls.planPropertyTemplates.setValue(JSON.stringify(currentTemplates, null, '\t'));
  }

  save() {
    console.log('Save template');
    console.log(JSON.parse(this.form.controls.planPropertyTemplates.value));
    this.updatedTemplates.next(JSON.parse(this.form.controls.planPropertyTemplates.value));
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
