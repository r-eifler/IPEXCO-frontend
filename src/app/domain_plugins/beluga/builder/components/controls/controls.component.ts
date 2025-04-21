import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFlightFinished } from '../../state/builder.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { SwitchBeluga } from '../../../shared/domain/beluga_plan';
import { nextFlight } from '../../state/builder.actions';

@Component({
  selector: 'app-controls',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    AsyncPipe,
  ],
  providers: [
    provideTranslocoScope({
      scope: "builder",
      alias: "b",
    }),
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
