import { Component, input } from '@angular/core';
import { JigType } from '../../domain/beluga_problem';
import { Jig } from '../beluga-plan-animation/beluga-plan-animation.component';
import { JigComponent } from '../jig/jig.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-jig-status',
  imports: [
    JigComponent,
    MatIconModule,
  ],
  templateUrl: './jig-status.component.html',
  styleUrl: './jig-status.component.scss'
})
export class JigStatusComponent {

    index = input<null | number>(null);
    jig = input.required<Jig>();
    jigType = input.required<JigType>();
    animate = input(false);
    // status = input.required<{
    //   skip: boolean,
    //   unloaded: boolean,
    //   next: boolean,
    // }>();
}
