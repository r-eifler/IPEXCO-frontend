import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { GoalSolvabilityStatus } from '../../../flight-section-planning/domain/flight-section';
import { Jig, JigType, Flight } from '../../../shared/domain/beluga_problem';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-jig-type-status-outgoing',
  imports: [
    JigComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './jig-type-status-outgoing.component.html',
  styleUrl: './jig-type-status-outgoing.component.scss'
})
export class JigTypeStatusOutgoingComponent {

  solvabilityStatuses = GoalSolvabilityStatus
  
    store = inject(Store);
  
    index = input<null | number>(null);
    jig = input.required<Jig>();
    jigType = input.required<JigType>();
    status = input.required<{
      skip: boolean,
      solvability: GoalSolvabilityStatus,
      loaded: boolean,
      next: boolean,
    }>();
    
    flight = input.required<Flight>()

}
