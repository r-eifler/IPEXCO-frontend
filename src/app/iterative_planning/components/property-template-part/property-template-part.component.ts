import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { PDDLObject } from 'src/app/shared/domain/planning-task';

@Component({
  selector: 'app-property-template-part',
  standalone: true,
  imports: [    
    MatMenuModule,
    MatBadgeModule,
	  MatIcon,
  ],
  templateUrl: './property-template-part.component.html',
  styleUrl: './property-template-part.component.scss'
})
export class PropertyTemplatePartComponent {

  @Input({required: true}) values: PDDLObject[];
  @Input({required: true}) isSelected: boolean;
  @Input({required: true}) selectedValue: string | undefined;

  @Output() value = new EventEmitter<PDDLObject>();

  @Output() reset = new EventEmitter<void>();


  displayOrder(values: PDDLObject[]): PDDLObject[]{
    return values.sort((a, b) => a.name.localeCompare(b.name));
  }


  selectValue(v: PDDLObject) {
    this.value.emit(v);
  }

  resetVar() {
    this.reset.emit();
  }

}
