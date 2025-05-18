import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trailer',
  imports: [
    MatIconModule
  ],
  templateUrl: './trailer.component.html',
  styleUrl: './trailer.component.scss'
})
export class TrailerComponent {

  name = input.required<string>();
  size = input.required<number>();

  maintenance = input<boolean>(false);

  dragTarget = input<boolean>(false);
  noDragTarget = input<boolean>(false);

  inConflict = input<boolean>(false);
}
