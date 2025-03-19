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
import { equalPlanProperties, PlanProperty, PlanPropertyBase } from 'src/app/shared/domain/plan-property/plan-property';
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
  created = output<PlanPropertyBase>();

  planningTask = input.required<PlanningTask>();
  planProperties = input.required<Record<string, PlanProperty> | null>();
  planPropertiesList = computed(() => {
    const properties = this.planProperties();
    return properties !== null ? Object.values(properties) : [];
  });
  templates = input.required<PlanPropertyTemplate[]>();

  groupedTemplates:Record<string,PlanPropertyTemplate[]> = {};

  selectedTemplate: PlanPropertyTemplate | null = null;

  templateParts: TemplatePart[] = [];
  selectedVariableValue: Record<string, TaskObject> = {};
  possibleVariableValues: Record<string, TaskObject[]> = {};
  selectedNumericVariableValue: Record<string, number> = {};

  allSelected = false;
  propertyAlreadyExists = false;

  form = this.fb.group({
    name: this.fb.control<string | null>(null, [Validators.required]),
    naturalLanguageDescription: this.fb.control<string | null>(null, [Validators.required]),
    utility: this.fb.control<number>(1, [Validators.required]),
  });

  ngOnInit(): void {
    let sorted: Record<string, PlanPropertyTemplate[]> = this.templates()?.reduce((acc, t) => ({...acc,[t.class]: []}), {})
    this.templates().forEach(t => sorted[(t.class)].push(t))
    this.groupedTemplates = sorted;
  }

  private getDisplayText(part: TemplatePart){
    if(!part.isVar || part.var == undefined){
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

    if(this.selectedTemplate == null){
      return;
    }

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
      isSelected: p.isVar && p.var ? this.selectedVariableValue[p.var] !== undefined : false,
      text: this.getDisplayText(p),
      possibleValues: p.var ? this.possibleVariableValues[p.var] : []
    }))

    // console.log(this.templateParts)
  }

  selectTemplate(template: PlanPropertyTemplate, stepper: MatStepper){
    this.selectedTemplate = template
    this.selectedVariableValue = {};
    // console.log(template)

    if(stepper.selected)
      stepper.selected.completed = true;
    stepper.next();

	  this.templateParts = [];
    this.updatePossibleVariableValues();

    this.form.controls.name.setValue(template.nameTemplate);
    this.form.controls.naturalLanguageDescription.setValue(template.sentenceTemplate);
  }


  selectNumericVariableValue(variable: string | undefined, value: number) {
    if(variable === undefined){
      return;
    }

    // console.log("select: " + value)
    this.selectedNumericVariableValue[variable] = value;

    // this.updatePossibleVariableValues();
    this.checkAllSelected();
  }

  selectVariableValue(variable: string | undefined, object: TaskObject) {
    if(variable === undefined){
      return;
    }

    // console.log("select: " + object.name)
    this.selectedVariableValue[variable] = object;

    this.updatePossibleVariableValues();
    this.checkAllSelected();
  }

  checkAllSelected(){
    if(this.selectedTemplate == null){
      return;
    }

	  this.allSelected = Object.keys(this.selectedVariableValue).length  + 
      Object.keys(this.selectedNumericVariableValue).length === Object.keys(this.selectedTemplate.variables).length

    if(this.allSelected){
      const dummy: PlanPropertyBase = generatePlanProperty(
        this.selectedTemplate,
        this.selectedVariableValue,
        this.selectedNumericVariableValue
      )

      this.form.controls.name.setValue(dummy.name)
      if(dummy.naturalLanguageDescription)
        this.form.controls.naturalLanguageDescription.setValue(dummy.naturalLanguageDescription);

      this.propertyAlreadyExists = this.planPropertiesList().some(
        p => equalPlanProperties(p, dummy)
      )
    }
  }
  

  resetVariableValue(variable: string | undefined) {
    if(variable == undefined){
      return
    }
    delete this.selectedVariableValue[variable];
    this.updatePossibleVariableValues();
	  this.allSelected = false;
    this.propertyAlreadyExists = false;
  }

  onCancel(){
	  this.cancel.emit()
  }

  onCreateProperty(){
    if(this.selectedTemplate == null){
      return;
    }

    let newPlanProperty = generatePlanProperty(
      this.selectedTemplate,
      this.selectedVariableValue,
      this.selectedNumericVariableValue
    )

    newPlanProperty.name = this.form.controls.name.value ?? 'TODO';
    newPlanProperty.naturalLanguageDescription = this.form.controls.naturalLanguageDescription.value ?? 'TODO';
    newPlanProperty.utility = this.form.controls.utility.value ?? 1;

    // console.log(newPlanProperty);

    this.created.emit(newPlanProperty);
  }

}


