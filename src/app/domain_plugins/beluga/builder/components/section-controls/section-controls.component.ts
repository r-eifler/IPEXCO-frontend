import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActions, selectFlightFinished } from '../../state/builder.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { cancelManualPlanning, finishManualPlanning } from '../../state/builder.actions';

@Component({
  selector: 'app-section-controls',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    AsyncPipe,
  ],
  templateUrl: './section-controls.component.html',
  styleUrl: './section-controls.component.scss'
})
export class SectionControlsComponent {

  store = inject(Store);

  nextFlightAvailable$ = this.store.select(selectFlightFinished);
  actions = this.store.selectSignal(selectActions);

  onSave(){  
      const actions = this.actions();
      if(actions != undefined){
        this.store.dispatch(finishManualPlanning({actions}))
      } 
  }

  onCancel(){  
    this.store.dispatch(cancelManualPlanning())
}
}
