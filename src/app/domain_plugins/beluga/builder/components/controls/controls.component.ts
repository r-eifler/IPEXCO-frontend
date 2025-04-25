import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { nextFlight } from '../../state/builder.actions';
import { selectFlightFinished } from '../../state/builder.selector';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-controls',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    AsyncPipe,
  ],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {

  store = inject(Store);

  nextFlightAvailable$ = this.store.select(selectFlightFinished);

  nextFlight(){  
      this.store.dispatch(nextFlight());
  }
}
