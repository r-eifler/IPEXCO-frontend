import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { PlanPropertyTemplate } from 'src/app/iterative_planning/domain/plan-property/plan-property-template';

@Component({
  selector: 'app-property-template-creator',
  templateUrl: './property-template-creator.component.html',
  styleUrl: './property-template-creator.component.scss'
})
export class PropertyTemplateCreatorComponent {

  templates = input.required<PlanPropertyTemplate[] | null>();

  @Output() updatedTemplates = new EventEmitter<PlanPropertyTemplate[]>();

  templateString = computed( () => JSON.stringify(this.templates()));
  validInput = false

  constructor( ){
    
  }

  save() {
    this.updatedTemplates.next(JSON.parse(this.templateString()));
  }

  checkJSON() {
    try{
      console.log(this.templateString())
      const res = JSON.parse(this.templateString());
      this.validInput = true
      console.log('CHECK JSON: ' + res)
    }
    catch (err){
      this.validInput=false
      console.log('CHECK JSON: ' + this.validInput)
    }
  }
}
