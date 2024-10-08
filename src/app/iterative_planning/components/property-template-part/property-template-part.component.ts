import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';

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

  @Input({required: true}) values: string[];
  @Input({required: true}) isSelected: boolean;
  @Input({required: true}) selectedValue: string | undefined;

  @Output() value = new EventEmitter<string>();

  @Output() reset = new EventEmitter<void>();


  displayOrder(values: string[]): string[]{
    return values.sort();
  }


  selectValue(v: string) {
    this.value.emit(v);
  }

  resetVar() {
    this.reset.emit();
  }

}
