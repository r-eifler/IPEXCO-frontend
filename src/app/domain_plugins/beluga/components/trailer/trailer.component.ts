import { Component, computed, input } from '@angular/core';
import { Jig } from '../../domain/beluga_problem';
import { JigComponent } from '../jig/jig.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trailer',
  imports: [
    JigComponent,
    MatIconModule,
  ],
  templateUrl: './trailer.component.html',
  styleUrl: './trailer.component.scss'
})
export class TrailerComponent {

  jig = input.required<Jig>()

  name = computed(() => this.jig()?.name.replace('jig',''))

}
