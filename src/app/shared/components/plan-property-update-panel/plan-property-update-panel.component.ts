import { Component, effect, inject, input, output } from '@angular/core';
import { PlanProperty } from '../../domain/plan-property/plan-property';
import { ProjectDirective } from 'src/app/iterative_planning/derectives/isProject.directive';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { QuoteModule } from '../quote/quote.module';
import { UnformattedModule } from '../unformatted/unformatted.module';
import { MatFormField } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-plan-property-update-panel',
  imports: [
    MatExpansionModule, 
    MatIconModule, 
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './plan-property-update-panel.component.html',
  styleUrl: './plan-property-update-panel.component.scss'
})
export class PlanPropertyUpdatePanelComponent {

  property = input.required<PlanProperty | null>();
  update = output<PlanProperty>();

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string | null>(null, [Validators.required]),
    naturalLanguageDescription: this.fb.control<string | null>(null, [Validators.required]),
    utility: this.fb.control<number>(1, [Validators.required]),
    color: this.fb.control<string | null>(null, [Validators.required]),
    icon: this.fb.control<string | null>(null, [Validators.required]),
  });

  constructor(){
    effect(() => {
      const property = this.property();
      if(property === null){
        return 
      }
      this.form.controls.name.setValue(property.name);
      this.form.controls.utility.setValue(property.utility);
      this.form.controls.icon.setValue(property.icon);
      this.form.controls.color.setValue(property.color);
      if(property.naturalLanguageDescription){
        this.form.controls.naturalLanguageDescription.setValue(property.naturalLanguageDescription );
      }
    })
  }

  onSave(){
    const baseProperty = this.property();
    if(baseProperty === null){
      return
    }

    let newPlanProperty: PlanProperty = {
      ...baseProperty,
      name: this.form.controls.name.value ?? '',
      naturalLanguageDescription: this.form.controls.naturalLanguageDescription.value ?? 'TODO',
      utility: this.form.controls.utility.value ?? 1,
      icon: this.form.controls.icon.value ?? 'star',
      color: this.form.controls.color.value ?? '#000000',
    }

    this.update.emit(newPlanProperty);

  }

}
