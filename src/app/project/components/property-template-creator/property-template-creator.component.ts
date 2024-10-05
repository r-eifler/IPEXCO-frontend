import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ValidatorFn } from '@angular/forms';
import { PlanPropertyTemplate } from 'src/app/iterative_planning/domain/plan-property/plan-property-template';

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
    const templateString = JSON.stringify(templates);
    this.form.controls.planPropertyTemplates.setValue(templateString);
  }

  @Output() updatedTemplates = new EventEmitter<PlanPropertyTemplate[]>();

  constructor( ){
  }

  save() {
    this.updatedTemplates.next(JSON.parse(this.form.controls.planPropertyTemplates.value));
  }
}


