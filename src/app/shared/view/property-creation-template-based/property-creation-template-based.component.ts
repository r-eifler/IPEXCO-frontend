import { AsyncPipe, KeyValuePipe} from '@angular/common';
import { Component, computed, input, OnInit, output } from '@angular/core';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { PropertyTemplatePartComponent } from '../../../iterative_planning/components/property-template-part/property-template-part.component'
import { PDDLObject, PlanningTask } from '../../domain/planning-task';
import { MatIcon } from '@angular/material/icon';
import { generateDummyPlanProperty, generatePlanProperty, getPossibleValues, getTemplateParts, PlanPropertyTemplate, TemplatePart } from '../../domain/plan-property/plan-property-template';
import { equalPlanProperties, PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';

@Component({
  selector: 'app-property-creation-template-based',
  standalone: true,
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
    MatIcon
  ],
  templateUrl: './property-creation-template-based.component.html',
  styleUrl: './property-creation-template-based.component.scss'
})
export class PropertyCreationTemplateBasedComponent implements OnInit{

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
  selectedVariableValue: Record<string, PDDLObject> = {};
  possibleVariableValues: Record<string, PDDLObject[]>;

  allSelected = false;
  propertyAlreadyExists = false;

  ngOnInit(): void {
    let sorted: Record<string, PlanPropertyTemplate[]> = this.templates()?.reduce((acc, t) => ({...acc,[t.class]: []}), {})
    this.templates().forEach(t => sorted[(t.class)].push(t))
    this.groupedTemplates = sorted;
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

    console.log(this.possibleVariableValues)

    this.templateParts = this.templateParts.map(p => ({
      ...p,
      isSelected: p.isVar ? this.selectedVariableValue[p.var] !== undefined : false,
      text: (p.isVar && this.selectedVariableValue[p.var]) ? this.selectedVariableValue[p.var].name: p.text,
      possibleValues: p.isVar ? this.possibleVariableValues[p.var] : []
    }))

    console.log(this.templateParts)
  }

  selectTemplate(template: PlanPropertyTemplate, stepper: MatStepper){
    this.selectedTemplate = template
    this.selectedVariableValue = {};
    console.log(template)

    stepper.selected.completed = true;
    stepper.next();

	  this.templateParts = [];
    this.updatePossibleVariableValues();
  }

  selectVariableValue(variable: string, object: PDDLObject) {

    this.selectedVariableValue[variable] = object;
    console.log("Selected Variables: " + this.selectedVariableValue)

    this.updatePossibleVariableValues()

	  this.allSelected = Object.keys(this.selectedVariableValue).length === Object.keys(this.possibleVariableValues).length

    if(this.allSelected){
      const dummy: PlanProperty = generateDummyPlanProperty(
        this.selectedTemplate,
        this.selectedVariableValue
      )
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
    const newPlanProperty = generatePlanProperty(
      this.selectedTemplate,
      this.selectedVariableValue,
    )
    this.created.emit(newPlanProperty);
  }

}


