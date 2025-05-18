import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { ApplicationRef, Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BelugaActionType, UnloadBeluga } from '../../../shared/domain/beluga_plan';
import { Jig } from '../../../shared/domain/beluga_problem';
import { cancelDrag, createNewBelugaAction, skipIncomingJig } from '../../state/builder.actions';
import { selectAvailableBelugaTrailers, selectDragInProgress, selectFlightSchedule, selectIncomingUnloadFinished, selectJigTypes } from '../../state/builder.selector';
import { JigStatusIncomingComponent } from '../jig-status-incoming/jig-status-incoming.component';
import { selectIncomingJigsStatusSchedule, selectNextIncomingJigToUnload } from './incoming-flight-state.selector';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';

@Component({
  selector: 'app-incoming-flight-state',
  imports: [
    MatCardModule,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    JigStatusIncomingComponent,
    CdkDropList,
    AsyncPipe,
    InfoComponent,
  ],
  templateUrl: './incoming-flight-state.component.html',
  styleUrl: './incoming-flight-state.component.scss'
})
export class IncomingFlightStateComponent {
  appRef = inject(ApplicationRef);
  store = inject(Store);

  jigTypes = this.store.selectSignal(selectJigTypes);

  incomingJigsStatusSchedule = this.store.selectSignal(selectIncomingJigsStatusSchedule);

  nextJig = this.store.selectSignal(selectNextIncomingJigToUnload);
  finished = this.store.selectSignal(selectIncomingUnloadFinished);

  availableTrailers = this.store.selectSignal(selectAvailableBelugaTrailers);
  currentFlight = this.store.selectSignal(selectFlightSchedule);
  dragInProgress$ = this.store.select(selectDragInProgress);

  flightIsEmpty = computed(() => this.incomingJigsStatusSchedule()?.length == 0)

  unloadAvailable = computed(() => this.currentFlight() != null &&
    (this.availableTrailers()?.length ?? 0) > 0 &&
    ! this.finished()
  );

  skipPossible = computed(() => this.nextJig() !== null)

  constructor(){
    effect(() => console.log(this.incomingJigsStatusSchedule()))
    effect(() => console.log(this.jigTypes()))
  }

  onSkip(){
    let jigName = this.nextJig()?.name;
    if(jigName !== undefined){
      this.store.dispatch(skipIncomingJig({jigName}))
    }
  }

  onUnload(){
    let flightName = this.currentFlight()?.name;
    let nextTrailer = this.availableTrailers()?.[0]?.name;
    let jigName = this.nextJig()?.name;

    if(flightName != null && nextTrailer !== undefined && jigName !== undefined){
      let unloadAction: UnloadBeluga = {
        name: BelugaActionType.UNLOAD_BELUGA,
        j: jigName,
        b: flightName,
        t: nextTrailer
      }

      document.startViewTransition(() => {
        this.store.dispatch(createNewBelugaAction({action: unloadAction}));
        this.appRef.tick();
      });
    }
  }


  drop(event: CdkDragDrop<Jig[]>){
      if (event.previousContainer === event.container) {
        this.store.dispatch(cancelDrag());
      }
    }

  noDrop(){
    return false;
  }

}
