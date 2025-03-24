import { AfterViewInit, Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { filter } from 'rxjs';

@Component({
  selector: 'app-property-template-numeric-part',
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './property-template-numeric-part.component.html',
  styleUrl: './property-template-numeric-part.component.scss'
})
export class PropertyTemplateNumericPartComponent implements OnInit{

  fb = inject(FormBuilder)

  form = this.fb.control(0, Validators.required);

  isSelected = input.required<boolean>();
  selectedValue = input.required<string>();

  displayValue = computed(() => this.selectedValue() ? parseInt(this.selectedValue()) : 0)

  value = output<string>();

  constructor(){

    this.form.valueChanges.pipe(
      takeUntilDestroyed(),
      filter(n => n != null || n != undefined),
    ).subscribe(n => {
      this.value.emit(n.toString());
    });
  }


  ngOnInit(): void { 
      this.form.setValue(this.displayValue(), {emitEvent: false});
  }


}
