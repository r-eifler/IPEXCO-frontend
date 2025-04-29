import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { decreaseFlightIndex, increaseFlightIndex } from '../../state/flight-section-planning.actions';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-controls',
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {

  store = inject(Store);

  prevFlight(){
    this.store.dispatch(decreaseFlightIndex({offset: 1}));
  }

  nextFlight(){
    this.store.dispatch(increaseFlightIndex({offset: 1}));
  }

}
