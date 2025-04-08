import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';

@Component({
  selector: 'app-explanation',
  imports: [
    MarkedPipe,
    MatCardModule
  ],
  templateUrl: './explanation.component.html',
  styleUrl: './explanation.component.scss'
})
export class ExplanationComponent {
  
  text = input.required<string>()
}
