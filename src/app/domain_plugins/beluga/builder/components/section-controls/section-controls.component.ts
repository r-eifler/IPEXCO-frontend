import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllFlightsInHorizonFinished, selectCurrentActions, selectCurrentConfiguration, selectCurrentFlightFinished, selectSection } from '../../state/builder.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { cancelManualPlanning, createNewBelugaAction, finishManualPlanning } from '../../state/builder.actions';
import { UndoStackService } from 'src/app/shared/state/undo/undo-stack.service';
import { undoLastAction } from 'src/app/shared/state/undo/undo-stack.effect';
import { RouterLink, RouterModule } from '@angular/router';
import { BelugaActionType } from '../../../shared/domain/beluga_plan';

@Component({
  selector: 'app-section-controls',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    RouterModule,
  ],
  templateUrl: './section-controls.component.html',
  styleUrl: './section-controls.component.scss'
})
export class SectionControlsComponent {
  cd = inject(ChangeDetectorRef);
  store = inject(Store);
  undoStack = inject(UndoStackService);

  constructor() {
    this.undoStack.clear();
  }

  currentFlightFinished = this.store.selectSignal(selectCurrentFlightFinished);
  allFlightsInHorizonFinished = this.store.selectSignal(selectAllFlightsInHorizonFinished);
  actions = this.store.selectSignal(selectCurrentActions);
  section = this.store.selectSignal(selectSection);
  config = this.store.selectSignal(selectCurrentConfiguration);

  onSave() {
      const actions = this.actions();
      if(actions != undefined){
        this.store.dispatch(finishManualPlanning({actions, solved: this.allFlightsInHorizonFinished()}))
      }
  }

  onCancel() {
    const sectionId = this.section()?._id;
    const config = this.config();
    const planAttempt = this.actions();
    if(sectionId !== undefined && planAttempt !== undefined && config !== null){
      this.store.dispatch(cancelManualPlanning({sectionId, planAttempt, config}))
    }
  }

  onUndo() {
    document.startViewTransition(() => {
      this.store.dispatch(undoLastAction());
      this.cd.detectChanges();
    });
  }

  onNextFlight() {
    this.store.dispatch(createNewBelugaAction({action: {name: BelugaActionType.SWITCH_TO_NEXT_BELUGA}}))
  }
}
