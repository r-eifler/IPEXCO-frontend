import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rack',
  imports: [
    MatIconModule
  ],
  templateUrl: './rack.component.html',
  styleUrl: './rack.component.scss'
})
export class RackComponent {
  name = input.required<string>();
  occupied = input.required<number>();
  size = input.required<number>();
  maintenance = input<boolean>(false);

  dragTarget = input<boolean>(false);
  noDragTarget = input<boolean>(false);

  inConflict = input<boolean>(false);
}
