import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { Demo } from 'src/app/shared/domain/demo';

@Component({
  selector: 'app-demo-info',
  imports: [
    MatExpansionModule,
    MarkedPipe
  ],
  templateUrl: './demo-info.component.html',
  styleUrl: './demo-info.component.scss'
})
export class DemoInfoComponent {

  host = window.location.protocol + "//" + window.location.host;

  demo = input.required<Demo>();

}
