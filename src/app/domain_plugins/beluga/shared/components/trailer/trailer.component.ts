import { Component, input } from '@angular/core';

@Component({
  selector: 'app-trailer',
  imports: [
  ],
  templateUrl: './trailer.component.html',
  styleUrl: './trailer.component.scss'
})
export class TrailerComponent {

  name = input.required<string>();
  size = input.required<number>();

  dragTarget = input<boolean>(false);
  noDragTarget = input<boolean>(false);

}
