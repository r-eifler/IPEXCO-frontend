import { Component, effect, input } from '@angular/core';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-incoming-flight-state',
  imports: [
    JigComponent,
    TranslocoModule
  ],
  templateUrl: './incoming-flight-state.component.html',
  styleUrl: './incoming-flight-state.component.scss'
})
export class IncomingFlightStateComponent {

  jigs = input.required<Jig[]>();
  jigTypes = input.required<Record<string,JigType>>();

  constructor(){
    effect(() => console.log(this.jigs()))
  }

}
