import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, first, map, Observable, tap } from 'rxjs';
import { ConstraintDomains, generatePlanProperty, getPossibleVariableValues, getSentenceTemplateParts, initializeVariableConstraints, PlanPropertyTemplate, TemplateProgress } from '../../domain/plan-property/plan-property-template';
import { selectIterativePlanningProject, selectIterativePlanningPropertyTemplates, selectIterativePlanningTask } from '../../state/iterative-planning.selector';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { PropertyTemplatePartComponent } from '../../components/property-template-part/property-template-part.component'
import { PlanProperty } from '../../domain/plan-property/plan-property';
import { MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../../project/domain/project';
import { PlanningTask } from '../../../interface/planning-task';
import { createPlanProperty } from '../../state/iterative-planning.actions';


export interface TemplatePart {
	isVar: boolean,
	isSelected: boolean,
	var: string | undefined,
	text: string, 
	possibleValues: string[]
}


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
    MatButton, 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
	MatCardModule,
	PropertyTemplatePartComponent
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
  templates$: Observable<PlanPropertyTemplate[]>;
  groupedTemplates$: Observable<Record<string,PlanPropertyTemplate[]>>;

  selectedTemplate: PlanPropertyTemplate;
  initializationProgress: TemplateProgress;

  textParts: string[];
  templateParts: TemplatePart[] = [];
  selectedVariableValue: Map<string, string> = new Map();
  possibleVariableValues: Map<string, string[]>;
  selectedVariablePlaceholder: string;

  allSelected: boolean = false;

  constructor() {

	this.project$ = this.store.select(selectIterativePlanningProject)
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

  private init(task: PlanningTask){

    initializeVariableConstraints(task, this.selectedTemplate, this.initializationProgress);
    console.log(this.initializationProgress)
    this.textParts = getSentenceTemplateParts(this.selectedTemplate, this.initializationProgress);
  }

  private updatePossibleVariableValues(){
    this.planningTask$.pipe(
        first(task => !!task),
      ).subscribe(
      task => {

        if(this.textParts.length == 0){
          this.init(task);
        }
        
        this.possibleVariableValues = getPossibleVariableValues(
          this.selectedTemplate,
          this.initializationProgress,
          task,
          this.selectedVariableValue,
        );

        console.log(this.possibleVariableValues)

        this.templateParts = this.textParts.map(p => ({
          isVar: p.startsWith('$'),
          isSelected: p.startsWith('$') ? this.selectedVariableValue.has(p) : false,
          var: p.startsWith('$') ? p : undefined,
          text: (p.startsWith('$') && this.selectedVariableValue.has(p)) ? this.selectedVariableValue.get(p) : p,
          possibleValues: p.startsWith('$') ? this.possibleVariableValues.get(p) : []
        }))

        console.log(this.templateParts)
      }
    );
  }

  selectTemplate(template: PlanPropertyTemplate, stepper: MatStepper){
    this.selectedTemplate = template
    console.log(template)

	  this.initializationProgress = {
      constraintDomains: new ConstraintDomains(),
      numSelectableVariables: 0,
	  }

    stepper.selected.completed = true;
    stepper.next();

	  this.textParts = [];
    this.updatePossibleVariableValues();
  }

  selectVariableValue(variable: string, value: string) {
    this.selectedVariableValue.set(variable, value);
    this.updatePossibleVariableValues()
	  this.allSelected = this.selectedVariableValue.size === this.possibleVariableValues.size
  }

  resetVariableValue(variable: string) {
    this.selectedVariableValue.delete(variable);
    this.updatePossibleVariableValues();
	  this.allSelected = false;
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
          this.initializationProgress,
          this.selectedVariableValue,
          project.baseTask,
          project
        )
        this.created.emit(newPlanProperty);
        this.store.dispatch(createPlanProperty({planProperty: newPlanProperty}));
        this.dialogRef.close()
      }
    )
  }

}


