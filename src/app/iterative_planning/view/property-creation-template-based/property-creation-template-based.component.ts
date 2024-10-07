import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-property-creation-template-based',
  standalone: true,
  imports: [AsyncPipe, DialogModule],
  templateUrl: './property-creation-template-based.component.html',
  styleUrl: './property-creation-template-based.component.scss'
})
export class PropertyCreationTemplateBasedComponent {

}
