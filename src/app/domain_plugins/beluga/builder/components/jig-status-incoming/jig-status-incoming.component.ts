import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, computed, effect, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Flight, Jig, JigType } from '../../../shared/domain/beluga_problem';
import { cancelDrag, startDrag } from '../../state/builder.actions';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-jig-status-incoming',
  imports: [
    JigComponent,
    CdkDrag,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './jig-status-incoming.component.html',
  styleUrl: './jig-status-incoming.component.scss'
})
export class JigStatusIncomingComponent {

  store = inject(Store);

  isSkipPossible = input(true);
  isUnloadPossible = input(true);

  index = input<null | number>(null);
  jig = input.required<Jig>();
  jigType = input.required<JigType>();
  status = input.required<{
    skip: boolean,
    unloaded: boolean,
    next: boolean,
  }>();

  flight = input.required<Flight>()

  skip = output<void>();
  unload = output<void>();

  onCancelDrag(event: CdkDragDrop<Jig>){
    if(!event.isPointerOverContainer){
      this.store.dispatch(cancelDrag())
    }
  }

  onStartDrag(){
    let flight = this.flight();
    if(flight !== undefined && flight !== null){
      this.store.dispatch(startDrag({source: {...flight, stageType: "flight"}, jigName: this.jig().name, sides: ['bside']}))
    }
  }

  onSkip() {
    this.skip.emit();
  }

  onUnload() {
    this.unload.emit();
  }
}
