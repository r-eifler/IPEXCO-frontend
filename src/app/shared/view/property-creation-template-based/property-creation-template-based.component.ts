import { KeyValuePipe} from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { PropertyTemplatePartComponent } from '../../../iterative_planning/components/property-template-part/property-template-part.component'
import { PlanningTask, TaskObject } from '../../domain/planning-task';
import { MatIcon } from '@angular/material/icon';
import { generatePlanProperty, getPossibleValues, getTemplateParts, PlanPropertyTemplate, TemplatePart } from '../../domain/plan-property/plan-property-template';
import { equalPlanProperties, PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { PropertyTemplateNumericPartComponent } from 'src/app/iterative_planning/components/property-template-numeric-part/property-template-numeric-part.component';

@Component({
    selector: 'app-property-creation-template-based',
    imports: [
        KeyValuePipe,
        DialogModule,
        MatStepperModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatCardModule,
        PropertyTemplatePartComponent,
        PropertyTemplateNumericPartComponent,
        MatIcon,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule
    ],
    templateUrl: './property-creation-template-based.component.html',
    styleUrl: './property-creation-template-based.component.scss'
})
export class PropertyCreationTemplateBasedComponent implements OnInit{

  fb = inject(FormBuilder);

  cancel = output<void>();
  created = output<PlanProperty>();

  planningTask = input.required<PlanningTask>();
  planProperties = input.required<Record<string, PlanProperty> | null>();
  planPropertiesList = computed(() => 
      this.planProperties() ? Object.values(this.planProperties()) : [])
  templates = input.required<PlanPropertyTemplate[]>();

  groupedTemplates:Record<string,PlanPropertyTemplate[]>;

  selectedTemplate: PlanPropertyTemplate;

  templateParts: TemplatePart[] = [];
  selectedVariableValue: Record<string, TaskObject> = {};
  possibleVariableValues: Record<string, TaskObject[]>;
  selectedNumericVariableValue: Record<string, number> = {};

  allSelected = false;
  propertyAlreadyExists = false;

  form = this.fb.group({
    name: this.fb.control<string>(null, [Validators.required]),
    naturalLanguageDescription: this.fb.control<string>(null, [Validators.required]),
    utility: this.fb.control<number>(1, [Validators.required]),
  });

  ngOnInit(): void {
    let sorted: Record<string, PlanPropertyTemplate[]> = this.templates()?.reduce((acc, t) => ({...acc,[t.class]: []}), {})
    this.templates().forEach(t => sorted[(t.class)].push(t))
    this.groupedTemplates = sorted;
  }

  private getDisplayText(part: TemplatePart){
    if(!part.isVar){
      return part.text;
    }
    if(part.numeric){
      if(this.selectedNumericVariableValue[part.var]){
        return this.selectedNumericVariableValue[part.var].toString();
      }
      return '0';
    }

    if (this.selectedVariableValue[part.var]){
      return this.selectedVariableValue[part.var].name
    }
    return part.var;
  }

  private updatePossibleVariableValues(){
    if(this.templateParts.length == 0){
      this.templateParts = getTemplateParts(this.selectedTemplate);
    }

    this.possibleVariableValues = getPossibleValues(
      this.selectedTemplate,
      this.planningTask(),
      this.selectedVariableValue,
    )

    // console.log(this.possibleVariableValues)

    this.templateParts = this.templateParts.map(p => ({
      ...p,
      isSelected: p.isVar ? this.selectedVariableValue[p.var] !== undefined : false,
      text: this.getDisplayText(p),
      possibleValues: this.possibleVariableValues[p.var] 
    }))

    // console.log(this.templateParts)
  }

  selectTemplate(template: PlanPropertyTemplate, stepper: MatStepper){
    this.selectedTemplate = template
    this.selectedVariableValue = {};
    // console.log(template)

    stepper.selected.completed = true;
    stepper.next();

	  this.templateParts = [];
    this.updatePossibleVariableValues();

    this.form.controls.name.setValue(template.nameTemplate);
    this.form.controls.naturalLanguageDescription.setValue(template.sentenceTemplate);
  }


  selectNumericVariableValue(variable: string, value: number) {

    // console.log("select: " + value)
    this.selectedNumericVariableValue[variable] = value;

    // this.updatePossibleVariableValues();
    this.checkAllSelected();
  }

  selectVariableValue(variable: string, object: TaskObject) {

    // console.log("select: " + object.name)
    this.selectedVariableValue[variable] = object;

    this.updatePossibleVariableValues();
    this.checkAllSelected();
  }

  checkAllSelected(){
	  this.allSelected = Object.keys(this.selectedVariableValue).length  + 
      Object.keys(this.selectedNumericVariableValue).length === Object.keys(this.selectedTemplate.variables).length

    if(this.allSelected){
      const dummy: PlanProperty = generatePlanProperty(
        this.selectedTemplate,
        this.selectedVariableValue,
        this.selectedNumericVariableValue
      )

      this.form.controls.name.setValue(dummy.name);
      this.form.controls.naturalLanguageDescription.setValue(dummy.naturalLanguageDescription);

      this.propertyAlreadyExists = this.planPropertiesList().some(
        p => equalPlanProperties(p, dummy)
      )
    }
  }
  

  resetVariableValue(variable: string) {
    delete this.selectedVariableValue[variable];
    this.updatePossibleVariableValues();
	  this.allSelected = false;
    this.propertyAlreadyExists = false;
  }

  onCancel(){
	  this.cancel.emit()
  }

  onCreateProperty(){
    let newPlanProperty = generatePlanProperty(
      this.selectedTemplate,
      this.selectedVariableValue,
      this.selectedNumericVariableValue
    )

    newPlanProperty.name = this.form.controls.name.value;
    newPlanProperty.naturalLanguageDescription = this.form.controls.naturalLanguageDescription.value;
    newPlanProperty.utility = this.form.controls.utility.value;

    // console.log(newPlanProperty);

    this.created.emit(newPlanProperty);
  }

}


