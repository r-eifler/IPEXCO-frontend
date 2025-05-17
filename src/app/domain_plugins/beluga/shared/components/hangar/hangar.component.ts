import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hangar',
  imports: [
    MatIconModule,
  ],
  templateUrl: './hangar.component.html',
  styleUrl: './hangar.component.scss'
})
export class HangarComponent {

  name = input.required<string>();

  maintenance = input<boolean>(false);

  dragTarget = input<boolean>(false);
  noDragTarget = input<boolean>(false);

}
