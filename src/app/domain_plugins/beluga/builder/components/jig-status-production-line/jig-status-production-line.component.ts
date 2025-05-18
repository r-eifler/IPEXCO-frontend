import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { selectJigMapIncomingFlight } from '../../state/builder.selector';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-jig-status-production-line',
  imports: [
    JigComponent,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective,
    MatTooltipModule,
  ],
  templateUrl: './jig-status-production-line.component.html',
  styleUrl: './jig-status-production-line.component.scss'
})
export class JigStatusProductionLineComponent {
  store = inject(Store);

  incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

  isSkipPossible = input(true);

  index = input<null | number>(null);
  jig = input.required<Jig>();
  jigType = input.required<JigType>();
  status = input.required<{
    skip: boolean,
    delivered: boolean,
    next: boolean,
  }>();

  skip = output<void>();

  onSkip() {
    this.skip.emit();
  }
}
