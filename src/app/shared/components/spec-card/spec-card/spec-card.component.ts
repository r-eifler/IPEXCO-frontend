import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-spec-card',
  imports: [
    MatCardModule,
  ],
  templateUrl: './spec-card.component.html',
  styleUrl: './spec-card.component.scss'
})
export class SpecCardComponent {

}
