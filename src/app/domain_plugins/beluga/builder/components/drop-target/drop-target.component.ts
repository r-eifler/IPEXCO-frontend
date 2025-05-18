import { Component, input } from '@angular/core';

@Component({
  selector: 'app-drop-target',
  imports: [],
  templateUrl: './drop-target.component.html',
  styleUrl: './drop-target.component.scss',
  host: {
    '[class.drop-target-center]': 'centerContent()',
  }
})
export class DropTargetComponent {
  centerContent = input(false);
}
