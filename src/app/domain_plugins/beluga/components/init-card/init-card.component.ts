import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-init-card',
  imports: [
    MatIconModule
  ],
  templateUrl: './init-card.component.html',
  styleUrl: './init-card.component.scss'
})
export class InitCardComponent {

  select = input.required<boolean>();
  selected = output<void>();


  onSelect(){
    this.selected.emit();
  }

}
