import { Component, computed, EventEmitter, input, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { PDDLObject } from 'src/app/shared/domain/planning-task';
import { boolean } from 'zod';

@Component({
    selector: 'app-property-template-part',
    imports: [
        MatMenuModule,
        MatBadgeModule,
        MatIcon,
    ],
    templateUrl: './property-template-part.component.html',
    styleUrl: './property-template-part.component.scss'
})
export class PropertyTemplatePartComponent {

  values = input.required<PDDLObject[]>();
  isSelected = input.required<boolean>();
  selectedValue = input.required<string>();

  @Output() value = new EventEmitter<PDDLObject>();
  @Output() reset = new EventEmitter<void>();

  displayValues = computed(() => this.values()?.sort((a, b) => a.name.localeCompare(b.name)))

  selectValue(v: PDDLObject) {
    this.value.emit(v);
  }

  resetVar() {
    this.reset.emit();
  }

}
