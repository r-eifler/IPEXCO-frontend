import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentActions, selectCurrentConfiguration, selectFlightFinished, selectSection } from '../../state/builder.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { cancelManualPlanning, finishManualPlanning } from '../../state/builder.actions';
import { UndoStackService } from 'src/app/shared/state/undo/undo-stack.service';
import { undoLastAction } from 'src/app/shared/state/undo/undo-stack.effect';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-section-controls',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    AsyncPipe,
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

  nextFlightAvailable$ = this.store.select(selectFlightFinished);
  actions = this.store.selectSignal(selectCurrentActions);
  section = this.store.selectSignal(selectSection);
  config = this.store.selectSignal(selectCurrentConfiguration);

  onSave() {
      const actions = this.actions();
      if(actions != undefined){
        this.store.dispatch(finishManualPlanning({actions}))
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
}
