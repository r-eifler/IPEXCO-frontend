import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Jig } from '../../domain/beluga_problem';
import { JigComponent } from '../jig/jig.component';

@Component({
  selector: 'app-hangar',
  imports: [
    JigComponent,
    MatIconModule,
  ],
  templateUrl: './hangar.component.html',
  styleUrl: './hangar.component.scss'
})
export class HangarComponent {

  jig = input.required<Jig>()

  name = computed(() => this.jig()?.name.replace('jig',''))

}
