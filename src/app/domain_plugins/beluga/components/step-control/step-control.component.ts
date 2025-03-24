import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step-control',
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './step-control.component.html',
  styleUrl: './step-control.component.scss'
})
export class StepControlComponent {

  back = output<void>();
  forward = output<void>();

  onBack(){
    this.back.emit();
  }

  onForward(){
    this.forward.emit()
  }
}
