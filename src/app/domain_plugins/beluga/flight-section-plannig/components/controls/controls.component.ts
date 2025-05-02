import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { selectNumFlightsFlights, selectProject } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-controls',
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {

  store = inject(Store);
  project = this.store.selectSignal(selectProject);
  numFlights = this.store.selectSignal(selectNumFlightsFlights);

  disabled = input<boolean>(false);

}
