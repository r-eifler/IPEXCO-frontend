import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JigType } from '../../domain/beluga_problem';
import { Jig } from '../beluga-plan-animation/beluga-plan-animation.component';
import { JigComponent } from '../jig/jig.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAvailableFactoryTrailers } from '../../../builder/state/builder.selector';
import { BelugaActionType, GetFromHanger } from '../../domain/beluga_plan';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { createNewBelugaAction } from '../../../builder/state/builder.actions';

@Component({
  selector: 'app-hangar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    JigComponent,
  ],
  templateUrl: './hangar.component.html',
  styleUrl: './hangar.component.scss'
})
export class HangarComponent {

    store = inject(Store);

    name = input.required<string>();
    jig = input.required<Jig>();
    jigType = input.required<JigType>();

    availableTrailers = toSignal(this.store.select(selectAvailableFactoryTrailers));

    trailerAvailable = computed(() => (this.availableTrailers()?.length ?? 0) > 0 && this.jig() != null)

    fromHangar(){
      let nextTrailer = this.availableTrailers()?.[0]?.name;

      if(nextTrailer != undefined){

        let action: GetFromHanger = {
          name: BelugaActionType.GET_FROM_HANGAR,
          j: this.jig()?.name,
          h: this.name(),
          t: nextTrailer
        };
    
        console.log(action);
    
        this.store.dispatch(createNewBelugaAction({action}));
      }
    }

}
