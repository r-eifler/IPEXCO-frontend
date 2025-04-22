import { Component, computed, effect, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';

@Component({
  selector: 'app-outgoing-flight-state',
  imports: [
    JigComponent,
    TranslocoModule
  ],
  templateUrl: './outgoing-flight-state.component.html',
  styleUrl: './outgoing-flight-state.component.scss'
})
export class OutgoingFlightStateComponent {

  jigsLoaded = input.required<Jig[]>();
  jigTypesScheduled = input.required<string[]>();
  jigTypes = input.required<Record<string,JigType>>();

  remaining = computed(() => this.jigTypesScheduled()?.length - this.jigsLoaded().length)
}
