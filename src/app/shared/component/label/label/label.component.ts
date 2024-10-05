import { Component, input } from '@angular/core';

export type Color = 'primary' | 'secondary' | 'error';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class LabelComponent {
  color = input<Color | null | undefined>();

}
