import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

export type Color = 'primary' | 'secondary' | 'error' | 'neutral';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [NgClass],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class LabelComponent {
  color = input<Color | null | undefined>();

}
