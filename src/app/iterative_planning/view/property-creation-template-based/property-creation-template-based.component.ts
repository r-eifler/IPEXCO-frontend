import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, first, map, Observable, take, tap } from 'rxjs';
import { generateDummyPlanProperty, generatePlanProperty, getPossibleValues, getTemplateParts, PlanPropertyTemplate, TemplatePart } from '../../domain/plan-property/plan-property-template';
import { selectIterativePlanningProject, selectIterativePlanningPropertiesList, selectIterativePlanningPropertyTemplates, selectIterativePlanningTask } from '../../state/iterative-planning.selector';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { PropertyTemplatePartComponent } from '../../components/property-template-part/property-template-part.component'
import { equalPlanProperties, PlanProperty } from '../../domain/plan-property/plan-property';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../../project/domain/project';
import { PDDLObject, PlanningTask } from '../../../interface/planning-task';
import { createPlanProperty } from '../../state/iterative-planning.actions';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-property-creation-template-based',
  standalone: true,
  imports: [
	NgIf,
	NgFor,
    AsyncPipe, 
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
export class PropertyCreationTemplateBasedComponent {

  private store = inject(Store)
  private dialogRef = inject(MatDialogRef)

  cancel = output<void>();
  created = output<PlanProperty>();

  project$: Observable<Project>;
  planningTask$: Observable<PlanningTask>;
  planProperties$: Observable<PlanProperty[]>
  templates$: Observable<PlanPropertyTemplate[]>;
  groupedTemplates$: Observable<Record<string,PlanPropertyTemplate[]>>;

  selectedTemplate: PlanPropertyTemplate;

  templateParts: TemplatePart[] = [];
  selectedVariableValue: Record<string, PDDLObject> = {};
  possibleVariableValues: Record<string, PDDLObject[]>;

  allSelected = false;
  propertyAlreadyExists = false;

  data: {createProperty: false} = inject(MAT_DIALOG_DATA)

  constructor() {

	  this.project$ = this.store.select(selectIterativePlanningProject);
    this.planProperties$ = this.store.select(selectIterativePlanningPropertiesList);

    this.planningTask$ = this.store.select(selectIterativePlanningTask);
    this.templates$ = this.store.select(selectIterativePlanningPropertyTemplates);
    this.groupedTemplates$ = this.templates$.pipe(
      filter(templates => !!templates),
      map(templates => {
         let sorted: Record<string, PlanPropertyTemplate[]> = templates.reduce((acc, t) => ({...acc,[t.class]: []}), {})
         templates.forEach(t => sorted[(t.class)].push(t))
         return sorted
      }
      ),
      tap(console.log)
    );
  }

  private updatePossibleVariableValues(){
    this.planningTask$.pipe(
        first(task => !!task),
      ).subscribe(
      task => {

        if(this.templateParts.length == 0){
          this.templateParts = getTemplateParts(this.selectedTemplate);
        }

        this.possibleVariableValues = getPossibleValues(
          this.selectedTemplate,
          task,
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
    );
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
      this.planProperties$.pipe(first(properties => !!properties)).subscribe(
        properties => this.propertyAlreadyExists = properties.some(
          p => equalPlanProperties(p, 
            generateDummyPlanProperty(
              this.selectedTemplate,
              this.selectedVariableValue
            )
          ))
        );
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
    this.dialogRef.close()
  }

  onCreateProperty(){
    this.project$.pipe(
          first(project => !!project),
        ).subscribe(
      project => {
        const newPlanProperty = generatePlanProperty(
          this.selectedTemplate,
          this.selectedVariableValue,
          project.baseTask,
          project
        )
        this.created.emit(newPlanProperty);
        if(this.data.createProperty){
          this.store.dispatch(createPlanProperty({planProperty: newPlanProperty}));
        }
        this.dialogRef.close(newPlanProperty)
      }
    )
  }

}


