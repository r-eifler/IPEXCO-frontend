import { Component, input, output } from '@angular/core';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { GoalStatus } from '../../domain/flight-section';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-jig-configurator',
  imports: [
    JigComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './jig-configurator.component.html',
  styleUrl: './jig-configurator.component.scss'
})
export class JigConfiguratorComponent {

  statusTypes = GoalStatus;

  index = input<null | number>(null);
  jig = input.required<Jig>();
  jigType = input.required<JigType>();
  status = input.required<GoalStatus>();

  showOnlyPart = input<boolean>(false);

  statusChange = output<GoalStatus>();

  onStatusChanged(status: GoalStatus){
    this.statusChange.emit(status)
  }
}
