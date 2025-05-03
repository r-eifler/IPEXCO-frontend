import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hangar',
  imports: [],
  templateUrl: './hangar.component.html',
  styleUrl: './hangar.component.scss'
})
export class HangarComponent {

  name = input.required<string>();

  dragTarget = input<boolean>(false);
  noDragTarget = input<boolean>(false);

}
