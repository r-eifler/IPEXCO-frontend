import { Component, input } from '@angular/core';

@Component({
  selector: 'app-rack',
  imports: [
  ],
  templateUrl: './rack.component.html',
  styleUrl: './rack.component.scss'
})
export class RackComponent {

 
  name = input.required<string>();
  occupied = input.required<number>();
  size = input.required<number>();

  dragTarget = input<boolean>(false);
  noDragTarget = input<boolean>(false);
}
